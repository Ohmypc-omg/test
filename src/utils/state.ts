// Simple reactive state management

type Listener<T> = (value: T) => void;

export class State<T> {
  private value: T;
  private listeners: Set<Listener<T>> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(newValue: T | ((prev: T) => T)): void {
    const nextValue = typeof newValue === 'function'
      ? (newValue as (prev: T) => T)(this.value)
      : newValue;

    if (nextValue !== this.value) {
      this.value = nextValue;
      this.listeners.forEach(listener => listener(this.value));
    }
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // For derived state
  map<U>(fn: (value: T) => U): State<U> {
    const derived = new State(fn(this.value));
    this.subscribe(value => derived.set(fn(value)));
    return derived;
  }
}

export function createState<T>(initialValue: T): State<T> {
  return new State(initialValue);
}

// Global app state
export const appState = {
  currentUser: createState<User | null>(null),
  currentPage: createState<string>('landing'),
  isSidebarOpen: createState(false),
  theme: createState<'light' | 'dark'>('light'),
  notifications: createState<Notification[]>([]),
};

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// Theme persistence
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  appState.theme.set(savedTheme || (prefersDark ? 'dark' : 'light'));

  appState.theme.subscribe(theme => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  });

  // Initialize theme on load
  document.documentElement.setAttribute('data-theme', appState.theme.get());
}

// Notification helpers
export function showNotification(
  message: string,
  type: Notification['type'] = 'info',
  duration = 5000
): void {
  const notification: Notification = {
    id: generateId('notif-'),
    type,
    message,
    duration,
  };

  const current = appState.notifications.get();
  appState.notifications.set([...current, notification]);

  if (duration > 0) {
    setTimeout(() => {
      const updated = appState.notifications.get().filter(n => n.id !== notification.id);
      appState.notifications.set(updated);
    }, duration);
  }
}

function generateId(prefix = ''): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 9)}`;
}

// User type for app state
import type { User } from '../types';