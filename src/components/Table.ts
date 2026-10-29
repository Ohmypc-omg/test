// Table component

import { createElement, on, addClass, removeClass } from '../utils/dom';
import { formatCurrency, formatDate, formatRelativeTime } from '../utils/dom';
import type { Order, Product, User, Seller } from '../types';

export interface Column<T> {
  key: string;
  header: string;
  render?: (value: unknown, row: T, index: number) => HTMLElement | string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: string;
  sortable?: boolean;
  pageSize?: number;
  showPagination?: boolean;
  emptyMessage?: string;
  rowClick?: (row: T) => void;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
}

interface TableState<T> {
  sortKey: string | null;
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  pageSize: number;
}

export function createTable<T>(props: TableProps<T>): HTMLElement {
  const {
    columns,
    data,
    keyField,
    sortable = true,
    pageSize = 10,
    showPagination = true,
    emptyMessage = 'No data available',
    rowClick,
    striped = true,
    hoverable = true,
    className = '',
  } = props;

  // State
  const state: TableState<T> = {
    sortKey: null,
    sortDirection: 'asc',
    currentPage: 1,
    pageSize,
  };

  // Get sorted and paginated data
  const getProcessedData = (): T[] => {
    let processed = [...data];

    // Sort
    if (state.sortKey) {
      const column = columns.find(c => c.key === state.sortKey);
      if (column && column.sortable) {
        processed.sort((a, b) => {
          const aVal = (a as Record<string, unknown>)[state.sortKey!];
          const bVal = (b as Record<string, unknown>)[state.sortKey!];

          if (aVal == null && bVal == null) return 0;
          if (aVal == null) return 1;
          if (bVal == null) return -1;

          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return state.sortDirection === 'asc' ? comparison : -comparison;
        });
      }
    }

    // Paginate
    if (showPagination) {
      const start = (state.currentPage - 1) * state.pageSize;
      const end = start + state.pageSize;
      processed = processed.slice(start, end);
    }

    return processed;
  };

  // Create table element
  const tableContainer = createElement('div', { class: `table-container ${className}` });

  const table = createElement('table', { class: 'table' }, [
    // Header
    createElement('thead', {}, [
      createElement('tr', {},
        columns.map(col => createElement('th', {
          class: `th-${col.align || 'left'} ${col.sortable ? 'sortable' : ''} ${col.className || ''}`,
          style: col.width ? { width: col.width } : {},
          scope: 'col',
        }, [
          createElement('div', { class: 'th-content' }, [
            createElement('span', { class: 'th-text' }, col.header),
            col.sortable && createElement('span', { class: 'sort-icon' }, [
              createElement('svg', { width: '14', height: '14', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
                createElement('path', { d: 'M6 9l6 6 6-6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
              ]),
            ]),
          ]),
        ]))
      ),
    ]),
    // Body
    createElement('tbody', { class: 'table-body' }, []),
  ]);

  tableContainer.appendChild(table);

  const tbody = table.querySelector('tbody')!;
  const thead = table.querySelector('thead')!;

  // Render function
  const render = () => {
    const processedData = getProcessedData();

    if (processedData.length === 0) {
      tbody.innerHTML = '';
      const colCount = columns.length;
      tbody.appendChild(createElement('tr', {}, [
        createElement('td', { class: 'empty-state', colSpan: String(colCount) }, [
          createElement('div', { class: 'empty-content' }, [
            createElement('svg', { class: 'empty-icon', width: '48', height: '48', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' }, [
              createElement('path', { d: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 7v3', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
            ]),
            createElement('p', {}, emptyMessage),
          ]),
        ]),
      ]));
    } else {
      tbody.innerHTML = '';
      processedData.forEach((row, index) => {
        const rowRecord = row as Record<string, unknown>;
        const rowEl = createElement('tr', {
          class: `${striped && index % 2 === 1 ? 'striped' : ''} ${hoverable ? 'hoverable' : ''} ${rowClick ? 'clickable' : ''}`,
          'data-key': String(rowRecord[keyField]),
        },
          columns.map(col => {
            const value = (row as Record<string, unknown>)[col.key];
            let cellContent: HTMLElement | string;

            if (col.render) {
              const rendered = col.render(value, row, index);
              cellContent = typeof rendered === 'string' ? rendered : rendered;
            } else {
              cellContent = formatCellValue(value, col.key);
            }

            return createElement('td', {
              class: `td-${col.align || 'left'} ${col.className || ''}`,
            }, [cellContent]);
          })
        );

        if (rowClick) {
          rowEl.style.cursor = 'pointer';
          rowEl.addEventListener('click', () => rowClick(row));
        }

        tbody.appendChild(rowEl);
      });
    }

    // Update sort indicators
    updateSortIndicators();
    updatePagination();
  };

  // Sort handling
  if (sortable) {
    const sortableHeaders = thead.querySelectorAll('th.sortable') as NodeListOf<HTMLTableCellElement>;
    sortableHeaders.forEach((th: HTMLTableCellElement) => {
      on(th, 'click', () => {
        const columnKey = th.getAttribute('data-key') || '';
        const column = columns.find(c => c.key === columnKey);
        if (!column || !column.sortable) return;

        if (state.sortKey === columnKey) {
          state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          state.sortKey = columnKey;
          state.sortDirection = 'asc';
        }
        render();
      });

      // Store column key for sort handling
      const columnKey = columns[Array.from(thead.querySelectorAll('th')).indexOf(th)]?.key;
      if (columnKey) th.setAttribute('data-key', columnKey);
    });
  }

  // Sort indicators
  function updateSortIndicators(): void {
    const sortableHeaders = thead.querySelectorAll('th.sortable') as NodeListOf<HTMLTableCellElement>;
    sortableHeaders.forEach((th: HTMLTableCellElement) => {
      const columnKey = th.getAttribute('data-key') || '';
      const sortIcon = th.querySelector('.sort-icon svg') as HTMLElement | null;

      if (state.sortKey === columnKey) {
        addClass(th, 'sorted');
        if (sortIcon) {
          sortIcon.style.transform = state.sortDirection === 'asc' ? 'rotate(180deg)' : 'rotate(0deg)';
        }
      } else {
        removeClass(th, 'sorted');
        if (sortIcon) {
          sortIcon.style.transform = 'rotate(0deg)';
        }
      }
    });
  }

  // Pagination
  let paginationEl: HTMLElement | null = null;

  function updatePagination(): void {
    if (!showPagination) return;

    const totalPages = Math.ceil(data.length / state.pageSize);

    if (totalPages <= 1) {
      if (paginationEl) {
        paginationEl.remove();
        paginationEl = null;
      }
      return;
    }

    if (!paginationEl) {
      paginationEl = createElement('div', { class: 'table-pagination' }) as HTMLElement;
      tableContainer.appendChild(paginationEl);
    }

    const pages = getPageNumbers(state.currentPage, totalPages);

    paginationEl!.innerHTML = '';
    paginationEl!.appendChild(createElement('div', { class: 'pagination-info' }, [
      createElement('span', {}, `Showing ${(state.currentPage - 1) * state.pageSize + 1} to ${Math.min(state.currentPage * state.pageSize, data.length)} of ${data.length} entries`),
    ]));

    const paginationControls = createElement('div', { class: 'pagination-controls' });

    // Previous button
    const prevBtn = createElement('button', {
      class: `btn btn-sm btn-secondary ${state.currentPage === 1 ? 'disabled' : ''}`,
      type: 'button',
      disabled: state.currentPage === 1,
      'aria-label': 'Previous page',
    }, 'Previous');

    on(prevBtn, 'click', () => {
      if (state.currentPage > 1) {
        state.currentPage--;
        render();
      }
    });

    paginationControls.appendChild(prevBtn);

    // Page numbers
    pages.forEach(page => {
      if (page === '...') {
        paginationControls.appendChild(createElement('span', { class: 'pagination-ellipsis' }, '...'));
      } else {
        const pageBtn = createElement('button', {
          class: `btn btn-sm ${page === state.currentPage ? 'btn-primary' : 'btn-secondary'}`,
          type: 'button',
          'aria-label': `Page ${page}`,
          'aria-current': page === state.currentPage ? 'page' : undefined,
        }, String(page));

        on(pageBtn, 'click', () => {
          state.currentPage = page;
          render();
        });

        paginationControls.appendChild(pageBtn);
      }
    });

    // Next button
    const nextBtn = createElement('button', {
      class: `btn btn-sm btn-secondary ${state.currentPage === totalPages ? 'disabled' : ''}`,
      type: 'button',
      disabled: state.currentPage === totalPages,
      'aria-label': 'Next page',
    }, 'Next');

    on(nextBtn, 'click', () => {
      if (state.currentPage < totalPages) {
        state.currentPage++;
        render();
      }
    });

    paginationControls.appendChild(nextBtn);
    paginationEl!.appendChild(paginationControls);
  }

  function getPageNumbers(current: number, total: number): (number | '...')[] {
    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);

      if (current > 3) pages.push('...');

      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (current < total - 2) pages.push('...');

      pages.push(total);
    }

    return pages;
  }

  // Initial render
  render();

  // Return table with methods
  return Object.assign(tableContainer, {
    refresh: render,
    setData: (newData: T[]) => {
      data.length = 0;
      data.push(...newData);
      state.currentPage = 1;
      render();
    },
    getState: () => ({ ...state }),
  }) as HTMLElement & {
    refresh: () => void;
    setData: (newData: T[]) => void;
    getState: () => { sortKey: string | null; sortDirection: 'asc' | 'desc'; currentPage: number; pageSize: number };
  };
}

// Format cell values based on key
function formatCellValue(value: unknown, key: string): string {
  if (value == null) return '—';

  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') {
    if (key.includes('price') || key.includes('total') || key.includes('revenue') || key.includes('balance') || key.includes('payout')) {
      return formatCurrency(value);
    }
    return value.toLocaleString();
  }
  if (value instanceof Date) return formatDate(value.toISOString());
  if (typeof value === 'string' && key.includes('At') && value.includes('T')) {
    return formatRelativeTime(value);
  }
  if (typeof value === 'string' && key === 'status') {
    return `<span class="badge badge-${value}">${value}</span>`;
  }
  return String(value);
}

// Predefined column creators for common types
export const orderColumns: Column<Order>[] = [
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
    return createElement('span', { class: `badge ${badges[status] || 'badge-gray'}` }, status.charAt(0).toUpperCase() + status.slice(1)) as HTMLElement;
  }},
  { key: 'paymentStatus', header: 'Payment', width: '120px', render: (v) => {
    const status = v as string;
    const badges: Record<string, string> = {
      pending: 'badge-warning',
      paid: 'badge-success',
      failed: 'badge-error',
      refunded: 'badge-gray',
    };
    return createElement('span', { class: `badge ${badges[status] || 'badge-gray'}` }, status.charAt(0).toUpperCase() + status.slice(1)) as HTMLElement;
  }},
  { key: 'createdAt', header: 'Date', width: '140px', render: (v) => formatRelativeTime(v as string) },
];

