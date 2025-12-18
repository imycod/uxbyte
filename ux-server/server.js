import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import config from './config.js';
import sseManager from './sse-manager.js';
import workflowAgent from './workflow-agent.js';
import codeGeneratorAgent from './code-generator-agent.js';
import buildManager from './build-manager.js';
import previewServer from './preview-server.js';
import storageManager from './storage-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main HTTP Server
 * Handles all API requests and serves static files
 */
class Server {
    constructor() {
        this.server = null;
        this.currentWorkflow = null;
        this.generationStatus = new Map(); // pageId -> status
        this.currentProjectId = null;
    }

    /**
     * Start the server
     */
    async start() {
        this.server = http.createServer(async (req, res) => {
            await this.handleRequest(req, res);
        });

        this.server.listen(config.server.port, config.server.host, () => {
            console.log(`\n🚀 Server running at http://${config.server.host}:${config.server.port}`);
            console.log(`📝 Open http://${config.server.host}:${config.server.port}/index.html to start\n`);
        });
    }

    /**
     * Handle incoming HTTP request
     */
    async handleRequest(req, res) {
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        console.log(`[${req.method}] ${pathname}`);

        try {
            // API routes
            if (pathname.startsWith('/api/')) {
                await this.handleApiRequest(req, res, pathname);
            }
            // Static files
            else {
                await this.handleStaticFile(req, res, pathname);
            }
        } catch (error) {
            console.error('[Server] Error:', error);
            this.sendError(res, 500, error.message);
        }
    }

    /**
     * Handle API requests
     */
    async handleApiRequest(req, res, pathname) {
        // SSE endpoint
        if (pathname === '/api/events') {
            const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            sseManager.addClient(clientId, res);
            return;
        }

        // Parse request body for POST requests
        let body = '';
        if (req.method === 'POST') {
            body = await this.readBody(req);
        }

        // Route to appropriate handler
        switch (pathname) {
            case '/api/workflow/plan':
                await this.handleWorkflowPlan(req, res, body);
                break;

            case '/api/workflow/generate':
                await this.handleWorkflowGenerate(req, res, body);
                break;

            case '/api/workflow/status':
                await this.handleWorkflowStatus(req, res);
                break;

            case '/api/build':
                await this.handleBuild(req, res);
                break;

            case '/api/preview/start':
                await this.handlePreviewStart(req, res);
                break;

            case '/api/preview/status':
                await this.handlePreviewStatus(req, res);
                break;

            case '/api/projects/list':
                await this.handleProjectList(req, res);
                break;

            case '/api/projects/load':
                await this.handleProjectLoad(req, res, body);
                break;

            default:
                this.sendError(res, 404, 'API endpoint not found');
        }
    }

    /**
     * Handle workflow planning request
     */
    async handleWorkflowPlan(req, res, body) {
        try {
            const { description } = JSON.parse(body);

            if (!description || !description.trim()) {
                this.sendError(res, 400, 'Description is required');
                return;
            }

            // Generate new projectId for this request
            const projectId = uuidv4();
            storageManager.setProjectId(projectId)
            // Store projectId for this session
            this.currentProjectId = projectId;

            console.log(`[Server] Starting workflow planning for project: ${projectId}`);

            // Broadcast planning started
            sseManager.broadcast('workflow:planning', {
                message: '开始规划工作流...',
                description,
                projectId
            });
            // 移除 
            /**
             *     pagesDir: path.resolve(__dirname, '../client/src/pages'),
                    componentsDir: path.resolve(__dirname, '../client/src/components'),
                    dataDir: path.resolve(__dirname, '../client/src/data'),
             */

            // 清空所有指定目录
            // 定义需要清空的目录路径
            const pathsToClear = [
                config.paths.pagesDir,
                config.paths.componentsDir,
                config.paths.dataDir
            ];
            try {
                await Promise.all(pathsToClear.map(storageManager.clearDirectory));
                console.log('[Server] 所有目标目录已清空');
            } catch (error) {
                console.error('[Server] 清空目录时发生错误:', error);
                throw error;
            }
            // Plan workflow using agent
            const result = await workflowAgent.planWorkflow(description, {
                onProgress: (progress) => {
                    sseManager.broadcast('workflow:progress', progress);
                },
                projectId
            });

            if (result.success) {
                this.currentWorkflow = result.workflow;

                // Save workflow data to local storage
                try {
                    await storageManager.saveWorkflowData(projectId, result.workflow);
                    console.log(`[Server] Workflow data saved to local storage`);
                } catch (error) {
                    console.error(`[Server] Failed to save workflow data:`, error);
                    // Don't fail the request, just log the error
                }

                // Save project metadata
                try {
                    const projectName = result.workflow.functional_spec || description.substring(0, 50);
                    await storageManager.saveProjectMeta(projectId, projectName, description);
                    console.log(`[Server] Project metadata saved for: ${projectId}`);
                } catch (error) {
                    console.error(`[Server] Failed to save project metadata:`, error);
                    // Don't fail the request, just log the error
                }

                // Broadcast completion
                sseManager.broadcast('workflow:complete', {
                    message: '工作流规划完成',
                    workflow: result.workflow
                });

                this.sendJson(res, 200, {
                    success: true,
                    projectId: projectId,
                    workflow: result.workflow
                });
            } else {
                sseManager.broadcast('workflow:error', {
                    error: result.error
                });

                this.sendError(res, 500, result.error);
            }

        } catch (error) {
            console.error('[API] Workflow plan error:', error);
            sseManager.broadcast('workflow:error', {
                error: error.message
            });
            this.sendError(res, 500, error.message);
        }
    }

