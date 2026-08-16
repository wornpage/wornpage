export interface ButtonProps {
  variant?: 'primary' | 'default' | 'danger' | 'warning';
  disabled?: boolean;
  size?: 'sm' | 'md';
  type?: 'button' | 'submit';
  href?: string;
  class?: string;
  onclick?: (e: MouseEvent) => void;
  children?: any;
  [key: string]: unknown;
}

export interface IconButtonProps {
  label: string;
  title?: string;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
  class?: string;
  onclick?: (e: MouseEvent) => void;
  children?: any;
  [key: string]: unknown;
}

export interface ReactionButtonProps {
  reaction: string;
  label?: string;
  count?: number;
  pressed?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  class?: string;
  onclick?: (e: MouseEvent) => void;
  [key: string]: unknown;
}
