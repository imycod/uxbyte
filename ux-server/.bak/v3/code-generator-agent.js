import Agent from './agent-system.js';
import llmService from './llm-service.js';
import storageManager from './storage-manager.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { parse } = require('@vue/compiler-sfc');

/**
 * Code Generation Agent
 * Generates Vue components and Astro pages based on page specifications
 */
export class CodeGeneratorAgent extends Agent {
    constructor() {
        const systemPrompt = `你是一个专业的前端代码生成助手。你的任务是根据页面规格生成高质量的Vue 3组件和Astro页面代码。

技术栈：
- Vue 3 Composition API
- Astro框架
- Tailwind CSS
- TypeScript

代码要求：
1. 使用Vue 3 Composition API (<script setup>)
2. 响应式设计，移动端友好
3. 使用Tailwind CSS进行样式设计
4. 代码清晰，注释完整
5. 遵循最佳实践和无障碍标准
6. 组件要可复用
7. 代码要符合eslint规范
8. Vue3 SFC文件必须包含 <template>、<script>、<style> 标签和它们的</template>、</script>、</style>闭合标签
9. 禁止使用vue-router，所有跳转都用a链接跳转/[page-name].html
10. 页面之间的链接 path 禁止使用中文

文件组织结构（非常重要！）：
1. **共享组件** - components/common/
   - Header.vue - 网站头部导航
   - Footer.vue - 网站底部
   - Navigation.vue - 导航菜单
   
2. **UI组件** - components/ui/
   - Button.vue - 按钮组件
   - Card.vue - 卡片组件
   - Input.vue - 输入框组件
   - 其他可复用的UI组件

3. **页面特定组件** - components/[page-name]/
   - 例如: components/[page-name]/VisitorForm.vue
   - 例如: components/[page-name]/ProductInfo.vue
   - 使用页面名称的kebab-case作为目录名

4. **数据文件** - data/
   - visitor.ts - 访客相关的类型定义和模拟数据
   - product.ts - 产品相关的类型定义和模拟数据
   - 使用TypeScript导出接口和常量

5. **页面文件** - pages/
   - [page-name].astro - Astro页面骨架
   - 必须导入并引用生成的Vue组件

Astro页面模板示例：
\`\`\`astro
---
import BaseLayout from '@/layouts/BaseLayout.astro'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import PageComponent from '@/components/[page-name]/PageComponent.vue'
import { MOCK_DATA } from '@/data/[data-file]'
---

<BaseLayout title="页面标题">
  <Header client:load />
  
  <main class="flex-1">
    <div class="container mx-auto px-4 py-8">
      <PageComponent 
        client:load 
        prop1={MOCK_DATA.prop1}
        prop2={MOCK_DATA.prop2}
      />
    </div>
  </main>

  <Footer client:load />
</BaseLayout>

<style>
  main {
    min-height: calc(100vh - 8rem);
  }
</style>
\`\`\`

TypeScript数据文件示例：
\`\`\`typescript
// data/visitor.ts
export interface VisitorFormData {
  name: string
  phone: string
  purpose: string
  visitee: string
  visitDate: string
  visitTime: string
  notes?: string
}

export interface VisitorInfo extends VisitorFormData {
  visitId: string
  registerTime: string
  expectedLeaveTime: string
}

export const MOCK_VISITOR_DATA: VisitorInfo = {
  name: '张三',
  phone: '138****1234',
  purpose: '商务洽谈',
  visitee: '李四',
  visitDate: '2023-05-15',
  visitTime: '09:30',
  registerTime: '2023-05-15 09:30',
  expectedLeaveTime: '2023-05-15 17:00',
  visitId: 'VS20230515001'
}
\`\`\`

生成策略：
1. 首先生成共享组件（Header, Footer）到 components/common/
2. 生成页面特定组件到 components/[page-name]/
3. 如果需要，生成数据文件到 data/
4. 最后生成Astro页面文件到 pages/，确保正确导入所有组件

使用write_file工具时的路径规则：
- 共享组件: "components/common/Header.vue"
- 页面组件: "components/visitor-registration/VisitorForm.vue"
- 数据文件: "data/visitor.ts"
- 页面文件: "pages/visitor-registration.astro"

重要提示：
- 所有路径都是相对于src/目录
- 使用kebab-case命名文件和目录
- Astro页面必须使用client:load或client:idle指令来激活Vue组件
- 确保所有导入路径使用@/别名（例如：@/components/common/Header.vue）
- 页面之间的导航使用相对路径（例如：href="/visitor-registration"）
- [page-name] 可以使用en_name 作为文件目录的命名，不要使用中文名称 且 使用kebab-case命名文件和目录

请根据页面规格生成完整的代码文件。`;

        super('CodeGenerator', systemPrompt);
    }

