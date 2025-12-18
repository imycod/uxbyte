<template>
  <div class="task-detail-page">
    <!-- Back button -->
    <button
      @click="goToTaskList"
      class="flex items-center text-primary hover:text-primary/80 mb-6 transition-colors"
    >
      <svg
        class="w-5 h-5 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      返回任务列表
    </button>

    <!-- Task header -->
    <div class="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <h1 class="text-2xl font-bold text-foreground">{{ task.title }}</h1>
            <span
              :class="getPriorityClass(task.priority)"
              class="px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap"
            >
              {{ getPriorityLabel(task.priority) }}
            </span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              :class="getStatusClass(task.status)"
              class="px-2 py-1 text-xs font-medium rounded-full"
            >
              {{ getStatusLabel(task.status) }}
            </span>
            <span class="px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
              {{ task.assignee.name }}
            </span>
          </div>
        </div>
        <div class="flex gap-2">
          <button
            @click="goToProgressTracking"
            class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            进度跟踪
          </button>
          <button
            class="px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors text-sm"
          >
            编辑任务
          </button>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="mt-4">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-foreground">任务进度</span>
          <span class="text-sm font-medium text-foreground">{{ task.progress }}%</span>
        </div>
        <div class="w-full bg-muted rounded-full h-2.5">
          <div
            class="bg-primary h-2.5 rounded-full"
            :style="{ width: task.progress + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Task details -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main content -->
      <div class="lg:col-span-2">
        <!-- Description -->
        <div class="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
          <h2 class="text-lg font-semibold text-foreground mb-4">任务描述</h2>
          <p class="text-foreground whitespace-pre-line">{{ task.description }}</p>
        </div>

        <!-- Attachments -->
        <div class="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
          <h2 class="text-lg font-semibold text-foreground mb-4">附件 ({{ task.attachments.length }})</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              v-for="attachment in task.attachments"
              :key="attachment.name"
              class="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div class="flex items-center">
                <div class="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                  <svg
                    class="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p class="font-medium text-foreground">{{ attachment.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ attachment.size }}</p>
                </div>
              </div>
              <button class="text-primary hover:text-primary/80">
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Comments -->
        <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-foreground mb-4">评论 ({{ task.comments.length }})</h2>
          <div class="space-y-4 mb-6">
            <div
              v-for="comment in task.comments"
              :key="comment.id"
              class="flex gap-3"
            >
              <img
                :src="comment.avatar"
                :alt="comment.author"
                class="w-10 h-10 rounded-full bg-muted"
              />
              <div class="flex-1">
                <div class="bg-muted rounded-lg p-4">
                  <div class="flex items-center justify-between mb-1">
                    <h4 class="font-medium text-foreground">{{ comment.author }}</h4>
                    <span class="text-xs text-muted-foreground">{{ comment.timestamp }}</span>
                  </div>
                  <p class="text-foreground">{{ comment.content }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <img
              :src="task.assignee.avatar"
              :alt="task.assignee.name"
              class="w-10 h-10 rounded-full bg-muted"
            />
            <div class="flex-1">
              <textarea
                placeholder="添加评论..."
                class="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows="3"
              ></textarea>
              <div class="flex justify-end mt-2">
                <button class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  发布评论
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Assignee -->
        <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-foreground mb-4">负责人</h2>
          <div class="flex items-center gap-3">
            <img
              :src="task.assignee.avatar"
              :alt="task.assignee.name"
              class="w-12 h-12 rounded-full bg-muted"
            />
            <div>
              <p class="font-medium text-foreground">{{ task.assignee.name }}</p>
              <p class="text-sm text-muted-foreground">{{ task.assignee.email }}</p>
            </div>
          </div>
        </div>

        <!-- Dates -->
        <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-foreground mb-4">时间信息</h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-muted-foreground">开始日期</span>
              <span class="font-medium text-foreground">{{ formatDate(task.startDate) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">截止日期</span>
              <span class="font-medium text-foreground">{{ formatDate(task.dueDate) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">预计工时</span>
              <span class="font-medium text-foreground">{{ task.estimatedHours }} 小时</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">实际工时</span>
              <span class="font-medium text-foreground">{{ task.actualHours }} 小时</span>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div class="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-foreground mb-4">标签</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in task.tags"
              :key="tag"
              class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/data/TaskDetailPage'
import { MOCK_TASK_DATA, STATUS_LABELS, PRIORITY_LABELS, PRIORITY_COLORS } from '@/data/TaskDetailPage'

// Props with defaults
interface Props {
  task?: Task
}

const props = withDefaults(defineProps<Props>(), {
  task: () => MOCK_TASK_DATA
})

// Computed properties for labels and classes
const getStatusLabel = (status: string) => {
  return STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status
}

const getPriorityLabel = (priority: string) => {
  return PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS] || priority
}

const getPriorityClass = (priority: string) => {
  return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || 'bg-gray-100 text-gray-800'
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'pending': 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'cancelled': 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Navigation functions
const goToTaskList = () => {
  window.location.href = './TaskListPage.html'
}

const goToProgressTracking = () => {
  window.location.href = './ProgressTrackingPage.html'
}
</script>

<style scoped>
/* Custom styles if needed */
</style>