// Admin Dashboard Page

import { createElement, on, qs } from '../utils/dom';
import { createHeader, updateHeaderActiveLink } from '../components/Header';
import { createFooter } from '../components/Footer';
import { createStatCard, createChartCard, createIcon } from '../components/Card';
import { createButton, createDropdownButton, createIconButton } from '../components/Button';
import { createTable, orderColumns, userColumns } from '../components/Table';
import { createChart, createRevenueChartData, createOrdersChartData } from '../components/Chart';
import { api, asyncApi } from '../utils/api';
import { appState } from '../utils/state';
import { getRouter } from '../router';
import type { Order, User, AdminStats } from '../types';

let stats: AdminStats | null = null;
let statsTable: ReturnType<typeof createTable<Order>> | null = null;
let usersTable: ReturnType<typeof createTable<User>> | null = null;
let revenueChart: HTMLElement | null = null;
let ordersChart: HTMLElement | null = null;
let sidebarOpen = false;

export default {
  render: async (container: HTMLElement) => {
    const user = appState.currentUser.get();
    const header = createHeader({ currentPage: 'admin', user });

    // Load stats
    stats = await asyncApi(() => api.getAdminStats());

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
              createElement('span', { class: 'logo-text' }, 'Admin'),
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
                createElement('a', { class: 'nav-link', href: '#orders' }, [
                  createIcon('orders', 20),
                  createElement('span', {}, 'Orders'),
                ]),
              ]),
              createElement('li', { class: 'nav-item' }, [
                createElement('a', { class: 'nav-link', href: '#users' }, [
                  createIcon('users', 20),
                  createElement('span', {}, 'Users'),
                ]),
              ]),
              createElement('li', { class: 'nav-item' }, [
                createElement('a', { class: 'nav-link', href: '#sellers' }, [
                  createIcon('users', 20),
                  createElement('span', {}, 'Sellers'),
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
              createElement('div', { class: 'user-avatar' }, user?.name?.charAt(0).toUpperCase() || 'A'),
              createElement('div', { class: 'user-info' }, [
                createElement('span', { class: 'user-name' }, user?.name || 'Admin'),
                createElement('span', { class: 'user-role' }, 'Administrator'),
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
              createElement('input', { type: 'search', placeholder: 'Search...', class: 'search-input', 'aria-label': 'Search' }),
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
                  icon: createElement('div', { class: 'user-avatar-sm' }, user?.name?.charAt(0).toUpperCase() || 'A'),
                },
                items: [
                  { label: 'Profile', icon: createIcon('users', 16) },
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
                createElement('h1', { class: 'page-title' }, 'Dashboard'),
                createElement('p', { class: 'page-description' }, 'Overview of your platform metrics and activity'),
              ]),
              createElement('div', { class: 'page-actions' }, [
                createButton({
                  children: 'Export Report',
                  variant: 'secondary',
                  icon: createIcon('chart', 18),
                }),
                createButton({
                  children: 'Refresh',
                  variant: 'outline',
                  icon: createIcon('growth', 18),
                  onClick: () => loadStats(),
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
                label: 'Total Users',
                value: stats?.totalUsers || 0,
                change: stats?.userGrowth,
                changeLabel: 'vs last month',
                trend: stats && stats.userGrowth >= 0 ? 'up' : 'down',
                icon: createIcon('users', 24),
                iconBg: 'var(--color-warning-light)',
              }),
              createStatCard({
                label: 'Active Sellers',
                value: stats?.totalSellers || 0,
                change: stats?.sellerGrowth,
                changeLabel: 'vs last month',
                trend: stats && stats.sellerGrowth >= 0 ? 'up' : 'down',
                icon: createIcon('products', 24),
                iconBg: 'var(--color-purple-light)',
              }),
            ]),

            // Charts row
            createElement('div', { class: 'charts-grid' }, [
              // Revenue Chart
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
                  title: 'Revenue Overview',
                  subtitle: 'Monthly revenue for the last 6 months',
                  chart,
                });
              })(),

              // Orders Chart
              (() => {
                const chartData = createOrdersChartData(
                  stats?.revenueByMonth.map(m => m.month) || [],
                  stats?.revenueByMonth.map(m => m.orders) || []
                );
                const chart = createChart({
                  data: chartData,
                  type: 'bar',
                  width: 600,
                  height: 300,
                  showLegend: false,
                });
                ordersChart = chart;
                return createChartCard({
                  title: 'Orders Overview',
                  subtitle: 'Monthly order volume for the last 6 months',
                  chart,
                });
              })(),
            ]),

            // Tables row
            createElement('div', { class: 'tables-grid' }, [
              // Recent Orders
              (() => {
                const table = createTable<Order>({
                  columns: orderColumns,
                  data: stats?.recentOrders || [],
                  keyField: 'id',
                  pageSize: 5,
                  showPagination: true,
                  rowClick: (order) => console.log('Order clicked', order),
                  striped: true,
                  hoverable: true,
                });
                statsTable = table;
                return createChartCard({
                  title: 'Recent Orders',
                  subtitle: 'Latest orders across all sellers',
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

              // Top Users
              (() => {
                const table = createTable<User>({
                  columns: userColumns,
                  data: api.getUsers(),
                  keyField: 'id',
                  pageSize: 5,
                  showPagination: true,
                  rowClick: (user) => console.log('User clicked', user),
                  striped: true,
                  hoverable: true,
                });
                usersTable = table;
                return createChartCard({
                  title: 'All Users',
                  subtitle: 'Platform users and their roles',
                  chart: table,
                  footer: createElement('div', { class: 'table-footer' }, [
                    createButton({
                      children: 'Manage Users',
                      variant: 'ghost',
                      size: 'sm',
                    }),
                  ]),
                });
              })(),
            ]),
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

      // Sidebar links navigate within this dashboard without replacing the app route hash.
      sidebar.querySelectorAll<HTMLAnchorElement>('.nav-link').forEach(link => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const href = link.getAttribute('href') || '#/';
          const targetTitles: Record<string, string> = {
            '#orders': 'Recent Orders',
            '#users': 'All Users',
            '#sellers': 'All Users',
            '#analytics': 'Revenue Overview',
          };
          let target: HTMLElement | null = null;
          if (href === '#/') {
            target = container.querySelector<HTMLElement>('.dashboard-page');
          } else if (href === '#analytics') {
            target = container.querySelector<HTMLElement>('.charts-grid');
          } else if (href === '#settings') {
            target = container.querySelector<HTMLElement>('.dashboard-topbar');
          } else {
            const title = targetTitles[href];
            target = title
              ? Array.from(container.querySelectorAll<HTMLElement>('.chart-card'))
                  .find(card => card.querySelector('.chart-card-title')?.textContent?.trim() === title) || null
              : null;
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

    // Update header active link
    updateHeaderActiveLink('admin');
  },

  destroy: () => {
    // Cleanup charts
    if (revenueChart && (revenueChart as any)._chartDestroy) {
      (revenueChart as any)._chartDestroy();
    }
    if (ordersChart && (ordersChart as any)._chartDestroy) {
      (ordersChart as any)._chartDestroy();
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

async function loadStats(): Promise<void> {
  stats = await asyncApi(() => api.getAdminStats());
  // Refresh would re-render - in a real app we'd update the UI directly
}