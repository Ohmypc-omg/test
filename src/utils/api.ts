// Mock API layer with localStorage persistence

import type { User, Seller, Product, Order, AdminStats, SellerStats, MonthlyData, StatusCount } from '../types';

// Generate unique IDs
function generateId(prefix = ''): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

// Initial mock data
const initialUsers: User[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: '2024-01-15T10:00:00Z', status: 'active' },
  { id: 'user-2', name: 'John Seller', email: 'john@example.com', role: 'seller', createdAt: '2024-02-20T14:30:00Z', status: 'active' },
  { id: 'user-3', name: 'Jane Seller', email: 'jane@example.com', role: 'seller', createdAt: '2024-03-10T09:15:00Z', status: 'active' },
  { id: 'user-4', name: 'Bob Customer', email: 'bob@example.com', role: 'customer', createdAt: '2024-04-05T16:45:00Z', status: 'active' },
  { id: 'user-5', name: 'Alice Customer', email: 'alice@example.com', role: 'customer', createdAt: '2024-05-12T11:20:00Z', status: 'inactive' },
];

const initialSellers: Seller[] = [
  {
    id: initialUsers[1]!.id,
    name: initialUsers[1]!.name,
    email: initialUsers[1]!.email,
    role: 'seller',
    createdAt: initialUsers[1]!.createdAt,
    status: initialUsers[1]!.status,
    storeName: 'John\'s Electronics',
    storeDescription: 'Best deals on electronics and gadgets',
    rating: 4.8,
    totalSales: 125000,
    payoutBalance: 12500,
    verified: true,
  },
  {
    id: initialUsers[2]!.id,
    name: initialUsers[2]!.name,
    email: initialUsers[2]!.email,
    role: 'seller',
    createdAt: initialUsers[2]!.createdAt,
    status: initialUsers[2]!.status,
    storeName: 'Jane\'s Fashion Boutique',
    storeDescription: 'Trendy fashion for modern women',
    rating: 4.9,
    totalSales: 98000,
    payoutBalance: 8900,
    verified: true,
  },
];

const initialProducts: Product[] = [
  {
    id: 'prod-1',
    sellerId: 'user-2',
    name: 'Wireless Headphones Pro',
    description: 'Premium noise-cancelling wireless headphones with 30hr battery life',
    price: 299.99,
    originalPrice: 399.99,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    stock: 45,
    sold: 234,
    rating: 4.7,
    reviewCount: 89,
    status: 'active',
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-05-15T14:30:00Z',
  },
  {
    id: 'prod-2',
    sellerId: 'user-2',
    name: 'Smart Watch Series 5',
    description: 'Latest smartwatch with health monitoring and GPS',
    price: 449.99,
    category: 'Electronics',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'],
    stock: 32,
    sold: 156,
    rating: 4.5,
    reviewCount: 67,
    status: 'active',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-05-10T14:30:00Z',
  },
  {
    id: 'prod-3',
    sellerId: 'user-3',
    name: 'Floral Summer Dress',
    description: 'Light and breezy floral dress perfect for summer',
    price: 59.99,
    originalPrice: 79.99,
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400'],
    stock: 78,
    sold: 432,
    rating: 4.9,
    reviewCount: 156,
    status: 'active',
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-05-20T14:30:00Z',
  },
  {
    id: 'prod-4',
    sellerId: 'user-3',
    name: 'Leather Handbag',
    description: 'Genuine leather handbag with multiple compartments',
    price: 189.99,
    category: 'Fashion',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400'],
    stock: 25,
    sold: 89,
    rating: 4.8,
    reviewCount: 45,
    status: 'active',
    createdAt: '2024-04-10T10:00:00Z',
    updatedAt: '2024-05-18T14:30:00Z',
  },
];

