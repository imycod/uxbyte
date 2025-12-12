import llmService from './llm-service.js';
import fileManager from './file-manager.js';
import config from './config.js';

/**
 * Base Agent class with tool execution capabilities
 */
export class Agent {
    constructor(name, systemPrompt) {
        this.name = name;
        this.systemPrompt = systemPrompt;
        this.tools = new Map();
        this.conversationHistory = [];
        this.maxToolExecutions = config.agent.maxToolExecutions;

        // Register default tools
        this.registerDefaultTools();
    }

    /**
     * Register default tools available to all agents
     */
    registerDefaultTools() {
        this.registerTool({
            name: 'write_file',
            description: 'Write content to a file in the ux-client/src directory. Creates directories if needed.',
            parameters: {
                type: 'object',
                properties: {
                    path: {
                        type: 'string',
                        description: 'Relative path from src directory, e.g., "pages/home.astro" or "components/Header.vue"'
                    },
                    content: {
                        type: 'string',
                        description: 'File content to write'
                    }
                },
                required: ['path', 'content']
            },
            execute: async (params) => {
                const fullPath = `${config.paths.srcDir}/${params.path}`;
                const result = await fileManager.writeFile(fullPath, params.content);
                return { success: true, path: params.path, message: 'File written successfully' };
            }
        });

        this.registerTool({
            name: 'read_file',
            description: 'Read content from a file in the ux-client/src directory',
            parameters: {
                type: 'object',
                properties: {
                    path: {
                        type: 'string',
                        description: 'Relative path from src directory'
                    }
                },
                required: ['path']
            },
            execute: async (params) => {
                const fullPath = `${config.paths.srcDir}/${params.path}`;
                const content = await fileManager.readFile(fullPath);
                return { success: true, content, path: params.path };
            }
        });

        this.registerTool({
            name: 'list_files',
            description: 'List files in a directory within ux-client/src',
            parameters: {
                type: 'object',
                properties: {
                    directory: {
                        type: 'string',
                        description: 'Relative directory path from src, e.g., "pages" or "components"'
                    },
                    recursive: {
                        type: 'boolean',
                        description: 'Whether to list recursively',
                        default: false
                    }
                },
                required: ['directory']
            },
            execute: async (params) => {
                const fullPath = `${config.paths.srcDir}/${params.directory}`;
                const files = await fileManager.listFiles(fullPath, {
                    recursive: params.recursive || false
                });
                return { success: true, files };
            }
        });
    }

    /**
     * Register a custom tool
     */
    registerTool(tool) {
        this.tools.set(tool.name, tool);
    }

    /**
     * Execute a tool by name
     */
    async executeTool(toolName, parameters) {
        const tool = this.tools.get(toolName);

        if (!tool) {
            throw new Error(`Tool '${toolName}' not found`);
        }

        try {
            console.log(`[Agent:${this.name}] Executing tool: ${toolName}`, parameters);

            const result = await Promise.race([
                tool.execute(parameters),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Tool execution timeout')), config.agent.toolTimeout)
                )
            ]);

            console.log(`[Agent:${this.name}] Tool ${toolName} completed successfully`);
            return result;
        } catch (error) {
            console.error(`[Agent:${this.name}] Tool ${toolName} failed:`, error.message);
            throw error;
        }
    }

    /**
     * Get tool definitions for LLM function calling
     */
    getToolDefinitions() {
        return Array.from(this.tools.values()).map(tool => ({
            type: 'function',
            function: {
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters
            }
        }));
    }

    /**
     * Run the agent with a user message
     */
    async run(userMessage, options = {}) {
        const { onProgress, maxIterations = 10 } = options;

        // Initialize conversation with system prompt
        if (this.conversationHistory.length === 0) {
            this.conversationHistory.push({
                role: 'system',
                content: this.systemPrompt
            });
        }

        // Add user message
        this.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        let iterations = 0;
        let toolExecutions = 0;

        while (iterations < maxIterations) {
            iterations++;

            if (onProgress) {
                onProgress({
                    type: 'thinking',
                    iteration: iterations,
                    message: 'Processing...'
                });
            }

            try {
                // Call LLM with tool definitions
                const response = await llmService.chatCompletionWithRetry(
                    this.conversationHistory
                );

                const message = response.choices?.[0]?.message;

                if (!message) {
                    throw new Error('No message in LLM response');
                }

                // Add assistant message to history
                this.conversationHistory.push(message);

                // Check if assistant wants to use a tool
                const toolCalls = message.tool_calls;

                if (!toolCalls || toolCalls.length === 0) {
                    // No tool calls, agent is done
                    if (onProgress) {
                        onProgress({
                            type: 'complete',
                            message: message.content
                        });
                    }

                    return {
                        success: true,
                        result: message.content,
                        toolExecutions,
                        iterations
                    };
                }

                // Execute tool calls
                for (const toolCall of toolCalls) {
                    if (toolExecutions >= this.maxToolExecutions) {
                        throw new Error('Maximum tool executions reached');
                    }

                    const toolName = toolCall.function.name;
                    const toolParams = JSON.parse(toolCall.function.arguments);

                    if (onProgress) {
                        onProgress({
                            type: 'tool_execution',
                            tool: toolName,
                            parameters: toolParams
                        });
                    }

                    try {
                        const toolResult = await this.executeTool(toolName, toolParams);
                        toolExecutions++;

                        // Add tool result to conversation
                        this.conversationHistory.push({
                            role: 'tool',
                            tool_call_id: toolCall.id,
                            content: JSON.stringify(toolResult)
                        });

                    } catch (error) {
                        // Add error to conversation
                        this.conversationHistory.push({
                            role: 'tool',
                            tool_call_id: toolCall.id,
                            content: JSON.stringify({
                                success: false,
                                error: error.message
                            })
                        });
                    }
                }

            } catch (error) {
                console.error(`[Agent:${this.name}] Error:`, error);

                if (onProgress) {
                    onProgress({
                        type: 'error',
                        error: error.message
                    });
                }

                return {
                    success: false,
                    error: error.message,
                    toolExecutions,
                    iterations
                };
            }
        }

        // Max iterations reached
        return {
            success: false,
            error: 'Maximum iterations reached',
            toolExecutions,
            iterations
        };
    }

    /**
     * Reset conversation history
     */
    reset() {
        this.conversationHistory = [];
    }

    /**
     * Get conversation history
     */
    getHistory() {
        return this.conversationHistory;
    }
}

export default Agent;
