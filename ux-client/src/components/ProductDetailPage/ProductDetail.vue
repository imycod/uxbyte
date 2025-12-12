<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <!-- 返回按钮 -->
    <div class="mb-6">
      <button 
        @click="goToHome"
        class="flex items-center text-primary hover:text-primary-dark transition-colors"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        返回首页
      </button>
    </div>

    <!-- 商品详情 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <!-- 商品图片 -->
        <div class="space-y-4">
          <div class="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
            <img 
              :src="product.images[currentImageIndex].url" 
              :alt="product.images[currentImageIndex].alt"
              class="w-full h-full object-center object-cover"
            >
          </div>
          <div class="grid grid-cols-3 gap-4">
            <div 
              v-for="(image, index) in product.images" 
              :key="image.id"
              class="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden cursor-pointer border-2"
              :class="index === currentImageIndex ? 'border-primary' : 'border-transparent'"
              @click="currentImageIndex = index"
            >
              <img 
                :src="image.url" 
                :alt="image.alt"
                class="w-full h-full object-center object-cover"
              >
            </div>
          </div>
        </div>

        <!-- 商品信息 -->
        <div>
          <div class="flex justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ product.name }}</h1>
              <div class="mt-2 flex items-center">
                <div class="flex items-center">
                  <svg v-for="i in 5" :key="i" :class="[i <= product.averageRating ? 'text-yellow-400' : 'text-gray-300', 'h-5 w-5 flex-shrink-0']" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <p class="ml-2 text-sm text-gray-500">{{ product.averageRating }} ({{ product.reviewCount }} 条评价)</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-gray-900">¥{{ product.price.toFixed(2) }}</p>
              <p v-if="product.originalPrice" class="text-sm text-gray-500 line-through">¥{{ product.originalPrice.toFixed(2) }}</p>
            </div>
          </div>

          <div class="mt-6">
            <h2 class="text-sm font-medium text-gray-900">品牌</h2>
            <p class="mt-1 text-sm text-gray-500">{{ product.brand }}</p>
          </div>

          <div class="mt-6">
            <h2 class="text-sm font-medium text-gray-900">商品描述</h2>
            <div class="mt-2 text-sm text-gray-500">
              <p>{{ product.description }}</p>
            </div>
          </div>

          <!-- 商品规格 -->
          <div class="mt-6">
            <h2 class="text-sm font-medium text-gray-900">规格</h2>
            <div class="mt-2 grid grid-cols-2 gap-4">
              <div v-for="spec in product.specifications" :key="spec.id" class="border border-gray-200 rounded-md p-3">
                <p class="text-sm font-medium text-gray-900">{{ spec.name }}</p>
                <p class="mt-1 text-sm text-gray-500">{{ spec.value }}</p>
              </div>
            </div>
          </div>

          <!-- 商品变体 -->
          <div class="mt-6">
            <div v-for="(variantGroup, index) in groupedVariants" :key="index" class="mb-4">
              <h3 class="text-sm font-medium text-gray-900">{{ variantGroup.name }}</h3>
              <div class="mt-2 flex flex-wrap gap-2">
                <button
                  v-for="variant in variantGroup.variants"
                  :key="variant.id"
                  @click="selectVariant(variant)"
                  :class="[
                    'px-4 py-2 text-sm rounded-md border',
                    selectedVariants[variantGroup.name] === variant.value
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                  ]"
                >
                  {{ variant.value }}
                </button>
              </div>
            </div>
          </div>

          <!-- 数量和按钮 -->
          <div class="mt-8">
            <div class="flex items-center">
              <label class="mr-4 text-sm font-medium text-gray-900">数量:</label>
              <div class="flex items-center border border-gray-300 rounded-md">
                <button
                  @click="decreaseQuantity"
                  type="button"
                  class="px-3 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
                  :disabled="quantity <= 1"
                  :class="{ 'opacity-50 cursor-not-allowed': quantity <= 1 }"
                >
                  -
                </button>
                <span class="px-3 py-1 text-gray-900">{{ quantity }}</span>
                <button
                  @click="increaseQuantity"
                  type="button"
                  class="px-3 py-1 text-gray-600 hover:bg-gray-100 focus:outline-none"
                  :disabled="quantity >= product.stockQuantity"
                  :class="{ 'opacity-50 cursor-not-allowed': quantity >= product.stockQuantity }"
                >
                  +
                </button>
              </div>
              <span class="ml-4 text-sm text-gray-500">库存: {{ product.stockQuantity }} 件</span>
            </div>

            <div class="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                @click="addToCart"
                type="button"
                class="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
              >
                加入购物车
              </button>
              <button
                @click="buyNow"
                type="button"
                class="flex-1 bg-secondary hover:bg-secondary-dark text-white py-3 px-6 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary transition-colors"
              >
                立即购买
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-xl font-bold text-gray-900">商品评价</h2>
      </div>
      <div class="p-6">
        <div v-if="product.reviews.length > 0" class="space-y-6">
          <div v-for="review in product.reviews" :key="review.id" class="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span class="text-gray-700 font-medium">{{ review.userName.charAt(0) }}</span>
                </div>
              </div>
              <div class="ml-4">
                <h4 class="text-sm font-medium text-gray-900">{{ review.userName }}</h4>
                <div class="flex items-center mt-1">
                  <div class="flex">
                    <svg v-for="i in 5" :key="i" :class="[i <= review.rating ? 'text-yellow-400' : 'text-gray-300', 'h-4 w-4 flex-shrink-0']" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span class="ml-2 text-sm text-gray-500">{{ review.date }}</span>
                </div>
                <p class="mt-2 text-sm text-gray-600">{{ review.comment }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-500">暂无评价</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, withDefaults, defineProps } from 'vue'
import type { ProductDetail } from '@/data/ProductDetailPage'

interface Props {
  product?: ProductDetail
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
})

