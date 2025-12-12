<template>
  <header class="bg-background border-b border-border shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-2">
          <div class="bg-primary w-8 h-8 rounded-lg"></div>
          <span class="text-xl font-bold text-foreground">博客系统</span>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-6">
          <a 
            v-for="item in navItems" 
            :key="item.name"
            :href="item.path"
            class="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            :class="{ 'text-primary': isActive(item.path) }"
          >
            {{ item.name }}
          </a>
        </nav>

        <!-- Mobile menu button -->
        <button 
          @click="toggleMobileMenu"
          class="md:hidden text-foreground focus:outline-none"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-menu"
        >
          <svg 
            v-if="!mobileMenuOpen" 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          </svg>
          <svg 
            v-else 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div 
        v-show="mobileMenuOpen" 
        id="mobile-menu"
        class="md:hidden pb-4"
      >
        <div class="flex flex-col space-y-2 pt-2">
          <a 
            v-for="item in navItems" 
            :key="item.name"
            :href="item.path"
            class="text-foreground hover:bg-muted hover:text-primary px-3 py-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-muted text-primary': isActive(item.path) }"
            @click="closeMobileMenu"
          >
            {{ item.name }}
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 导航项定义
const navItems = [
  { name: '文章列表', path: '/ArticleListPage' },
  { name: '文章详情', path: '/ArticleDetailPage' },
  { name: '分类管理', path: '/CategoryManagementPage' }
]

// 移动端菜单状态
const mobileMenuOpen = ref(false)

// 切换移动端菜单
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

// 检查当前页面是否激活
const isActive = (path: string) => {
  if (typeof window !== 'undefined') {
    return window.location.pathname === path
  }
  return false
}

// 处理窗口点击事件，点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('header')) {
    mobileMenuOpen.value = false
  }
}

// 挂载时添加事件监听器
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// 卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>