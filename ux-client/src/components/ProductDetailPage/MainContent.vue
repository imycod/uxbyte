<template>
  <div class="max-w-6xl mx-auto">
    <button 
      @click="goToHomePage"
      class="flex items-center text-gray-600 hover:text-gray-900 mb-6"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      返回首页
    </button>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- 产品图片展示 -->
      <div class="space-y-4">
        <!-- 主图 -->
        <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          <img 
            :src="mainImage.url" 
            :alt="mainImage.alt"
            class="w-full h-full object-contain"
          />
        </div>
        
        <!-- 缩略图 -->
        <div class="flex gap-4 overflow-x-auto pb-2">
          <div 
            v-for="image in product.images" 
            :key="image.id"
            @click="setMainImage(image)"
            class="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-md overflow-hidden cursor-pointer border-2"
            :class="image.id === mainImage.id ? 'border-primary' : 'border-transparent'"
          >
            <img 
              :src="image.url" 
              :alt="image.alt"
              class="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
      
      <!-- 产品信息 -->
      <div>
        <div class="mb-4">
          <span class="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
            {{ product.category }}
          </span>
        </div>
        
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.name }}</h1>
        <p class="text-gray-600 mb-6">{{ product.description }}</p>
        
        <div class="flex items-center mb-6">
          <div class="flex items-center">
            <div class="flex">
              <svg 
                v-for="i in 5" 
                :key="i" 
                class="w-5 h-5" 
                :class="i <= Math.floor(product.averageRating) ? 'text-yellow-400' : 'text-gray-300'"
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="ml-2 text-gray-600">{{ product.averageRating }} ({{ product.reviewCount }} 条评价)</span>
          </div>
        </div>
        
        <div class="mb-6">
          <div class="flex items-baseline">
            <span class="text-3xl font-bold text-gray-900">¥{{ product.price }}</span>
            <span v-if="product.originalPrice" class="ml-2 text-xl text-gray-500 line-through">¥{{ product.originalPrice }}</span>
            <span v-if="product.originalPrice" class="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
              {{ Math.round((1 - product.price / product.originalPrice) * 100) }}% OFF
            </span>
          </div>
        </div>
        
        <div class="border-t border-b border-gray-200 py-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <span class="text-gray-700">库存状态:</span>
            <span class="font-medium" :class="product.inStock ? 'text-green-600' : 'text-red-600'">
              {{ product.inStock ? '有货' : '缺货' }}
            </span>
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-gray-700">品牌:</span>
            <span class="font-medium text-gray-900">{{ product.brand }}</span>
          </div>
        </div>
        
        <!-- 选择变体 -->
        <div class="mb-6">
          <div v-for="(variants, name) in groupedVariants" :key="name" class="mb-4">
            <h3 class="text-sm font-medium text-gray-900 mb-2">{{ name }}</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="variant in variants"
                :key="variant.id"
                @click="selectVariant(variant)"
                class="px-4 py-2 text-sm border rounded-md"
                :class="selectedVariants[name] === variant.value ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
              >
                {{ variant.value }}
              </button>
            </div>
          </div>
        </div>
        
        <!-- 数量选择和购买按钮 -->
        <div class="flex flex-wrap gap-4 mb-8">
          <div class="flex items-center border border-gray-300 rounded-md">
            <button
              @click="decreaseQuantity"
              type="button"
              class="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
              :disabled="quantity <= 1"
              :class="{ 'opacity-50 cursor-not-allowed': quantity <= 1 }"
            >
              -
            </button>
            <span class="px-4 py-2 text-gray-900">{{ quantity }}</span>
            <button
              @click="increaseQuantity"
              type="button"
              class="px-3 py-2 text-gray-600 hover:bg-gray-100 focus:outline-none"
              :disabled="quantity >= product.stockQuantity"
              :class="{ 'opacity-50 cursor-not-allowed': quantity >= product.stockQuantity }"
            >
              +
            </button>
          </div>
          
          <button
            @click="addToCart"
            :disabled="!product.inStock"
            class="flex-1 min-w-[200px] bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ product.inStock ? '加入购物车' : '商品已售罄' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 产品详情和评价 -->
    <div class="mt-16 border-t border-gray-200 pt-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <!-- 产品规格 -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-6">产品规格</h2>
          <dl class="space-y-4">
            <div v-for="spec in product.specifications" :key="spec.id" class="flex items-start">
              <dt class="w-1/3 text-gray-600">{{ spec.name }}</dt>
              <dd class="w-2/3 text-gray-900">{{ spec.value }}</dd>
            </div>
          </dl>
        </div>
        
        <!-- 用户评价 -->
        <div>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">用户评价</h2>
            <span class="text-sm text-gray-500">{{ product.reviewCount }} 条评价</span>
          </div>
          
          <div class="space-y-6">
            <div 
              v-for="review in product.reviews" 
              :key="review.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between mb-2">
                <span class="font-medium text-gray-900">{{ review.userName }}</span>
                <span class="text-sm text-gray-500">{{ review.date }}</span>
              </div>
              <div class="flex items-center mb-2">
                <div class="flex">
                  <svg 
                    v-for="i in 5" 
                    :key="i" 
                    class="w-4 h-4" 
                    :class="i <= review.rating ? 'text-yellow-400' : 'text-gray-300'"
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <p class="text-gray-700">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { withDefaults, defineProps } from 'vue';
import type { ProductDetail, ProductImage, ProductVariant } from '@/data/ProductDetailPage';

interface Props {
  product?: ProductDetail;
}

const props = withDefaults(defineProps<Props>(), {
  product: () => ({
    id: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    brand: '',
    inStock: true,
    stockQuantity: 0,
    images: [],
    variants: [],
    specifications: [],
    reviews: [],
    averageRating: 0,
    reviewCount: 0
  })
});

// 响应式数据
const mainImage = ref<ProductImage>(props.product.images[0] || { id: '', url: '', alt: '' });
const selectedVariants = ref<Record<string, string>>({});
const quantity = ref(1);

// 计算属性：按名称分组变体
const groupedVariants = computed(() => {
  const groups: Record<string, ProductVariant[]> = {};
  props.product.variants.forEach(variant => {
    if (!groups[variant.name]) {
      groups[variant.name] = [];
    }
    groups[variant.name].push(variant);
  });
  return groups;
});

// 设置主图
const setMainImage = (image: ProductImage) => {
  mainImage.value = image;
};

// 选择变体
const selectVariant = (variant: ProductVariant) => {
  selectedVariants.value[variant.name] = variant.value;
};

// 增加数量
const increaseQuantity = () => {
  if (quantity.value < props.product.stockQuantity) {
    quantity.value++;
  }
};

// 减少数量
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// 加入购物车
const addToCart = () => {
  // 这里可以添加加入购物车的逻辑
  console.log(`Added ${quantity.value} of ${props.product.name} to cart`);
  alert(`${props.product.name} 已添加到购物车！`);
};

// 返回首页
const goToHomePage = () => {
  window.location.href = '/HomePage';
};
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>