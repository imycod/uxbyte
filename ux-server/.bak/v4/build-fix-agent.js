import Agent from './agent-system.js';
import llmService from './llm-service.js';
import fileManager from './file-manager.js';
import config from './config.js';

/**
 * Build Fix Agent
 * Analyzes build errors and fixes them automatically
 */
export class BuildFixAgent extends Agent {
  constructor() {
    const systemPrompt = `你是一个专业的前端构建错误修复助手。你的任务是分析构建错误信息，找到问题根源并修复代码。

你需要：
1. 仔细分析错误信息，找到具体的文件和行号
2. 读取有问题的文件内容
3. 分析错误原因（例如：缺少结束标签、语法错误、导入错误等）
4. 修复文件中的错误
5. 给出修复说明

常见错误类型：
- Vue组件缺少结束标签（如 </template>, </script>, </style>）
- TypeScript类型错误（导入不存在的类型）
- 语法错误（括号不匹配、引号不匹配等）
- 导入路径错误
- 使用了未定义的变量或函数

修复原则：
- 只修复必要的错误，不要改变功能
- 保持代码格式和缩进
- 确保修复后的代码符合语法规范
- 使用 write_file 工具写入修复后的文件

你有以下工具可用：
- read_file: 读取文件内容
- write_file: 写入文件内容
- list_files: 列出目录中的文件

请分析错误并修复它。`;

    super('BuildFixAgent', systemPrompt);
  }

  /**
   * Analyze and fix build error
   */
  async fixBuildError(errorInfo, options = {}) {
    const { onProgress } = options;

    console.log(`[BuildFixAgent] Analyzing build error...`);

    try {
      if (onProgress) {
        onProgress({
          type: 'fix_started',
          message: '开始分析构建错误...'
        });
      }

      // Build context message
      const contextMessage = this.buildErrorContext(errorInfo);

      // Run agent with progress tracking
      const result = await this.run(contextMessage, {
        onProgress: (progress) => {
          if (onProgress) {
            onProgress({
              type: 'fix_progress',
              progress
            });
          }
        },
        maxIterations: 10
      });

      if (result.success) {
        if (onProgress) {
          onProgress({
            type: 'fix_complete',
            message: '错误修复完成',
            result: result.result
          });
        }

        console.log(`[BuildFixAgent] Build error fixed successfully`);

        return {
          success: true,
          message: result.result,
          toolExecutions: result.toolExecutions
        };
      } else {
        throw new Error(result.error || 'Fix failed');
      }

    } catch (error) {
      console.error(`[BuildFixAgent] Failed to fix build error:`, error);

      if (onProgress) {
        onProgress({
          type: 'fix_error',
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
   * Build error context message
   */
  buildErrorContext(errorInfo) {
    const { stdout, stderr, code } = errorInfo;

    // Extract error from stderr or stdout
    let errorMessage = stderr || stdout || '';

    // Remove ANSI color codes
    errorMessage = errorMessage.replace(/\x1B\[\d+m/g, '');

    return `构建失败，请分析并修复以下错误：

退出码: ${code}

错误信息：
${errorMessage}

请执行以下步骤：
1. 找到错误的文件路径和行号
2. 使用 read_file 工具读取该文件内容（注意：路径要从 src/ 开始，例如 "components/Header.vue"）
3. 分析错误原因
4. 使用 write_file 工具修复文件
5. 说明你做了什么修复

注意：
- 文件路径是相对于 ux-client/src/ 目录的
- 如果是 Vue 组件，确保有完整的 <template></template>, <script></script> 结构
- 如果是 TypeScript 错误，检查导入的类型是否正确导出
- 保持原有的代码格式和缩进`;
  }
}

export default new BuildFixAgent();

