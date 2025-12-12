// data/HomePage.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  description: string;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export const MOCK_HOME_BANNERS: Banner[] = [
  {
    id: '1',
    title: '夏日清凉大促',
    subtitle: '精选商品低至5折起',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&h=400',
    ctaText: '立即选购',
    ctaLink: '/ProductDetailPage'
  },
  {
    id: '2',
    title: '新品上市',
    subtitle: '最新潮流单品抢先体验',
    image: 'https://images.unsplash.com/photo-1607083208920-3c4313939378?auto=format&fit=crop&w=1200&h=400',
    ctaText: '查看详情',
    ctaLink: '/ProductDetailPage'
  },
  {
    id: '3',
    title: '会员专享',
    subtitle: '加入会员享更多优惠',
    image: 'https://images.unsplash.com/photo-1607083208856-1f57423a2e5d?auto=format&fit=crop&w=1200&h=400',
    ctaText: '立即加入',
    ctaLink: '/ProductDetailPage'
  }
];

export const MOCK_HOME_CATEGORIES: Category[] = [
  {
    id: '1',
    name: '电子产品',
    icon: '📱',
    productCount: 128
  },
  {
    id: '2',
    name: '家居生活',
    icon: '🏠',
    productCount: 96
  },
  {
    id: '3',
    name: '服装配饰',
    icon: '👕',
    productCount: 215
  },
  {
    id: '4',
    name: '美妆护肤',
    icon: '💄',
    productCount: 87
  },
  {
    id: '5',
    name: '运动户外',
    icon: '⚽',
    productCount: 64
  },
  {
    id: '6',
    name: '图书文具',
    icon: '📚',
    productCount: 142
  }
];

export const MOCK_HOME_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '无线蓝牙耳机',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600',
    rating: 4.8,
    reviewCount: 124,
    category: '电子产品',
    description: '高保真音质，降噪功能，续航长达30小时',
    tags: ['热销', '新品']
  },
  {
    id: '2',
    name: '智能手表',
    price: 899,
    originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&h=600',
    rating: 4.6,
    reviewCount: 89,
    category: '电子产品',
    description: '健康监测，运动追踪，支持多种表盘',
    tags: ['特价']
  },
  {
    id: '3',
    name: '休闲运动鞋',
    price: 399,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&h=600',
    rating: 4.7,
    reviewCount: 215,
    category: '服装配饰',
    description: '舒适透气，轻便耐磨，多种配色可选',
    tags: ['推荐']
  },
  {
    id: '4',
    name: '便携式充电宝',
    price: 129,
    originalPrice: 199,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&h=600',
    rating: 4.5,
    reviewCount: 342,
    category: '电子产品',
    description: '20000mAh大容量，支持快充，小巧便携',
    tags: ['热销']
  },
  {
    id: '5',
    name: '香薰加湿器',
    price: 199,
    image: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=600&h=600',
    rating: 4.9,
    reviewCount: 76,
    category: '家居生活',
    description: '静音运行，七彩夜灯，改善空气质量',
    tags: ['新品']
  },
  {
    id: '6',
    name: '防晒霜 SPF50+',
    price: 89,
    originalPrice: 129,
    image: 'https://images.unsplash.com/photo-1526758097130-bab247f432d9?auto=format&fit=crop&w=600&h=600',
    rating: 4.4,
    reviewCount: 189,
    category: '美妆护肤',
    description: '清爽不油腻，防水防汗，适合各种肤质',
    tags: ['特价']
  }
];