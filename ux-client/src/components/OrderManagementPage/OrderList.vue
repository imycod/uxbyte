<template>
  <div class=\"order-management-page\">
    <!-- Page header -->
    <div class=\"flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4\">
      <div>
        <h1 class=\"text-2xl md:text-3xl font-bold text-foreground\">订单管理</h1>
        <p class=\"text-muted-foreground mt-2\">查看和管理您的所有订单</p>
      </div>
      <button
        @click=\"goToHomePage\"
        class=\"px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center\"
      >
        <svg
          class=\"w-5 h-5 mr-2\"
          fill=\"none\"
          stroke=\"currentColor\"
          viewBox=\"0 0 24 24\"
          xmlns=\"http://www.w3.org/2000/svg\"
        >
          <path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M10 19l-7-7m0 0l7-7m-7 7h18\"></path>
        </svg>
        返回首页
      </button>
    </div>

    <!-- Orders list -->
    <div class=\"bg-card border border-border rounded-lg shadow-sm overflow-hidden\">
      <div v-if=\"orders.length === 0\" class=\"text-center py-12\">
        <svg
          class=\"mx-auto h-12 w-12 text-muted-foreground\"
          fill=\"none\"
          stroke=\"currentColor\"
          viewBox=\"0 0 24 24\"
          xmlns=\"http://www.w3.org/2000/svg\"
        >
          <path
            stroke-linecap=\"round\"
            stroke-linejoin=\"round\"
            stroke-width=\"2\"
            d=\"M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2\"
          ></path>
        </svg>
        <h3 class=\"mt-2 text-lg font-medium text-foreground\">暂无订单</h3>
        <p class=\"mt-1 text-muted-foreground\">您还没有任何订单记录</p>
        <div class=\"mt-6\">
          <button
            @click=\"goToHomePage\"
            class=\"px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors\"
          >
            去购物
          </button>
        </div>
      </div>

      <div v-else>
        <div class=\"px-6 py-4 border-b border-border\">
          <h2 class=\"text-lg font-semibold text-foreground\">订单列表</h2>
        </div>
        <div class=\"divide-y divide-border\">
          <transition-group
            name=\"order-list\"
            tag=\"div\"
            class=\"divide-y divide-border\"
            enter-active-class=\"transition-all duration-300 ease-out\"
            enter-from-class=\"opacity-0 transform translate-y-2\"
            enter-to-class=\"opacity-100 transform translate-y-0\"
            leave-active-class=\"transition-all duration-300 ease-in\"
            leave-from-class=\"opacity-100 transform translate-y-0\"
            leave-to-class=\"opacity-0 transform -translate-y-2\"
          >
            <div
              v-for=\"order in orders\"
              :key=\"order.id\"
              class=\"px-6 py-4 hover:bg-muted/50 transition-colors cursor-pointer\"
              @click=\"viewOrderDetail(order.id)\"
            >
              <div class=\"flex flex-col md:flex-row md:items-center justify-between gap-4\">
                <div class=\"flex-1\">
                  <div class=\"flex flex-col sm:flex-row sm:items-center justify-between gap-2\">
                    <h3 class=\"font-medium text-foreground\">
                      订单号: {{ order.id }}
                    </h3>
                    <span
                      :class=\"ORDER_STATUS_COLORS[order.status]\"
                      class=\"px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap w-fit\"
                    >
                      {{ ORDER_STATUS_LABELS[order.status] }}
                    </span>
                  </div>
                  <p class=\"text-sm text-muted-foreground mt-1\">
                    {{ formatDate(order.date) }} · {{ order.items.length }} 件商品
                  </p>
                </div>
                <div class=\"flex items-center justify-between gap-4\">
                  <div class=\"text-right\">
                    <p class=\"font-medium text-foreground\">¥{{ order.total.toFixed(2) }}</p>
                    <p class=\"text-sm text-muted-foreground\">{{ order.shippingAddress }}</p>
                  </div>
                  <button
                    class=\"px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors\"
                    @click.stop=\"viewOrderDetail(order.id)\"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>

    <!-- Order statistics -->
    <div class=\"grid grid-cols-1 md:grid-cols-5 gap-4 mt-6\">
      <div class=\"bg-card border border-border rounded-lg p-4 shadow-sm\">
        <p class=\"text-sm text-muted-foreground\">总订单数</p>
        <p class=\"text-2xl font-bold text-foreground\">{{ orders.length }}</p>
      </div>
      <div class=\"bg-card border border-border rounded-lg p-4 shadow-sm\">
        <p class=\"text-sm text-muted-foreground\">待处理</p>
        <p class=\"text-2xl font-bold text-foreground\">
          {{ orders.filter(o => o.status === 'pending').length }}
        </p>
      </div>
      <div class=\"bg-card border border-border rounded-lg p-4 shadow-sm\">
        <p class=\"text-sm text-muted-foreground\">处理中</p>
        <p class=\"text-2xl font-bold text-foreground\">
          {{ orders.filter(o => o.status === 'processing').length }}
        </p>
      </div>
      <div class=\"bg-card border border-border rounded-lg p-4 shadow-sm\">
        <p class=\"text-sm text-muted-foreground\">已发货</p>
        <p class=\"text-2xl font-bold text-foreground\">
          {{ orders.filter(o => o.status === 'shipped').length }}
        </p>
      </div>
      <div class=\"bg-card border border-border rounded-lg p-4 shadow-sm\">
        <p class=\"text-sm text-muted-foreground\">已完成</p>
        <p class=\"text-2xl font-bold text-foreground\">
          {{ orders.filter(o => o.status === 'delivered').length }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang=\"ts\">
import { computed } from 'vue'
import type { Order } from '@/data/OrderManagementPage'
import { MOCK_ORDERS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/data/OrderManagementPage'

// Props with defaults
interface Props {
  orders?: Order[]
}

const props = withDefaults(defineProps<Props>(), {
  orders: () => MOCK_ORDERS
})

// Computed properties
const ORDER_STATUS_LABELS_COMPUTED = computed(() => ORDER_STATUS_LABELS)
const ORDER_STATUS_COLORS_COMPUTED = computed(() => ORDER_STATUS_COLORS)

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Navigation functions
const goToHomePage = () => {
  window.location.href = './HomePage.html'
}

const viewOrderDetail = (orderId: string) => {
  window.location.href = `./OrderDetailPage.html?id=${orderId}`
}
</script>

<style scoped>
.order-list-enter-active,
.order-list-leave-active {
  transition: all 0.3s ease;
}

.order-list-enter-from,
.order-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>