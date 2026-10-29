// Landing Page

import { createElement, on } from '../utils/dom';
import { createHeader } from '../components/Header';
import { createFooter } from '../components/Footer';
import { createButton } from '../components/Button';
import { createInfoCard, createIcon } from '../components/Card';

export default {
  render: (container: HTMLElement) => {
    const user = null; // No user on landing page
    const header = createHeader({ currentPage: 'landing', user });

    const main = createElement('main', { class: 'main' }, [
      // Hero Section
      createElement('section', { class: 'hero' }, [
        createElement('div', { class: 'hero-container' }, [
          createElement('div', { class: 'hero-content' }, [
            createElement('span', { class: 'hero-badge' }, '✨ New: Vanilla TypeScript Dashboard'),
            createElement('h1', { class: 'hero-title' }, 'Build Beautiful Dashboards Without Frameworks'),
            createElement('p', { class: 'hero-description' }, 'A modern, performant admin dashboard built with pure TypeScript. No React, no Vue, no build complexity — just clean, typed code that runs everywhere.'),
            createElement('div', { class: 'hero-actions' }, [
              createButton({
                children: 'View Admin Demo',
                variant: 'primary',
                size: 'lg',
                onClick: () => window.location.hash = '#/admin',
              }),
              createButton({
                children: 'View Seller Demo',
                variant: 'secondary',
                size: 'lg',
                onClick: () => window.location.hash = '#/seller',
              }),
            ]),
            createElement('p', { class: 'hero-note' }, 'No signup required — explore instantly with mock data'),
          ]),
          createElement('div', { class: 'hero-visual' }, [
            createElement('div', { class: 'dashboard-preview' }, [
              createElement('div', { class: 'preview-header' }, [
                createElement('div', { class: 'preview-dots' }, [
                  createElement('span', {}),
                  createElement('span', {}),
                  createElement('span', {}),
                ]),
                createElement('div', { class: 'preview-url' }, 'dashboard.app/admin'),
              ]),
              createElement('div', { class: 'preview-content' }, [
                createElement('div', { class: 'preview-sidebar' }, [
                  createElement('div', { class: 'preview-nav-item active' }),
                  createElement('div', { class: 'preview-nav-item' }),
                  createElement('div', { class: 'preview-nav-item' }),
                  createElement('div', { class: 'preview-nav-item' }),
                ]),
                createElement('div', { class: 'preview-main' }, [
                  createElement('div', { class: 'preview-stats' }, [
                    createElement('div', { class: 'preview-stat' }),
                    createElement('div', { class: 'preview-stat' }),
                    createElement('div', { class: 'preview-stat' }),
                    createElement('div', { class: 'preview-stat' }),
                  ]),
                  createElement('div', { class: 'preview-chart' }),
                  createElement('div', { class: 'preview-table' }, [
                    createElement('div', { class: 'preview-table-header' }),
                    createElement('div', { class: 'preview-table-row' }),
                    createElement('div', { class: 'preview-table-row' }),
                    createElement('div', { class: 'preview-table-row' }),
                  ]),
                ]),
              ]),
            ]),
          ]),
        ]),
      ]),

      // Features Section
      createElement('section', { class: 'features' }, [
        createElement('div', { class: 'container' }, [
          createElement('div', { class: 'section-header' }, [
            createElement('h2', { class: 'section-title' }, 'Everything You Need'),
            createElement('p', { class: 'section-description' }, 'Production-ready components built with vanilla TypeScript and modern CSS'),
          ]),
          createElement('div', { class: 'features-grid' }, [
            createInfoCard({
              icon: createIcon('chart', 32),
              title: 'Real-time Charts',
              description: 'Beautiful, responsive charts using Canvas API — no Chart.js dependency, zero bundle size impact.',
              iconBg: 'var(--color-primary-light)',
            }),
            createInfoCard({
              icon: createIcon('settings', 32),
              title: 'Type-Safe',
              description: 'Full TypeScript support with strict mode. Catch bugs at compile time, not runtime.',
              iconBg: 'var(--color-success-light)',
            }),
            createInfoCard({
              icon: createIcon('growth', 32),
              title: 'Zero Dependencies',
              description: 'No UI frameworks, no heavy libraries. Just ~15KB gzipped for the entire application.',
              iconBg: 'var(--color-warning-light)',
            }),
            createInfoCard({
              icon: createIcon('users', 32),
              title: 'Responsive Design',
              description: 'Mobile-first approach with CSS Grid and Flexbox. Works perfectly on all screen sizes.',
              iconBg: 'var(--color-purple-light)',
            }),
            createInfoCard({
              icon: createIcon('products', 32),
              title: 'Component Library',
              description: 'Reusable components: Tables, Cards, Buttons, Forms, Modals, Dropdowns, and more.',
              iconBg: 'var(--color-cyan-light)',
            }),
            createInfoCard({
              icon: createIcon('revenue', 32),
              title: 'Dark Mode Ready',
              description: 'Built-in dark mode support with CSS variables. Respects system preference automatically.',
              iconBg: 'var(--color-pink-light)',
            }),
          ]),
        ]),
      ]),

      // Demo Section
      createElement('section', { class: 'demo-section' }, [
        createElement('div', { class: 'container' }, [
          createElement('div', { class: 'demo-cards' }, [
            createElement('div', { class: 'demo-card admin' }, [
              createElement('div', { class: 'demo-card-header' }, [
                createElement('span', { class: 'demo-badge' }, 'Admin Dashboard'),
                createElement('h3', {}, 'Complete Admin Panel'),
              ]),
              createElement('ul', { class: 'demo-features' }, [
                createElement('li', {}, '📊 Revenue analytics & charts'),
                createElement('li', {}, '👥 User & seller management'),
                createElement('li', {}, '📦 Order monitoring'),
                createElement('li', {}, '📈 Growth metrics'),
              ]),
              createButton({
                children: 'Try Admin Dashboard',
                variant: 'primary',
                onClick: () => window.location.hash = '#/admin',
                fullWidth: true,
              }),
            ]),
            createElement('div', { class: 'demo-card seller' }, [
              createElement('div', { class: 'demo-card-header' }, [
                createElement('span', { class: 'demo-badge seller' }, 'Seller Dashboard'),
                createElement('h3', {}, 'Seller Management'),
              ]),
              createElement('ul', { class: 'demo-features' }, [
                createElement('li', {}, '📦 Product CRUD management'),
                createElement('li', {}, '📋 Order fulfillment workflow'),
                createElement('li', {}, '💰 Payout tracking'),
                createElement('li', {}, '📊 Sales analytics'),
              ]),
              createButton({
                children: 'Try Seller Dashboard',
                variant: 'secondary',
                onClick: () => window.location.hash = '#/seller',
                fullWidth: true,
              }),
            ]),
          ]),
        ]),
      ]),

      // Tech Stack
      createElement('section', { class: 'tech-stack' }, [
        createElement('div', { class: 'container' }, [
          createElement('div', { class: 'section-header' }, [
            createElement('h2', { class: 'section-title' }, 'Built With Modern Standards'),
            createElement('p', { class: 'section-description' }, 'No legacy code, no technical debt — just modern web platform APIs'),
          ]),
          createElement('div', { class: 'tech-grid' }, ...[
            ['TypeScript 5.5', 'Static typing with latest features'],
            ['Vite 5', 'Lightning-fast build tool'],
            ['ES Modules', 'Native module system'],
            ['CSS Variables', 'Dynamic theming system'],
            ['Canvas API', 'Hardware-accelerated charts'],
            ['IntersectionObserver', 'Performance optimization'],
            ['ResizeObserver', 'Responsive components'],
            ['localStorage', 'Client-side persistence'],
          ].map(([title, desc]) => createElement('div', { class: 'tech-item' }, [
            createElement('h4', {}, title),
            createElement('p', {}, desc),
          ]))),
        ]),
      ]),

      // CTA Section
      createElement('section', { class: 'cta-section' }, [
        createElement('div', { class: 'container' }, [
          createElement('div', { class: 'cta-content' }, [
            createElement('h2', {}, 'Ready to Build Your Own?'),
            createElement('p', {}, 'Clone the repository, run npm install, and start customizing in minutes.'),
            createElement('div', { class: 'cta-actions' }, [
              createButton({
                children: 'View on GitHub',
                variant: 'primary',
                size: 'lg',
                icon: createElement('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'currentColor' }, [
                  createElement('path', { d: 'M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z' }),
                ]),
                iconPosition: 'right',
              }),
              createButton({
                children: 'Read Documentation',
                variant: 'secondary',
                size: 'lg',
              }),
            ]),
          ]),
        ]),
      ]),
    ]);

    const footer = createFooter();

    container.appendChild(header);
    container.appendChild(main);
    container.appendChild(footer);
  },

  destroy: () => {
    // Cleanup if needed
  },
};