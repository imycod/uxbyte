// data/CategoryManagementPage.ts
export interface Category {
  id: string
  name: string
  description: string
  articleCount: number
  createdAt: string
  updatedAt: string
}

export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: '技术分享',
    description: '编程技术、开发经验分享',
    articleCount: 12,
    createdAt: '2023-01-15',
    updatedAt: '2023-05-20'
  },
  {
    id: '2',
    name: '生活随笔',
    description: '日常生活、感悟分享',
    articleCount: 8,
    createdAt: '2023-02-10',
    updatedAt: '2023-05-18'
  },
  {
    id: '3',
    name: '旅行游记',
    description: '旅行经历、风景分享',
    articleCount: 5,
    createdAt: '2023-03-05',
    updatedAt: '2023-05-10'
  },
  {
    id: '4',
    name: '读书笔记',
    description: '读书心得、书评分享',
    articleCount: 7,
    createdAt: '2023-03-22',
    updatedAt: '2023-05-15'
  },
  {
    id: '5',
    name: '美食推荐',
    description: '美食探店、食谱分享',
    articleCount: 3,
    createdAt: '2023-04-12',
    updatedAt: '2023-05-05'
  }
]