import type { Snippet } from 'svelte';

export interface DrawerProps {
  open?: boolean;
  side?: 'start' | 'end' | 'bottom';
  title?: string;
  onclose?: () => void;
  children?: Snippet;
}
