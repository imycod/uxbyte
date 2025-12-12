<template>
  <div>
    <!-- 页面标题和操作区域 -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-4 md:mb-0">博客文章</h1>
      <div class="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文章..."
            class="w-full sm:w-64 pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg
            class="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <button
          @click="goToCategoryManagement"
          class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
          分类管理
        </button>
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="mb-8">
      <div class="flex flex-wrap gap-2">
        <button
          @click="selectedCategory = null"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
            selectedCategory === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          ]"
        >
          全部
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center',
            selectedCategory === category.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          ]"
        >
          {{ category.name }}
          <span
            class="ml-2 bg-background/20 text-background-foreground text-xs px-2 py-0.5 rounded-full"
          >
            {{ category.articleCount }}
          </span>
        </button>
      </div>
    </div>

    <!-- 文章列表 -->
    <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="article in filteredArticles"
        :key="article.id"
        class="bg-card rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        @click="viewArticle(article.id)"
      >
        <div v-if="article.coverImage" class="h-48 overflow-hidden">
          <img
            :src="article.coverImage"
            :alt="article.title"
            class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div class="p-6">
          <div class="flex justify-between items-start mb-3">
            <span class="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
              {{ article.categoryName }}
            </span>
            <span class="text-xs text-muted-foreground">
              {{ formatDate(article.publishDate) }}
            </span>
          </div>
          <h2 class="text-xl font-bold text-foreground mb-3 line-clamp-2">
            {{ article.title }}
          </h2>
          <p class="text-muted-foreground mb-4 line-clamp-3">
            {{ article.summary }}
          </p>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in article.tags.slice(0, 3)"
              :key="tag"
              class="text-xs px-2 py-1 bg-muted text-muted-foreground rounded"
            >
              {{ tag }}
            </span>
            <span
              v-if="article.tags.length > 3"
              class="text-xs px-2 py-1 bg-muted text-muted-foreground rounded"
            >
              +{{ article.tags.length - 3 }}
            </span>
          </div>
          <div class="flex items-center mt-4 text-sm text-muted-foreground">
            <span class="flex items-center mr-4">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
              {{ article.views }}
            </span>
            <span class="flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                ></path>
              </svg>
              {{ article.likes }}
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-muted-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        ></path>
      </svg>
      <h3 class="mt-2 text-lg font-medium text-foreground">没有找到文章</h3>
      <p class="mt-1 text-muted-foreground">
        没有找到与 "{{ searchQuery }}" 相关的文章。
      </p>
      <div class="mt-6">
        <button
          @click="resetFilters"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          重置筛选条件
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Article, Category, MOCK_ARTICLES, MOCK_CATEGORIES } from '@/data/ArticleListPage'

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref<string | null>(null)
const articles = ref<Article[]>(MOCK_ARTICLES)
const categories = ref<Category[]>(MOCK_CATEGORIES)

// 计算属性：过滤后的文章
const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    // 搜索过滤
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    // 分类过滤
    const matchesCategory = selectedCategory.value 
      ? article.categoryId === selectedCategory.value 
      : true
    
    return matchesSearch && matchesCategory
  })
})

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 查看文章详情
const viewArticle = (articleId: string) => {
  window.location.href = `/ArticleDetailPage`
}

// 跳转到分类管理页面
const goToCategoryManagement = () => {
  window.location.href = '/CategoryManagementPage'
}

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = null
}
</script>

<style scoped>
/* 添加行数限制的样式 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>