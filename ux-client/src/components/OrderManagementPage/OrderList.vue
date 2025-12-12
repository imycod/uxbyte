<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-xl font-bold text-gray-900">我的订单</h2>
    </div>
    
    <div v-if="orders.length > 0" class="divide-y divide-gray-200">
      <div 
        v-for="order in orders" 
        :key="order.id"
        class="p-6 hover:bg-gray-50 transition-colors"
      >
        <div class="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <div class="flex flex-col sm:flex-row sm:items-center">
              <h3 class="text-lg font-medium text-gray-900">
                订单号: {{ order.orderNumber }}
              </h3>
              <span class="ml-0 sm:ml-4 mt-1 sm:mt-0 text-sm text-gray-500">
                {{ formatDate(order.date) }}
              </span>
            </div>
            
            <div class="mt-2 flex flex-wrap gap-2">
              <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(order.status)]">
                {{ getStatusText(order.status) }}
              </span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {{ order.items.length }} 件商品
              </span>
            </div>
          </div>
          
          <div class="mt-4 md:mt-0 flex flex-col items-end">
            <p class="text-lg font-medium text-gray-900">¥{{ order.total.toFixed(2) }}</p>
            <button
              @click="viewOrderDetail(order.id)"
              class="mt-2 text-sm font-medium text-primary hover:text-primary-dark"
            >
              查看详情 →
            </button>
          </div>
        </div>
        
        <!-- 订单商品缩略图 -->
        <div class="mt-4 flex gap-2 overflow-x-auto">
          <div 
            v-for="item in order.items.slice(0, 5)" 
            :key="item.id"
            class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden"
          >
            <img 
              :src="item.image" 
              :alt="item.name"
              class="w-full h-full object-cover"
            >
          </div>
          <div 
            v-if="order.items.length > 5"
            class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm"
          >
            +{{ order.items.length - 5 }}
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">暂无订单</h3>
      <p class="mt-1 text-gray-500">您还没有任何订单记录</p>
      <div class="mt-6">
        <button
          @click="goToHomePage"
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          去购物
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from 'vue';
import type { Order } from '@/data/OrderManagementPage';
import { getStatusText, getStatusColor } from '@/data/OrderManagementPage';

interface Props {
  orders?: Order[];
}

const props = withDefaults(defineProps<Props>(), {
  orders: () => []
});

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 查看订单详情
const viewOrderDetail = (orderId: string) => {
  window.location.href = `/OrderDetailPage?orderId=${orderId}`;
};

// 去购物
const goToHomePage = () => {
  window.location.href = '/HomePage';
};
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>