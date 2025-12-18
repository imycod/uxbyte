<template>
  <header class="bg-background border-b border-border shadow-sm">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo and site title -->
        <div class="flex items-center space-x-2">
          <a href="./HomePage.html" class="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div class="bg-primary w-8 h-8 rounded-lg flex items-center justify-center">
              <span class="text-primary-foreground font-bold text-lg">M</span>
            </div>
            <span class="text-xl font-bold text-foreground">在线商城</span>
          </a>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <a 
            v-for="item in navItems" 
            :key="item.name"
            :href="item.path"
            class="text-foreground hover:text-primary transition-colors font-medium"
            :class="{ 'text-primary': isActive(item.path) }"
          >
            {{ item.name }}
          </a>
        </nav>

        <!-- Mobile menu button -->
        <button 
          @click="toggleMobileMenu"
          class="md:hidden text-foreground focus:outline-none"
          :aria-expanded="isMobileMenuOpen"
          aria-label="Toggle menu"
        >
          <svg 
            v-if="!isMobileMenuOpen" 
            class="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <svg 
            v-else 
            class="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Mobile Navigation -->
      <transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-96"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 max-h-96"
        leave-to-class="opacity-0 max-h-0"
      >
        <nav 
          v-if="isMobileMenuOpen" 
          class="md:hidden py-4 border-t border-border"
        >
          <div class="flex flex-col space-y-3">
            <a 
              v-for="item in navItems" 
              :key="item.name"
              :href="item.path"
              class="text-foreground hover:text-primary transition-colors py-2 px-4 rounded-md"
              :class="{ 'bg-primary/10 text-primary': isActive(item.path) }"
              @click="closeMobileMenu"
            >
              {{ item.name }}
            </a>
          </div>
        </nav>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Navigation items
const navItems = [
  { name: '首页', path: './HomePage.html' },
  { name: '商品详情', path: './ProductDetailPage.html' },
  { name: '购物车', path: './ShoppingCartPage.html' },
  { name: '订单管理', path: './OrderManagementPage.html' },
  { name: '订单详情', path: './OrderDetailPage.html' }
]

// Reactive state
const isMobileMenuOpen = ref(false)

// Check if current path matches the navigation item
const isActive = (path: string) => {
  if (typeof window !== 'undefined') {
    return window.location.pathname.includes(path.replace('./', '').replace('.html', ''))
  }
  return false
}

// Toggle mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Close mobile menu
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Close mobile menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('header')) {
    isMobileMenuOpen.value = false
  }
}

// Close mobile menu on escape key
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isMobileMenuOpen.value = false
  }
}

// Handle window resize
const handleResize = () => {
  if (window.innerWidth >= 768) {
    isMobileMenuOpen.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener('click', handleClickOutside)
  window.addEventListener('keydown', handleEscape)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('keydown', handleEscape)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* Custom styles if needed */
</style>