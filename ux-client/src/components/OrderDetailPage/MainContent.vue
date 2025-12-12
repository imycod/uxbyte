<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">订单详情</h1>
      <button
        @click="goToOrderManagement"
        class="flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        返回订单列表
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 订单信息 -->
      <div class="lg:col-span-2 space-y-8">
        <!-- 订单状态 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">订单状态</h2>
          </div>
          <div class="p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">订单已完成</h3>
                <p class="text-sm text-gray-500">您的订单已成功交付</p>
              </div>
            </div>
            
            <!-- 订单进度 -->
            <div class="mt-8">
              <div class="flex justify-between">
                <div class="text-center">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white mx-auto">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p class="mt-2 text-sm font-medium text-gray-900">已下单</p>
                  <p class="text-xs text-gray-500">2023-05-15</p>
                </div>
                
                <div class="flex-1 flex items-center justify-center">
                  <div class="w-full h-1 bg-green-500"></div>
                </div>
                
                <div class="text-center">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white mx-auto">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p class="mt-2 text-sm font-medium text-gray-900">已发货</p>
                  <p class="text-xs text-gray-500">2023-05-16</p>
                </div>
                
                <div class="flex-1 flex items-center justify-center">
                  <div class="w-full h-1 bg-green-500"></div>
                </div>
                
                <div class="text-center">
                  <div class="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white mx-auto">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p class="mt-2 text-sm font-medium text-gray-900">已完成</p>
                  <p class="text-xs text-gray-500">2023-05-18</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 订单商品 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">订单商品</h2>
          </div>
          <div class="divide-y divide-gray-200">
            <div 
              v-for="item in order.items" 
              :key="item.id"
              class="p-6 flex items-center"
            >
              <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                <img 
                  :src="item.image" 
                  :alt="item.name"
                  class="w-full h-full object-cover"
                >
              </div>
              <div class="ml-4 flex-1">
                <h3 class="text-sm font-medium text-gray-900">{{ item.name }}</h3>
                <p class="mt-1 text-sm text-gray-500">SKU: {{ item.sku }}</p>
              </div>
              <div class="ml-4">
                <p class="text-sm text-gray-900">x{{ item.quantity }}</p>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">¥{{ item.price.toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 订单摘要 -->
      <div class="space-y-8">
        <!-- 订单摘要 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">订单摘要</h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">订单号</span>
              <span class="font-medium text-gray-900">{{ order.orderNumber }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">下单时间</span>
              <span class="font-medium text-gray-900">{{ order.date }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">订单状态</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusColor(order.status)">
                {{ getStatusText(order.status) }}
              </span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">支付方式</span>
              <span class="font-medium text-gray-900">{{ order.paymentMethod }}</span>
            </div>
            
            <div v-if="order.trackingNumber" class="flex justify-between">
              <span class="text-gray-600">快递单号</span>
              <span class="font-medium text-gray-900">{{ order.trackingNumber }}</span>
            </div>
          </div>
        </div>
        
        <!-- 费用明细 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">费用明细</h2>
          </div>
          <div class="p-6 space-y-4">
            <div class="flex justify-between">
              <span class="text-gray-600">商品总价</span>
              <span class="font-medium text-gray-900">¥{{ subtotal.toFixed(2) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">运费</span>
              <span class="font-medium text-gray-900">¥{{ shippingCost.toFixed(2) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">税费</span>
              <span class="font-medium text-gray-900">¥{{ tax.toFixed(2) }}</span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">优惠</span>
              <span class="font-medium text-green-600">-¥{{ discount.toFixed(2) }}</span>
            </div>
            
            <div class="border-t border-gray-200 pt-4 flex justify-between">
              <span class="text-base font-medium text-gray-900">总计</span>
              <span class="text-lg font-bold text-gray-900">¥{{ order.total.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <!-- 收货信息 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">收货信息</h2>
          </div>
          <div class="p-6">
            <p class="text-gray-900">{{ order.shippingAddress }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { withDefaults, defineProps } from 'vue';
import type { OrderDetail } from '@/data/OrderDetailPage';
import { getStatusText, getStatusColor } from '@/data/OrderManagementPage';

interface Props {
  order?: OrderDetail;
}

const props = withDefaults(defineProps<Props>(), {
  order: () => ({
    id: '',
    orderNumber: '',
    date: '',
    status: 'pending',
    total: 0,
    shippingAddress: '',
    paymentMethod: '',
    items: []
  })
});

// 计算费用明细
const subtotal = computed(() => {
  return props.order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
});

const shippingCost = computed(() => props.order.shippingCost || 0);
const tax = computed(() => props.order.tax || 0);
const discount = computed(() => props.order.discount || 0);

// 导航到订单管理页
const goToOrderManagement = () => {
  window.location.href = '/OrderManagementPage';
};
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>