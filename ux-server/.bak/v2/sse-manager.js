import config from './config.js';

/**
 * Server-Sent Events (SSE) Manager
 * Handles client connections and event broadcasting
 */
export class SSEManager {
    constructor() {
        this.clients = new Map(); // clientId -> { response, lastActivity }
        this.heartbeatInterval = null;
        this.startHeartbeat();
    }

    /**
     * Add a new SSE client connection
     */
    addClient(clientId, response) {
        // Set SSE headers
        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });

        // Send initial connection event
        this.sendToClient(response, 'connected', { clientId, timestamp: Date.now() });

        // Store client
        this.clients.set(clientId, {
            response,
            lastActivity: Date.now()
        });

        console.log(`[SSE] Client ${clientId} connected. Total clients: ${this.clients.size}`);

        // Handle client disconnect
        response.on('close', () => {
            this.removeClient(clientId);
        });

        return clientId;
    }

    /**
     * Remove a client connection
     */
    removeClient(clientId) {
        if (this.clients.has(clientId)) {
            this.clients.delete(clientId);
            console.log(`[SSE] Client ${clientId} disconnected. Total clients: ${this.clients.size}`);
        }
    }

    /**
     * Send event to a specific client
     */
    sendToClient(response, event, data) {
        try {
            response.write(`event: ${event}\n`);
            response.write(`data: ${JSON.stringify(data)}\n\n`);
            return true;
        } catch (error) {
            console.error(`[SSE] Error sending to client:`, error.message);
            return false;
        }
    }

    /**
     * Broadcast event to all clients
     */
    broadcast(event, data) {
        const timestamp = Date.now();
        let successCount = 0;
        let failedClients = [];

        for (const [clientId, client] of this.clients.entries()) {
            const success = this.sendToClient(client.response, event, {
                ...data,
                timestamp
            });

            if (success) {
                client.lastActivity = timestamp;
                successCount++;
            } else {
                failedClients.push(clientId);
            }
        }

        // Remove failed clients
        failedClients.forEach(clientId => this.removeClient(clientId));

        console.log(`[SSE] Broadcast '${event}' to ${successCount}/${this.clients.size} clients`);

        return successCount;
    }

    /**
     * Send event to specific client by ID
     */
    sendToClientById(clientId, event, data) {
        const client = this.clients.get(clientId);

        if (!client) {
            console.warn(`[SSE] Client ${clientId} not found`);
            return false;
        }

        const success = this.sendToClient(client.response, event, {
            ...data,
            timestamp: Date.now()
        });

        if (success) {
            client.lastActivity = Date.now();
        } else {
            this.removeClient(clientId);
        }

        return success;
    }

    /**
     * Start heartbeat to keep connections alive
     */
    startHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }

        this.heartbeatInterval = setInterval(() => {
            const now = Date.now();
            const timeout = config.sse.connectionTimeout;

            for (const [clientId, client] of this.clients.entries()) {
                // Check for stale connections
                if (now - client.lastActivity > timeout) {
                    console.log(`[SSE] Client ${clientId} timed out`);
                    this.removeClient(clientId);
                    continue;
                }

                // Send heartbeat
                this.sendToClient(client.response, 'heartbeat', { timestamp: now });
            }
        }, config.sse.heartbeatInterval);
    }

    /**
     * Stop heartbeat
     */
    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * Close all connections
     */
    closeAll() {
        for (const [clientId, client] of this.clients.entries()) {
            try {
                client.response.end();
            } catch (error) {
                console.error(`[SSE] Error closing client ${clientId}:`, error.message);
            }
        }
        this.clients.clear();
        this.stopHeartbeat();
    }

    /**
     * Get number of active clients
     */
    getClientCount() {
        return this.clients.size;
    }
}

export default new SSEManager();
