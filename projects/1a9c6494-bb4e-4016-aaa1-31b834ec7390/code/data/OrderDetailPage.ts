// data/OrderDetailPage.ts
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  billingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
  shippingMethod: string;
}

export const MOCK_ORDER_DETAIL: OrderDetail = {
  id: 'ORD-2023-001',
  orderNumber: 'ORD-2023-001',
  date: '2023-06-15',
  status: 'delivered',
  subtotal: 259.98,
  shipping: 15.00,
  tax: 25.01,
  total: 299.99,
  items: [
    {
      id: 'ITEM-001',
      name: '无线蓝牙耳机',
      price: 199.99,
      quantity: 1,
      image: 'https://via.placeholder.com/80x80?text=耳机',
      sku: 'EAR-001-BLK'
    },
    {
      id: 'ITEM-002',
      name: '手机保护壳',
      price: 29.99,
      quantity: 2,
      image: 'https://via.placeholder.com/80x80?text=保护壳',
      sku: 'CASE-002-RED'
    }
  ],
  shippingAddress: {
    name: '张三',
    phone: '138****1234',
    address: '朝阳区某某街道123号',
    city: '北京市',
    postalCode: '100000'
  },
  billingAddress: {
    name: '张三',
    phone: '138****1234',
    address: '朝阳区某某街道123号',
    city: '北京市',
    postalCode: '100000'
  },
  paymentMethod: '支付宝',
  shippingMethod: '标准配送 (3-5个工作日)'
};

export const ORDER_STATUS_LABELS = {
  pending: '待处理',
  processing: '处理中',
  shipped: '已发货',
  delivered: '已送达',
  cancelled: '已取消'
};

export const ORDER_STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};