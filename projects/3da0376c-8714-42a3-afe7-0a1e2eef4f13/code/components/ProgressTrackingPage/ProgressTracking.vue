<template>
  <div class="progress-tracking-page">
    <!-- Page header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
      <div>
        <h1 class="text-3xl font-bold text-foreground mb-2">进度跟踪</h1>
        <p class="text-muted-foreground">实时跟踪任务进度和完成情况</p>
      </div>
      <button
        @click="goToTaskList"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        返回任务列表
      </button>
    </div>

    <!-- Stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">总任务数</p>
            <p class="text-2xl font-bold text-foreground">{{ progressData.length }}</p>
          </div>
          <div class="bg-blue-100 p-3 rounded-full">
            <svg
              class="w-6 h-6 text-blue-600"
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
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">进行中</p>
            <p class="text-2xl font-bold text-foreground">{{ inProgressCount }}</p>
          </div>
          <div class="bg-yellow-100 p-3 rounded-full">
            <svg
              class="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">已完成</p>
            <p class="text-2xl font-bold text-foreground">{{ completedCount }}</p>
          </div>
          <div class="bg-green-100 p-3 rounded-full">
            <svg
              class="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-muted-foreground">平均进度</p>
            <p class="text-2xl font-bold text-foreground">{{ averageProgress }}%</p>
          </div>
          <div class="bg-purple-100 p-3 rounded-full">
            <svg
              class="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress chart -->
    <div class="bg-card border border-border rounded-lg p-6 mb-8 shadow-sm">
      <h2 class="text-xl font-semibold text-foreground mb-6">进度概览</h2>
      <div class="h-64 flex items-end justify-between gap-2">
        <div
          v-for="(task, index) in progressData"
          :key="task.id"
          class="flex-1 flex flex-col items-center"
        >
          <div class="text-xs text-muted-foreground mb-2 text-center w-full truncate px-1">
            {{ task.title }}
          </div>
          <div
            class="w-full rounded-t-lg transition-all duration-500 ease-in-out"
            :class="getProgressColor(task.progress)"
            :style="{ height: (task.progress / 100) * 200 + 'px' }"
          ></div>
          <div class="text-xs font-medium text-foreground mt-2">{{ task.progress }}%</div>
        </div>
      </div>
    </div>

    <!-- Task progress list -->
    <div class="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-border">
        <h2 class="text-xl font-semibold text-foreground">任务进度详情</h2>
      </div>
      <div class="divide-y divide-border">
        <div
          v-for="task in progressData"
          :key="task.id"
          class="px-6 py-4 hover:bg-muted/50 transition-colors"
        >
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-start justify-between">
                <h3 class="font-medium text-foreground">{{ task.title }}</h3>
                <span
                  :class="getStatusClass(task.status)"
                  class="ml-2 px-2 py-1 text-xs rounded-full whitespace-nowrap"
                >
                  {{ getStatusLabel(task.status) }}
                </span>
              </div>
              <p class="text-sm text-muted-foreground mt-1 line-clamp-1">
                {{ task.description }}
              </p>
              <div class="flex flex-wrap gap-2 mt-2">
                <span class="text-xs px-2 py-1 bg-muted rounded">
                  {{ task.assignee }}
                </span>
                <span class="text-xs px-2 py-1 bg-muted rounded">
                  截止: {{ formatDate(task.dueDate) }}
                </span>
                <span
                  v-for="tag in task.tags"
                  :key="tag"
                  class="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <div class="w-full md:w-48">
              <div class="flex justify-between text-sm mb-1">
                <span class="text-muted-foreground">进度</span>
                <span class="font-medium">{{ task.progress }}%</span>
              </div>
              <div class="w-full bg-muted rounded-full h-2">
                <div
                  class="h-2 rounded-full"
                  :class="getProgressColor(task.progress)"
                  :style="{ width: task.progress + '%' }"
                ></div>
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="viewTaskDetail(task.id)"
                class="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                查看详情
              </button>
              <button
                v-if="task.status !== 'completed'"
                @click="updateProgress(task)"
                class="px-3 py-1.5 text-sm bg-background border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                更新进度
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progress update modal -->
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showUpdateModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        @click="closeModal"
      >
        <div
          class="bg-background border border-border rounded-lg w-full max-w-md p-6"
          @click.stop
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-foreground">更新任务进度</h3>
            <button @click="closeModal" class="text-muted-foreground hover:text-foreground">
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div v-if="selectedTask" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-foreground mb-1">任务</label>
              <p class="text-muted-foreground">{{ selectedTask.title }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground mb-1"
                >当前进度: {{ selectedTask.progress }}%</label
              >
              <input
                v-model="newProgress"
                type="range"
                min="0"
                max="100"
                class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div class="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-foreground mb-1">备注 (可选)</label>
              <textarea
                v-model="progressNotes"
                rows="3"
                class="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="添加进度更新说明..."
              ></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button
                @click="closeModal"
                class="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                取消
              </button>
              <button
                @click="submitProgressUpdate"
                class="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                更新进度
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TaskProgress } from '@/data/ProgressTrackingPage'
import { MOCK_PROGRESS_DATA } from '@/data/ProgressTrackingPage'

// Props with defaults
interface Props {
  progressData?: TaskProgress[]
}

const props = withDefaults(defineProps<Props>(), {
  progressData: () => MOCK_PROGRESS_DATA
})

// Reactive state
const showUpdateModal = ref(false)
const selectedTask = ref<TaskProgress | null>(null)
const newProgress = ref(0)
const progressNotes = ref('')

// Computed properties
const inProgressCount = computed(() => {
  return props.progressData.filter(
    task => task.status === 'in-progress' || task.status === 'not-started'
  ).length
})

const completedCount = computed(() => {
  return props.progressData.filter(task => task.status === 'completed').length
})

const averageProgress = computed(() => {
  if (props.progressData.length === 0) return 0
  const totalProgress = props.progressData.reduce((sum, task) => sum + task.progress, 0)
  return Math.round(totalProgress / props.progressData.length)
})

// Helper functions
const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    'not-started': '未开始',
    'in-progress': '进行中',
    'completed': '已完成',
    'overdue': '已逾期'
  }
  return labels[status] || status
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'not-started': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'overdue': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getProgressColor = (progress: number) => {
  if (progress < 30) return 'bg-red-500'
  if (progress < 70) return 'bg-yellow-500'
  return 'bg-green-500'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

// Navigation functions
const goToTaskList = () => {
  window.location.href = './TaskListPage.html'
}

const viewTaskDetail = (taskId: string) => {
  window.location.href = `./TaskDetailPage.html?id=${taskId}`
}

// Progress update functions
const updateProgress = (task: TaskProgress) => {
  selectedTask.value = task
  newProgress.value = task.progress
  progressNotes.value = ''
  showUpdateModal.value = true
}

const closeModal = () => {
  showUpdateModal.value = false
  selectedTask.value = null
  newProgress.value = 0
  progressNotes.value = ''
}

const submitProgressUpdate = () => {
  if (!selectedTask.value) return

  // In a real app, this would be sent to a server
  console.log('Updating progress:', {
    taskId: selectedTask.value.id,
    progress: newProgress.value,
    notes: progressNotes.value
  })

  // For demo purposes, we'll just close the modal
  // In a real app, you would update the task progress in your data store
  alert(`任务 "${selectedTask.value.title}" 的进度已更新为 ${newProgress.value}%`)
  closeModal()
}
</script>

<style scoped>
/* Custom styles for the progress chart */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom slider thumb styling */
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input[type='range']::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>