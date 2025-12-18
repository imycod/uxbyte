<template>
  <div class="task-list-page">
    <!-- Page header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">任务列表</h1>
      <p class="text-muted-foreground">管理您的所有任务，跟踪进度并确保按时完成</p>
    </div>

    <!-- Filters and search -->
    <div class="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search input -->
        <div class="md:col-span-2">
          <label for="search" class="block text-sm font-medium text-foreground mb-1">搜索任务</label>
          <div class="relative">
            <input
              id="search"
              v-model="searchQuery"
              type="text"
              placeholder="按任务标题或描述搜索..."
              class="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg
              class="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        <!-- Status filter -->
        <div>
          <label for="status" class="block text-sm font-medium text-foreground mb-1">状态</label>
          <select
            id="status"
            v-model="statusFilter"
            class="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Priority filter -->
        <div>
          <label for="priority" class="block text-sm font-medium text-foreground mb-1">优先级</label>
          <select
            id="priority"
            v-model="priorityFilter"
            class="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option v-for="option in priorityOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Task list -->
    <div class="space-y-4">
      <transition-group
        name="task-list"
        tag="div"
        class="space-y-4"
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 transform translate-y-2"
        enter-to-class="opacity-100 transform translate-y-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 transform translate-y-0"
        leave-to-class="opacity-0 transform -translate-y-2"
      >
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          @click="viewTaskDetail(task.id)"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-lg font-semibold text-foreground mb-1">{{ task.title }}</h3>
                <span
                  :class="getPriorityClass(task.priority)"
                  class="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                >
                  {{ getPriorityLabel(task.priority) }}
                </span>
              </div>
              <p class="text-muted-foreground text-sm mb-3 line-clamp-2">
                {{ task.description }}
              </p>
              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  :class="getStatusClass(task.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ getStatusLabel(task.status) }}
                </span>
                <span class="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                  {{ task.assignee }}
                </span>
                <span class="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                  截止: {{ formatDate(task.dueDate) }}
                </span>
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in task.tags"
                  :key="tag"
                  class="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="w-full md:w-48">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-foreground">进度</span>
                <span class="text-sm font-medium text-foreground">{{ task.progress }}%</span>
              </div>
              <div class="w-full bg-muted rounded-full h-2">
                <div
                  class="bg-primary h-2 rounded-full"
                  :style="{ width: task.progress + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Empty state -->
      <div v-if="filteredTasks.length === 0" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          ></path>
        </svg>
        <h3 class="mt-2 text-lg font-medium text-foreground">未找到任务</h3>
        <p class="mt-1 text-muted-foreground">
          没有符合当前筛选条件的任务，请尝试调整筛选条件。
        </p>
      </div>
    </div>

    <!-- Progress tracking button -->
    <div class="mt-8 flex justify-center">
      <button
        @click="goToProgressTracking"
        class="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm flex items-center"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          ></path>
        </svg>
        查看进度跟踪
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task, TaskFilter } from '@/data/TaskListPage'
import { MOCK_TASKS, STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/data/TaskListPage'

// Props with defaults
interface Props {
  tasks?: Task[]
}

const props = withDefaults(defineProps<Props>(), {
  tasks: () => MOCK_TASKS
})

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')

// Computed properties
const statusOptions = STATUS_OPTIONS
const priorityOptions = PRIORITY_OPTIONS

const filteredTasks = computed(() => {
  return props.tasks.filter(task => {
    // Search filter
    const matchesSearch = 
      !searchQuery.value || 
      task.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Status filter
    const matchesStatus = !statusFilter.value || task.status === statusFilter.value
    
    // Priority filter
    const matchesPriority = !priorityFilter.value || task.priority === priorityFilter.value
    
    return matchesSearch && matchesStatus && matchesPriority
  })
})

// Helper functions
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'todo': '待办',
    'in-progress': '进行中',
    'review': '审核中',
    'completed': '已完成'
  }
  return labels[status] || status
}

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    'low': '低',
    'medium': '中',
    'high': '高',
    'urgent': '紧急'
  }
  return labels[priority] || priority
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'todo': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'review': 'bg-purple-100 text-purple-800',
    'completed': 'bg-green-100 text-green-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getPriorityClass = (priority: string) => {
  const classes: Record<string, string> = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-blue-100 text-blue-800',
    'high': 'bg-yellow-100 text-yellow-800',
    'urgent': 'bg-red-100 text-red-800'
  }
  return classes[priority] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// Navigation functions
const viewTaskDetail = (taskId: string) => {
  window.location.href = `./TaskDetailPage.html`
}

const goToProgressTracking = () => {
  window.location.href = './ProgressTrackingPage.html'
}
</script>

<style scoped>
.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.3s ease;
}

.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>