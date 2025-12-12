// data/ShoppingCartPage.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  sku: string;
  color?: string;
  size?: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: '1',
    name: '无线蓝牙耳机',
    price: 299.99,
    originalPrice: 399.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=600',
    quantity: 1,
    sku: 'WBH-001',
    color: '黑色',
    size: '标准'
  },
  {
    id: '2',
    name: '智能手表',
    price: 1299.99,
    originalPrice: 1599.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&h=600',
    quantity: 1,
    sku: 'SW-002',
    color: '银色',
    size: '42mm'
  },
  {
    id: '3',
    name: '便携式充电宝',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&h=600',
    quantity: 2,
    sku: 'PP-003',
    color: '白色',
    size: '10000mAh'
  }
];

export const MOCK_CART_SUMMARY: CartSummary = {
  subtotal: 1799.97,
  discount: 200.00,
  shipping: 0,
  tax: 126.00,
  total: 1725.97
};