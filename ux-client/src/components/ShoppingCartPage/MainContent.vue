<template>
  <div class="max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-2xl font-bold text-gray-900">购物车</h1>
      <button
        @click="goToHomePage"
        class="flex items-center text-sm text-gray-600 hover:text-gray-900"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        继续购物
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 商品列表 -->
      <div class="lg:col-span-2">
        <CartItemList 
          :cart-items="cartItems"
          @update-quantity="updateQuantity"
          @remove-item="removeItem"
          @continue-shopping="goToHomePage"
        />
      </div>

      <!-- 订单摘要 -->
      <div>
        <CartSummaryComponent
          :summary="cartSummary"
          @checkout="goToCheckout"
          @continue-shopping="goToHomePage"
        />
        
        <!-- 优惠码 -->
        <div class="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">优惠码</h2>
            <div class="flex">
              <input
                v-model="couponCode"
                type="text"
                placeholder="输入优惠码"
                class="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary"
              />
              <button
                @click="applyCoupon"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                应用
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { withDefaults, defineProps } from 'vue';
import type { CartItem, CartSummary } from '@/data/ShoppingCartPage';
import CartItemList from './CartItemList.vue';
import CartSummaryComponent from './CartSummary.vue';

interface Props {
  initialCartItems?: CartItem[];
  initialCartSummary?: CartSummary;
}

const props = withDefaults(defineProps<Props>(), {
  initialCartItems: () => [],
  initialCartSummary: () => ({
    subtotal: 0,
    discount: 0,
    shipping: 0,
    tax: 0,
    total: 0
  })
});

// 响应式数据
const cartItems = ref<CartItem[]>([...props.initialCartItems]);
const cartSummary = ref<CartSummary>({...props.initialCartSummary});
const couponCode = ref('');

// 更新商品数量
const updateQuantity = (id: string, quantity: number) => {
  const item = cartItems.value.find(item => item.id === id);
  if (item) {
    item.quantity = quantity;
    // 这里可以添加更新购物车的逻辑
    console.log(`Updated quantity for item ${id} to ${quantity}`);
  }
};

// 删除商品
const removeItem = (id: string) => {
  const index = cartItems.value.findIndex(item => item.id === id);
  if (index !== -1) {
    cartItems.value.splice(index, 1);
    // 这里可以添加从购物车删除商品的逻辑
    console.log(`Removed item ${id} from cart`);
  }
};

// 应用优惠码
const applyCoupon = () => {
  if (couponCode.value.trim()) {
    // 这里可以添加应用优惠码的逻辑
    console.log(`Applying coupon: ${couponCode.value}`);
    alert(`优惠码 "${couponCode.value}" 已应用！`);
    couponCode.value = '';
  }
};

// 导航到首页
const goToHomePage = () => {
  window.location.href = '/HomePage';
};

// 导航到结算页面
const goToCheckout = () => {
  window.location.href = '/OrderManagementPage';
};

// 挂载时的逻辑
onMounted(() => {
  // 可以在这里从本地存储或API加载购物车数据
  console.log('Shopping cart page mounted');
});
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>