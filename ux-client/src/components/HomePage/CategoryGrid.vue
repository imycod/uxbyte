<template>
  <div class="bg-background rounded-lg border border-border p-6">
    <h2 class="text-xl font-bold text-foreground mb-6">商品分类</h2>
    
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
      <div 
        v-for="category in categories" 
        :key="category.id"
        class="flex flex-col items-center p-4 rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer"
        @click="goToCategory(category.id)"
      >
        <div class="text-2xl mb-2">{{ category.icon }}</div>
        <h3 class="font-medium text-foreground text-center">{{ category.name }}</h3>
        <p class="text-sm text-muted-foreground mt-1">{{ category.productCount }} 件商品</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@/data/HomePage';

interface Props {
  categories?: Category[];
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => []
});

// 导航到分类页面
const goToCategory = (categoryId: string) => {
  // 在实际应用中，这里会导航到分类页面
  console.log(`Navigating to category: ${categoryId}`);
};
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>