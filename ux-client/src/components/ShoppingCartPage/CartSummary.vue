<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-900">订单摘要</h2>
    </div>
    
    <div class="p-6 space-y-4">
      <div class="flex justify-between">
        <span class="text-gray-600">小计</span>
        <span class="font-medium text-gray-900">¥{{ summary.subtotal.toFixed(2) }}</span>
      </div>
      
      <div class="flex justify-between">
        <span class="text-gray-600">折扣</span>
        <span class="font-medium text-green-600">-¥{{ summary.discount.toFixed(2) }}</span>
      </div>
      
      <div class="flex justify-between">
        <span class="text-gray-600">运费</span>
        <span class="font-medium text-gray-900">
          <span v-if="summary.shipping === 0">免运费</span>
          <span v-else>¥{{ summary.shipping.toFixed(2) }}</span>
        </span>
      </div>
      
      <div class="flex justify-between">
        <span class="text-gray-600">税费</span>
        <span class="font-medium text-gray-900">¥{{ summary.tax.toFixed(2) }}</span>
      </div>
      
      <div class="border-t border-gray-200 pt-4 flex justify-between">
        <span class="text-lg font-bold text-gray-900">总计</span>
        <span class="text-lg font-bold text-gray-900">¥{{ summary.total.toFixed(2) }}</span>
      </div>
      
      <div class="mt-6">
        <button
          @click="checkout"
          type="button"
          class="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          去结算
        </button>
      </div>
      
      <div class="mt-4">
        <button
          @click="continueShopping"
          type="button"
          class="w-full text-primary hover:text-primary-dark font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
        >
          ← 继续购物
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from 'vue'
import type { CartSummary } from '@/data/ShoppingCartPage'

interface Props {
  summary?: CartSummary
}

const props = withDefaults(defineProps<Props>(), {
  summary: () => ({
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0
  })
})

// 定义事件
const emit = defineEmits<{
  (e: 'checkout'): void
  (e: 'continue-shopping'): void
}>()

// 去结算
const checkout = () => {
  emit('checkout')
}

// 继续购物
const continueShopping = () => {
  emit('continue-shopping')
}
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>