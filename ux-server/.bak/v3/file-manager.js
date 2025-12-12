import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import config from './config.js';

/**
 * Safe file operations manager with path validation and atomic writes
 */
export class FileManager {
    constructor() {
        this.allowedBasePaths = [
            config.paths.srcDir,
            config.paths.pagesDir,
            config.paths.componentsDir,
            config.paths.dataDir
        ];
        this.locks = new Map(); // Simple file locking mechanism
    }

    /**
     * Validate that a path is within allowed directories
     */
    validatePath(filePath) {
        const resolvedPath = path.resolve(filePath);
        const isAllowed = this.allowedBasePaths.some(basePath => {
            const resolvedBase = path.resolve(basePath);
            return resolvedPath.startsWith(resolvedBase);
        });

        if (!isAllowed) {
            throw new Error(`Access denied: Path ${filePath} is outside allowed directories`);
        }

        return resolvedPath;
    }

    /**
     * Acquire a lock for a file
     */
    async acquireLock(filePath, timeout = 5000) {
        const startTime = Date.now();

        while (this.locks.has(filePath)) {
            if (Date.now() - startTime > timeout) {
                throw new Error(`Failed to acquire lock for ${filePath}: timeout`);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        this.locks.set(filePath, true);
    }

    /**
     * Release a lock for a file
     */
    releaseLock(filePath) {
        this.locks.delete(filePath);
    }

    /**
     * Read file contents
     */
    async readFile(filePath) {
        const validPath = this.validatePath(filePath);

        try {
            const content = await fs.readFile(validPath, 'utf-8');
            return content;
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`File not found: ${filePath}`);
            }
            throw error;
        }
    }

    /**
     * Write file with atomic operation (write to temp, then rename)
     */
    async writeFile(filePath, content, options = {}) {
        const validPath = this.validatePath(filePath);
        const { backup = false } = options;

        await this.acquireLock(validPath);

        try {
            // Ensure directory exists
            const dir = path.dirname(validPath);
            await fs.mkdir(dir, { recursive: true });

            // Backup existing file if requested
            if (backup && fsSync.existsSync(validPath)) {
                const backupPath = `${validPath}.backup`;
                await fs.copyFile(validPath, backupPath);
            }

            // Atomic write: write to temp file, then rename
            const tempPath = `${validPath}.tmp`;
            await fs.writeFile(tempPath, content, 'utf-8');
            await fs.rename(tempPath, validPath);

            return { success: true, path: validPath };
        } catch (error) {
            throw new Error(`Failed to write file ${filePath}: ${error.message}`);
        } finally {
            this.releaseLock(validPath);
        }
    }

    /**
     * List files in a directory
     */
    async listFiles(dirPath, options = {}) {
        const validPath = this.validatePath(dirPath);
        const { recursive = false, filter = null } = options;

        try {
            const entries = await fs.readdir(validPath, { withFileTypes: true });
            const files = [];

            for (const entry of entries) {
                const fullPath = path.join(validPath, entry.name);

                if (entry.isDirectory() && recursive) {
                    const subFiles = await this.listFiles(fullPath, options);
                    files.push(...subFiles);
                } else if (entry.isFile()) {
                    if (!filter || filter(entry.name)) {
                        files.push({
                            name: entry.name,
                            path: fullPath,
                            relativePath: path.relative(config.paths.srcDir, fullPath)
                        });
                    }
                }
            }

            return files;
        } catch (error) {
            if (error.code === 'ENOENT') {
                return [];
            }
            throw error;
        }
    }

    /**
     * Check if file exists
     */
    async exists(filePath) {
        const validPath = this.validatePath(filePath);

        try {
            await fs.access(validPath);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Delete file
     */
    async deleteFile(filePath) {
        const validPath = this.validatePath(filePath);

        await this.acquireLock(validPath);

        try {
            await fs.unlink(validPath);
            return { success: true };
        } catch (error) {
            if (error.code === 'ENOENT') {
                return { success: true }; // Already deleted
            }
            throw error;
        } finally {
            this.releaseLock(validPath);
        }
    }

    /**
     * Create directory
     */
    async createDirectory(dirPath) {
        const validPath = this.validatePath(dirPath);

        try {
            await fs.mkdir(validPath, { recursive: true });
            return { success: true, path: validPath };
        } catch (error) {
            throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
        }
    }
}

export default new FileManager();
