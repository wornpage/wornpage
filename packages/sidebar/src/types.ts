export type NavIconShape =
  | { type: 'path'; d: string }
  | { type: 'circle'; cx: number; cy: number; r: number }
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number }
  | { type: 'polyline'; points: string }
  | { type: 'polygon'; points: string }
  | { type: 'rect'; x: number; y: number; width: number; height: number; rx?: number; ry?: number };

export interface NavIcon {
  viewBox?: string;
  shapes: NavIconShape[];
}

export interface NavItem {
  id: string;
  href?: string;
  label: string;
  keywords?: string[];
  icon?: NavIcon;
  badge?: number;
  badgeVariant?: 'default' | 'danger' | 'warning';
  disabled?: boolean;
  children?: NavItem[];
  kind?: 'page' | 'action' | 'section' | 'tool';
  attention?: boolean;
  relatedTo?: string[];
}

export interface SidebarProps {
  collapsed?: boolean;
  items: NavItem[];
  activeHref?: string;
  onnavigate?: (href: string) => void;
  oncollapsed?: (collapsed: boolean) => void;
}