    /**
     * Validate Vue code syntax and check for SSR issues
     */
    validateVueCode(content, filename) {
        try {
            const { descriptor, errors } = parse(content);

            if (errors && errors.length > 0) {
                const errorMsg = errors.map(e => `- ${e.message} (Line ${e.loc.start.line})`).join('\n');
                throw new Error(`Syntax errors in ${filename}:\n${errorMsg}`);
            }

            // SSR Safe Check for route.push
            if (descriptor.scriptSetup || descriptor.script) {
                const scriptContent = (descriptor.scriptSetup?.content || '') + (descriptor.script?.content || '');

                // Check if there is any route.push/router.push
                if (scriptContent.match(/router\.push\(|route\.push\(/)) {
                    // Check if onMounted is imported
                    if (!scriptContent.includes('onMounted')) {
                        console.warn(`[WARNING] ${filename}: usage of route.push detected but onMounted not found.`);
                        throw new Error(`Potential SSR issue in ${filename}: Usage of route.push/router.push detected but not wrapped in onMounted. Please wrap it in onMounted(() => { ... }) or use <a href="..."> for navigation to avoid server-side errors.`);
                    }
                }
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Generate code for a single page
     */
    async generatePage(pageSpec, workflowContext, options = {}) {
        const { onProgress, clientId, projectId } = options;

        console.log(`[CodeGeneratorAgent] Generating page: ${pageSpec.name}`);

        try {
            // Set storage context if provided
            if (clientId && projectId) {
                this.setStorageContext(clientId, projectId);
            }

            if (onProgress) {
                onProgress({
                    type: 'generation_started',
                    pageId: pageSpec.id,
                    pageName: pageSpec.name
                });
            }

            // Build context message
            const contextMessage = this.buildContextMessage(pageSpec, workflowContext, options.feedback);

            // Run agent with progress tracking
            const result = await this.run(contextMessage, {
                onProgress: (progress) => {
                    if (onProgress) {
                        onProgress({
                            type: 'generation_progress',
                            pageId: pageSpec.id,
                            pageName: pageSpec.name,
                            progress
                        });
                    }
                },
                maxIterations: 15
            });

            if (result.success) {
                if (onProgress) {
                    onProgress({
                        type: 'generation_complete',
                        pageId: pageSpec.id,
                        pageName: pageSpec.name,
                        toolExecutions: result.toolExecutions
                    });
                }

                // Validate generated Vue files
                console.log(`[CodeGeneratorAgent] Validating generated files for ${pageSpec.name}...`);
                const history = this.getHistory();
                // Find tool calls from the latest response(s)
                const toolCalls = history.filter(h => h.role === 'assistant' && h.tool_calls);

                for (const msg of toolCalls) {
                    for (const call of msg.tool_calls) {
                        if (call.function.name === 'write_file') {
                            try {
                                const args = JSON.parse(call.function.arguments);
                                if (args.path && args.path.endsWith('.vue')) {
                                    this.validateVueCode(args.content, args.path);
                                }
                            } catch (e) {
                                console.error('Failed to validate tool call args', e);
                            }
                        }
                    }
                }

                console.log(`[CodeGeneratorAgent] Page ${pageSpec.name} generated successfully`);

                return {
                    success: true,
                    pageId: pageSpec.id,
                    pageName: pageSpec.name,
                    filesGenerated: result.toolExecutions
                };
            } else {
                throw new Error(result.error || 'Generation failed');
            }

        } catch (error) {
            console.error(`[CodeGeneratorAgent] Failed to generate page ${pageSpec.name}:`, error);

            if (onProgress) {
                onProgress({
                    type: 'generation_error',
                    pageId: pageSpec.id,
                    pageName: pageSpec.name,
                    error: error.message
                });
            }

            return {
                success: false,
                pageId: pageSpec.id,
                pageName: pageSpec.name,
                error: error.message
            };
        }
    }

    /**
     * Generate multiple pages in parallel
     */
    async generatePages(pageSpecs, workflowContext, options = {}) {
        const { onProgress, maxParallel = 3, clientId, projectId } = options;

        console.log(`[CodeGeneratorAgent] Generating ${pageSpecs.length} pages in parallel (max ${maxParallel})`);

        // Set storage context if provided
        if (clientId && projectId) {
            this.setStorageContext(clientId, projectId);
        }

        // First, generate common components
        if (onProgress) {
            onProgress({
                type: 'generating_common_components',
                message: '生成共享组件...'
            });
        }

        await this.generateCommonComponents(workflowContext, { onProgress, clientId, projectId });

        // Generate pages in batches with retry logic
        const maxRetries = 3;
        const results = [];
        let remainingPages = [...pageSpecs];
        const pageFeedback = new Map(); // pageId -> error message

        for (let attempt = 1; attempt <= maxRetries && remainingPages.length > 0; attempt++) {
            if (attempt > 1) {
                console.log(`[CodeGeneratorAgent] Retry attempt ${attempt} for ${remainingPages.length} pages`);

                if (onProgress) {
                    onProgress({
                        type: 'retry_started',
                        message: `开始第 ${attempt} 次尝试生成，剩余 ${remainingPages.length} 个页面`,
                        attempt,
                        remainingCount: remainingPages.length
                    });
                }
            }

            const attemptResults = [];

            for (let i = 0; i < remainingPages.length; i += maxParallel) {
                const batch = remainingPages.slice(i, i + maxParallel);

                const batchPromises = batch.map(pageSpec => {
                    const feedback = pageFeedback.get(pageSpec.id);
                    return this.generatePage(pageSpec, workflowContext, {
                        onProgress, clientId, projectId, feedback
                    });
                });

                const batchResults = await Promise.all(batchPromises);
                attemptResults.push(...batchResults);
            }

            // Process results
            const successes = attemptResults.filter(r => r.success);
            results.push(...successes);

            const failures = attemptResults.filter(r => !r.success);

            if (failures.length > 0) {
                remainingPages = failures.map(r => pageSpecs.find(p => p.id === r.pageId));
                failures.forEach(f => {
                    pageFeedback.set(f.pageId, `Verification Failed: ${f.error}. Please adjust the code to fix these errors.`);
                });
            } else {
                remainingPages = [];
            }
        }

        // Add final failures to results
        const successfulPageIds = new Set(results.map(r => r.pageId));
        const failedPageSpecs = pageSpecs.filter(p => !successfulPageIds.has(p.id));

        failedPageSpecs.forEach(p => {
            results.push({
                success: false,
                pageId: p.id,
                pageName: p.name,
                error: pageFeedback.get(p.id) || 'Generation failed after max retries'
            });
        });

        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        console.log(`[CodeGeneratorAgent] Generation complete: ${successCount} succeeded, ${failCount} failed`);

        return {
            success: failCount === 0,
            results,
            successCount,
            failCount
        };
    }

    /**
     * Generate common/shared components
     */
    async generateCommonComponents(workflowContext, options = {}) {
        const { onProgress, clientId, projectId } = options;

        if (clientId && projectId) {
            this.setStorageContext(clientId, projectId);
        }

        const commonComponentsPrompt = `请生成以下共享组件到 components/common/ 目录：

1. **Header.vue** - 网站头部导航
   - 包含logo和网站标题
   - 导航菜单（响应式，支持移动端）
   - 使用Tailwind CSS设计
   - 支持导航到以下页面：${workflowContext.pages.map(p => `\n     - ${p.name} (/${this.getPageFileName(p.name)})`).join('')}

2. **Footer.vue** - 网站底部
   - 包含版权信息
   - 联系方式
   - 快捷链接
   - 使用Tailwind CSS设计

项目信息：
- 功能描述: ${workflowContext.functional_spec}
- 页面数量: ${workflowContext.pages.length}

要求：
- 使用Vue 3 Composition API (<script setup lang="ts">)
- 响应式设计，移动端友好
- 使用Tailwind CSS的设计系统变量（如bg-background, text-foreground等）
- 添加适当的过渡动画
- 代码要有清晰的注释

请使用write_file工具将组件写入：
- components/common/Header.vue
- components/common/Footer.vue

记住：所有路径都是相对于src/目录的。`;

        try {
            const result = await this.run(commonComponentsPrompt, {
                onProgress: (progress) => {
                    if (onProgress) {
                        onProgress({
                            type: 'common_components_progress',
                            progress
                        });
                    }
                },
                maxIterations: 10
            });

            return result;
        } catch (error) {
            console.error('[CodeGeneratorAgent] Failed to generate common components:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Build context message for page generation
     */
    buildContextMessage(pageSpec, workflowContext, feedback) {
        const relatedPages = this.findRelatedPages(pageSpec, workflowContext);
        const pageFileName = this.getPageFileName(pageSpec.name);

        let prompt = `请为以下页面生成完整的代码：`;

        if (feedback) {
            prompt += `\n\n> [!IMPORTANT] 上次生成尝试失败，请修复以下错误：\n> ${feedback}\n`;
        }

        prompt += `

页面信息：
- 名称: ${pageSpec.name}
- 描述: ${pageSpec.description}
- 是否核心页面: ${pageSpec.is_core ? '是' : '否'}

导航关系：
${pageSpec.navigation_list.map(nav => {
            const targetPage = workflowContext.pages.find(p => p.id === nav.target_page_id);
            return `- ${nav.name}: ${nav.trigger} -> ${targetPage?.name || '未知页面'}`;
        }).join('\n')}

相关页面：
${relatedPages.map(p => `- ${p.name}: ${p.description}`).join('\n')}

项目整体信息：
- 功能描述: ${workflowContext.functional_spec}

请按照以下结构生成代码：

1. **页面特定组件** - components/${pageFileName}/
   例如: components/${pageFileName}/MainContent.vue
   - 包含页面的主要功能组件
   - 使用Vue 3 Composition API
   - 使用Tailwind CSS样式
   - 添加必要的类型定义

2. **数据文件（如果需要）** - data/${pageFileName}.ts
   - 定义TypeScript接口
   - 导出模拟数据常量
   - 例如：
   \`\`\`typescript
   export interface ${this.toPascalCase(pageFileName)}Data {
     // 定义数据结构
   }
   
   export const MOCK_${this.toUpperSnakeCase(pageFileName)}_DATA = {
     // 模拟数据
   }
   \`\`\`

3. **Astro页面文件** - pages/${pageFileName}.astro
   必须遵循以下结构：
   \`\`\`astro
   ---
   import BaseLayout from '@/layouts/BaseLayout.astro'
   import Header from '@/components/common/Header.vue'
   import Footer from '@/components/common/Footer.vue'
   import MainContent from '@/components/${pageFileName}/MainContent.vue'
   // 如果有数据文件，导入数据
   // import { MOCK_DATA } from '@/data/${pageFileName}'
   ---

   <BaseLayout title="${pageSpec.name}">
     <Header client:load />
     
     <main class="flex-1">
       <div class="container mx-auto px-4 py-8">
         <MainContent client:load />
       </div>
     </main>

     <Footer client:load />
   </BaseLayout>

   <style>
     main {
       min-height: calc(100vh - 8rem);
     }
   </style>
   \`\`\`

要求：
- 使用Tailwind CSS设计现代、美观的界面
- 实现所有导航功能（使用window.location.href或<a>标签）
- 确保响应式设计
- 添加适当的交互效果和过渡动画
- 代码要有清晰的注释
- 组件要模块化和可复用

导航实现示例：
${pageSpec.navigation_list.map(nav => {
            const targetPage = workflowContext.pages.find(p => p.id === nav.target_page_id);
            const targetFileName = targetPage ? this.getPageFileName(targetPage.name) : 'unknown';
            return `- ${nav.name}: <a href="/${targetFileName}" class="...">或 window.location.href = '/${targetFileName}'`;
        }).join('\n')}

请使用write_file工具创建所需的文件。记住所有路径都是相对于src/目录的。`;
        return prompt;
    }

    /**
     * Find pages related to the current page
     */
    findRelatedPages(pageSpec, workflowContext) {
        const relatedPageIds = new Set();

        // Add pages this page navigates to
        pageSpec.navigation_list.forEach(nav => {
            relatedPageIds.add(nav.target_page_id);
        });

        // Add pages that navigate to this page
        workflowContext.pages.forEach(page => {
            page.navigation_list.forEach(nav => {
                if (nav.target_page_id === pageSpec.id) {
                    relatedPageIds.add(page.id);
                }
            });
        });

        return workflowContext.pages.filter(p => relatedPageIds.has(p.id));
    }

    /**
     * Convert page name to file name
     */
    getPageFileName(pageName) {
        return pageName
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, '')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Convert kebab-case to PascalCase
     */
    toPascalCase(str) {
        return str
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }

    /**
     * Convert kebab-case to UPPER_SNAKE_CASE
     */
    toUpperSnakeCase(str) {
        return str
            .replace(/-/g, '_')
            .toUpperCase();
    }
}

export default new CodeGeneratorAgent();
