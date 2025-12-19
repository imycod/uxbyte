<template>
  <div class="task-detail-page">
    <!-- 返回按钮和页面标题 -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <button 
          @click="goBack"
          class="flex items-center text-primary hover:text-primary/80 mr-4"
        >
          <svg class="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回
        </button>
        <h1 class="text-2xl font-bold text-foreground">任务详情</h1>
      </div>
      <button 
        @click="navigateToProgressTracking"
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm"
      >
        进度跟踪
      </button>
    </div>

    <!-- 任务基本信息卡片 -->
    <div class="bg-card border border-border rounded-lg p-6 mb-6">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between">
        <div class="flex-1">
          <h2 class="text-xl font-bold text-foreground mb-2">{{ task.title }}</h2>
          <p class="text-muted-foreground mb-4">{{ task.description }}</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="text-sm font-medium text-muted-foreground mb-1">状态</h3>
              <span 
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="getStatusClass(task.status)"
              >
                {{ getStatusText(task.status) }}
              </span>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-muted-foreground mb-1">优先级</h3>
              <span 
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                :class="getPriorityClass(task.priority)"
              >
                {{ getPriorityText(task.priority) }}
              </span>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-muted-foreground mb-1">负责人</h3>
              <div class="flex items-center">
                <img 
                  :src="task.assignee.avatar" 
                  :alt="task.assignee.name" 
                  class="w-8 h-8 rounded-full mr-2"
                />
                <span class="text-foreground">{{ task.assignee.name }}</span>
              </div>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-muted-foreground mb-1">截止日期</h3>
              <span class="text-foreground">{{ formatDate(task.dueDate) }}</span>
            </div>
          </div>
        </div>
        
        <div class="mt-4 md:mt-0">
          <h3 class="text-sm font-medium text-muted-foreground mb-2">进度</h3>
          <div class="w-32 h-32">
            <svg viewBox="0 0 36 36" class="circular-chart">
              <path class="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path class="circle"
                :stroke-dasharray="`${task.progress}, 100`"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.5" class="percentage">{{ task.progress }}%</text>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 任务详细信息 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧内容 -->
      <div class="lg:col-span-2">
        <!-- 标签 -->
        <div class="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 class="text-lg font-medium text-foreground mb-4">标签</h3>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="tag in task.tags" 
              :key="tag"
              class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <!-- 附件 -->
        <div class="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 class="text-lg font-medium text-foreground mb-4">附件</h3>
          <div v-if="task.attachments.length > 0" class="space-y-3">
            <div 
              v-for="attachment in task.attachments" 
              :key="attachment.id"
              class="flex items-center justify-between p-3 border border-border rounded-md hover:bg-accent transition-colors"
            >
              <div class="flex items-center">
                <div class="bg-muted p-2 rounded-md mr-3">
                  <svg class="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <div class="font-medium text-foreground">{{ attachment.name }}</div>
                  <div class="text-sm text-muted-foreground">{{ attachment.size }}</div>
                </div>
              </div>
              <button class="text-primary hover:text-primary/80">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>
          </div>
          <div v-else class="text-muted-foreground text-center py-8">
            暂无附件
          </div>
        </div>

        <!-- 评论 -->
        <div class="bg-card border border-border rounded-lg p-6">
          <h3 class="text-lg font-medium text-foreground mb-4">评论</h3>
          <div class="space-y-6">
            <div 
              v-for="comment in task.comments" 
              :key="comment.id"
              class="border-b border-border pb-6 last:border-0 last:pb-0"
            >
              <div class="flex items-start">
                <img 
                  :src="comment.author.avatar" 
                  :alt="comment.author.name" 
                  class="w-10 h-10 rounded-full mr-3"
                />
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <h4 class="font-medium text-foreground">{{ comment.author.name }}</h4>
                    <span class="text-sm text-muted-foreground">{{ formatDateTime(comment.createdAt) }}</span>
                  </div>
                  <p class="mt-2 text-foreground">{{ comment.content }}</p>
                </div>
              </div>
            </div>
            
            <div class="pt-4">
              <h4 class="font-medium text-foreground mb-3">添加评论</h4>
              <textarea 
                v-model="newComment"
                rows="3"
                placeholder="输入您的评论..."
                class="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              ></textarea>
              <div class="mt-2 flex justify-end">
                <button 
                  @click="addComment"
                  class="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  发布评论
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧信息 -->
      <div>
        <!-- 时间信息 -->
        <div class="bg-card border border-border rounded-lg p-6 mb-6">
          <h3 class="text-lg font-medium text-foreground mb-4">时间信息</h3>
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-muted-foreground mb-1">创建时间</h4>
              <p class="text-foreground">{{ formatDateTime(task.createdAt) }}</p>
            </div>
            <div v-if="task.startDate">
              <h4 class="text-sm font-medium text-muted-foreground mb-1">开始时间</h4>
              <p class="text-foreground">{{ formatDateTime(task.startDate) }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-muted-foreground mb-1">截止时间</h4>
              <p class="text-foreground">{{ formatDateTime(task.dueDate) }}</p>
            </div>
            <div v-if="task.completedDate">
              <h4 class="text-sm font-medium text-muted-foreground mb-1">完成时间</h4>
              <p class="text-foreground">{{ formatDateTime(task.completedDate) }}</p>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="bg-card border border-border rounded-lg p-6">
          <h3 class="text-lg font-medium text-foreground mb-4">操作</h3>
          <div class="space-y-3">
            <button 
              class="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              @click="updateProgress"
            >
              更新进度
            </button>
            <button 
              class="w-full px-4 py-2 bg-background text-foreground border border-border rounded-md hover:bg-accent transition-colors"
              @click="editTask"
            >
              编辑任务
            </button>
            <button 
              class="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
              @click="deleteTask"
            >
              删除任务
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Task } from '@/data/TaskDetailPage'
import { MOCK_TASK_DETAIL_DATA } from '@/data/TaskDetailPage'

