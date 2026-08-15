import type { Snippet } from 'svelte';

export interface AccordionProps {
  label: string;
  description?: string;
  open?: boolean;
  panelId?: string;
  onchange?: (open: boolean) => void;
  children?: Snippet;
}

export interface CollapsibleProps {
  summary: string;
  open?: boolean;
  ariaLabel?: string;
  panelId?: string;
  onchange?: (open: boolean) => void;
  children?: Snippet;
}
