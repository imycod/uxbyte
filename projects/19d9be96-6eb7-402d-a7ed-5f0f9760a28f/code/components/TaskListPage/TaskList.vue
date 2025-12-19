<template>
  <div class="task-list-page">
    <!-- 页面标题和操作按钮 -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <h1 class="text-2xl font-bold text-foreground mb-4 md:mb-0">任务列表</h1>
      <div class="flex space-x-2">
        <button 
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          @click="navigateToProgressTracking"
        >
          进度跟踪
        </button>
        <button 
          class="px-4 py-2 bg-background text-foreground border border-border rounded-md hover:bg-accent transition-colors"
          @click="refreshTasks"
        >
          刷新
        </button>
      </div>
    </div>

    <!-- 筛选和搜索区域 -->
    <div class="bg-card border border-border rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- 搜索框 -->
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-medium text-muted-foreground mb-1">搜索任务</label>
          <div class="relative">
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="按任务名称或描述搜索..."
              class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              @input="handleSearch"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg class="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 状态筛选 -->
        <div>
          <label for="status" class="block text-sm font-medium text-muted-foreground mb-1">状态</label>
          <select
            id="status"
            v-model="statusFilter"
            class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            @change="handleFilterChange"
          >
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- 优先级筛选 -->
        <div>
          <label for="priority" class="block text-sm font-medium text-muted-foreground mb-1">优先级</label>
          <select
            id="priority"
            v-model="priorityFilter"
            class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            @change="handleFilterChange"
          >
            <option v-for="option in priorityOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="bg-card border border-border rounded-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead class="bg-muted">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">任务</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">负责人</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">状态</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">优先级</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">截止日期</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">进度</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-background divide-y divide-border">
            <tr 
              v-for="task in filteredTasks" 
              :key="task.id" 
              class="hover:bg-accent transition-colors cursor-pointer"
              @click="viewTaskDetail(task.id)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-foreground">{{ task.title }}</div>
                <div class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ task.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-foreground">{{ task.assignee }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(task.status)"
                >
                  {{ getStatusText(task.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getPriorityClass(task.priority)"
                >
                  {{ getPriorityText(task.priority) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                {{ formatDate(task.dueDate) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-full bg-muted rounded-full h-2">
                    <div 
                      class="bg-primary h-2 rounded-full" 
                      :style="{ width: task.progress + '%' }"
                    ></div>
                  </div>
                  <div class="ml-2 text-sm text-muted-foreground w-10">{{ task.progress }}%</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click.stop="viewTaskDetail(task.id)"
                  class="text-primary hover:text-primary/80"
                >
                  查看详情
                </button>
              </td>
            </tr>
            <tr v-if="filteredTasks.length === 0">
              <td colspan="7" class="px-6 py-12 text-center">
                <div class="text-muted-foreground">
                  <svg class="mx-auto h-12 w-12 text-muted-foreground/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 class="mt-2 text-sm font-medium text-foreground">没有找到任务</h3>
                  <p class="mt-1 text-sm text-muted-foreground">尝试调整筛选条件或搜索关键词</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 分页信息 -->
    <div class="mt-4 flex items-center justify-between">
      <div class="text-sm text-muted-foreground">
        显示 {{ filteredTasks.length }} 个任务
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Task, TaskFilter } from '@/data/TaskListPage'
import { MOCK_TASKS, STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/data/TaskListPage'

// Props with defaults
interface Props {
  tasks?: Task[]
  statusOptions?: Array<{ value: string; label: string }>
  priorityOptions?: Array<{ value: string; label: string }>
}

const props = withDefaults(defineProps<Props>(), {
  tasks: () => MOCK_TASKS,
  statusOptions: () => STATUS_OPTIONS,
  priorityOptions: () => PRIORITY_OPTIONS
})

// 筛选状态
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

// 计算属性：过滤后的任务列表
const filteredTasks = computed(() => {
  return props.tasks.filter(task => {
    // 搜索过滤
    const matchesSearch = !searchQuery.value || 
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // 状态过滤
    const matchesStatus = !statusFilter.value || task.status === statusFilter.value
    
    // 优先级过滤
    const matchesPriority = !priorityFilter.value || task.priority === priorityFilter.value
    
    return matchesSearch && matchesStatus && matchesPriority
  })
})

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑已在computed中处理
}

// 处理筛选变化
const handleFilterChange = () => {
  // 筛选逻辑已在computed中处理
}

// 查看任务详情
const viewTaskDetail = (taskId: string) => {
  window.location.href = `./TaskDetailPage.html?taskId=${taskId}`
}

// 导航到进度跟踪页
const navigateToProgressTracking = () => {
  window.location.href = './ProgressTrackingPage.html'
}

// 刷新任务列表
const refreshTasks = () => {
  // 在实际应用中，这里会重新获取数据
  window.location.reload()
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'todo': '待办',
    'in-progress': '进行中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'todo': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

// 获取优先级文本
const getPriorityText = (priority: string) => {
  const priorityMap: Record<string, string> = {
    'low': '低',
    'medium': '中',
    'high': '高'
  }
  return priorityMap[priority] || priority
}

// 获取优先级样式类
const getPriorityClass = (priority: string) => {
  const classMap: Record<string, string> = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-red-100 text-red-800'
  }
  return classMap[priority] || 'bg-gray-100 text-gray-800'
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 组件挂载时的初始化逻辑
onMounted(() => {
  // 可以在这里添加初始化逻辑
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>