<template>
  <header class="bg-background border-b border-border shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and site title -->
        <div class="flex items-center space-x-2">
          <a href="./HomePage.html" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div class="bg-primary w-8 h-8 rounded-lg flex items-center justify-center">
              <span class="text-primary-foreground font-bold text-lg">T</span>
            </div>
            <span class="text-xl font-bold text-foreground">任务管理系统</span>
          </a>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-1">
          <a
            v-for="item in navItems"
            :key="item.name"
            :href="item.path"
            class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
            :class="[
              isActive(item.path)
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-accent hover:text-accent-foreground'
            ]"
          >
            {{ item.name }}
          </a>
        </nav>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none"
            aria-expanded="false"
          >
            <span class="sr-only">打开主菜单</span>
            <svg
              v-if="!mobileMenuOpen"
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg
              v-else
              class="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-show="mobileMenuOpen" class="md:hidden bg-background border-t border-border">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a
          v-for="item in navItems"
          :key="item.name"
          :href="item.path"
          class="block px-3 py-2 rounded-md text-base font-medium transition-colors"
          :class="[
            isActive(item.path)
              ? 'bg-primary text-primary-foreground'
              : 'text-foreground hover:bg-accent hover:text-accent-foreground'
          ]"
          @click="closeMobileMenu"
        >
          {{ item.name }}
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 定义导航项
interface NavItem {
  name: string
  path: string
}

const navItems: NavItem[] = [
  { name: '任务列表', path: './TaskListPage.html' },
  { name: '任务详情', path: './TaskDetailPage.html' },
  { name: '进度跟踪', path: './ProgressTrackingPage.html' }
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
    return window.location.pathname.includes(path.replace('./', '').replace('.html', ''))
  }
  return false
}
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>