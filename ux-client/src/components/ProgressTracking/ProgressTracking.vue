<template>
  <div class="progress-tracking-page">
    <!-- 页面标题和返回按钮 -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <button 
          @click="goBack"
          class="flex items-center text-primary hover:text-primary/80 mr-4"
        >
          <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回任务列表
        </button>
        <h1 class="text-2xl font-bold text-foreground">进度跟踪</h1>
      </div>
      <button 
        @click="refreshData"
        class="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
      >
        <svg class="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        刷新
      </button>
    </div>

    <!-- 进度概览 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-card border border-border rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-muted-foreground">总任务数</p>
            <p class="text-xl font-bold text-foreground">{{ tasks.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-card border border-border rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-muted-foreground">已完成</p>
            <p class="text-xl font-bold text-foreground">{{ completedTasks.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-card border border-border rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-muted-foreground">进行中</p>
            <p class="text-xl font-bold text-foreground">{{ inProgressTasks.length }}</p>
          </div>
        </div>
      </div>
      
      <div class="bg-card border border-border rounded-lg p-4">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-muted-foreground">已延迟</p>
            <p class="text-xl font-bold text-foreground">{{ delayedTasks.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务进度列表 -->
    <div class="bg-card border border-border rounded-lg mb-6">
      <div class="p-4 border-b border-border">
        <h2 class="text-lg font-semibold text-foreground">任务进度</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-border">
          <thead class="bg-muted">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">任务</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">负责人</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">截止日期</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">进度</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">状态</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-background divide-y divide-border">
            <tr v-for="task in tasks" :key="task.id" class="hover:bg-accent">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-foreground">{{ task.taskName }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-muted-foreground">{{ task.assignee }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-muted-foreground">{{ formatDate(task.dueDate) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-full bg-muted rounded-full h-2 mr-2">
                    <div 
                      class="h-2 rounded-full" 
                      :class="getProgressColor(task.currentProgress)"
                      :style="{ width: task.currentProgress + '%' }"
                    ></div>
                  </div>
                  <div class="text-sm text-muted-foreground w-10">{{ task.currentProgress }}%</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(task.status)"
                >
                  {{ getStatusText(task.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewTaskDetail(task.taskId)"
                  class="text-primary hover:text-primary/80 mr-3"
                >
                  查看详情
                </button>
                <button 
                  @click="updateProgress(task)"
                  class="text-foreground hover:text-foreground/80"
                >
                  更新进度
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 进度历史记录 -->
    <div class="bg-card border border-border rounded-lg">
      <div class="p-4 border-b border-border">
        <h2 class="text-lg font-semibold text-foreground">进度历史记录</h2>
      </div>
      <div class="divide-y divide-border">
        <div 
          v-for="record in history" 
          :key="record.id"
          class="p-4 hover:bg-accent transition-colors"
        >
          <div class="flex justify-between">
            <div>
              <h3 class="font-medium text-foreground">{{ getTaskNameById(record.taskId) }}</h3>
              <p class="text-sm text-muted-foreground mt-1">{{ record.comment }}</p>
            </div>
            <div class="text-right">
              <div class="text-sm font-medium text-foreground">{{ record.progress }}%</div>
              <div class="text-xs text-muted-foreground mt-1">
                {{ formatDate(record.timestamp) }} by {{ record.updatedBy }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 更新进度模态框 -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-background rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-foreground">更新进度</h3>
            <button @click="closeUpdateModal" class="text-muted-foreground hover:text-foreground">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-foreground mb-2">
              任务: {{ selectedTask?.taskName }}
            </label>
            <label class="block text-sm font-medium text-foreground mb-2">
              当前进度: {{ selectedTask?.currentProgress }}%
            </label>
            <label class="block text-sm font-medium text-foreground mb-2">
              新进度:
            </label>
            <input
              v-model.number="newProgress"
              type="range"
              min="0"
              max="100"
              step="5"
              class="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div class="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span class="font-medium text-foreground">{{ newProgress }}%</span>
              <span>100%</span>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-foreground mb-2">
              备注:
            </label>
            <textarea
              v-model="progressComment"
              rows="3"
              class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="添加进度更新备注..."
            ></textarea>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              @click="closeUpdateModal"
              class="px-4 py-2 border border-border text-foreground rounded-md hover:bg-accent transition-colors"
            >
              取消
            </button>
            <button
              @click="submitProgressUpdate"
              class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              更新进度
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TaskProgress, ProgressHistory, ProgressTrackingData } from '@/data/ProgressTracking'
import { MOCK_PROGRESS_TRACKING_DATA } from '@/data/ProgressTracking'

// Props with defaults
interface Props {
  data?: ProgressTrackingData
}

const props = withDefaults(defineProps<Props>(), {
  data: () => MOCK_PROGRESS_TRACKING_DATA
})

// 确保数据存在，防止访问undefined
const tasks = computed(() => props.data?.tasks || [])
const history = computed(() => props.data?.history || [])

// 计算属性
const completedTasks = computed(() => {
  return tasks.value.filter(task => task.status === 'completed')
})

const inProgressTasks = computed(() => {
  return tasks.value.filter(task => task.status === 'in-progress')
})

const delayedTasks = computed(() => {
  return tasks.value.filter(task => task.status === 'delayed')
})

// 模态框状态
const showUpdateModal = ref(false)
const selectedTask = ref<TaskProgress | null>(null)
const newProgress = ref(0)
const progressComment = ref('')

// 返回任务列表
const goBack = () => {
  window.location.href = './TaskListPage.html'
}

// 刷新数据
const refreshData = () => {
  window.location.reload()
}

// 查看任务详情
const viewTaskDetail = (taskId: string) => {
  window.location.href = `./TaskDetailPage.html?taskId=${taskId}`
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'not-started': '未开始',
    'in-progress': '进行中',
    'completed': '已完成',
    'delayed': '已延迟'
  }
  return statusMap[status] || status
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'not-started': 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'delayed': 'bg-red-100 text-red-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

// 获取进度条颜色
const getProgressColor = (progress: number) => {
  if (progress < 30) return 'bg-red-500'
  if (progress < 70) return 'bg-yellow-500'
  return 'bg-green-500'
}

// 根据任务ID获取任务名称
const getTaskNameById = (taskId: string) => {
  const task = tasks.value.find(t => t.taskId === taskId)
  return task ? task.taskName : '未知任务'
}

// 更新进度相关函数
const updateProgress = (task: TaskProgress) => {
  selectedTask.value = task
  newProgress.value = task.currentProgress
  progressComment.value = ''
  showUpdateModal.value = true
}

const closeUpdateModal = () => {
  showUpdateModal.value = false
  selectedTask.value = null
  newProgress.value = 0
  progressComment.value = ''
}

const submitProgressUpdate = () => {
  if (selectedTask.value) {
    // 在实际应用中，这里会发送请求更新进度
    console.log('更新进度:', {
      taskId: selectedTask.value.taskId,
      progress: newProgress.value,
      comment: progressComment.value
    })
    
    alert(`任务 "${selectedTask.value.taskName}" 的进度已更新为 ${newProgress.value}%`)
    closeUpdateModal()
  }
}
</script>

<style scoped>
/* 可以添加额外的样式 */
</style>