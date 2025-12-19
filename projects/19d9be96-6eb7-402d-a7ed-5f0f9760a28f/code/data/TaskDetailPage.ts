// data/TaskDetailPage.ts
export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee: {
    id: string
    name: string
    avatar: string
    email: string
  }
  createdAt: string
  dueDate: string
  startDate?: string
  completedDate?: string
  tags: string[]
  attachments: Array<{
    id: string
    name: string
    size: string
    url: string
  }>
  comments: Array<{
    id: string
    author: {
      id: string
      name: string
      avatar: string
    }
    content: string
    createdAt: string
  }>
}

export interface TaskDetailData {
  task: Task
}

export const MOCK_TASK_DETAIL_DATA: TaskDetailData = {
  task: {
    id: 'TASK-001',
    title: '设计新用户界面',
    description: '为新产品模块设计现代化的用户界面，需要遵循最新的设计规范和用户体验原则。界面应该简洁直观，同时提供所有必要的功能。',
    status: 'in-progress',
    priority: 'high',
    assignee: {
      id: 'user-001',
      name: '张伟',
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=张伟',
      email: 'zhangwei@example.com'
    },
    createdAt: '2023-06-15T09:30:00Z',
    dueDate: '2023-07-15T18:00:00Z',
    startDate: '2023-06-20T09:00:00Z',
    tags: ['设计', 'UI/UX', '新产品'],
    attachments: [
      {
        id: 'attach-001',
        name: '设计规范.pdf',
        size: '2.4 MB',
        url: '#'
      },
      {
        id: 'attach-002',
        name: '原型图.sketch',
        size: '15.7 MB',
        url: '#'
      }
    ],
    comments: [
      {
        id: 'comment-001',
        author: {
          id: 'user-002',
          name: '李娜',
          avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=李娜'
        },
        content: '初稿设计已经完成，请查看并提供反馈意见。',
        createdAt: '2023-06-22T14:30:00Z'
      },
      {
        id: 'comment-002',
        author: {
          id: 'user-001',
          name: '张伟',
          avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=张伟'
        },
        content: '整体设计很好，但建议在颜色搭配上做一些调整，以提高可访问性。',
        createdAt: '2023-06-23T10:15:00Z'
      }
    ]
  }
}