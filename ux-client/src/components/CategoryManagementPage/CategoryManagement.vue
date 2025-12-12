<template>
  <div class="max-w-4xl mx-auto">
    <!-- 页面标题和返回按钮 -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-4 md:mb-0">分类管理</h1>
      <button
        @click="goBack"
        class="flex items-center text-primary hover:text-primary/80 transition-colors duration-200"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        返回文章列表
      </button>
    </div>

    <!-- 添加分类表单 -->
    <div class="bg-card rounded-xl shadow-md p-6 mb-8 border border-border">
      <h2 class="text-xl font-semibold text-foreground mb-4">
        {{ isEditing ? '编辑分类' : '添加新分类' }}
      </h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-foreground mb-1">
            分类名称 *
          </label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            :class="[
              'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground',
              formErrors.name ? 'border-red-500' : 'border-border'
            ]"
            placeholder="请输入分类名称"
          />
          <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">
            {{ formErrors.name }}
          </p>
        </div>
        
        <div>
          <label for="description" class="block text-sm font-medium text-foreground mb-1">
            分类描述
          </label>
          <textarea
            id="description"
            v-model="form.description"
            rows="3"
            :class="[
              'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground',
              formErrors.description ? 'border-red-500' : 'border-border'
            ]"
            placeholder="请输入分类描述"
          ></textarea>
          <p v-if="formErrors.description" class="mt-1 text-sm text-red-500">
            {{ formErrors.description }}
          </p>
        </div>
        
        <div class="flex space-x-3 pt-2">
          <button
            type="submit"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-200"
          >
            {{ isEditing ? '更新分类' : '添加分类' }}
          </button>
          <button
            v-if="isEditing"
            type="button"
            @click="cancelEdit"
            class="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors duration-200"
          >
            取消
          </button>
        </div>
      </form>
    </div>

    <!-- 分类列表 -->
    <div class="bg-card rounded-xl shadow-md overflow-hidden border border-border">
      <div class="px-6 py-4 border-b border-border">
        <h2 class="text-xl font-semibold text-foreground">现有分类</h2>
      </div>
      
      <div v-if="categories && categories.length > 0" class="divide-y divide-border">
        <div
          v-for="category in categories"
          :key="category.id"
          class="px-6 py-4 hover:bg-muted/50 transition-colors duration-200"
        >
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div class="mb-3 md:mb-0">
              <h3 class="text-lg font-medium text-foreground">{{ category.name }}</h3>
              <p class="text-muted-foreground mt-1">{{ category.description }}</p>
              <div class="flex flex-wrap gap-2 mt-2">
                <span class="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                  文章数: {{ category.articleCount }}
                </span>
                <span class="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                  创建: {{ formatDate(category.createdAt) }}
                </span>
                <span class="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full">
                  更新: {{ formatDate(category.updatedAt) }}
                </span>
              </div>
            </div>
            
            <div class="flex space-x-2">
              <button
                @click="editCategory(category)"
                class="p-2 text-foreground hover:text-primary rounded-full hover:bg-muted transition-colors duration-200"
                aria-label="编辑分类"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </button>
              <button
                @click="deleteCategory(category.id)"
                class="p-2 text-foreground hover:text-red-500 rounded-full hover:bg-muted transition-colors duration-200"
                aria-label="删除分类"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="px-6 py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-foreground">暂无分类</h3>
        <p class="mt-1 text-muted-foreground">您还没有创建任何分类，请添加第一个分类。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { Category } from '@/data/CategoryManagementPage'

// Props
const props = defineProps<{
  categories?: Category[]
}>()

// 响应式数据
const isEditing = ref(false)
const editingCategoryId = ref<string | null>(null)

const form = reactive({
  name: '',
  description: ''
})

const formErrors = reactive({
  name: '',
  description: ''
})

// 验证表单
const validateForm = () => {
  let isValid = true
  
  // 重置错误信息
  formErrors.name = ''
  formErrors.description = ''
  
  // 验证名称
  if (!form.name.trim()) {
    formErrors.name = '分类名称不能为空'
    isValid = false
  } else if (form.name.length > 20) {
    formErrors.name = '分类名称不能超过20个字符'
    isValid = false
  }
  
  // 验证描述
  if (form.description.length > 100) {
    formErrors.description = '分类描述不能超过100个字符'
    isValid = false
  }
  
  return isValid
}

// 提交表单
const handleSubmit = () => {
  if (!validateForm()) {
    return
  }
  
  if (isEditing.value) {
    // 更新分类逻辑（模拟）
    console.log('更新分类:', {
      id: editingCategoryId.value,
      ...form
    })
    cancelEdit()
  } else {
    // 添加分类逻辑（模拟）
    console.log('添加分类:', { ...form })
    resetForm()
  }
  
  // 显示成功消息（在实际应用中可能需要使用通知组件）
  alert(isEditing.value ? '分类更新成功！' : '分类添加成功！')
}

// 编辑分类
const editCategory = (category: Category) => {
  isEditing.value = true
  editingCategoryId.value = category.id
  form.name = category.name
  form.description = category.description
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  editingCategoryId.value = null
  resetForm()
}

// 删除分类
const deleteCategory = (id: string) => {
  // 确认删除
  if (confirm('确定要删除这个分类吗？此操作不可恢复。')) {
    // 删除分类逻辑（模拟）
    console.log('删除分类:', id)
    alert('分类删除成功！')
  }
}

// 重置表单
const resetForm = () => {
  form.name = ''
  form.description = ''
  formErrors.name = ''
  formErrors.description = ''
}

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 返回文章列表
const goBack = () => {
  window.location.href = '/ArticleListPage'
}
</script>

<style scoped>
/* 可以添加自定义样式 */
</style>