const initialOrders: Order[] = [
  {
    id: 'order-1',
    sellerId: 'user-2',
    customerId: 'user-4',
    customerName: 'Bob Customer',
    customerEmail: 'bob@example.com',
    items: [
      { productId: 'prod-1', productName: 'Wireless Headphones Pro', productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', quantity: 1, price: 299.99, total: 299.99 },
    ],
    subtotal: 299.99,
    tax: 24.00,
    shipping: 9.99,
    total: 333.98,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: { street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
    billingAddress: { street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
    createdAt: '2024-05-10T10:00:00Z',
    updatedAt: '2024-05-15T14:30:00Z',
    shippedAt: '2024-05-12T10:00:00Z',
    deliveredAt: '2024-05-14T16:00:00Z',
  },
  {
    id: 'order-2',
    sellerId: 'user-2',
    customerId: 'user-5',
    customerName: 'Alice Customer',
    customerEmail: 'alice@example.com',
    items: [
      { productId: 'prod-2', productName: 'Smart Watch Series 5', productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', quantity: 1, price: 449.99, total: 449.99 },
    ],
    subtotal: 449.99,
    tax: 36.00,
    shipping: 9.99,
    total: 495.98,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zipCode: '90001', country: 'USA' },
    billingAddress: { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zipCode: '90001', country: 'USA' },
    createdAt: '2024-05-12T10:00:00Z',
    updatedAt: '2024-05-14T14:30:00Z',
    shippedAt: '2024-05-13T10:00:00Z',
  },
  {
    id: 'order-3',
    sellerId: 'user-3',
    customerId: 'user-4',
    customerName: 'Bob Customer',
    customerEmail: 'bob@example.com',
    items: [
      { productId: 'prod-3', productName: 'Floral Summer Dress', productImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', quantity: 2, price: 59.99, total: 119.98 },
    ],
    subtotal: 119.98,
    tax: 9.60,
    shipping: 5.99,
    total: 135.57,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: { street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
    billingAddress: { street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
    createdAt: '2024-05-14T10:00:00Z',
    updatedAt: '2024-05-14T14:30:00Z',
  },
  {
    id: 'order-4',
    sellerId: 'user-3',
    customerId: 'user-4',
    customerName: 'Bob Customer',
    customerEmail: 'bob@example.com',
    items: [
      { productId: 'prod-4', productName: 'Leather Handbag', productImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', quantity: 1, price: 189.99, total: 189.99 },
    ],
    subtotal: 189.99,
    tax: 15.20,
    shipping: 9.99,
    total: 215.18,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: { street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
    billingAddress: { street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-05-15T14:30:00Z',
  },
];

// Storage keys
const STORAGE_KEYS = {
  USERS: 'app_users',
  SELLERS: 'app_sellers',
  PRODUCTS: 'app_products',
  ORDERS: 'app_orders',
} as const;

// Initialize data in localStorage if not exists
function initializeData(): void {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SELLERS)) {
    localStorage.setItem(STORAGE_KEYS.SELLERS, JSON.stringify(initialSellers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
  }
}

// Generic storage helpers
function getFromStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Initialize on module load
initializeData();

// API functions
export const api = {
  // Users
  getUsers(): User[] {
    return getFromStorage<User>(STORAGE_KEYS.USERS);
  },

  getUserById(id: string): User | undefined {
    return this.getUsers().find(u => u.id === id);
  },

  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  },

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: generateId('user-'),
      createdAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.USERS, [...users, newUser]);
    return newUser;
  },

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    const updated = { ...users[index], ...updates } as User;
    users[index] = updated;
    saveToStorage(STORAGE_KEYS.USERS, users);
    return updated;
  },

  deleteUser(id: string): boolean {
    const users = this.getUsers().filter(u => u.id !== id);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return true;
  },

  // Sellers
  getSellers(): Seller[] {
    return getFromStorage<Seller>(STORAGE_KEYS.SELLERS);
  },

  getSellerById(id: string): Seller | undefined {
    return this.getSellers().find(s => s.id === id);
  },

  updateSeller(id: string, updates: Partial<Seller>): Seller | null {
    const sellers = this.getSellers();
    const index = sellers.findIndex(s => s.id === id);
    if (index === -1) return null;
    const updated = { ...sellers[index], ...updates } as Seller;
    sellers[index] = updated;
    saveToStorage(STORAGE_KEYS.SELLERS, sellers);
    // Also update in users
    this.updateUser(id, updates);
    return updated;
  },

  // Products
  getProducts(): Product[] {
    return getFromStorage<Product>(STORAGE_KEYS.PRODUCTS);
  },

  getProductsBySeller(sellerId: string): Product[] {
    return this.getProducts().filter(p => p.sellerId === sellerId);
  },

  getProductById(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id);
  },

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'sold' | 'rating' | 'reviewCount'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: generateId('prod-'),
      sold: 0,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.PRODUCTS, [...products, newProduct]);
    return newProduct;
  },

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    const updated = { ...products[index], ...updates, updatedAt: new Date().toISOString() } as Product;
    products[index] = updated;
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    return updated;
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts().filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    return true;
  },

  // Orders
  getOrders(): Order[] {
    return getFromStorage<Order>(STORAGE_KEYS.ORDERS);
  },

  getOrdersBySeller(sellerId: string): Order[] {
    return this.getOrders().filter(o => o.sellerId === sellerId);
  },

  getOrdersByCustomer(customerId: string): Order[] {
    return this.getOrders().filter(o => o.customerId === customerId);
  },

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find(o => o.id === id);
  },

  createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      ...order,
      id: generateId('order-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.ORDERS, [...orders, newOrder]);
    return newOrder;
  },

  updateOrder(id: string, updates: Partial<Order>): Order | null {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    const updated = { ...orders[index], ...updates, updatedAt: new Date().toISOString() } as Order;
    orders[index] = updated;
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return updated;
  },

  // Admin Stats
  getAdminStats(): AdminStats {
    const users = this.getUsers();
    const sellers = this.getSellers();
    const orders = this.getOrders();
    const products = this.getProducts();

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
    const topSellers = [...sellers].sort((a, b) => b.totalSales - a.totalSales).slice(0, 5);

    // Revenue by month (last 6 months)
    const revenueByMonth: MonthlyData[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const monthOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
      });
      const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);
      revenueByMonth.push({ month: monthStr, revenue: monthRevenue, orders: monthOrders.length });
    }

    // Orders by status
    const statusCounts: Record<string, number> = {};
    orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
    const statusColors: Record<string, string> = {
      pending: '#F59E0B',
      confirmed: '#3B82F6',
      processing: '#8B5CF6',
      shipped: '#06B6D4',
      delivered: '#10B981',
      cancelled: '#EF4444',
      refunded: '#6B7280',
    };
    const ordersByStatus: StatusCount[] = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      color: statusColors[status] || '#6B7280',
    }));

    return {
      totalUsers: users.length,
      totalSellers: sellers.length,
      totalOrders: orders.length,
      totalRevenue,
      revenueGrowth: 12.5,
      userGrowth: 8.2,
      orderGrowth: 15.3,
      sellerGrowth: 5.1,
      recentOrders,
      topSellers,
      revenueByMonth,
      ordersByStatus,
    };
  },

  // Seller Stats
  getSellerStats(sellerId: string): SellerStats {
    const seller = this.getSellerById(sellerId);
    const products = this.getProductsBySeller(sellerId);
    const orders = this.getOrdersBySeller(sellerId);
    const activeProducts = products.filter(p => p.status === 'active');

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);
    const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
    const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
    const pendingPayout = orders
      .filter(o => o.paymentStatus === 'paid' && o.status !== 'refunded')
      .reduce((sum, o) => sum + o.total * 0.9, 0); // 90% to seller

    // Revenue by month (last 6 months)
    const revenueByMonth: MonthlyData[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const monthOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
      });
      const monthRevenue = monthOrders.reduce((sum, o) => sum + o.total, 0);
      revenueByMonth.push({ month: monthStr, revenue: monthRevenue, orders: monthOrders.length });
    }

    // Orders by status
    const statusCounts: Record<string, number> = {};
    orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
    const statusColors: Record<string, string> = {
      pending: '#F59E0B',
      confirmed: '#3B82F6',
      processing: '#8B5CF6',
      shipped: '#06B6D4',
      delivered: '#10B981',
      cancelled: '#EF4444',
      refunded: '#6B7280',
    };
    const ordersByStatus: StatusCount[] = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
      color: statusColors[status] || '#6B7280',
    }));

    return {
      totalProducts: products.length,
      activeProducts: activeProducts.length,
      totalOrders: orders.length,
      pendingOrders,
      totalRevenue,
      revenueGrowth: 18.2,
      orderGrowth: 22.1,
      payoutBalance: seller?.payoutBalance || 0,
      pendingPayout,
      recentOrders,
      topProducts,
      revenueByMonth,
      ordersByStatus,
    };
  },
};

// Simulate async API calls
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function asyncApi<T>(fn: () => T, ms = 300): Promise<T> {
  await delay(ms);
  return fn();
}