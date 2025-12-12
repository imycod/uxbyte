import { spawn } from 'child_process';
import path from 'path';
import config from './config.js';
import buildFixAgent from './build-fix-agent.js';

/**
 * Build Manager
 * Manages Astro build process and lifecycle
 */
export class BuildManager {
    constructor() {
        this.currentBuild = null;
        this.buildQueue = [];
        this.isBuilding = false;
        this.maxFixAttempts = 5; // 最大自动修复尝试次数
    }

    /**
     * Start a build process with auto-fix capability
     */
    async build(options = {}) {
        const { onProgress, onComplete, onError, autoFix = true } = options;

        // Queue build if already building
        if (this.isBuilding) {
            console.log('[BuildManager] Build already in progress, queuing...');
            return new Promise((resolve, reject) => {
                this.buildQueue.push({ resolve, reject, options });
            });
        }

        this.isBuilding = true;

        try {
            if (onProgress) {
                onProgress({
                    type: 'build_started',
                    message: '开始构建...'
                });
            }

            // Try to build with auto-fix if enabled
            let result;
            if (autoFix) {
                result = await this.buildWithAutoFix({ onProgress });
            } else {
                result = await this.executeBuild({ onProgress });
            }

            this.isBuilding = false;

            if (onComplete) {
                onComplete(result);
            }

            // Process next build in queue
            this.processQueue();

            return result;

        } catch (error) {
            this.isBuilding = false;

            if (onError) {
                onError(error);
            }

            // Process next build in queue
            this.processQueue();

            throw error;
        }
    }

    /**
     * Build with automatic error fixing
     */
    async buildWithAutoFix(options = {}) {
        const { onProgress } = options;
        let attempt = 0;

        while (attempt < this.maxFixAttempts) {
            attempt++;

            try {
                console.log(`[BuildManager] Build attempt ${attempt}/${this.maxFixAttempts}`);

                if (onProgress && attempt > 1) {
                    onProgress({
                        type: 'build_retry',
                        message: `第 ${attempt} 次构建尝试...`,
                        attempt
                    });
                }

                // Try to build
                const result = await this.executeBuild({ onProgress });

                // Build succeeded
                console.log(`[BuildManager] Build succeeded on attempt ${attempt}`);
                return result;

            } catch (error) {
                console.error(`[BuildManager] Build failed on attempt ${attempt}:`, error.message);

                // If this is the last attempt, give up
                if (attempt >= this.maxFixAttempts) {
                    console.error('[BuildManager] Max fix attempts reached, giving up');
                    throw error;
                }

                // Try to fix the error
                if (onProgress) {
                    onProgress({
                        type: 'fix_attempting',
                        message: `构建失败，尝试自动修复... (尝试 ${attempt}/${this.maxFixAttempts})`,
                        error: error.message
                    });
                }

                try {
                    const fixResult = await buildFixAgent.fixBuildError({
                        stdout: error.stdout,
                        stderr: error.stderr,
                        code: error.code
                    }, {
                        onProgress: (progress) => {
                            if (onProgress) {
                                onProgress({
                                    type: 'fix_progress',
                                    ...progress
                                });
                            }
                        }
                    });

                    if (!fixResult.success) {
                        console.error('[BuildManager] Auto-fix failed:', fixResult.error);
                        throw error; // Give up if fix fails
                    }

                    console.log('[BuildManager] Auto-fix successful, retrying build...');

                    if (onProgress) {
                        onProgress({
                            type: 'fix_success',
                            message: '错误已修复，重新构建...'
                        });
                    }

                    // Continue to next iteration to rebuild

                } catch (fixError) {
                    console.error('[BuildManager] Failed to fix error:', fixError);
                    throw error; // Give up if fix fails
                }
            }
        }

        throw new Error('Build failed after maximum fix attempts');
    }

    /**
     * Execute the actual build
     */
    executeBuild(options = {}) {
        const { onProgress } = options;

        return new Promise((resolve, reject) => {
            const buildProcess = spawn('npm', ['run', 'build'], {
                cwd: config.paths.uxClient,
                shell: true,
                env: { ...process.env }
            });

            let stdout = '';
            let stderr = '';

            buildProcess.stdout.on('data', (data) => {
                const output = data.toString();
                stdout += output;

                console.log('[Build]', output.trim());

                if (onProgress) {
                    onProgress({
                        type: 'build_progress',
                        message: output.trim(),
                        stdout: output
                    });
                }
            });

            buildProcess.stderr.on('data', (data) => {
                const output = data.toString();
                stderr += output;

                console.error('[Build Error]', output.trim());

                if (onProgress) {
                    onProgress({
                        type: 'build_warning',
                        message: output.trim(),
                        stderr: output
                    });
                }
            });

            buildProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('[BuildManager] Build completed successfully');

                    if (onProgress) {
                        onProgress({
                            type: 'build_complete',
                            message: '构建成功',
                            code
                        });
                    }

                    resolve({
                        success: true,
                        code,
                        stdout,
                        stderr
                    });
                } else {
                    console.error(`[BuildManager] Build failed with code ${code}`);

                    const error = new Error(`Build failed with exit code ${code}`);
                    error.code = code;
                    error.stdout = stdout;
                    error.stderr = stderr;

                    if (onProgress) {
                        onProgress({
                            type: 'build_error',
                            message: `构建失败 (退出码: ${code})`,
                            error: stderr || stdout,
                            code
                        });
                    }

                    reject(error);
                }
            });

            buildProcess.on('error', (error) => {
                console.error('[BuildManager] Build process error:', error);

                if (onProgress) {
                    onProgress({
                        type: 'build_error',
                        message: '构建进程错误',
                        error: error.message
                    });
                }

                reject(error);
            });

            // Store current build process
            this.currentBuild = buildProcess;

            // Timeout
            setTimeout(() => {
                if (this.currentBuild === buildProcess) {
                    buildProcess.kill();
                    reject(new Error('Build timeout'));
                }
            }, config.build.timeout);
        });
    }

    /**
     * Process next build in queue
     */
    async processQueue() {
        if (this.buildQueue.length === 0) {
            return;
        }

        const { resolve, reject, options } = this.buildQueue.shift();

        try {
            const result = await this.build(options);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    }

    /**
     * Cancel current build
     */
    cancelBuild() {
        if (this.currentBuild) {
            this.currentBuild.kill();
            this.currentBuild = null;
            this.isBuilding = false;
            console.log('[BuildManager] Build cancelled');
            return true;
        }
        return false;
    }

    /**
     * Get build status
     */
    getStatus() {
        return {
            isBuilding: this.isBuilding,
            queueLength: this.buildQueue.length
        };
    }
}

export default new BuildManager();
