export interface NavItem {
  id: string;
  href?: string;
  label: string;
  icon?: string;
  badge?: number;
  badgeVariant?: 'default' | 'danger';
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
