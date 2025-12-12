<template>
  <footer class="bg-background border-t border-border mt-12">
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 关于我们 -->
        <div>
          <h3 class="text-lg font-semibold text-foreground mb-4">关于我们</h3>
          <p class="text-muted-foreground">
            这是一个功能完善的博客系统，提供文章发布、分类管理、内容展示等功能，
            为用户提供优质的阅读和写作体验。
          </p>
        </div>

        <!-- 快捷链接 -->
        <div>
          <h3 class="text-lg font-semibold text-foreground mb-4">快捷链接</h3>
          <ul class="space-y-2">
            <li v-for="item in navItems" :key="item.name">
              <a 
                :href="item.path"
                class="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                {{ item.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- 联系方式 -->
        <div>
          <h3 class="text-lg font-semibold text-foreground mb-4">联系我们</h3>
          <ul class="space-y-2 text-muted-foreground">
            <li class="flex items-start">
              <svg class="h-5 w-5 mr-2 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>400-800-8888</span>
            </li>
            <li class="flex items-start">
              <svg class="h-5 w-5 mr-2 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>contact@blogsystem.com</span>
            </li>
            <li class="flex items-start">
              <svg class="h-5 w-5 mr-2 text-muted-foreground mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>北京市朝阳区某某街道123号</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="border-t border-border mt-8 pt-6 text-center text-muted-foreground">
        <p>© {{ currentYear }} 博客系统. 保留所有权利.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 当前年份
const currentYear = ref(new Date().getFullYear())

// 导航项
const navItems = [
  { name: '文章列表', path: '/ArticleListPage' },
  { name: '文章详情', path: '/ArticleDetailPage' },
  { name: '分类管理', path: '/CategoryManagementPage' }
]
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>