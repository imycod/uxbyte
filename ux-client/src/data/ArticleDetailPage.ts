// data/ArticleDetailPage.ts
export interface Article {
  id: string
  title: string
  content: string
  category: string
  author: string
  publishDate: string
  readTime: number
  tags: string[]
}

export const MOCK_ARTICLE_DATA: Article = {
  id: '1',
  title: 'Vue 3 Composition API 完全指南',
  content: `
    <p>Vue 3 Composition API 是 Vue.js 3.0 版本引入的重要特性，它提供了一种更灵活的方式来组织和复用组件逻辑。</p>
    
    <h2>什么是 Composition API？</h2>
    <p>Composition API 是一组基于函数的 API，允许我们更灵活地组合组件的逻辑。相比于 Options API，它提供了更好的逻辑复用性和代码组织方式。</p>
    
    <h2>Composition API 的优势</h2>
    <ul>
      <li><strong>更好的逻辑复用</strong>：通过组合函数可以轻松地在多个组件之间共享逻辑</li>
      <li><strong>更灵活的代码组织</strong>：可以将相关逻辑组织在一起，而不是分散在不同的选项中</li>
      <li><strong>更好的类型推导</strong>：在 TypeScript 中有更好的类型支持</li>
      <li><strong>更小的生产包</strong>：通过 tree-shaking 可以减少最终打包体积</li>
    </ul>
    
    <h2>基本用法示例</h2>
    <pre><code>import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const doubledCount = computed(() => count.value * 2)
    
    const increment = () => {
      count.value++
    }
    
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    return {
      count,
      doubledCount,
      increment
    }
  }
}</code></pre>
    
    <h2>实际应用场景</h2>
    <p>在实际开发中，Composition API 特别适用于以下场景：</p>
    <ol>
      <li>复杂的组件逻辑组织</li>
      <li>跨组件的逻辑复用</li>
      <li>大型项目的代码维护</li>
      <li>与 TypeScript 的深度集成</li>
    </ol>
    
    <p>通过合理使用 Composition API，我们可以构建出更加健壮和可维护的 Vue 应用程序。</p>
  `,
  category: '前端开发',
  author: '张三',
  publishDate: '2023-05-15',
  readTime: 8,
  tags: ['Vue', 'JavaScript', '前端框架']
}