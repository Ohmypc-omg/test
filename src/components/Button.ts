// Button component

import { createElement, toggleClass, removeClass } from '../utils/dom';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: string | HTMLElement;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
  icon?: Element;
  iconPosition?: 'left' | 'right';
  form?: string;
}

export function createButton(props: ButtonProps): HTMLButtonElement {
  const {
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    onClick,
    type = 'button',
    className = '',
    fullWidth = false,
    icon,
    iconPosition = 'left',
    form,
  } = props;

  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-block' : '',
    loading ? 'btn-loading' : '',
    disabled ? 'btn-disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  const button = createElement('button', {
    class: classes,
    type,
    disabled: disabled || loading,
    'aria-busy': loading,
    form,
  }, [
    loading ? createElement('span', { class: 'btn-spinner' }) : null,
    icon && iconPosition === 'left' && !loading ? icon : null,
    typeof children === 'string'
      ? createElement('span', { class: 'btn-text' }, children)
      : children,
    icon && iconPosition === 'right' && !loading ? icon : null,
  ].filter(Boolean)) as HTMLButtonElement;

  if (onClick && !disabled && !loading) {
    button.addEventListener('click', onClick);
  }

  return button;
}

// Button group
export interface ButtonGroupProps {
  buttons: ButtonProps[];
  className?: string;
}

export function createButtonGroup(props: ButtonGroupProps): HTMLElement {
  const { buttons, className = '' } = props;

  return createElement('div', { class: `btn-group ${className}` },
    buttons.map(btnProps => createButton(btnProps))
  );
}

// Icon button
export interface IconButtonProps {
  icon: Element;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  'aria-label': string;
  className?: string;
}

export function createIconButton(props: IconButtonProps): HTMLButtonElement {
  const { icon, variant = 'ghost', size = 'md', disabled = false, loading = false, onClick, 'aria-label': ariaLabel, className = '' } = props;

  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    'btn-icon',
    loading ? 'btn-loading' : '',
    disabled ? 'btn-disabled' : '',
    className,
  ].filter(Boolean).join(' ');

  const button = createElement('button', {
    class: classes,
    type: 'button',
    disabled: disabled || loading,
    'aria-label': ariaLabel,
    'aria-busy': loading,
  }, [
    loading ? createElement('span', { class: 'btn-spinner' }) : icon,
  ]) as HTMLButtonElement;

  if (onClick && !disabled && !loading) {
    button.addEventListener('click', onClick);
  }

  return button;
}

// Dropdown button
export interface DropdownItem {
  label?: string;
  onClick?: () => void;
  icon?: Element;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

export interface DropdownButtonProps {
  trigger: ButtonProps;
  items: DropdownItem[];
  align?: 'left' | 'right';
}

export function createDropdownButton(props: DropdownButtonProps): HTMLElement {
  const { trigger, items, align = 'right' } = props;

  const dropdown = createElement('div', { class: 'dropdown' });

  const button = createButton({
    ...trigger,
    icon: trigger.icon || createElement('span', { class: 'chevron-down' }, [
      createElement('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
        createElement('path', { d: 'M6 9l6 6 6-6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
      ]),
    ]),
    iconPosition: 'right',
  });

  const menu = createElement('div', { class: `dropdown-menu dropdown-menu-${align}`, role: 'menu' },
    items.map((item: DropdownItem, index) => {
      if (item.divider) {
        return createElement('div', { class: 'dropdown-divider', role: 'separator' });
      }

      return createElement('button', {
        class: `dropdown-item ${item.danger ? 'dropdown-item-danger' : ''} ${item.disabled ? 'dropdown-item-disabled' : ''}`,
        type: 'button',
        role: 'menuitem',
        disabled: item.disabled,
        tabIndex: -1,
      }, [
        item.icon && createElement('span', { class: 'dropdown-item-icon' }, [item.icon]),
        createElement('span', { class: 'dropdown-item-text' }, item.label || ''),
      ]);
    })
  );

  let isOpen = false;

  const toggle = () => {
    isOpen = !isOpen;
    button.setAttribute('aria-expanded', String(isOpen));
    toggleClass(menu, 'open');
  };

  const close = () => {
    isOpen = false;
    button.setAttribute('aria-expanded', 'false');
    removeClass(menu, 'open');
  };

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle();
  });

  menu.querySelectorAll('.dropdown-item').forEach((item, index) => {
    const itemData = items[index];
    if (itemData && !itemData.divider && !itemData.disabled && itemData.onClick) {
      item.addEventListener('click', () => {
        itemData.onClick!();
        close();
      });
    }
  });

  // Close on outside click
  document.addEventListener('click', close);

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  dropdown.appendChild(button);
  dropdown.appendChild(menu);

  // Store cleanup function
  (dropdown as any)._cleanup = () => {
    document.removeEventListener('click', close);
    document.removeEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  };

  return dropdown;
}