// DOM helper utilities - permissive types for easier usage

export function createElement(
  tag: string,
  attributes: Record<string, any> = {},
  ...children: any[]
): HTMLElement {
  const isSvg = ['svg', 'path', 'rect', 'circle', 'g', 'line', 'polygon', 'polyline', 'text', 'defs', 'use', 'symbol', 'marker', 'mask', 'clipPath', 'filter', 'linearGradient', 'radialGradient', 'stop', 'foreignObject'].includes(tag);

  const element = isSvg
    ? document.createElementNS('http://www.w3.org/2000/svg', tag)
    : document.createElement(tag);

  Object.entries(attributes).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === 'class') {
      (element as HTMLElement).className = String(value);
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign((element as HTMLElement).style, value);
    } else if (key.startsWith('data-') || key.startsWith('aria-')) {
      element.setAttribute(key, String(value));
    } else {
      element.setAttribute(key, String(value));
    }
  });

  function flattenChildren(arr: any[]): any[] {
    return arr.flatMap(child => {
      if (child === null || child === undefined) return [];
      return Array.isArray(child) ? flattenChildren(child) : [child];
    });
  }

  const allChildren = flattenChildren(children);
  allChildren.forEach(child => {
    if (child === null || child === undefined) return;
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element as HTMLElement;
}

export function createElementNS(
  namespace: string,
  tag: string,
  attributes: Record<string, string> = {},
  children: any[] = []
): Element {
  const element = document.createElementNS(namespace, tag);

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  children.forEach(child => {
    if (child === null || child === undefined) return;
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });

  return element;
}

export function qs<T extends Element>(selector: string, parent: Element | Document = document): T | null {
  return parent.querySelector<T>(selector);
}

export function qsa<T extends Element>(selector: string, parent: Element | Document = document): NodeListOf<T> {
  return parent.querySelectorAll<T>(selector);
}

export function on<K extends keyof HTMLElementEventMap>(
  element: Element | Document | null,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  if (!element) return () => {};
  element.addEventListener(event, handler as EventListener, options);
  return () => element.removeEventListener(event, handler as EventListener, options);
}

export function delegate<K extends keyof HTMLElementEventMap>(
  parent: Element,
  selector: string,
  event: K,
  handler: (event: HTMLElementEventMap[K], target: Element) => void
): () => void {
  const listener = (event: Event) => {
    const target = event.target as Element;
    const matched = target.closest(selector);
    if (matched && parent.contains(matched)) {
      handler(event as HTMLElementEventMap[K], matched);
    }
  };
  parent.addEventListener(event, listener);
  return () => parent.removeEventListener(event, listener);
}

export function addClass(element: Element, ...classes: string[]): void {
  element.classList.add(...classes);
}

export function removeClass(element: Element, ...classes: string[]): void {
  element.classList.remove(...classes);
}

export function toggleClass(element: Element, className: string, force?: boolean): boolean {
  return element.classList.toggle(className, force);
}

export function hasClass(element: Element, className: string): boolean {
  return element.classList.contains(className);
}

export function setStyles(element: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
  Object.assign(element.style, styles);
}

export function getRect(element: Element): DOMRect {
  return element.getBoundingClientRect();
}

export function isVisible(element: Element): boolean {
  const rect = getRect(element);
  return rect.width > 0 && rect.height > 0;
}

export function scrollIntoView(element: Element, options?: ScrollIntoViewOptions): void {
  element.scrollIntoView({ behavior: 'smooth', block: 'nearest', ...options });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

export function formatRelativeTime(dateString: string): string {
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
  return formatDate(dateString);
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function generateId(prefix = ''): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}