// 当前显示的图片索引
const currentImageIndex = ref(0)

// 商品数量
const quantity = ref(1)

// 选中的变体
const selectedVariants = ref<Record<string, string>>({})

// 对变体进行分组
const groupedVariants = computed(() => {
  const groups: Record<string, any[]> = {}
  props.product.variants.forEach(variant => {
    if (!groups[variant.name]) {
      groups[variant.name] = []
    }
    groups[variant.name].push(variant)
  })
  
  return Object.keys(groups).map(name => ({
    name,
    variants: groups[name]
  }))
})

// 初始化选中的变体
const initializeSelectedVariants = () => {
  groupedVariants.value.forEach(group => {
    if (group.variants.length > 0) {
      selectedVariants.value[group.name] = group.variants[0].value
    }
  })
}

// 增加数量
const increaseQuantity = () => {
  if (quantity.value < props.product.stockQuantity) {
    quantity.value++
  }
}

// 减少数量
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// 选择变体
const selectVariant = (variant: any) => {
  selectedVariants.value[variant.name] = variant.value
}

// 加入购物车
const addToCart = () => {
  // 这里可以添加加入购物车的逻辑
  console.log('加入购物车:', {
    productId: props.product.id,
    quantity: quantity.value,
    selectedVariants: selectedVariants.value
  })
  
  // 跳转到购物车页面
  window.location.href = '/ShoppingCartPage'
}

// 立即购买
const buyNow = () => {
  // 这里可以添加立即购买的逻辑
  console.log('立即购买:', {
    productId: props.product.id,
    quantity: quantity.value,
    selectedVariants: selectedVariants.value
  })
  
  // 跳转到购物车页面
  window.location.href = '/ShoppingCartPage'
}

// 返回首页
const goToHome = () => {
  window.location.href = '/HomePage'
}

// 初始化选中的变体
initializeSelectedVariants()
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>