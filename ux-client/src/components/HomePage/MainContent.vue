<template>
  <div class="space-y-12">
    <!-- 轮播图 -->
    <div class="relative rounded-xl overflow-hidden shadow-lg">
      <div class="relative h-64 md:h-96">
        <img 
          v-if="currentBanner"
          :src="currentBanner.image" 
          :alt="currentBanner.title"
          class="w-full h-full object-cover"
        />
        <div v-if="currentBanner" class="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
        <div v-if="currentBanner" class="absolute inset-0 flex items-center">
          <div class="container mx-auto px-4">
            <div class="max-w-lg text-white">
              <h2 class="text-2xl md:text-4xl font-bold mb-2">{{ currentBanner.title }}</h2>
              <p class="text-lg md:text-xl mb-6">{{ currentBanner.subtitle }}</p>
              <button 
                @click="goToBannerLink"
                class="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-6 rounded-lg transition duration-300"
              >
                {{ currentBanner.ctaText }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 轮播指示器 -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button
          v-for="(banner, index) in banners"
          :key="banner.id"
          @click="setCurrentBanner(index)"
          class="w-3 h-3 rounded-full"
          :class="index === currentBannerIndex ? 'bg-white' : 'bg-white/50'"
          :aria-label="`转到横幅 ${index + 1}`"
        ></button>
      </div>
    </div>
    
    <!-- 分类导航 -->
    <CategoryGrid :categories="categories" />
    
    <!-- 热门商品 -->
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-foreground">热门商品</h2>
        <a href="/ProductDetailPage" class="text-primary hover:text-primary-dark font-medium">
          查看更多 →
        </a>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import type { Banner, Category, Product } from '@/data/HomePage';
import CategoryGrid from './CategoryGrid.vue';
import ProductCard from './ProductCard.vue';

interface Props {
  banners?: Banner[];
  categories?: Category[];
  products?: Product[];
}

const props = withDefaults(defineProps<Props>(), {
  banners: () => [],
  categories: () => [],
  products: () => []
});

// 轮播图相关状态
const currentBannerIndex = ref(0);
const currentBanner = computed(() => {
  if (props.banners.length > 0) {
    return props.banners[currentBannerIndex.value] || props.banners[0];
  }
  return null;
});

// 设置当前横幅
const setCurrentBanner = (index: number) => {
  if (props.banners.length > 0) {
    currentBannerIndex.value = index;
  }
};

// 跳转到横幅链接
const goToBannerLink = () => {
  if (currentBanner.value) {
    window.location.href = currentBanner.value.ctaLink;
  }
};

// 自动轮播
let intervalId: number | null = null;

const startAutoSlide = () => {
  if (props.banners.length > 1) {
    intervalId = window.setInterval(() => {
      currentBannerIndex.value = (currentBannerIndex.value + 1) % props.banners.length;
    }, 5000);
  }
};

const stopAutoSlide = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

// 挂载时启动自动轮播
onMounted(() => {
  if (props.banners.length > 1) {
    startAutoSlide();
  }
});

// 卸载时停止自动轮播
onUnmounted(() => {
  stopAutoSlide();
});
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>