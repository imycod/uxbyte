// data/ArticleListPage.ts
export interface Article {
  id: string
  title: string
  summary: string
  content: string
  categoryId: string
  categoryName: string
  author: string
  publishDate: string
  coverImage?: string
  tags: string[]
  views: number
  likes: number
}

export interface Category {
  id: string
  name: string
  description: string
  articleCount: number
}

export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: '技术分享',
    description: '编程技术、开发经验分享',
    articleCount: 12
  },
  {
    id: '2',
    name: '生活随笔',
    description: '日常生活、感悟分享',
    articleCount: 8
  },
  {
    id: '3',
    name: '旅行游记',
    description: '旅行经历、风景分享',
    articleCount: 5
  },
  {
    id: '4',
    name: '读书笔记',
    description: '读书心得、书评分享',
    articleCount: 7
  }
]

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Vue 3 Composition API 实战指南',
    summary: '深入讲解Vue 3 Composition API的使用方法和最佳实践',
    content: 'Vue 3 Composition API 是Vue.js 3.0版本引入的新特性，它提供了一种更灵活的方式来组织和重用组件逻辑...',
    categoryId: '1',
    categoryName: '技术分享',
    author: '张三',
    publishDate: '2023-05-15',
    coverImage: 'https://picsum.photos/seed/vue/400/200',
    tags: ['Vue', 'JavaScript', '前端'],
    views: 1250,
    likes: 42
  },
  {
    id: '2',
    title: '春天的公园散步',
    summary: '记录一次春日公园散步的美好时光',
    content: '周末的午后，阳光正好，微风不燥。我决定去附近的公园走走，感受春天的气息...',
    categoryId: '2',
    categoryName: '生活随笔',
    author: '李四',
    publishDate: '2023-04-22',
    coverImage: 'https://picsum.photos/seed/park/400/200',
    tags: ['生活', '春天', '散步'],
    views: 860,
    likes: 28
  },
  {
    id: '3',
    title: 'TypeScript 高级类型详解',
    summary: '深入理解TypeScript中的高级类型系统',
    content: 'TypeScript的类型系统非常强大，除了基础类型外，还提供了许多高级类型工具...',
    categoryId: '1',
    categoryName: '技术分享',
    author: '王五',
    publishDate: '2023-05-10',
    coverImage: 'https://picsum.photos/seed/typescript/400/200',
    tags: ['TypeScript', '前端', '类型系统'],
    views: 2100,
    likes: 85
  },
  {
    id: '4',
    title: '京都三日游全攻略',
    summary: '详细的京都三日游行程安排和景点推荐',
    content: '京都作为日本的古都，拥有众多历史悠久的寺庙和传统建筑。这次旅行我制定了详细的行程计划...',
    categoryId: '3',
    categoryName: '旅行游记',
    author: '赵六',
    publishDate: '2023-04-18',
    coverImage: 'https://picsum.photos/seed/kyoto/400/200',
    tags: ['旅行', '日本', '攻略'],
    views: 1520,
    likes: 63
  },
  {
    id: '5',
    title: '《人类简史》读后感',
    summary: '读完《人类简史》后的思考与感悟',
    content: '《人类简史》是以色列历史学家尤瓦尔·赫拉利的著作，从宏观角度审视了人类从石器时代到现代社会的发展历程...',
    categoryId: '4',
    categoryName: '读书笔记',
    author: '孙七',
    publishDate: '2023-05-05',
    coverImage: 'https://picsum.photos/seed/book/400/200',
    tags: ['读书', '历史', '感悟'],
    views: 980,
    likes: 35
  },
  {
    id: '6',
    title: 'React Hooks 使用技巧',
    summary: 'React Hooks 的高级使用技巧和注意事项',
    content: 'React Hooks 自推出以来，极大地简化了函数组件的开发体验。本文将介绍一些高级使用技巧...',
    categoryId: '1',
    categoryName: '技术分享',
    author: '周八',
    publishDate: '2023-04-30',
    coverImage: 'https://picsum.photos/seed/react/400/200',
    tags: ['React', 'JavaScript', '前端'],
    views: 1750,
    likes: 72
  }
]