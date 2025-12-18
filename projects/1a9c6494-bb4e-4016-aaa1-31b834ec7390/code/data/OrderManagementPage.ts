// data/OrderManagementPage.ts
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: string;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-2023-001',
    date: '2023-06-15',
    status: 'delivered',
    total: 299.99,
    shippingAddress: '北京市朝阳区某某街道123号',
    items: [
      {
        id: 'ITEM-001',
        name: '无线蓝牙耳机',
        price: 199.99,
        quantity: 1,
        image: 'https://via.placeholder.com/80x80?text=耳机'
      },
      {
        id: 'ITEM-002',
        name: '手机保护壳',
        price: 29.99,
        quantity: 2,
        image: 'https://via.placeholder.com/80x80?text=保护壳'
      }
    ]
  },
  {
    id: 'ORD-2023-002',
    date: '2023-06-10',
    status: 'shipped',
    total: 149.99,
    shippingAddress: '北京市朝阳区某某街道123号',
    items: [
      {
        id: 'ITEM-003',
        name: '智能手环',
        price: 149.99,
        quantity: 1,
        image: 'https://via.placeholder.com/80x80?text=手环'
      }
    ]
  },
  {
    id: 'ORD-2023-003',
    date: '2023-06-05',
    status: 'processing',
    total: 89.99,
    shippingAddress: '北京市朝阳区某某街道123号',
    items: [
      {
        id: 'ITEM-004',
        name: '无线充电器',
        price: 59.99,
        quantity: 1,
        image: 'https://via.placeholder.com/80x80?text=充电器'
      },
      {
        id: 'ITEM-005',
        name: '数据线',
        price: 14.99,
        quantity: 2,
        image: 'https://via.placeholder.com/80x80?text=数据线'
      }
    ]
  },
  {
    id: 'ORD-2023-004',
    date: '2023-05-28',
    status: 'pending',
    total: 199.99,
    shippingAddress: '北京市朝阳区某某街道123号',
    items: [
      {
        id: 'ITEM-006',
        name: '蓝牙音箱',
        price: 199.99,
        quantity: 1,
        image: 'https://via.placeholder.com/80x80?text=音箱'
      }
    ]
  },
  {
    id: 'ORD-2023-005',
    date: '2023-05-20',
    status: 'cancelled',
    total: 79.99,
    shippingAddress: '北京市朝阳区某某街道123号',
    items: [
      {
        id: 'ITEM-007',
        name: '手机支架',
        price: 39.99,
        quantity: 1,
        image: 'https://via.placeholder.com/80x80?text=支架'
      },
      {
        id: 'ITEM-008',
        name: '屏幕清洁剂',
        price: 19.99,
        quantity: 2,
        image: 'https://via.placeholder.com/80x80?text=清洁剂'
      }
    ]
  }
];

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