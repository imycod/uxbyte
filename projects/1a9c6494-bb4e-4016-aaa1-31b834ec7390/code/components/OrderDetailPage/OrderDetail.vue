<template>
  <div class="order-detail-page">
    <!-- 返回按钮 -->
    <button
      @click="goToOrderList"
      class="flex items-center text-primary hover:text-primary/80 transition-colors mb-6"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      返回订单列表
    </button>

    <!-- 订单头部信息 -->
    <div class="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-foreground">订单详情</h1>
          <p class="text-muted-foreground mt-1">订单号: {{ order.orderNumber }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span 
            :class="ORDER_STATUS_COLORS[order.status]"
            class="px-3 py-1 text-sm font-medium rounded-full whitespace-nowrap"
          >
            {{ ORDER_STATUS_LABELS[order.status] }}
          </span>
          <span class="text-muted-foreground">{{ formatDate(order.date) }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧内容 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 商品列表 -->
        <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-foreground mb-4">商品信息</h2>
          <div class="space-y-4">
            <div 
              v-for="item in order.items" 
              :key="item.id"
              class="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-lg"
            >
              <img 
                :src="item.image" 
                :alt="item.name"
                class="w-20 h-20 object-contain rounded-lg bg-muted"
              />
              <div class="flex-1">
                <h3 class="font-medium text-foreground">{{ item.name }}</h3>
                <p class="text-sm text-muted-foreground mt-1">SKU: {{ item.sku }}</p>
                <div class="flex flex-wrap items-center justify-between mt-3 gap-2">
                  <span class="text-foreground">¥{{ item.price.toFixed(2) }}</span>
                  <span class="text-muted-foreground">数量: {{ item.quantity }}</span>
                  <span class="font-medium text-foreground">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 配送和账单地址 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h2 class="text-xl font-semibold text-foreground mb-4">配送地址</h2>
            <div class="space-y-2">
              <p class="font-medium text-foreground">{{ order.shippingAddress.name }}</p>
              <p class="text-muted-foreground">{{ order.shippingAddress.phone }}</p>
              <p class="text-muted-foreground">{{ order.shippingAddress.address }}</p>
              <p class="text-muted-foreground">{{ order.shippingAddress.city }} {{ order.shippingAddress.postalCode }}</p>
            </div>
          </div>

          <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
            <h2 class="text-xl font-semibold text-foreground mb-4">账单地址</h2>
            <div class="space-y-2">
              <p class="font-medium text-foreground">{{ order.billingAddress.name }}</p>
              <p class="text-muted-foreground">{{ order.billingAddress.phone }}</p>
              <p class="text-muted-foreground">{{ order.billingAddress.address }}</p>
              <p class="text-muted-foreground">{{ order.billingAddress.city }} {{ order.billingAddress.postalCode }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧总计 -->
      <div class="bg-card border border-border rounded-lg p-6 shadow-sm h-fit">
        <h2 class="text-xl font-semibold text-foreground mb-4">订单总计</h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-muted-foreground">商品小计</span>
            <span class="text-foreground">¥{{ order.subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">配送费</span>
            <span class="text-foreground">¥{{ order.shipping.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">税费</span>
            <span class="text-foreground">¥{{ order.tax.toFixed(2) }}</span>
          </div>
          <div class="border-t border-border pt-3 mt-3">
            <div class="flex justify-between font-semibold">
              <span class="text-foreground">总计</span>
              <span class="text-foreground">¥{{ order.total.toFixed(2) }}</span>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-border">
            <div class="space-y-2">
              <div>
                <p class="text-sm text-muted-foreground">支付方式</p>
                <p class="text-foreground">{{ order.paymentMethod }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground">配送方式</p>
                <p class="text-foreground">{{ order.shippingMethod }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { OrderDetail } from '@/data/OrderDetailPage'
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, MOCK_ORDER_DETAIL } from '@/data/OrderDetailPage'

// Props with defaults
interface Props {
  order?: OrderDetail
}

const props = withDefaults(defineProps<Props>(), {
  order: () => MOCK_ORDER_DETAIL
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Navigation methods
const goToOrderList = () => {
  window.location.href = './OrderManagementPage.html'
}
</script>

<style scoped>
/* Custom styles if needed */
</style>