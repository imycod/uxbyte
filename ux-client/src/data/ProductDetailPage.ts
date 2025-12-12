// data/ProductDetailPage.ts
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceAdjustment: number; // 价格调整值
}

export interface ProductSpecification {
  id: string;
  name: string;
  value: string;
}

export interface ProductReview {
  id: string;
  userName: string;
  rating: number; // 1-5星
  comment: string;
  date: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // 原价（用于显示折扣）
  category: string;
  brand: string;
  inStock: boolean;
  stockQuantity: number;
  images: ProductImage[];
  variants: ProductVariant[]; // 如颜色、尺寸等
  specifications: ProductSpecification[];
  reviews: ProductReview[];
  averageRating: number; // 平均评分
  reviewCount: number; // 评论数量
}

export const MOCK_PRODUCT_DETAIL: ProductDetail = {
  id: "PD001",
  name: "无线蓝牙耳机 Pro",
  description: "这款无线蓝牙耳机采用最新的蓝牙5.2技术，提供卓越的音质和稳定的连接。主动降噪功能让您沉浸在纯净的音乐世界中，无论是在嘈杂的街道还是安静的办公室。长达30小时的续航时间，让您无需频繁充电。",
  price: 299.99,
  originalPrice: 399.99,
  category: "电子产品",
  brand: "TechSound",
  inStock: true,
  stockQuantity: 150,
  images: [
    {
      id: "img1",
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      alt: "无线蓝牙耳机正面视图"
    },
    {
      id: "img2",
      url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      alt: "无线蓝牙耳机侧面视图"
    },
    {
      id: "img3",
      url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      alt: "无线蓝牙耳机充电盒"
    }
  ],
  variants: [
    { id: "color-black", name: "颜色", value: "黑色", priceAdjustment: 0 },
    { id: "color-white", name: "颜色", value: "白色", priceAdjustment: 0 },
    { id: "color-blue", name: "颜色", value: "蓝色", priceAdjustment: 0 },
    { id: "size-standard", name: "尺寸", value: "标准版", priceAdjustment: 0 },
    { id: "size-pro", name: "尺寸", value: "Pro版", priceAdjustment: 50 }
  ],
  specifications: [
    { id: "spec1", name: "蓝牙版本", value: "5.2" },
    { id: "spec2", name: "电池续航", value: "30小时" },
    { id: "spec3", name: "充电时间", value: "1.5小时" },
    { id: "spec4", name: "重量", value: "250g" },
    { id: "spec5", name: "防水等级", value: "IPX5" },
    { id: "spec6", name: "驱动单元", value: "40mm" }
  ],
  reviews: [
    {
      id: "rev1",
      userName: "张三",
      rating: 5,
      comment: "音质非常棒，降噪效果出色，佩戴舒适，强烈推荐！",
      date: "2023-05-15"
    },
    {
      id: "rev2",
      userName: "李四",
      rating: 4,
      comment: "性价比很高，电池续航确实很持久，不过充电盒有点大。",
      date: "2023-04-22"
    },
    {
      id: "rev3",
      userName: "王五",
      rating: 5,
      comment: "已经使用一个月了，连接稳定，音质清晰，非常满意这次购买。",
      date: "2023-03-10"
    }
  ],
  averageRating: 4.7,
  reviewCount: 128
};