// Footer component

import { createElement } from '../utils/dom';

export function createFooter(): HTMLElement {
  const currentYear = new Date().getFullYear();

  return createElement('footer', { class: 'footer' }, [
    createElement('div', { class: 'footer-container' }, [
      // Brand section
      createElement('div', { class: 'footer-brand' }, [
        createElement('a', { class: 'footer-logo', href: '#/' }, [
          createElement('svg', { class: 'logo-icon', viewBox: '0 0 32 32', fill: 'none', width: '32', height: '32' }, [
            createElement('rect', { width: '32', height: '32', rx: '8', fill: 'currentColor' }),
            createElement('path', { d: 'M8 12h16M8 16h12M8 20h8', stroke: 'white', 'stroke-width': '2', 'stroke-linecap': 'round' }),
          ]),
          createElement('span', { class: 'logo-text' }, 'DashboardApp'),
        ]),
        createElement('p', { class: 'footer-tagline' }, 'Modern dashboards built with vanilla TypeScript.'),
        createElement('div', { class: 'footer-social' }, [
          createElement('a', { class: 'social-link', href: '#', 'aria-label': 'Twitter' }, [
            createElement('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'currentColor' }, [
              createElement('path', { d: 'M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' }),
            ]),
          ]),
          createElement('a', { class: 'social-link', href: '#', 'aria-label': 'GitHub' }, [
            createElement('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'currentColor' }, [
              createElement('path', { d: 'M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z' }),
            ]),
          ]),
          createElement('a', { class: 'social-link', href: '#', 'aria-label': 'LinkedIn' }, [
            createElement('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'currentColor' }, [
              createElement('path', { d: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z' }),
            ]),
          ]),
        ]),
      ]),

      // Links sections
      createElement('div', { class: 'footer-links' }, [
        createElement('div', { class: 'footer-column' }, [
          createElement('h4', { class: 'footer-title' }, 'Product'),
          createElement('ul', { class: 'footer-list' }, [
            createElement('li', {}, createElement('a', { href: '#' }, 'Features')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Pricing')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Integrations')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Changelog')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Roadmap')),
          ]),
        ]),
        createElement('div', { class: 'footer-column' }, [
          createElement('h4', { class: 'footer-title' }, 'Company'),
          createElement('ul', { class: 'footer-list' }, [
            createElement('li', {}, createElement('a', { href: '#' }, 'About')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Blog')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Careers')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Press')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Contact')),
          ]),
        ]),
        createElement('div', { class: 'footer-column' }, [
          createElement('h4', { class: 'footer-title' }, 'Resources'),
          createElement('ul', { class: 'footer-list' }, [
            createElement('li', {}, createElement('a', { href: '#' }, 'Documentation')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Help Center')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Community')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Webinars')),
            createElement('li', {}, createElement('a', { href: '#' }, 'API Reference')),
          ]),
        ]),
        createElement('div', { class: 'footer-column' }, [
          createElement('h4', { class: 'footer-title' }, 'Legal'),
          createElement('ul', { class: 'footer-list' }, [
            createElement('li', {}, createElement('a', { href: '#' }, 'Privacy Policy')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Terms of Service')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Cookie Policy')),
            createElement('li', {}, createElement('a', { href: '#' }, 'Security')),
          ]),
        ]),
      ]),

      // Bottom bar
      createElement('div', { class: 'footer-bottom' }, [
        createElement('p', { class: 'copyright' }, `© ${currentYear} DashboardApp. All rights reserved.`),
        createElement('div', { class: 'footer-badges' }, [
          createElement('span', { class: 'badge' }, 'Vanilla TypeScript'),
          createElement('span', { class: 'badge' }, 'No Framework'),
          createElement('span', { class: 'badge' }, 'Open Source'),
        ]),
      ]),
    ]),
  ]);
}