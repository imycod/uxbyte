// data/TaskDetailPage.ts
export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: {
    name: string
    avatar: string
    email: string
  }
  dueDate: string
  startDate: string
  estimatedHours: number
  actualHours: number
  tags: string[]
  attachments: {
    name: string
    size: string
    type: string
  }[]
  comments: {
    id: string
    author: string
    avatar: string
    content: string
    timestamp: string
  }[]
  progress: number // 0-100
}

export const MOCK_TASK_DATA: Task = {
  id: 'TASK-001',
  title: '开发用户管理系统',
  description: '开发一个完整的用户管理系统，包括用户注册、登录、权限管理等功能。需要实现用户信息的增删改查操作，并确保数据安全性。',
  status: 'in-progress',
  priority: 'high',
  assignee: {
    name: '张三',
    avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=张三',
    email: 'zhangsan@example.com'
  },
  dueDate: '2023-06-30',
  startDate: '2023-06-01',
  estimatedHours: 40,
  actualHours: 25,
  tags: ['开发', '后端', '安全'],
  attachments: [
    { name: '需求文档.pdf', size: '2.4 MB', type: 'pdf' },
    { name: '设计稿.sketch', size: '5.1 MB', type: 'sketch' },
    { name: 'API规范.docx', size: '1.2 MB', type: 'docx' }
  ],
  comments: [
    {
      id: '1',
      author: '李四',
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=李四',
      content: '这个任务的进度如何？预计什么时候能完成？',
      timestamp: '2023-06-15 10:30'
    },
    {
      id: '2',
      author: '张三',
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=张三',
      content: '目前已经完成了用户注册和登录功能，权限管理部分正在进行中，预计还需要一周时间。',
      timestamp: '2023-06-15 14:20'
    }
  ],
  progress: 65
}

export const STATUS_LABELS = {
  'pending': '待处理',
  'in-progress': '进行中',
  'completed': '已完成',
  'cancelled': '已取消'
}

export const PRIORITY_LABELS = {
  'low': '低',
  'medium': '中',
  'high': '高',
  'urgent': '紧急'
}

export const PRIORITY_COLORS = {
  'low': 'bg-green-100 text-green-800',
  'medium': 'bg-blue-100 text-blue-800',
  'high': 'bg-yellow-100 text-yellow-800',
  'urgent': 'bg-red-100 text-red-800'
}