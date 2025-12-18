// data/ProgressTrackingPage.ts
export interface TaskProgress {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  assignee: string;
  dueDate: string;
  startDate: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
}

export interface ProgressUpdate {
  taskId: string;
  progress: number;
  notes?: string;
  timestamp: string;
}

export const MOCK_PROGRESS_DATA: TaskProgress[] = [
  {
    id: 'task-001',
    title: '设计新用户界面',
    description: '为产品重新设计用户界面，提升用户体验',
    progress: 75,
    status: 'in-progress',
    assignee: '张三',
    dueDate: '2023-06-15',
    startDate: '2023-05-01',
    priority: 'high',
    tags: ['设计', 'UI/UX']
  },
  {
    id: 'task-002',
    title: '开发用户认证模块',
    description: '实现用户注册、登录和权限管理功能',
    progress: 40,
    status: 'in-progress',
    assignee: '李四',
    dueDate: '2023-06-30',
    startDate: '2023-05-10',
    priority: 'high',
    tags: ['开发', '后端']
  },
  {
    id: 'task-003',
    title: '编写项目文档',
    description: '完成项目技术文档和用户手册',
    progress: 20,
    status: 'in-progress',
    assignee: '王五',
    dueDate: '2023-07-10',
    startDate: '2023-05-20',
    priority: 'medium',
    tags: ['文档']
  },
  {
    id: 'task-004',
    title: '测试性能优化',
    description: '对系统进行性能测试并优化瓶颈',
    progress: 0,
    status: 'not-started',
    assignee: '赵六',
    dueDate: '2023-06-25',
    startDate: '2023-06-01',
    priority: 'medium',
    tags: ['测试', '优化']
  },
  {
    id: 'task-005',
    title: '部署到生产环境',
    description: '将应用部署到生产服务器并进行监控',
    progress: 100,
    status: 'completed',
    assignee: '孙七',
    dueDate: '2023-05-30',
    startDate: '2023-05-25',
    priority: 'high',
    tags: ['运维', '部署']
  }
];

export const MOCK_PROGRESS_UPDATES: ProgressUpdate[] = [
  {
    taskId: 'task-001',
    progress: 25,
    notes: '完成了初步设计草图',
    timestamp: '2023-05-10T09:30:00Z'
  },
  {
    taskId: 'task-001',
    progress: 50,
    notes: '完成了高保真设计稿',
    timestamp: '2023-05-20T14:15:00Z'
  },
  {
    taskId: 'task-001',
    progress: 75,
    notes: '完成了设计评审',
    timestamp: '2023-05-28T11:45:00Z'
  },
  {
    taskId: 'task-002',
    progress: 20,
    notes: '完成了数据库设计',
    timestamp: '2023-05-15T10:00:00Z'
  },
  {
    taskId: 'task-002',
    progress: 40,
    notes: '完成了API接口开发',
    timestamp: '2023-05-25T16:30:00Z'
  }
];