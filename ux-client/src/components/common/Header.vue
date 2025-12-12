<template>
  <header class="bg-background border-b border-border sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-2">
          <div class="bg-primary w-8 h-8 rounded-lg"></div>
          <span class="text-xl font-bold text-foreground">在线商城</span>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex space-x-6">
          <a
            v-for="item in navItems"
            :key="item.name"
            :href="item.path"
            class="text-foreground hover:text-primary transition-colors duration-200"
            :class="{ 'text-primary font-medium': isActive(item.path) }"
          >
            {{ item.name }}
          </a>
        </nav>

        <!-- Mobile menu button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden text-foreground focus:outline-none"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Toggle navigation menu"
        >
          <svg
            v-if="!isMobileMenuOpen"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-show="isMobileMenuOpen"
        class="md:hidden py-4 border-t border-border"
        id="mobile-menu"
      >
        <div class="flex flex-col space-y-3">
          <a
            v-for="item in navItems"
            :key="item.name"
            :href="item.path"
            class="text-foreground hover:text-primary transition-colors duration-200 py-2"
            :class="{ 'text-primary font-medium': isActive(item.path) }"
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

// 定义导航项
interface NavItem {
  name: string
  path: string
}

const navItems: NavItem[] = [
  { name: '首页', path: '/HomePage' },
  { name: '商品详情', path: '/ProductDetailPage' },
  { name: '购物车', path: '/ShoppingCartPage' },
  { name: '订单管理', path: '/OrderManagementPage' },
  { name: '订单详情', path: '/OrderDetailPage' }
]

// 响应式状态
const isMobileMenuOpen = ref(false)

// 切换移动端菜单
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// 关闭移动端菜单
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// 检查当前页面是否激活
const isActive = (path: string) => {
  if (typeof window !== 'undefined') {
    return window.location.pathname === path
  }
  return false
}

// 处理点击外部关闭菜单
const handleClickOutside = (event: MouseEvent) => {
  const mobileMenu = document.getElementById('mobile-menu')
  const header = document.querySelector('header')
  
  if (
    isMobileMenuOpen.value &&
    mobileMenu &&
    header &&
    !mobileMenu.contains(event.target as Node) &&
    !header.contains(event.target as Node)
  ) {
    closeMobileMenu()
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