// data/OrderDetailPage.ts
import type { Order } from './OrderManagementPage';

export interface OrderDetail extends Order {
  // 可以在这里添加订单详情特有的字段
  // 比如物流信息、发票信息等
  trackingNumber?: string;
  estimatedDeliveryDate?: string;
}

// 模拟订单详情数据
export const MOCK_ORDER_DETAIL: OrderDetail = {
  id: '1',
  orderNumber: 'ORD-20230515-001',
  date: '2023-05-15',
  status: 'delivered',
  total: 1725.97,
  shippingAddress: '北京市朝阳区某某街道123号 张三 收 138****1234',
  paymentMethod: '支付宝',
  trackingNumber: 'SF123456789CN',
  estimatedDeliveryDate: '2023-05-18',
  items: [
    {
      id: '1',
      name: '无线蓝牙耳机',
      price: 299.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600',
      sku: 'WBH-001'
    },
    {
      id: '2',
      name: '智能手表',
      price: 1299.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&h=600',
      sku: 'SW-002'
    },
    {
      id: '3',
      name: '便携式充电宝',
      price: 199.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&h=600',
      sku: 'PP-003'
    }
  ]
};