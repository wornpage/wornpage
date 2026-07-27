# @wornpage/sidebar

Svelte 5 sidebar navigation component. Zero dependencies.

## Features

- 🎯 Collapsible groups with smooth animation
- ⌨ Full keyboard navigation (arrows, Home, End, Enter)
- 🔍 Inline search/filter
- 📌 Pin favorites (right-click or star icon)
- 🕐 Recent items tracking
- 🔄 Drag-to-reorder pinned items
- 🎨 Animated active indicator pill
- 📱 Responsive (rail → drawer on mobile)
- 🌗 CSS custom properties for theming
- 🪶 Zero dependencies (Svelte 5 peer only)

## Install

```bash
bun add @wornpage/sidebar
# or
npm add @wornpage/sidebar
```

## Usage

### Svelte component

```svelte
<script lang="ts">
  import { Sidebar } from '@wornpage/sidebar';
  import type { NavItem } from '@wornpage/sidebar';

  const items: NavItem[] = [
    { id: 'home', href: '/', label: 'Home', icon: '<path d="M3 9l9-7 9 7..."/>' },
    { id: 'review', href: '/review', label: 'Review', badge: 3, badgeVariant: 'danger' },
  ];
</script>

<Sidebar {items} activeHref="/work" onnavigate={(href) => goto(href)} />
```

### Web component (any framework)

```html
<worn-sidebar id="sidebar"></worn-sidebar>

<script type="module">
  import '@wornpage/sidebar';

  const sb = document.getElementById('sidebar');
  sb.items = [
    { id: 'home', href: '/', label: 'Home', icon: '<path d="..."/>' },
    { id: 'review', href: '/review', label: 'Review', badge: 3, badgeVariant: 'danger' },
  ];
  sb.activehref = '/work';
  sb.addEventListener('worn-nav', (e) => {
    window.location.href = e.detail.href;
  });
  sb.addEventListener('worn-collapse', (e) => {
    console.log('Collapsed:', e.detail.collapsed);
  });
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `NavItem[]` | required | Navigation tree (property only, not attribute) |
| `activeHref` | `string` | `''` | Currently active route |
| `collapsed` | `boolean` | `false` | Collapsed state |
| `rounded` | `'sm' \| 'md' \| 'lg' \| 'pill'` | `'md'` | Border radius variant |

## Events

| Event | Detail | Description |
|-------|--------|-------------|
| `worn-nav` | `{ href: string }` | Fired when user clicks a nav link |
| `worn-collapse` | `{ collapsed: boolean }` | Fired when collapse state changes |

### NavItem

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `href` | `string` (optional) | Navigation target. Omit for group headers |
| `label` | `string` | Display text |
| `icon` | `string` (optional) | Inline SVG path content |
| `badge` | `number` (optional) | Badge count |
| `badgeVariant` | `'default' \| 'danger'` | Badge color variant |
| `disabled` | `boolean` | Disable navigation |
| `children` | `NavItem[]` (optional) | Nested items for collapsible groups |

## Theming

The component uses CSS custom properties. Wrap in a container with `.worn-sidebar` class:

```css
.worn-sidebar {
  --worn-nav-radius: 8px;
  --worn-sidebar-accent: #0d9488;
  --worn-sidebar-accent-text: #fff;
  --worn-sidebar-text: #21322b;
  --worn-sidebar-text-muted: #506058;
  --worn-sidebar-hover: #eaf4f0;
  --worn-sidebar-border: #e2ddd5;
  --worn-sidebar-surface: #fdfbf7;
  --worn-sidebar-bg: #f5f0e8;
  --worn-sidebar-danger: #e74c3c;
}
```

## License

MIT

---

**Part of [Wornpage](https://github.com/wornpage/wornpage)** — a Svelte 5 component library.
Browse all packages in the [monorepo](https://github.com/wornpage/wornpage).
