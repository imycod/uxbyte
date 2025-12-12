// data/OrderManagementPage.ts
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  paymentMethod: string;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-20230515-001',
    date: '2023-05-15',
    status: 'delivered',
    total: 1725.97,
    shippingAddress: '北京市朝阳区某某街道123号',
    paymentMethod: '支付宝',
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
  },
  {
    id: '2',
    orderNumber: 'ORD-20230510-002',
    date: '2023-05-10',
    status: 'shipped',
    total: 899.99,
    shippingAddress: '北京市朝阳区某某街道123号',
    paymentMethod: '微信支付',
    items: [
      {
        id: '4',
        name: '无线蓝牙音箱',
        price: 899.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1618366712032-4a5a055d933d?auto=format&fit=crop&w=600&h=600',
        sku: 'WBS-004'
      }
    ]
  },
  {
    id: '3',
    orderNumber: 'ORD-20230505-003',
    date: '2023-05-05',
    status: 'processing',
    total: 399.99,
    shippingAddress: '北京市朝阳区某某街道123号',
    paymentMethod: '信用卡',
    items: [
      {
        id: '5',
        name: '运动手环',
        price: 399.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1572573386949-53943c6d4964?auto=format&fit=crop&w=600&h=600',
        sku: 'FB-005'
      }
    ]
  }
];

export const getStatusText = (status: Order['status']): string => {
  switch (status) {
    case 'pending':
      return '待付款';
    case 'processing':
      return '处理中';
    case 'shipped':
      return '已发货';
    case 'delivered':
      return '已完成';
    case 'cancelled':
      return '已取消';
    default:
      return '未知状态';
  }
};

export const getStatusColor = (status: Order['status']): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-indigo-100 text-indigo-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};