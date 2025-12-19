// data/ProgressTracking.ts
export interface TaskProgress {
  id: string
  taskId: string
  taskName: string
  currentProgress: number
  targetProgress: number
  lastUpdated: string
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed'
  assignee: string
  dueDate: string
}

export interface ProgressHistory {
  id: string
  taskId: string
  progress: number
  timestamp: string
  updatedBy: string
  comment: string
}

export interface ProgressTrackingData {
  tasks: TaskProgress[]
  history: ProgressHistory[]
}

export const MOCK_PROGRESS_TRACKING_DATA: ProgressTrackingData = {
  tasks: [
    {
      id: 'prog1',
      taskId: 'task1',
      taskName: '设计新用户界面',
      currentProgress: 75,
      targetProgress: 100,
      lastUpdated: '2023-06-15T14:30:00Z',
      status: 'in-progress',
      assignee: '张三',
      dueDate: '2023-06-30'
    },
    {
      id: 'prog2',
      taskId: 'task2',
      taskName: '开发用户认证模块',
      currentProgress: 100,
      targetProgress: 100,
      lastUpdated: '2023-06-10T09:15:00Z',
      status: 'completed',
      assignee: '李四',
      dueDate: '2023-06-15'
    },
    {
      id: 'prog3',
      taskId: 'task3',
      taskName: '优化数据库查询性能',
      currentProgress: 30,
      targetProgress: 80,
      lastUpdated: '2023-06-18T11:45:00Z',
      status: 'delayed',
      assignee: '王五',
      dueDate: '2023-06-20'
    },
    {
      id: 'prog4',
      taskId: 'task4',
      taskName: '编写API文档',
      currentProgress: 0,
      targetProgress: 100,
      lastUpdated: '2023-06-01T10:00:00Z',
      status: 'not-started',
      assignee: '赵六',
      dueDate: '2023-06-25'
    }
  ],
  history: [
    {
      id: 'hist1',
      taskId: 'task1',
      progress: 75,
      timestamp: '2023-06-15T14:30:00Z',
      updatedBy: '张三',
      comment: '完成了主要界面设计，正在进行细节优化'
    },
    {
      id: 'hist2',
      taskId: 'task2',
      progress: 100,
      timestamp: '2023-06-10T09:15:00Z',
      updatedBy: '李四',
      comment: '用户认证模块开发完成并通过测试'
    },
    {
      id: 'hist3',
      taskId: 'task3',
      progress: 30,
      timestamp: '2023-06-18T11:45:00Z',
      updatedBy: '王五',
      comment: '已完成索引优化，正在进行查询重构'
    },
    {
      id: 'hist4',
      taskId: 'task1',
      progress: 50,
      timestamp: '2023-06-10T16:20:00Z',
      updatedBy: '张三',
      comment: '完成了50%的界面设计工作'
    }
  ]
}