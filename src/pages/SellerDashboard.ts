// Seller Dashboard Page

import { createElement, on, qs } from '../utils/dom';
import { createHeader, updateHeaderActiveLink } from '../components/Header';
import { createFooter } from '../components/Footer';
import { createStatCard, createChartCard, createIcon, createCard } from '../components/Card';
import { createButton, createDropdownButton, createIconButton } from '../components/Button';
import { createTable, productColumns } from '../components/Table';
import { createChart, createRevenueChartData, createMiniChart } from '../components/Chart';
import { api, asyncApi } from '../utils/api';
import { appState } from '../utils/state';
import { getRouter } from '../router';
import type { Order, Product, SellerStats } from '../types';

let stats: SellerStats | null = null;
let productsTable: ReturnType<typeof createTable<Product>> | null = null;
let ordersTable: ReturnType<typeof createTable<Order>> | null = null;
let revenueChart: HTMLElement | null = null;
let sidebarOpen = false;

export default {
  render: async (container: HTMLElement) => {
    const user = appState.currentUser.get();
    const header = createHeader({ currentPage: 'seller', user });

    // Load seller stats
    const sellerId = user?.id || 'user-2';
    stats = await asyncApi(() => api.getSellerStats(sellerId));

    const main = createElement('main', { class: 'main dashboard-main' }, [
      createElement('div', { class: 'dashboard-layout' }, [
        // Sidebar
        createElement('aside', { class: `dashboard-sidebar ${sidebarOpen ? 'open' : ''}`, id: 'sidebar' }, [
          createElement('div', { class: 'sidebar-header' }, [
            createElement('a', { class: 'sidebar-logo', href: '#/' }, [
              createElement('svg', { class: 'logo-icon', viewBox: '0 0 32 32', fill: 'none', width: '28', height: '28' }, [
                createElement('rect', { width: '32', height: '32', rx: '8', fill: 'currentColor' }),
                createElement('path', { d: 'M8 12h16M8 16h12M8 20h8', stroke: 'white', 'stroke-width': '2', 'stroke-linecap': 'round' }),
              ]),
              createElement('span', { class: 'logo-text' }, 'Seller'),
            ]),
          ]),
          createElement('nav', { class: 'sidebar-nav' }, [
            createElement('ul', { class: 'nav-list' }, [
              createElement('li', { class: 'nav-item' }, [
                createElement('a', { class: 'nav-link active', href: '#/' }, [
                  createIcon('chart', 20),
                  createElement('span', {}, 'Overview'),
                ]),
              ]),
              createElement('li', { class: 'nav-item' }, [
                createElement('a', { class: 'nav-link', href: '#products' }, [
                  createIcon('products', 20),
                  createElement('span', {}, 'Products'),
                ]),
              ]),
              createElement('li', { class: 'nav-item' }, [
                createElement('a', { class: 'nav-link', href: '#orders' }, [
                  createIcon('orders', 20),
                  createElement('span', {}, 'Orders'),
                ]),
              ]),
              createElement('li', { class: 'nav-item' }, [
                createElement('a', { class: 'nav-link', href: '#payouts' }, [
                  createIcon('revenue', 20),
                  createElement('span', {}, 'Payouts'),
                ]),
              ]),
              createElement('li', { class: 'nav-item' }, [
                createElement('a', { class: 'nav-link', href: '#analytics' }, [
                  createIcon('growth', 20),
                  createElement('span', {}, 'Analytics'),
                ]),
              ]),
              createElement('li', { class: 'nav-item' }, [
                createElement('a', { class: 'nav-link', href: '#settings' }, [
                  createIcon('settings', 20),
                  createElement('span', {}, 'Settings'),
                ]),
              ]),
            ]),
          ]),
          createElement('div', { class: 'sidebar-footer' }, [
            createElement('a', { class: 'sidebar-user', href: '#/' }, [
              createElement('div', { class: 'user-avatar' }, user?.name?.charAt(0).toUpperCase() || 'S'),
              createElement('div', { class: 'user-info' }, [
                createElement('span', { class: 'user-name' }, user?.name || 'Seller'),
                createElement('span', { class: 'user-role' }, 'Seller'),
              ]),
            ]),
          ]),
        ]),

        // Sidebar overlay for mobile
        createElement('div', { class: 'sidebar-overlay', id: 'sidebarOverlay' }),

        // Main content
        createElement('div', { class: 'dashboard-content' }, [
          // Top bar
          createElement('header', { class: 'dashboard-topbar' }, [
            createElement('button', { class: 'sidebar-toggle', id: 'sidebarToggle', 'aria-label': 'Toggle sidebar' }, [
              createIcon('chart', 24),
            ]),
            createElement('div', { class: 'topbar-search' }, [
              createIcon('settings', 20),
              createElement('input', { type: 'search', placeholder: 'Search products...', class: 'search-input', 'aria-label': 'Search products' }),
            ]),
            createElement('div', { class: 'topbar-actions' }, [
              createIconButton({
                icon: createIcon('chart', 20),
                'aria-label': 'Notifications',
                onClick: () => {},
              }),
              createDropdownButton({
                trigger: {
                  children: '',
                  variant: 'ghost',
                  size: 'md',
                  icon: createElement('div', { class: 'user-avatar-sm' }, user?.name?.charAt(0).toUpperCase() || 'S'),
                },
                items: [
                  { label: 'My Store', icon: createIcon('products', 16) },
                  { label: 'Settings', icon: createIcon('settings', 16) },
                  { divider: true },
                  { label: 'Logout', icon: createIcon('chart', 16), danger: true, onClick: () => {
                    appState.currentUser.set(null);
                    getRouter().navigate('/');
                  }},
                ],
              }),
            ]),
          ]),

          // Page content
          createElement('div', { class: 'dashboard-page' }, [
            // Page header
            createElement('div', { class: 'page-header' }, [
              createElement('div', {}, [
                createElement('h1', { class: 'page-title' }, 'Seller Dashboard'),
                createElement('p', { class: 'page-description' }, 'Manage your store, track sales, and fulfill orders'),
              ]),
              createElement('div', { class: 'page-actions' }, [
                createButton({
                  children: 'Add Product',
                  variant: 'primary',
                  icon: createIcon('products', 18),
                  onClick: () => openProductModal(),
                }),
              ]),
            ]),

            // Stats cards
            createElement('div', { class: 'stats-grid' }, [
              createStatCard({
                label: 'Total Revenue',
                value: stats ? formatCurrency(stats.totalRevenue) : '$0',
                change: stats?.revenueGrowth,
                changeLabel: 'vs last month',
                trend: stats && stats.revenueGrowth >= 0 ? 'up' : 'down',
                icon: createIcon('revenue', 24),
                iconBg: 'var(--color-primary-light)',
              }),
              createStatCard({
                label: 'Total Orders',
                value: stats?.totalOrders || 0,
                change: stats?.orderGrowth,
                changeLabel: 'vs last month',
                trend: stats && stats.orderGrowth >= 0 ? 'up' : 'down',
                icon: createIcon('orders', 24),
                iconBg: 'var(--color-success-light)',
              }),
              createStatCard({
                label: 'Active Products',
                value: stats?.activeProducts || 0,
                icon: createIcon('products', 24),
                iconBg: 'var(--color-warning-light)',
              }),
              createStatCard({
                label: 'Pending Payout',
                value: stats ? formatCurrency(stats.pendingPayout) : '$0',
                icon: createIcon('revenue', 24),
                iconBg: 'var(--color-purple-light)',
              }),
            ]),

            // Charts row
            createElement('div', { class: 'charts-grid' }, [
              // Sales Chart
              (() => {
                const chartData = createRevenueChartData(
                  stats?.revenueByMonth.map(m => m.month) || [],
                  stats?.revenueByMonth.map(m => m.revenue) || []
                );
                const chart = createChart({
                  data: chartData,
                  type: 'area',
                  width: 600,
                  height: 300,
                  showLegend: false,
                });
                revenueChart = chart;
                return createChartCard({
                  title: 'Sales Overview',
                  subtitle: 'Monthly revenue for the last 6 months',
                  chart,
                });
              })(),

              // Orders by Status
              (() => {
                const statusData = stats?.ordersByStatus || [];
                const chartData = {
                  labels: statusData.map(s => s.status.charAt(0).toUpperCase() + s.status.slice(1)),
                  datasets: [{
                    label: 'Orders',
                    data: statusData.map(s => s.count),
                    borderColor: statusData[0]?.color || '#4F46E5',
                    backgroundColor: statusData[0]?.color || '#4F46E5',
                    fill: false,
                  }],
                };
                const chart = createChart({
                  data: chartData,
                  type: 'bar',
                  width: 600,
                  height: 300,
                  showLegend: false,
                });
                return createChartCard({
                  title: 'Orders by Status',
                  subtitle: 'Current order distribution',
                  chart,
                });
              })(),
            ]),

            // Products table
            (() => {
              const products = api.getProductsBySeller(sellerId);
              const table = createTable<Product>({
                columns: productColumns,
                data: products,
                keyField: 'id',
                pageSize: 5,
                showPagination: true,
                rowClick: (product) => openProductModal(product),
                striped: true,
                hoverable: true,
              });
              productsTable = table;
              return createChartCard({
                title: 'Your Products',
                subtitle: 'Manage your product catalog',
                chart: table,
                footer: createElement('div', { class: 'table-footer' }, [
                  createButton({
                    children: 'Add Product',
                    variant: 'primary',
                    size: 'sm',
                    icon: createIcon('products', 16),
                    onClick: () => openProductModal(),
                  }),
                ]),
              });
            })(),

            // Recent Orders table
            (() => {
              const orders = api.getOrdersBySeller(sellerId).slice(0, 10);
              const table = createTable<Order>({
                columns: [
                  { key: 'id', header: 'Order ID', width: '120px' },
                  { key: 'customerName', header: 'Customer' },
                  { key: 'total', header: 'Total', align: 'right', render: (v) => formatCurrency(v as number) },
                  { key: 'status', header: 'Status', width: '120px', render: (v) => {
                    const status = v as string;
                    const badges: Record<string, string> = {
                      pending: 'badge-warning',
                      confirmed: 'badge-info',
                      processing: 'badge-purple',
                      shipped: 'badge-cyan',
                      delivered: 'badge-success',
                      cancelled: 'badge-error',
                      refunded: 'badge-gray',
                    };
                    return createElement('span', { class: `badge ${badges[status] || 'badge-gray'}` }, status.charAt(0).toUpperCase() + status.slice(1));
                  }},
                  { key: 'createdAt', header: 'Date', width: '140px', render: (v) => formatRelativeTime(v as string) },
                  { key: 'actions', header: 'Actions', width: '140px', render: (_, row) => {
                    const order = row as Order;
                    return createDropdownButton({
                      trigger: {
                        children: 'Actions',
                        variant: 'outline',
                        size: 'sm',
                      },
                      items: getOrderActions(order),
                      align: 'right',
                    });
                  }},
                ],
                data: orders,
                keyField: 'id',
                pageSize: 5,
                showPagination: true,
                striped: true,
                hoverable: true,
              });
              ordersTable = table;
              return createChartCard({
                title: 'Recent Orders',
                subtitle: 'Latest orders for your store',
                chart: table,
                footer: createElement('div', { class: 'table-footer' }, [
                  createButton({
                    children: 'View All Orders',
                    variant: 'ghost',
                    size: 'sm',
                  }),
                ]),
              });
            })(),
          ]),
        ]),
      ]),
    ]);

    const footer = createFooter();

    container.appendChild(header);
    container.appendChild(main);
    container.appendChild(footer);

    // Event listeners
    const sidebarToggle = container.querySelector('#sidebarToggle') as HTMLButtonElement;
    const sidebar = container.querySelector('#sidebar') as HTMLElement;
    const sidebarOverlay = container.querySelector('#sidebarOverlay') as HTMLElement;

    if (sidebarToggle && sidebar && sidebarOverlay) {
      const toggleSidebar = () => {
        sidebarOpen = !sidebarOpen;
        sidebar.classList.toggle('open', sidebarOpen);
        sidebarOverlay.classList.toggle('open', sidebarOpen);
        sidebarToggle.setAttribute('aria-expanded', String(sidebarOpen));
      };

      sidebarToggle.addEventListener('click', toggleSidebar);
      sidebarOverlay.addEventListener('click', toggleSidebar);

      sidebar.querySelectorAll<HTMLAnchorElement>('.nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const href = link.getAttribute('href') || '#/';
          const targetTitles: Record<string, string> = {
            '#products': 'Your Products',
            '#orders': 'Recent Orders',
            '#analytics': 'Sales Overview',
          };
          let target: HTMLElement | null = null;
          if (href === '#/') {
            target = container.querySelector<HTMLElement>('.dashboard-page');
          } else if (href === '#payouts') {
            target = Array.from(container.querySelectorAll<HTMLElement>('.stat-card'))
              .find(card => card.querySelector('.stat-label')?.textContent?.trim() === 'Pending Payout') || null;
          } else if (href === '#settings') {
            target = container.querySelector<HTMLElement>('.dashboard-topbar');
          } else {
            const title = targetTitles[href];
            target = title
              ? Array.from(container.querySelectorAll<HTMLElement>('.chart-card'))
                  .find(card => card.querySelector('.chart-card-title')?.textContent?.trim() === title) || null
              : null;
            if (href === '#analytics') target = container.querySelector<HTMLElement>('.charts-grid');
          }
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          sidebar.querySelectorAll('.nav-link').forEach(navLink => navLink.classList.toggle('active', navLink === link));

          if (window.innerWidth < 1024) {
            sidebarOpen = false;
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('open');
            sidebarToggle.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }

    updateHeaderActiveLink('seller');
  },

  destroy: () => {
    if (revenueChart && (revenueChart as any)._chartDestroy) {
      (revenueChart as any)._chartDestroy();
    }
    sidebarOpen = false;
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getOrderActions(order: Order) {
  const items = [];

  if (order.status === 'pending') {
    items.push({ label: 'Confirm Order', icon: createIcon('chart', 16), onClick: () => updateOrderStatus(order.id, 'confirmed') });
    items.push({ label: 'Cancel Order', icon: createIcon('chart', 16), danger: true, onClick: () => updateOrderStatus(order.id, 'cancelled') });
  } else if (order.status === 'confirmed') {
    items.push({ label: 'Start Processing', icon: createIcon('chart', 16), onClick: () => updateOrderStatus(order.id, 'processing') });
  } else if (order.status === 'processing') {
    items.push({ label: 'Mark as Shipped', icon: createIcon('chart', 16), onClick: () => updateOrderStatus(order.id, 'shipped') });
  } else if (order.status === 'shipped') {
    items.push({ label: 'Mark as Delivered', icon: createIcon('chart', 16), onClick: () => updateOrderStatus(order.id, 'delivered') });
  }

  items.push({ divider: true });
  items.push({ label: 'View Details', icon: createIcon('chart', 16), onClick: () => console.log('View order', order.id) });

  return items;
}

function updateOrderStatus(orderId: string, status: Order['status']): void {
  api.updateOrder(orderId, { status });
  // In a real app, we'd refresh the table
  console.log(`Order ${orderId} updated to ${status}`);
}

function openProductModal(product?: Product): void {
  const isEditing = !!product;
  const modal = createElement('div', { class: 'modal-overlay' }, [
    createElement('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'modal-title' }, [
      createElement('div', { class: 'modal-header' }, [
        createElement('h2', { id: 'modal-title', class: 'modal-title' }, isEditing ? 'Edit Product' : 'Add Product'),
        createElement('button', { class: 'modal-close', 'aria-label': 'Close' }, [
          createIcon('chart', 20),
        ]),
      ]),
      createElement('form', { class: 'modal-body', id: 'productForm' }, [
        createElement('div', { class: 'form-group' }, [
          createElement('label', { for: 'productName', class: 'form-label' }, 'Product Name'),
          createElement('input', { type: 'text', id: 'productName', name: 'name', class: 'form-input', required: '', value: product?.name || '', placeholder: 'Enter product name' }),
        ]),
        createElement('div', { class: 'form-group' }, [
          createElement('label', { for: 'productDescription', class: 'form-label' }, 'Description'),
          createElement('textarea', { id: 'productDescription', name: 'description', class: 'form-input', rows: 3, placeholder: 'Enter product description' }, product?.description || ''),
        ]),
        createElement('div', { class: 'form-row' }, [
          createElement('div', { class: 'form-group' }, [
            createElement('label', { for: 'productPrice', class: 'form-label' }, 'Price ($)'),
            createElement('input', { type: 'number', id: 'productPrice', name: 'price', class: 'form-input', required: '', step: '0.01', min: '0', value: product?.price || '', placeholder: '0.00' }),
          ]),
          createElement('div', { class: 'form-group' }, [
            createElement('label', { for: 'productStock', class: 'form-label' }, 'Stock'),
            createElement('input', { type: 'number', id: 'productStock', name: 'stock', class: 'form-input', required: '', min: '0', value: product?.stock || '', placeholder: '0' }),
          ]),
        ]),
        createElement('div', { class: 'form-group' }, [
          createElement('label', { for: 'productCategory', class: 'form-label' }, 'Category'),
          createElement('select', { id: 'productCategory', name: 'category', class: 'form-input' }, [
            createElement('option', { value: 'Electronics' }, 'Electronics'),
            createElement('option', { value: 'Fashion' }, 'Fashion'),
            createElement('option', { value: 'Home & Garden' }, 'Home & Garden'),
            createElement('option', { value: 'Sports' }, 'Sports'),
            createElement('option', { value: 'Beauty' }, 'Beauty'),
          ]),
        ]),
        createElement('div', { class: 'form-group' }, [
          createElement('label', { for: 'productStatus', class: 'form-label' }, 'Status'),
          createElement('select', { id: 'productStatus', name: 'status', class: 'form-input' }, [
            createElement('option', { value: 'active' }, 'Active'),
            createElement('option', { value: 'draft' }, 'Draft'),
            createElement('option', { value: 'archived' }, 'Archived'),
          ]),
        ]),
      ]),
      createElement('div', { class: 'modal-footer' }, [
        createButton({ children: 'Cancel', variant: 'secondary', type: 'button', onClick: () => modal.remove() }),
        createButton({ children: isEditing ? 'Save Changes' : 'Create Product', variant: 'primary', type: 'submit', form: 'productForm' }),
      ]),
    ]),
  ]);

  document.body.appendChild(modal);

  // Focus management
  const firstInput = modal.querySelector('input, select, textarea') as HTMLElement;
  firstInput?.focus();

  // Close handlers
  const closeModal = () => modal.remove();
  modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
  modal.querySelector('.modal-overlay')?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Form submission
  const form = modal.querySelector('#productForm') as HTMLFormElement;
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const productData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      stock: parseInt(formData.get('stock') as string),
      category: formData.get('category') as string,
      status: formData.get('status') as Product['status'],
      sellerId: appState.currentUser.get()?.id || 'user-2',
      images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
    };

    if (isEditing && product) {
      api.updateProduct(product.id, productData);
    } else {
      api.createProduct(productData);
    }

    closeModal();
    // In a real app, refresh the table
  });

  // Escape key
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
  };
  document.addEventListener('keydown', handleEscape);
  modal.addEventListener('remove', () => document.removeEventListener('keydown', handleEscape));
}