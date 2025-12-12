import http from 'http';
import fs from 'fs/promises';
import path from 'path';
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
        this.currentClientId = null;
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

            default:
                this.sendError(res, 404, 'API endpoint not found');
        }
    }

    /**
     * Handle workflow planning request
     */
    async handleWorkflowPlan(req, res, body) {
        try {
            const { description, clientId, projectId } = JSON.parse(body);

            if (!description || !description.trim()) {
                this.sendError(res, 400, 'Description is required');
                return;
            }

            if (!clientId || !projectId) {
                this.sendError(res, 400, 'ClientId and ProjectId are required');
                return;
            }

            // Store clientId and projectId for this session
            this.currentClientId = clientId;
            this.currentProjectId = projectId;

            console.log(`[Server] Starting workflow planning for client: ${clientId}, project: ${projectId}`);

            // Broadcast planning started
            sseManager.broadcast('workflow:planning', {
                message: '开始规划工作流...',
                description,
                clientId,
                projectId
            });

            // Plan workflow using agent
            const result = await workflowAgent.planWorkflow(description, {
                onProgress: (progress) => {
                    sseManager.broadcast('workflow:progress', progress);
                },
                clientId,
                projectId
            });

            if (result.success) {
                this.currentWorkflow = result.workflow;

                // Save workflow data to local storage
                try {
                    await storageManager.saveWorkflowData(clientId, projectId, result.workflow);
                    console.log(`[Server] Workflow data saved to local storage`);
                } catch (error) {
                    console.error(`[Server] Failed to save workflow data:`, error);
                    // Don't fail the request, just log the error
                }

                // Broadcast completion
                sseManager.broadcast('workflow:complete', {
                    message: '工作流规划完成',
                    workflow: result.workflow
                });

                this.sendJson(res, 200, {
                    success: true,
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
                    clientId: this.currentClientId,
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
        const status = {
            hasWorkflow: !!this.currentWorkflow,
            workflow: this.currentWorkflow,
            generationStatus: Array.from(this.generationStatus.entries()).map(([id, status]) => ({
                pageId: id,
                ...status
            }))
        };

        this.sendJson(res, 200, status);
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
