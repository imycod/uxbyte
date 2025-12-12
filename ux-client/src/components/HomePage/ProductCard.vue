<template>
  <div class="bg-background rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div class="relative">
      <img 
        :src="product.image" 
        :alt="product.name"
        class="w-full h-48 object-cover cursor-pointer"
        @click="goToProductDetail"
      />
      <div class="absolute top-2 right-2 flex flex-col gap-2">
        <span 
          v-for="tag in product.tags" 
          :key="tag"
          class="px-2 py-1 text-xs font-semibold rounded"
          :class="{
            'bg-red-500 text-white': tag === '热销' || tag === '特价',
            'bg-blue-500 text-white': tag === '新品',
            'bg-green-500 text-white': tag === '推荐'
          }"
        >
          {{ tag }}
        </span>
      </div>
    </div>
    
    <div class="p-4">
      <div class="flex justify-between items-start">
        <h3 
          class="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
          @click="goToProductDetail"
        >
          {{ product.name }}
        </h3>
        <button 
          @click="addToCart"
          class="p-2 rounded-full hover:bg-muted transition-colors"
          aria-label="加入购物车"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
      </div>
      
      <p class="text-sm text-muted-foreground mt-1">{{ product.description }}</p>
      
      <div class="flex items-center mt-2">
        <div class="flex text-yellow-400">
          <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path v-if="i <= Math.floor(product.rating)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            <path v-else d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="currentColor" fill-opacity="0.2" />
          </svg>
        </div>
        <span class="text-sm text-muted-foreground ml-1">({{ product.reviewCount }})</span>
      </div>
      
      <div class="mt-3 flex items-center justify-between">
        <div>
          <span class="text-lg font-bold text-foreground">¥{{ product.price }}</span>
          <span v-if="product.originalPrice" class="text-sm text-muted-foreground line-through ml-2">¥{{ product.originalPrice }}</span>
        </div>
        <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">{{ product.category }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Product } from '@/data/HomePage';

interface Props {
  product?: Product;
}

const props = withDefaults(defineProps<Props>(), {
  product: () => ({
    id: '',
    name: '',
    price: 0,
    image: '',
    rating: 0,
    reviewCount: 0,
    category: '',
    description: '',
    tags: []
  })
});

// 导航到商品详情页
const goToProductDetail = () => {
  window.location.href = `/ProductDetailPage`;
};

// 添加到购物车
const addToCart = () => {
  // 这里可以添加加入购物车的逻辑
  console.log(`Added ${props.product.name} to cart`);
};
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>