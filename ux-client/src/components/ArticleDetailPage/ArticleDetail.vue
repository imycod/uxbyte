<template>
  <div class="max-w-4xl mx-auto">
    <!-- 返回按钮 -->
    <button 
      @click="goBack"
      class="flex items-center text-primary hover:text-primary/80 mb-6 transition-colors duration-200"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      返回文章列表
    </button>

    <!-- 文章详情卡片 -->
    <article class="bg-card rounded-xl shadow-lg overflow-hidden">
      <!-- 文章头部 -->
      <header class="p-6 border-b border-border">
        <div class="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ formatPublishDate(article.publishDate) }}
          </span>
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ article.readTime }} 分钟阅读
          </span>
          <span class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            {{ article.author }}
          </span>
        </div>

        <h1 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {{ article.title }}
        </h1>

        <div class="flex flex-wrap gap-2">
          <span 
            class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
          >
            {{ article.category }}
          </span>
          <span 
            v-for="tag in article.tags" 
            :key="tag"
            class="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
          >
            {{ tag }}
          </span>
        </div>
      </header>

      <!-- 文章内容 -->
      <div 
        class="prose prose-lg max-w-none p-6 text-foreground"
        v-html="article.content"
      ></div>

      <!-- 文章底部 -->
      <footer class="p-6 border-t border-border bg-muted/50">
        <div class="flex justify-between items-center">
          <div class="text-sm text-muted-foreground">
            发布于 {{ formatPublishDate(article.publishDate) }}
          </div>
          <div class="flex space-x-2">
            <button 
              class="p-2 rounded-full hover:bg-muted transition-colors duration-200"
              aria-label="分享文章"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
            </button>
            <button 
              class="p-2 rounded-full hover:bg-muted transition-colors duration-200"
              aria-label="收藏文章"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      </footer>
    </article>

    <!-- 相关文章推荐 -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold text-foreground mb-6">相关文章</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="related in relatedArticles" 
          :key="related.id"
          class="bg-card rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
          @click="viewRelatedArticle(related.id)"
        >
          <h3 class="text-lg font-semibold text-foreground mb-2">{{ related.title }}</h3>
          <p class="text-muted-foreground text-sm mb-4 line-clamp-2">{{ related.excerpt }}</p>
          <div class="flex items-center text-xs text-muted-foreground">
            <span>{{ formatPublishDate(related.publishDate) }}</span>
            <span class="mx-2">•</span>
            <span>{{ related.readTime }} 分钟阅读</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Article, MOCK_ARTICLE_DATA } from '@/data/ArticleDetailPage'

// 定义相关文章接口
interface RelatedArticle {
  id: string
  title: string
  excerpt: string
  publishDate: string
  readTime: number
}

// Props
const props = defineProps<{
  article: Article
}>()

// 相关文章数据
const relatedArticles = ref<RelatedArticle[]>([
  {
    id: '2',
    title: '深入理解 Vue 3 响应式系统',
    excerpt: 'Vue 3 的响应式系统是其核心特性之一，本文将深入探讨其工作原理和实现机制。',
    publishDate: '2023-05-10',
    readTime: 12
  },
  {
    id: '3',
    title: 'TypeScript 在 Vue 项目中的最佳实践',
    excerpt: '如何在 Vue 项目中充分利用 TypeScript 的类型系统来提高代码质量和开发体验。',
    publishDate: '2023-05-05',
    readTime: 10
  }
])

// 格式化发布日期
const formatPublishDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 返回文章列表
const goBack = () => {
  window.location.href = '/ArticleListPage'
}

// 查看相关文章
const viewRelatedArticle = (id: string) => {
  // 在实际应用中，这里会跳转到具体的文章详情页
  // 为演示目的，我们只是跳转到文章列表页
  window.location.href = '/ArticleListPage'
}
</script>

<style scoped>
/* 为文章内容中的代码块添加样式 */
.prose :deep(pre) {
  @apply bg-muted p-4 rounded-lg overflow-x-auto;
}

.prose :deep(code) {
  @apply font-mono text-sm;
}

.prose :deep(h2) {
  @apply text-2xl font-bold mt-8 mb-4 text-foreground;
}

.prose :deep(h3) {
  @apply text-xl font-semibold mt-6 mb-3 text-foreground;
}

.prose :deep(p) {
  @apply mb-4 text-foreground;
}

.prose :deep(ul) {
  @apply list-disc pl-6 mb-4;
}

.prose :deep(ol) {
  @apply list-decimal pl-6 mb-4;
}

.prose :deep(li) {
  @apply mb-2;
}

.prose :deep(strong) {
  @apply font-semibold;
}

/* 确保文章内容中的链接样式 */
.prose :deep(a) {
  @apply text-primary hover:underline;
}
</style>