    /**
     * Handle page generation request
     */
    async handleWorkflowGenerate(req, res, body) {
        try {
            const { pageIds } = JSON.parse(body);

            if (!pageIds || !Array.isArray(pageIds) || pageIds.length === 0) {
                this.sendError(res, 400, 'Page IDs array is required');
                return;
            }

            if (!this.currentWorkflow) {
                this.sendError(res, 400, 'No workflow available. Please plan workflow first.');
                return;
            }

            // Filter selected pages
            const selectedPages = this.currentWorkflow.pages.filter(p =>
                pageIds.includes(p.id)
            );

            if (selectedPages.length === 0) {
                this.sendError(res, 400, 'No valid pages found');
                return;
            }

            // Initialize generation status
            selectedPages.forEach(page => {
                this.generationStatus.set(page.id, {
                    status: 'pending',
                    pageName: page.name
                });
            });
            console.log('selectedPages---', selectedPages)
            // Send immediate response
            this.sendJson(res, 200, {
                success: true,
                message: `开始生成 ${selectedPages.length} 个页面`,
                pageCount: selectedPages.length
            });

            // Broadcast generation started
            sseManager.broadcast('generation:started', {
                message: `开始生成 ${selectedPages.length} 个页面`,
                pageCount: selectedPages.length,
                pages: selectedPages.map(p => ({ id: p.id, name: p.name }))
            });

            // Generate pages asynchronously
            this.generatePagesAsync(selectedPages);

        } catch (error) {
            console.error('[API] Generate error:', error);
            this.sendError(res, 500, error.message);
        }
    }

    /**
     * Generate pages asynchronously
     */
    async generatePagesAsync(pages) {
        try {
            const result = await codeGeneratorAgent.generatePages(
                pages,
                this.currentWorkflow,
                {
                    onProgress: (progress) => {
                        // Update status
                        if (progress.pageId) {
                            this.generationStatus.set(progress.pageId, {
                                status: progress.type.includes('error') ? 'error' :
                                    progress.type.includes('complete') ? 'complete' : 'generating',
                                pageName: progress.pageName,
                                error: progress.error
                            });
                        }

                        // Broadcast progress
                        sseManager.broadcast('generation:progress', progress);
                    },
                    maxParallel: 3,
                    projectId: this.currentProjectId
                }
            );

            // Broadcast completion
            sseManager.broadcast('generation:complete', {
                message: `页面生成完成: ${result.successCount} 成功, ${result.failCount} 失败`,
                successCount: result.successCount,
                failCount: result.failCount,
                results: result.results
            });

        } catch (error) {
            console.error('[Server] Generation error:', error);
            sseManager.broadcast('generation:error', {
                error: error.message
            });
        }
    }

