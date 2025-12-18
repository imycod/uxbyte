import Agent from './agent-system.js';
import llmService from './llm-service.js';

/**
 * Workflow Planning Agent
 * Analyzes natural language requirements and generates page structure
 */
export class WorkflowAgent extends Agent {
    constructor() {
        const systemPrompt = `你是一个专业的UX设计规划助手。你的任务是分析用户的自然语言需求，并生成详细的页面结构和工作流程。

你需要：
1. 理解用户的需求描述
2. 规划需要哪些页面
3. 确定页面之间的关系和导航
4. 生成符合以下格式的JSON结构

输出格式示例：
\`\`\`json
{
  "functional_spec": "用户需求的简短描述",
  "pages": [
    {
      "id": 唯一数字ID,
      "name": "页面名称",
      "en_name":"页面英文名称",
      "description": "页面功能描述",
      "is_core": true/false,
      "navigation_list": [
        {
          "id": 唯一数字ID,
          "name": "导航名称",
          "trigger": "触发条件，如'点击按钮'",
          "target_page_id": 目标页面ID
        }
      ]
    }
  ],
  "workflows": [
    {
      "id": 唯一数字ID,
      "name": "工作流名称",
      "description": "工作流描述",
      "workflow_tree": {
        "page_id": 起始页面ID,
        "navigation_id": null,
        "position": "null",
        "children": [
          {
            "page_id": 子页面ID,
            "navigation_id": 导航ID,
            "position": "null",
            "children": []
          }
        ]
      }
    }
  ]
}
\`\`\`

规划原则：
- 核心页面(is_core=true)是必须的，辅助页面可选
- 每个页面应该有清晰的职责
- 导航关系要合理，避免孤立页面
- 工作流要体现主要的用户路径
- ID使用随机6-7位数字
- en_name 使用英文名称并且采用驼峰命名，不要使用中文名称

请直接返回JSON，不要添加额外说明。`;

        super('WorkflowPlanner', systemPrompt);
    }

    /**
     * Plan workflow from natural language description
     */
    async planWorkflow(description, options = {}) {
        const { onProgress } = options;

        console.log(`[WorkflowAgent] Planning workflow for: ${description}`);

        try {
            // Use direct LLM call for workflow planning (no tools needed)
            const messages = [
                {
                    role: 'system',
                    content: this.systemPrompt
                },
                {
                    role: 'user',
                    content: `请为以下需求生成完整的页面结构和工作流程：\n\n${description}\n\n请直接返回JSON格式的结果。`
                }
            ];

            if (onProgress) {
                onProgress({
                    type: 'planning_started',
                    message: '开始分析需求...'
                });
            }

            const response = await llmService.chatCompletionWithRetry(messages);
            const content = response.choices?.[0]?.message?.content;

            if (!content) {
                throw new Error('No content in LLM response');
            }

            if (onProgress) {
                onProgress({
                    type: 'parsing_response',
                    message: '解析工作流结构...'
                });
            }

            // Extract and parse JSON
            const workflowData = llmService.extractJSON(content);

            // Validate structure
            if (!workflowData.pages || !Array.isArray(workflowData.pages)) {
                throw new Error('Invalid workflow structure: missing pages array');
            }

            if (!workflowData.workflows || !Array.isArray(workflowData.workflows)) {
                throw new Error('Invalid workflow structure: missing workflows array');
            }

            // Add status field to pages
            workflowData.pages = workflowData.pages.map(page => ({
                ...page,
                status: page.is_core ? 50 : -2, // 50 for core, -2 for optional
                position: null,
                can_hard_delete: !page.is_core
            }));

            // Add status to workflows
            workflowData.workflows = workflowData.workflows.map(workflow => ({
                ...workflow,
                status: workflow.workflow_tree ? 3 : 0
            }));

            if (onProgress) {
                onProgress({
                    type: 'planning_complete',
                    message: `成功规划 ${workflowData.pages.length} 个页面和 ${workflowData.workflows.length} 个工作流`,
                    data: workflowData
                });
            }

            console.log(`[WorkflowAgent] Planning complete: ${workflowData.pages.length} pages, ${workflowData.workflows.length} workflows`);

            return {
                success: true,
                workflow: workflowData
            };

        } catch (error) {
            console.error('[WorkflowAgent] Planning failed:', error);

            if (onProgress) {
                onProgress({
                    type: 'planning_error',
                    error: error.message
                });
            }

            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Refine existing workflow based on feedback
     */
    async refineWorkflow(currentWorkflow, feedback, options = {}) {
        const { onProgress } = options;

        const messages = [
            {
                role: 'system',
                content: this.systemPrompt
            },
            {
                role: 'user',
                content: `当前工作流：\n${JSON.stringify(currentWorkflow, null, 2)}\n\n用户反馈：${feedback}\n\n请根据反馈优化工作流，返回完整的JSON结构。`
            }
        ];

        if (onProgress) {
            onProgress({
                type: 'refining_started',
                message: '正在优化工作流...'
            });
        }

        try {
            const response = await llmService.chatCompletionWithRetry(messages);
            const content = response.choices?.[0]?.message?.content;
            const refinedWorkflow = llmService.extractJSON(content);

            if (onProgress) {
                onProgress({
                    type: 'refining_complete',
                    message: '工作流优化完成',
                    data: refinedWorkflow
                });
            }

            return {
                success: true,
                workflow: refinedWorkflow
            };

        } catch (error) {
            if (onProgress) {
                onProgress({
                    type: 'refining_error',
                    error: error.message
                });
            }

            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new WorkflowAgent();