export const productColumns: Column<Product>[] = [
  { key: 'images', header: '', width: '60px', render: (v) => {
    const images = v as string[];
    return createElement('img', { src: images[0] || '', alt: 'Product', class: 'product-thumb' }) as HTMLElement;
  }},
  { key: 'name', header: 'Product', render: (v, row) => {
    const product = row as Product;
    return createElement('div', {}, [
      createElement('strong', {}, product.name),
      createElement('span', { class: 'product-category' }, product.category),
    ]) as HTMLElement;
  }},
  { key: 'price', header: 'Price', align: 'right', width: '100px', render: (v) => formatCurrency(v as number) },
  { key: 'stock', header: 'Stock', align: 'center', width: '80px', render: (v) => {
    const stock = v as number;
    const cls = stock === 0 ? 'text-error' : stock < 10 ? 'text-warning' : '';
    return createElement('span', { class: cls }, String(stock)) as HTMLElement;
  }},
  { key: 'sold', header: 'Sold', align: 'center', width: '80px' },
  { key: 'rating', header: 'Rating', align: 'center', width: '80px', render: (v) => {
    const rating = v as number;
    return createElement('span', {}, `${rating.toFixed(1)} ⭐`) as HTMLElement;
  }},
  { key: 'status', header: 'Status', width: '100px', render: (v) => {
    const status = v as string;
    const badges: Record<string, string> = {
      active: 'badge-success',
      draft: 'badge-gray',
      archived: 'badge-warning',
    };
    return createElement('span', { class: `badge ${badges[status] || 'badge-gray'}` }, status.charAt(0).toUpperCase() + status.slice(1)) as HTMLElement;
  }},
];

export const userColumns: Column<User>[] = [
  { key: 'id', header: 'ID', width: '100px' },
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role', width: '100px', render: (v) => {
    const role = v as string;
    const badges: Record<string, string> = {
      admin: 'badge-purple',
      seller: 'badge-info',
      customer: 'badge-gray',
    };
    return createElement('span', { class: `badge ${badges[role] || 'badge-gray'}` }, role.charAt(0).toUpperCase() + role.slice(1)) as HTMLElement;
  }},
  { key: 'status', header: 'Status', width: '100px', render: (v) => {
    const status = v as string;
    const badges: Record<string, string> = {
      active: 'badge-success',
      inactive: 'badge-gray',
      suspended: 'badge-error',
    };
    return createElement('span', { class: `badge ${badges[status] || 'badge-gray'}` }, status.charAt(0).toUpperCase() + status.slice(1)) as HTMLElement;
  }},
  { key: 'createdAt', header: 'Joined', width: '140px', render: (v) => formatDate(v as string) },
];