    /**
     * Handle workflow status request
     */
    async handleWorkflowStatus(req, res) {
        try {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const projectId = url.searchParams.get('projectId');

            // If projectId provided, try to load it
            if (projectId) {
                // If it's different from current, load it
                if (this.currentProjectId !== projectId) {
                    const workflow = await storageManager.loadWorkflowData(projectId);
                    if (workflow) {
                        this.currentProjectId = projectId;
                        this.currentWorkflow = workflow;
                        // You might want to load generation status from somewhere if persisted, 
                        // but for now we might rely on in-memory or assume pending if fresh load.
                        // Ideally generationStatus should also be persisted or re-constructed.
                        // For this implementation, we'll keep in-memory map if it matches projectId, else clear?
                        // A better approach for production: persist status. 
                        // For now: clear status if project changes to avoid showing wrong status
                        this.generationStatus.clear();
                    }
                }
            }

            const status = {
                hasWorkflow: !!this.currentWorkflow,
                workflow: this.currentWorkflow,
                generationStatus: Array.from(this.generationStatus.entries()).map(([id, status]) => ({
                    pageId: id,
                    ...status
                }))
            };

            // Add 'processing' field to pages in workflow if it exists
            if (status.workflow && status.workflow.pages) {
                status.workflow.pages = status.workflow.pages.map(page => {
                    const genStatus = this.generationStatus.get(page.id);
                    let processing = 'pending'; // Default

                    if (genStatus) {
                        if (genStatus.status === 'complete') processing = 'done';
                        else if (genStatus.status === 'error') processing = 'error';
                        else if (genStatus.status === 'generating') processing = 'generating';
                    } else if (page.status === 50) { // Historical 'done' status from workflow.js example if any
                        // processing = 'done'; 
                        // Note: The user prompt mentions "判断当前项目pages 是否有done". 
                        // If the loaded workflow already has status marking completion, we should use it.
                        // But looking at workflow.js, status values like 50, -2, -3 exist. 
                        // Let's assume the in-memory generationStatus is the truth for now for active sessions.
                    }

                    return {
                        ...page,
                        processing: processing
                    };
                });
            }

            this.sendJson(res, 200, status);
        } catch (error) {
            console.error('[API] Workflow status error:', error);
            this.sendError(res, 500, error.message);
        }
    }

    /**
     * Handle build request
     */
    async handleBuild(req, res) {
        try {
            // Send immediate response
            this.sendJson(res, 200, {
                success: true,
                message: '构建已开始'
            });

            // Broadcast build started
            sseManager.broadcast('build:started', {
                message: '开始构建项目...'
            });

            // Start build asynchronously
            const result = await buildManager.build({
                onProgress: (progress) => {
                    sseManager.broadcast('build:progress', progress);
                },
                onComplete: (result) => {
                    sseManager.broadcast('build:complete', {
                        message: '构建完成',
                        result
                    });
                },
                onError: (error) => {
                    sseManager.broadcast('build:error', {
                        message: '构建失败',
                        error: error.message
                    });
                }
            });

        } catch (error) {
            console.error('[API] Build error:', error);
            sseManager.broadcast('build:error', {
                error: error.message
            });
        }
    }

    /**
     * Handle preview start request
     */
    async handlePreviewStart(req, res) {
        try {
            const result = await previewServer.start();

            this.sendJson(res, 200, {
                success: true,
                ...previewServer.getStatus()
            });

            sseManager.broadcast('preview:started', {
                message: '预览服务器已启动',
                ...previewServer.getStatus()
            });

        } catch (error) {
            console.error('[API] Preview start error:', error);
            this.sendError(res, 500, error.message);
        }
    }

    /**
     * Handle preview status request
     */
    async handlePreviewStatus(req, res) {
        this.sendJson(res, 200, previewServer.getStatus());
    }

    /**
     * Handle project list request
     */
    async handleProjectList(req, res) {
        try {
            // Get project metadata
            const meta = await storageManager.getProjectMeta();
            console.log('meta---', meta)

            const projects = Object.values(meta).map(project => ({
                id: project.id,
                name: project.name || `项目 ${project.id.substring(0, 8)}`,
                createdAt: project.createdAt || new Date().toISOString(),
                prompt: project.prompt || ''
            }));
            // Get project list
            // const projectIds = await storageManager.listProjects();

            // const projects = projectIds.map(id => {
            //     const projectMeta = meta[id] || {};
            //     return {
            //         id: id,
            //         name: projectMeta.name || `项目 ${id.substring(0, 8)}`,
            //         createdAt: projectMeta.createdAt || new Date().toISOString(),
            //         prompt: projectMeta.prompt || ''
            //     };
            // });

            this.sendJson(res, 200, {
                success: true,
                projects: projects
            });
        } catch (error) {
            console.error('[API] Project list error:', error);
            this.sendError(res, 500, error.message);
        }
    }

