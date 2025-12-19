// data/TaskListPage.ts
export interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  assignee: string
  dueDate: string
  progress: number
  createdAt: string
  updatedAt: string
}

export interface TaskFilter {
  status?: string
  priority?: string
  search?: string
}

export const MOCK_TASKS: Task[] = [
  {
    id: 'TASK-001',
    title: '设计新用户界面',
    description: '为移动端应用设计全新的用户界面，提升用户体验',
    status: 'in-progress',
    priority: 'high',
    assignee: '张三',
    dueDate: '2023-06-15',
    progress: 65,
    createdAt: '2023-05-20',
    updatedAt: '2023-05-25'
  },
  {
    id: 'TASK-002',
    title: '开发用户认证模块',
    description: '实现用户注册、登录和权限管理功能',
    status: 'todo',
    priority: 'high',
    assignee: '李四',
    dueDate: '2023-06-10',
    progress: 0,
    createdAt: '2023-05-18',
    updatedAt: '2023-05-18'
  },
  {
    id: 'TASK-003',
    title: '优化数据库查询性能',
    description: '分析并优化慢查询，提升系统响应速度',
    status: 'completed',
    priority: 'medium',
    assignee: '王五',
    dueDate: '2023-05-30',
    progress: 100,
    createdAt: '2023-05-10',
    updatedAt: '2023-05-28'
  },
  {
    id: 'TASK-004',
    title: '编写API文档',
    description: '为所有公共API端点编写详细的技术文档',
    status: 'in-progress',
    priority: 'low',
    assignee: '赵六',
    dueDate: '2023-06-20',
    progress: 30,
    createdAt: '2023-05-22',
    updatedAt: '2023-05-24'
  },
  {
    id: 'TASK-005',
    title: '测试移动端兼容性',
    description: '在不同设备和浏览器上测试应用的兼容性',
    status: 'todo',
    priority: 'medium',
    assignee: '孙七',
    dueDate: '2023-06-05',
    progress: 0,
    createdAt: '2023-05-15',
    updatedAt: '2023-05-15'
  },
  {
    id: 'TASK-006',
    title: '部署到生产环境',
    description: '将最新版本部署到生产服务器并监控运行状态',
    status: 'cancelled',
    priority: 'high',
    assignee: '周八',
    dueDate: '2023-05-28',
    progress: 0,
    createdAt: '2023-05-12',
    updatedAt: '2023-05-20'
  }
]

export const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: 'todo', label: '待办' },
  { value: 'in-progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'cancelled', label: '已取消' }
]

export const PRIORITY_OPTIONS = [
  { value: '', label: '全部优先级' },
  { value: 'low', label: '低' },
  { value: 'medium', label: '中' },
  { value: 'high', label: '高' }
]