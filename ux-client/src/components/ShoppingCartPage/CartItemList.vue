<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-900">购物车 ({{ cartItems.length }} 件商品)</h2>
    </div>
    
    <div v-if="cartItems.length > 0" class="divide-y divide-gray-200">
      <div 
        v-for="item in cartItems" 
        :key="item.id"
        class="p-6 flex flex-col sm:flex-row gap-6 hover:bg-gray-50 transition-colors"
      >
        <!-- 商品图片 -->
        <div class="flex-shrink-0">
          <img 
            :src="item.image" 
            :alt="item.name"
            class="w-24 h-24 object-cover rounded-md border border-gray-200"
          >
        </div>
        
        <!-- 商品信息 -->
        <div class="flex-1">
          <div class="flex flex-col md:flex-row md:justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ item.name }}</h3>
              <p class="mt-1 text-sm text-gray-500">SKU: {{ item.sku }}</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span v-if="item.color" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  颜色: {{ item.color }}
                </span>
                <span v-if="item.size" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  尺寸: {{ item.size }}
                </span>
              </div>
            </div>
            
            <!-- 价格 -->
            <div class="mt-4 md:mt-0 text-right">
              <p class="text-lg font-medium text-gray-900">¥{{ item.price.toFixed(2) }}</p>
              <p v-if="item.originalPrice" class="mt-1 text-sm text-gray-500 line-through">¥{{ item.originalPrice.toFixed(2) }}</p>
            </div>
          </div>
          
          <!-- 数量控制和操作 -->
          <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div class="flex items-center">
              <label class="mr-3 text-sm font-medium text-gray-700">数量:</label>
              <div class="flex items-center border border-gray-300 rounded-md">
                <button
                  @click="decreaseQuantity(item.id)"
                  type="button"
                  class="px-3 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
                  :disabled="item.quantity <= 1"
                  :class="{ 'opacity-50 cursor-not-allowed': item.quantity <= 1 }"
                >
                  -
                </button>
                <span class="px-3 py-1 text-gray-900">{{ item.quantity }}</span>
                <button
                  @click="increaseQuantity(item.id)"
                  type="button"
                  class="px-3 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
                >
                  +
                </button>
              </div>
            </div>
            
            <div class="flex items-center space-x-4">
              <p class="text-lg font-medium text-gray-900">小计: ¥{{ (item.price * item.quantity).toFixed(2) }}</p>
              <button
                @click="removeItem(item.id)"
                type="button"
                class="text-red-600 hover:text-red-800 text-sm font-medium flex items-center"
              >
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">购物车为空</h3>
      <p class="mt-1 text-gray-500">您的购物车中还没有商品</p>
      <div class="mt-6">
        <button
          @click="continueShopping"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          继续购物
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from 'vue'
import type { CartItem } from '@/data/ShoppingCartPage'

interface Props {
  cartItems?: CartItem[]
}

const props = withDefaults(defineProps<Props>(), {
  cartItems: () => []
})

// 定义事件
const emit = defineEmits<{
  (e: 'update-quantity', id: string, quantity: number): void
  (e: 'remove-item', id: string): void
  (e: 'continue-shopping'): void
}>()

// 增加商品数量
const increaseQuantity = (id: string) => {
  const item = props.cartItems.find(item => item.id === id)
  if (item) {
    emit('update-quantity', id, item.quantity + 1)
  }
}

// 减少商品数量
const decreaseQuantity = (id: string) => {
  const item = props.cartItems.find(item => item.id === id)
  if (item && item.quantity > 1) {
    emit('update-quantity', id, item.quantity - 1)
  }
}

// 删除商品
const removeItem = (id: string) => {
  emit('remove-item', id)
}

// 继续购物
const continueShopping = () => {
  emit('continue-shopping')
}
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>