// Core domain types for the application

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'seller' | 'customer';
  avatar?: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Seller extends User {
  role: 'seller';
  storeName: string;
  storeDescription: string;
  rating: number;
  totalSales: number;
  payoutBalance: number;
  verified: boolean;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  sellerId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: Address;
  billingAddress: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface AdminStats {
  totalUsers: number;
  totalSellers: number;
  totalOrders: number;
  totalRevenue: number;
  revenueGrowth: number;
  userGrowth: number;
  orderGrowth: number;
  sellerGrowth: number;
  recentOrders: Order[];
  topSellers: Seller[];
  revenueByMonth: MonthlyData[];
  ordersByStatus: StatusCount[];
}

export interface SellerStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  revenueGrowth: number;
  orderGrowth: number;
  payoutBalance: number;
  pendingPayout: number;
  recentOrders: Order[];
  topProducts: Product[];
  revenueByMonth: MonthlyData[];
  ordersByStatus: StatusCount[];
}

export interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
}

export interface StatusCount {
  status: string;
  count: number;
  color: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  fill?: boolean;
}

export type PageType = 'landing' | 'admin' | 'seller';

export interface Route {
  path: string;
  page: PageType;
  title: string;
  requiresAuth?: boolean;
  roles?: ('admin' | 'seller')[];
}