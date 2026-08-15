import type { Snippet } from 'svelte';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  tone?: AlertTone;
  dismissible?: boolean;
  title?: string;
  dismissLabel?: string;
  ondismiss?: () => void;
  children?: Snippet;
}
