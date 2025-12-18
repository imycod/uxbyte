// data/TaskListPage.ts
export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'review' | 'completed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: string
  dueDate: string
  createdAt: string
  progress: number
  tags: string[]
}

export interface TaskFilter {
  status?: string
  priority?: string
  search?: string
}

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: '设计新用户界面',
    description: '为移动端应用设计全新的用户界面，提升用户体验',
    status: 'in-progress',
    priority: 'high',
    assignee: '张三',
    dueDate: '2023-06-15',
    createdAt: '2023-05-20',
    progress: 65,
    tags: ['设计', 'UI/UX']
  },
  {
    id: '2',
    title: '开发用户认证系统',
    description: '实现用户注册、登录和权限管理功能',
    status: 'todo',
    priority: 'urgent',
    assignee: '李四',
    dueDate: '2023-06-10',
    createdAt: '2023-05-18',
    progress: 0,
    tags: ['开发', '安全']
  },
  {
    id: '3',
    title: '数据库性能优化',
    description: '优化数据库查询，提升系统响应速度',
    status: 'completed',
    priority: 'medium',
    assignee: '王五',
    dueDate: '2023-05-30',
    createdAt: '2023-05-10',
    progress: 100,
    tags: ['数据库', '优化']
  },
  {
    id: '4',
    title: '编写API文档',
    description: '为新功能编写详细的API文档',
    status: 'review',
    priority: 'low',
    assignee: '赵六',
    dueDate: '2023-06-20',
    createdAt: '2023-05-22',
    progress: 90,
    tags: ['文档', 'API']
  },
  {
    id: '5',
    title: '测试自动化脚本',
    description: '开发自动化测试脚本，提高测试效率',
    status: 'in-progress',
    priority: 'medium',
    assignee: '孙七',
    dueDate: '2023-06-25',
    createdAt: '2023-05-25',
    progress: 40,
    tags: ['测试', '自动化']
  },
  {
    id: '6',
    title: '部署到生产环境',
    description: '将最新版本部署到生产服务器',
    status: 'todo',
    priority: 'high',
    assignee: '周八',
    dueDate: '2023-06-05',
    createdAt: '2023-05-28',
    progress: 0,
    tags: ['运维', '部署']
  }
]

export const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'todo', label: '待办' },
  { value: 'in-progress', label: '进行中' },
  { value: 'review', label: '审核中' },
  { value: 'completed', label: '已完成' }
]

export const PRIORITY_OPTIONS = [
  { value: '', label: '全部优先级' },
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' },
  { value: 'urgent', label: '紧急' }
]