// Props with defaults
interface Props {
  task?: Task
}

const props = withDefaults(defineProps<Props>(), {
  task: () => MOCK_TASK_DETAIL_DATA.task
})

// 新评论内容
const newComment = ref('')

// 返回任务列表
const goBack = () => {
  window.location.href = './TaskListPage.html'
}

// 导航到进度跟踪页
const navigateToProgressTracking = () => {
  window.location.href = './ProgressTrackingPage.html'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'pending': '待办',
    'in-progress': '进行中',
    'completed': '已完成',
    'cancelled': '已取消'
  }
  return statusMap[status] || status
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    'pending': 'bg-blue-100 text-blue-800',
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
    'high': '高',
    'urgent': '紧急'
  }
  return priorityMap[priority] || priority
}

// 获取优先级样式类
const getPriorityClass = (priority: string) => {
  const classMap: Record<string, string> = {
    'low': 'bg-green-100 text-green-800',
    'medium': 'bg-yellow-100 text-yellow-800',
    'high': 'bg-orange-100 text-orange-800',
    'urgent': 'bg-red-100 text-red-800'
  }
  return classMap[priority] || 'bg-gray-100 text-gray-800'
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 添加评论
const addComment = () => {
  if (newComment.value.trim() === '') return
  
  // 在实际应用中，这里会发送请求添加评论
  alert('评论已添加')
  newComment.value = ''
}

// 更新进度
const updateProgress = () => {
  // 在实际应用中，这里会打开进度更新对话框
  alert('更新进度功能')
}

// 编辑任务
const editTask = () => {
  // 在实际应用中，这里会导航到编辑页面
  alert('编辑任务功能')
}

// 删除任务
const deleteTask = () => {
  if (confirm('确定要删除这个任务吗？')) {
    // 在实际应用中，这里会发送删除请求
    alert('任务已删除')
  }
}
</script>

<style scoped>
.circular-chart {
  display: block;
  margin: 10px auto;
  max-width: 80%;
  max-height: 250px;
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3;
}

.circle {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke: #4f46e5; /* primary color */
  animation: progress 1s ease-out forwards;
}

@keyframes progress {
  0% {
    stroke-dasharray: 0 100;
  }
}

.percentage {
  fill: #666;
  font-size: 0.5em;
  text-anchor: middle;
}
</style>