// Header navigation component

import { createElement, on, addClass, removeClass, toggleClass } from '../utils/dom';
import { appState } from '../utils/state';
import { getRouter } from '../router';
import type { NavItem } from '../types';

interface HeaderProps {
  currentPage: string;
  user?: { name: string; role: string } | null;
}

export function createHeader(props: HeaderProps): HTMLElement {
  const { currentPage, user } = props;

  const navItems: NavItem[] = [
    { label: 'Home', href: '#/' },
    { label: 'Admin Dashboard', href: '#/admin' },
    { label: 'Seller Dashboard', href: '#/seller' },
  ];

  const header = createElement('header', { class: 'header' }, [
    createElement('div', { class: 'header-container' }, [
      // Logo/Brand
      createElement('a', { class: 'header-logo', href: '#/' }, [
        createElement('svg', { class: 'logo-icon', viewBox: '0 0 32 32', fill: 'none', width: '32', height: '32' }, [
          createElement('rect', { width: '32', height: '32', rx: '8', fill: 'currentColor' }),
          createElement('path', { d: 'M8 12h16M8 16h12M8 20h8', stroke: 'white', 'stroke-width': '2', 'stroke-linecap': 'round' }),
        ]),
        createElement('span', { class: 'logo-text' }, 'DashboardApp'),
      ]),

      // Desktop Navigation
      createElement('nav', { class: 'header-nav desktop-nav' }, [
        createElement('ul', { class: 'nav-list' },
          navItems.map(item => createElement('li', { class: 'nav-item' }, [
            createElement('a', {
              class: `nav-link ${currentPage === item.href.replace('#/', '') || (item.href === '#/' && currentPage === 'landing') ? 'active' : ''}`,
              href: item.href
            }, item.label)
          ]))
        ),
      ]),

      // User menu / Auth buttons
      createElement('div', { class: 'header-actions' },
        user ? [
          createElement('div', { class: 'user-menu' }, [
            createElement('button', { class: 'user-menu-trigger', 'aria-expanded': 'false', 'aria-haspopup': 'true' }, [
              createElement('span', { class: 'user-avatar' }, user.name.charAt(0).toUpperCase()),
              createElement('span', { class: 'user-name' }, user.name),
              createElement('svg', { class: 'chevron-down', width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
                createElement('path', { d: 'M6 9l6 6 6-6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
              ]),
            ]),
            createElement('div', { class: 'user-dropdown', role: 'menu' }, [
              createElement('div', { class: 'dropdown-header' }, [
                createElement('span', { class: 'dropdown-name' }, user.name),
                createElement('span', { class: 'dropdown-role' }, user.role),
              ]),
              createElement('div', { class: 'dropdown-divider' }),
              createElement('a', { class: 'dropdown-item', href: '#/', role: 'menuitem' }, 'Profile'),
              createElement('a', { class: 'dropdown-item', href: '#/', role: 'menuitem' }, 'Settings'),
              createElement('div', { class: 'dropdown-divider' }),
              createElement('button', { class: 'dropdown-item logout-btn', role: 'menuitem' }, 'Logout'),
            ]),
          ]),
        ] : [
          createElement('a', { class: 'btn btn-secondary', href: '#/' }, 'Sign In'),
          createElement('a', { class: 'btn btn-primary', href: '#/' }, 'Get Started'),
        ]
      ),

      // Mobile menu toggle
      createElement('button', { class: 'mobile-menu-toggle', 'aria-label': 'Toggle menu', 'aria-expanded': 'false' }, [
        createElement('span', { class: 'hamburger' }),
      ]),
    ]),
  ]);

  // Mobile menu
  const mobileMenu = createElement('div', { class: 'mobile-menu', hidden: '' }, [
    createElement('nav', { class: 'mobile-nav' }, [
      createElement('ul', { class: 'nav-list' },
        navItems.map(item => createElement('li', { class: 'nav-item' }, [
          createElement('a', {
            class: `nav-link ${currentPage === item.href.replace('#/', '') || (item.href === '#/' && currentPage === 'landing') ? 'active' : ''}`,
            href: item.href
          }, item.label)
        ]))
      ),
      user ? [
        createElement('div', { class: 'mobile-user-info' }, [
          createElement('span', { class: 'user-avatar' }, user.name.charAt(0).toUpperCase()),
          createElement('div', {}, [
            createElement('span', { class: 'user-name' }, user.name),
            createElement('span', { class: 'user-role' }, user.role),
          ]),
        ]),
        createElement('button', { class: 'btn btn-outline logout-btn' }, 'Logout'),
      ] : [
        createElement('a', { class: 'btn btn-secondary btn-block', href: '#/' }, 'Sign In'),
        createElement('a', { class: 'btn btn-primary btn-block', href: '#/' }, 'Get Started'),
      ]
    ]),
  ]);

  header.appendChild(mobileMenu);

  // Event handlers
  const toggle = header.querySelector('.mobile-menu-toggle') as HTMLButtonElement;
  const mobileMenuEl = header.querySelector('.mobile-menu') as HTMLElement;
  const userMenuTrigger = header.querySelector('.user-menu-trigger') as HTMLButtonElement;
  const userDropdown = header.querySelector('.user-dropdown') as HTMLElement;
  const logoutBtns = header.querySelectorAll('.logout-btn');

  // Mobile menu toggle
  if (toggle && mobileMenuEl) {
    on(toggle, 'click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      if (isOpen) {
        mobileMenuEl.hidden = true;
        removeClass(header, 'mobile-menu-open');
      } else {
        mobileMenuEl.hidden = false;
        addClass(header, 'mobile-menu-open');
      }
    });
  }

  // User dropdown toggle
  if (userMenuTrigger && userDropdown) {
    on(userMenuTrigger, 'click', (e) => {
      e.stopPropagation();
      const isOpen = userMenuTrigger.getAttribute('aria-expanded') === 'true';
      userMenuTrigger.setAttribute('aria-expanded', String(!isOpen));
      toggleClass(userDropdown, 'open');
    });

    // Close dropdown on outside click
    on(document, 'click', () => {
      userMenuTrigger.setAttribute('aria-expanded', 'false');
      removeClass(userDropdown, 'open');
    });
  }

  // Logout buttons
  logoutBtns.forEach(btn => {
    on(btn, 'click', () => {
      appState.currentUser.set(null);
      getRouter().navigate('/');
    });
  });

  // Close mobile menu on nav link click
  const mobileNavLinks = header.querySelectorAll('.mobile-nav .nav-link');
  mobileNavLinks.forEach(link => {
    on(link, 'click', () => {
      if (mobileMenuEl && toggle) {
        mobileMenuEl.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        removeClass(header, 'mobile-menu-open');
      }
    });
  });

  return header;
}

export function updateHeaderActiveLink(currentPage: string): void {
  const header = document.querySelector('.header');
  if (!header) return;

  const links = header.querySelectorAll('.nav-link');
  links.forEach(link => {
    const href = link.getAttribute('href');
    const isActive = (href === `#/${currentPage}`) || (href === '#/') && currentPage === 'landing';
    toggleClass(link, 'active', isActive);
  });
}