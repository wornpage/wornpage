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
