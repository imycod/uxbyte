import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
    server: {
        port: process.env.PORT || 3000,
        host: process.env.HOST || 'localhost'
    },

    llm: {
        host: process.env.LLM_HOST || 'http://158.2.130.21:9997',
        model: process.env.LLM_MODEL || 'qwen-coder',
        temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
        maxRetries: parseInt(process.env.LLM_MAX_RETRIES || '3'),
        retryDelay: 1000, // ms
        timeout: 120000 // 2 minutes
    },

    paths: {
        root: path.resolve(__dirname, '..'),
        uxServer: __dirname,
        uxClient: path.resolve(__dirname, '../ux-client'),
        srcDir: path.resolve(__dirname, '../ux-client/src'),
        pagesDir: path.resolve(__dirname, '../ux-client/src/pages'),
        componentsDir: path.resolve(__dirname, '../ux-client/src/components'),
        dataDir: path.resolve(__dirname, '../ux-client/src/data'),
        distDir: path.resolve(__dirname, '../ux-client/dist'),
        baseDir: path.resolve(__dirname, '../ux-client-pages') // 副本存储地方
    },

    preview: {
        // port: process.env.PREVIEW_PORT || 4321,
        port: 4322,
        host: 'localhost'
    },

    sse: {
        heartbeatInterval: 30000, // 30 seconds
        connectionTimeout: 300000 // 5 minutes
    },

    build: {
        timeout: 300000, // 5 minutes
        maxConcurrent: 1 // Only one build at a time
    },

    agent: {
        maxToolExecutions: 50,
        toolTimeout: 30000, // 30 seconds per tool
        conversationMaxTokens: 8000
    }
};

export default config;
