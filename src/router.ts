// Client-side hash-based router

import type { Route, PageType } from './types';
import { appState } from './utils/state';
import { api } from './utils/api';

type PageModule = {
  default: {
    render: (container: HTMLElement) => void | Promise<void>;
    destroy?: () => void;
  };
};

// Explicit loaders keep Vite's build-time code splitting reliable.
const pageLoaders: Record<PageType, () => Promise<PageModule>> = {
  landing: () => import('./pages/LandingPage'),
  admin: () => import('./pages/AdminDashboard'),
  seller: () => import('./pages/SellerDashboard'),
};

type RouteHandler = (params: Record<string, string>) => Promise<void>;

class Router {
  private routes: Map<string, RouteHandler> = new Map();
  private currentRoute: string = '';
  private currentParams: Record<string, string> = {};
  private pageCache: Map<string, PageModule> = new Map();
  private destroyFn: (() => void) | null = null;

  constructor(private routesConfig: Route[]) {
    this.routesConfig.forEach(route => this.addRoute(route));
    this.bindEvents();
    this.handleHashChange();
  }

  private addRoute(route: Route): void {
    const pattern = this.pathToRegex(route.path);
    this.routes.set(pattern, async (params) => {
      // This project is a public, client-side demo with mock data (not production auth).
      // Select the matching demo identity so the advertised dashboards work without signup.
      if (route.requiresAuth && route.roles?.length) {
        const requiredRole = route.roles[0];
        let user = appState.currentUser.get();
        if (!user || user.role !== requiredRole) {
          user = api.getUsers().find(candidate => candidate.role === requiredRole) ?? null;
          appState.currentUser.set(user);
        }
        if (!user) {
          this.navigate('/');
          return;
        }
      }

      await this.loadPage(route.page, params);
    });
  }

  private pathToRegex(path: string): string {
    return path
      .replace(/\//g, '\\/')
      .replace(/:(\w+)/g, '(?<$1>[^/]+)')
      .replace(/\*/g, '.*');
  }

  private matchRoute(hash: string): { handler: RouteHandler; params: Record<string, string> } | null {
    const path = hash.replace(/^#/, '') || '/';

    for (const [pattern, handler] of this.routes) {
      const regex = new RegExp(`^${pattern}$`);
      const match = path.match(regex);
      if (match) {
        return { handler, params: match.groups || {} };
      }
    }
    return null;
  }

  private async loadPage(page: PageType, params: Record<string, string>): Promise<void> {
    const container = document.getElementById('app');
    if (!container) return;

    // Clean up previous page
    if (this.destroyFn) {
      this.destroyFn();
      this.destroyFn = null;
    }

    // Show loading state
    container.innerHTML = '<div class="loading">Loading...</div>';

    try {
      // Dynamic import for code splitting, using explicit Vite-resolvable paths.
      let module: PageModule;
      if (this.pageCache.has(page)) {
        module = this.pageCache.get(page)!;
      } else {
        module = await pageLoaders[page]();
        this.pageCache.set(page, module);
      }

      // Render new page
      await module.default.render(container);
      this.destroyFn = module.default.destroy || null;
      this.currentRoute = page;
      this.currentParams = params;
      appState.currentPage.set(page);

      // Scroll to top
      window.scrollTo(0, 0);
    } catch (error) {
      console.error(`Failed to load page: ${page}`, error);
      container.innerHTML = '<div class="error">Failed to load page</div>';
    }
  }

  private bindEvents(): void {
    // The constructor handles the initial URL once; here we only observe later changes.
    window.addEventListener('hashchange', () => this.handleHashChange());
  }

  private handleHashChange(): void {
    const currentHash = window.location.hash;
    // Ignore ordinary in-page anchors (for example #orders); app routes use #/route.
    if (currentHash && !currentHash.startsWith('#/')) {
      // A direct visit to a legacy/ordinary anchor should still initialize the app.
      if (!this.currentRoute) this.navigate('/');
      return;
    }

    const hash = currentHash || '#/';
    const match = this.matchRoute(hash);
    if (match) {
      match.handler(match.params);
    } else {
      // 404 - redirect to landing
      this.navigate('/');
    }
  }

  navigate(path: string): void {
    window.location.hash = path;
  }

  getCurrentRoute(): string {
    return this.currentRoute;
  }

  getCurrentParams(): Record<string, string> {
    return this.currentParams;
  }
}

// Route configuration
export const routes: Route[] = [
  { path: '/', page: 'landing', title: 'Home' },
  { path: '/admin', page: 'admin', title: 'Admin Dashboard', requiresAuth: true, roles: ['admin'] },
  { path: '/seller', page: 'seller', title: 'Seller Dashboard', requiresAuth: true, roles: ['seller'] },
];

// Singleton instance
let routerInstance: Router | null = null;

export function getRouter(): Router {
  if (!routerInstance) {
    routerInstance = new Router(routes);
  }
  return routerInstance;
}

export function initRouter(): Router {
  return getRouter();
}