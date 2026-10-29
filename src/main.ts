// Application Entry Point

import './styles/main.css';
import './styles/components.css';
import './styles/pages.css';
import { initRouter } from './router';
import { appState } from './utils/state';

// Initialize router
const router = initRouter();

// Set initial user for demo (in a real app, this would come from auth)
function initializeDemoUser(): void {
  // Check if user is already set (e.g., from previous session)
  const existingUser = appState.currentUser.get();
  if (!existingUser) {
    // For demo purposes, we'll let the user navigate to dashboards without auth
    // The router guards will handle access control
  }
}

// Handle theme
function initializeTheme(): void {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');

  document.documentElement.setAttribute('data-theme', theme);
  appState.theme.set(theme);

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      appState.theme.set(newTheme);
    }
  });
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});

// Initialize app
function initApp(): void {
  initializeTheme();
  initializeDemoUser();

  // Make router globally accessible for debugging
  (window as any).__router = router;
  (window as any).__appState = appState;

  console.log('🚀 Dashboard App initialized');
  console.log('📦 Vanilla TypeScript + Vite');
  console.log('🎨 No frameworks, just pure TS');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

export { router, appState };