    /**
     * Handle project load request - copy project files to client directories
     */
    async handleProjectLoad(req, res, body) {
        try {
            const { projectId } = JSON.parse(body);

            if (!projectId) {
                this.sendError(res, 400, 'Project ID is required');
                return;
            }

            // Check if project exists
            const projectExists = await storageManager.projectExists(projectId);
            if (!projectExists) {
                this.sendError(res, 404, `Project ${projectId} not found`);
                return;
            }

            const projectPath = storageManager.getProjectPath(projectId);
            const sourceCodePath = path.join(projectPath, 'code');

            // Source directories
            const sourcePagesDir = path.join(sourceCodePath, 'pages');
            const sourceComponentsDir = path.join(sourceCodePath, 'components');
            const sourceDataDir = path.join(sourceCodePath, 'data');

            // Target directories (from config)
            const targetPagesDir = config.paths.pagesDir;
            const targetComponentsDir = config.paths.componentsDir;
            const targetDataDir = config.paths.dataDir;

            console.log(`[Server] Loading project ${projectId} from ${sourceCodePath}`);

            // Copy directories
            await this.copyDirectory(sourcePagesDir, targetPagesDir);
            await this.copyDirectory(sourceComponentsDir, targetComponentsDir);
            await this.copyDirectory(sourceDataDir, targetDataDir);

            this.sendJson(res, 200, {
                success: true,
                message: `Project ${projectId} loaded successfully`
            });

            // Update server context
            this.currentProjectId = projectId;
            try {
                const workflow = await storageManager.loadWorkflowData(projectId);
                if (workflow) {
                    this.currentWorkflow = workflow;
                    // Reset generation status for the new project context
                    this.generationStatus.clear();
                }
            } catch (e) {
                console.warn(`[Server] Could not automatically load workflow data after project load: ${e.message}`);
            }

        } catch (error) {
            console.error('[API] Project load error:', error);
            this.sendError(res, 500, error.message);
        }
    }

    /**
     * Copy directory recursively
     */
    async copyDirectory(sourceDir, targetDir) {
        try {
            // Check if source directory exists
            try {
                await fs.access(sourceDir);
            } catch {
                console.log(`[Server] Source directory ${sourceDir} does not exist, skipping`);
                return;
            }

            // Create target directory
            await fs.mkdir(targetDir, { recursive: true });

            // Read source directory
            const entries = await fs.readdir(sourceDir, { withFileTypes: true });

            for (const entry of entries) {
                const sourcePath = path.join(sourceDir, entry.name);
                const targetPath = path.join(targetDir, entry.name);

                if (entry.isDirectory()) {
                    // Recursively copy subdirectory
                    await this.copyDirectory(sourcePath, targetPath);
                } else {
                    // Copy file
                    await fs.copyFile(sourcePath, targetPath);
                }
            }

            console.log(`[Server] Copied ${sourceDir} to ${targetDir}`);
        } catch (error) {
            console.error(`[Server] Failed to copy directory ${sourceDir} to ${targetDir}:`, error);
            throw error;
        }
    }

    /**
     * Handle static file requests
     */
    async handleStaticFile(req, res, pathname) {
        try {
            let filePath = pathname === '/' ? '/index.html' : pathname;
            const fullPath = path.join(__dirname, filePath);

            // Security check
            if (!fullPath.startsWith(__dirname)) {
                this.sendError(res, 403, 'Forbidden');
                return;
            }

            const content = await fs.readFile(fullPath);
            const ext = path.extname(fullPath);
            const contentType = this.getContentType(ext);

            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);

        } catch (error) {
            if (error.code === 'ENOENT') {
                this.sendError(res, 404, 'File not found');
            } else {
                throw error;
            }
        }
    }

    /**
     * Read request body
     */
    readBody(req) {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                resolve(body);
            });
            req.on('error', reject);
        });
    }

    /**
     * Send JSON response
     */
    sendJson(res, status, data) {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }

    /**
     * Send error response
     */
    sendError(res, status, message) {
        this.sendJson(res, status, {
            success: false,
            error: message
        });
    }

    /**
     * Get content type by extension
     */
    getContentType(ext) {
        const types = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.svg': 'image/svg+xml'
        };
        return types[ext] || 'text/plain';
    }
}

// Start server
const server = new Server();
server.start().catch(console.error);

export default Server;
