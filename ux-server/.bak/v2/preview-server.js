import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import config from './config.js';

/**
 * Preview Server
 * Serves built static files from dist directory
 */
export class PreviewServer {
    constructor() {
        this.server = null;
        this.isRunning = false;
        this.port = config.preview.port;
    }

    /**
     * Start the preview server
     */
    async start() {
        if (this.isRunning) {
            console.log('[PreviewServer] Already running');
            return { success: true, port: this.port };
        }

        return new Promise((resolve, reject) => {
            this.server = http.createServer(async (req, res) => {
                await this.handleRequest(req, res);
            });

            this.server.on('error', (error) => {
                if (error.code === 'EADDRINUSE') {
                    console.log(`[PreviewServer] Port ${this.port} in use, trying ${this.port + 1}`);
                    this.port++;
                    this.server.listen(this.port, config.preview.host);
                } else {
                    reject(error);
                }
            });

            this.server.listen(this.port, config.preview.host, () => {
                this.isRunning = true;
                console.log(`[PreviewServer] Running at http://${config.preview.host}:${this.port}`);
                resolve({ success: true, port: this.port });
            });
        });
    }

    /**
     * Handle HTTP request
     */
    async handleRequest(req, res) {
        try {
            let filePath = req.url === '/' ? '/index.html' : req.url;

            // Remove query string
            filePath = filePath.split('?')[0];

            // Security: prevent directory traversal
            if (filePath.includes('..')) {
                res.writeHead(403);
                res.end('Forbidden');
                return;
            }

            const fullPath = path.join(config.paths.distDir, filePath);

            try {
                const stats = await fs.stat(fullPath);

                if (stats.isDirectory()) {
                    // Try index.html in directory
                    const indexPath = path.join(fullPath, 'index.html');
                    await this.serveFile(indexPath, res);
                } else {
                    await this.serveFile(fullPath, res);
                }
            } catch (error) {
                if (error.code === 'ENOENT') {
                    // File not found, try .html extension
                    const htmlPath = fullPath + '.html';
                    try {
                        await this.serveFile(htmlPath, res);
                    } catch {
                        // Still not found, serve index.html for SPA routing
                        const indexPath = path.join(config.paths.distDir, 'index.html');
                        try {
                            await this.serveFile(indexPath, res);
                        } catch {
                            res.writeHead(404);
                            res.end('Not Found');
                        }
                    }
                } else {
                    throw error;
                }
            }
        } catch (error) {
            console.error('[PreviewServer] Error:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
    }

    /**
     * Serve a file
     */
    async serveFile(filePath, res) {
        const content = await fs.readFile(filePath);
        const ext = path.extname(filePath);
        const contentType = this.getContentType(ext);

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache'
        });
        res.end(content);
    }

    /**
     * Get content type by file extension
     */
    getContentType(ext) {
        const types = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.ico': 'image/x-icon',
            '.woff': 'font/woff',
            '.woff2': 'font/woff2',
            '.ttf': 'font/ttf',
            '.eot': 'application/vnd.ms-fontobject'
        };

        return types[ext] || 'application/octet-stream';
    }

    /**
     * Stop the preview server
     */
    async stop() {
        if (!this.isRunning || !this.server) {
            return { success: true };
        }

        return new Promise((resolve) => {
            this.server.close(() => {
                this.isRunning = false;
                this.server = null;
                console.log('[PreviewServer] Stopped');
                resolve({ success: true });
            });
        });
    }

    /**
     * Get server status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            port: this.port,
            url: this.isRunning ? `http://${config.preview.host}:${this.port}` : null
        };
    }
}

export default new PreviewServer();
