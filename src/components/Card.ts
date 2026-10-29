// Card component

import { createElement } from '../utils/dom';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: HTMLElement | HTMLElement[];
  footer?: HTMLElement;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function createCard(props: CardProps): HTMLElement {
  const { title, subtitle, children, footer, className = '', hoverable = false, onClick } = props;

  const cardClasses = ['card', className, hoverable ? 'card-hoverable' : ''].filter(Boolean).join(' ');

  const card = createElement('div', { class: cardClasses }, [
    (title || subtitle) ? createElement('div', { class: 'card-header' }, [
      title && createElement('h3', { class: 'card-title' }, title),
      subtitle && createElement('p', { class: 'card-subtitle' }, subtitle),
    ]) : null,
    createElement('div', { class: 'card-body' }, Array.isArray(children) ? children : [children]),
    footer ? createElement('div', { class: 'card-footer' }, [footer]) : null,
  ].filter(Boolean)) as HTMLElement;

  if (onClick && hoverable) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', onClick);
  }

  return card;
}

// Stat card for dashboards
export interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: Element;
  iconBg?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export function createStatCard(props: StatCardProps): HTMLElement {
  const { label, value, change, changeLabel, icon, iconBg, trend = 'neutral' } = props;

  const trendColors = {
    up: 'var(--color-success)',
    down: 'var(--color-error)',
    neutral: 'var(--color-text-muted)',
  };

  const trendIcons = {
    up: createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      createElement('path', { d: 'M18 15l-6-6-6 6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    ]),
    down: createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      createElement('path', { d: 'M6 9l6 6 6-6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    ]),
    neutral: createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
      createElement('path', { d: 'M5 12h14', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    ]),
  };

  return createElement('div', { class: 'stat-card' }, [
    createElement('div', { class: 'stat-card-content' }, [
      createElement('div', { class: 'stat-label' }, label),
      createElement('div', { class: 'stat-value' }, String(value)),
    ]),
    icon && createElement('div', { class: 'stat-icon', style: { backgroundColor: iconBg || 'var(--color-primary-light)' } }, [icon]),
    (change !== undefined || changeLabel) && createElement('div', { class: 'stat-change', style: { color: trendColors[trend] } }, [
      trendIcons[trend],
      change !== undefined && createElement('span', {}, `${change >= 0 ? '+' : ''}${change}%`),
      changeLabel && createElement('span', {}, ` ${changeLabel}`),
    ]),
  ]);
}

// Chart card for dashboards
export interface ChartCardProps {
  title: string;
  subtitle?: string;
  chart: HTMLElement;
  footer?: HTMLElement;
  className?: string;
}

export function createChartCard(props: ChartCardProps): HTMLElement {
  const { title, subtitle, chart, footer, className = '' } = props;

  return createElement('div', { class: `chart-card ${className}` }, [
    createElement('div', { class: 'chart-card-header' }, [
      createElement('div', {}, [
        createElement('h3', { class: 'chart-card-title' }, title),
        subtitle && createElement('p', { class: 'chart-card-subtitle' }, subtitle),
      ]),
    ]),
    createElement('div', { class: 'chart-card-body' }, [chart]),
    footer && createElement('div', { class: 'chart-card-footer' }, [footer]),
  ]);
}

// Simple card with icon and text
export interface InfoCardProps {
  icon: Element;
  title: string;
  description: string;
  iconBg?: string;
  onClick?: () => void;
}

export function createInfoCard(props: InfoCardProps): HTMLElement {
  const { icon, title, description, iconBg, onClick } = props;

  const card = createElement('div', { class: 'info-card' }, [
    createElement('div', { class: 'info-card-icon', style: { backgroundColor: iconBg || 'var(--color-primary-light)' } }, [icon]),
    createElement('h4', { class: 'info-card-title' }, title),
    createElement('p', { class: 'info-card-description' }, description),
  ]);

  if (onClick) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', onClick);
  }

  return card;
}

// Helper to create icon elements
export function createIcon(name: string, size = 24): Element {
  const icons: Record<string, string> = {
    users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 0 1 0-8 4 4 0 0 1 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    revenue: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z',
    orders: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
    products: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    growth: 'M18 20V10M12 20V4M6 20v-6',
    settings: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.15a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.09-.15a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 6a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
    chart: 'M3 3v18h18M19 19l-7-7-4 4-6-6',
  };

  const path = icons[name] || icons.chart;

  return createElement('svg', {
    width: String(size),
    height: String(size),
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
  }, [
    createElement('path', { d: path }),
  ]);
}