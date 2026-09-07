# @wornpage/sidebar

> Part of **[Wornpage Components](https://github.com/wornpage/wornpage#component-library)**.
> [Browse the catalog](https://wornpage-components.pages.dev) · [Setup guide](https://github.com/wornpage/wornpage/blob/main/docs/getting-started.md) · [Wornpage overview](https://github.com/wornpage/wornpage)

Svelte 5 sidebar navigation component. Zero dependencies.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/wornpage/blob/main/packages/cli/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Features

- 🎯 Collapsible groups with smooth animation
- ⌨ Full keyboard navigation (arrows, Home, End, Enter)
- 🔍 Inline search/filter
- 📌 Pin favorites (right-click or star icon)
- 🕐 Recent items tracking
- 🔄 Reorder pinned items with named controls
- 🎨 Animated active indicator pill
- 📱 Responsive (rail → drawer on mobile)
- 🌗 CSS custom properties for theming
- 🪶 Zero dependencies (Svelte 5 peer only)

## Source use

This package is not published to npm. Consume it from a reviewed source checkout
or vendor `src/` into your application; do not rely on an `@wornpage/sidebar`
registry package until this repository announces an immutable release. The
examples below use representative paths that the consuming application owns.

## Usage

### Svelte component

```svelte
<script lang="ts">
  import Sidebar from '$lib/vendor/wornpage/sidebar/Sidebar.svelte';
  import type { NavIcon, NavItem } from '$lib/vendor/wornpage/sidebar/types.js';

  const homeIcon: NavIcon = {
    shapes: [
      { type: 'path', d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
      { type: 'polyline', points: '9 22 9 12 15 12 15 22' },
    ],
  };

  const items: NavItem[] = [
    { id: 'home', href: '/', label: 'Start', keywords: ['Home'], icon: homeIcon },
    { id: 'review', href: '/review', label: 'Review', badge: 3, badgeVariant: 'danger' },
  ];
</script>

<Sidebar {items} activeHref="/work" onnavigate={(href) => goto(href)} />
```

When `onnavigate` is present, plain primary clicks are delegated to it for
client-side routing. Modified clicks, non-primary clicks, previously prevented
events, and links without a handler retain the browser's native anchor behavior.

Saved pin order drives rendering and survives reloads. After a keyboard move,
focus follows the item to its next valid reorder control. Reorder controls use
44px square targets on coarse pointers while retaining 28px desktop controls.

### Web component (any framework)

```html
<worn-sidebar id="sidebar"></worn-sidebar>

<script type="module">
  import './vendor/wornpage/sidebar/dist/worn-sidebar.js';

  const sb = document.getElementById('sidebar');
  sb.items = [
    {
      id: 'home',
      href: '/',
      label: 'Home',
      icon: { shapes: [{ type: 'path', d: 'M3 9l9-7 9 7v11' }] },
    },
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

The Svelte entry exports `Sidebar`, `SidebarGroup`, and `SidebarItem`. The generated browser entry registers `worn-sidebar` without compiling its custom-element wrapper into Svelte applications.

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
| `worn-nav` | `{ href: string }` | Fired for an unmodified primary click on a nav link |
| `worn-collapse` | `{ collapsed: boolean }` | Fired when collapse state changes |

### NavItem

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `href` | `string` (optional) | Validated navigation target. Omit for group headers |
| `label` | `string` | Display text |
| `keywords` | `string[]` (optional) | Additional case-insensitive filter terms that are not displayed |
| `icon` | `NavIcon` (optional) | Structured SVG primitives; raw SVG/HTML strings are rejected |
| `badge` | `number` (optional) | Badge count |
| `badgeVariant` | `'default' \| 'danger'` | Badge color variant |
| `disabled` | `boolean` | Disable navigation |
| `children` | `NavItem[]` (optional) | Nested items for collapsible groups |

Navigation targets may be relative URLs or absolute `https:`, `mailto:`, and
`tel:` URLs. The component rejects all other schemes, protocol-relative URLs,
backslashes, whitespace, and control or format characters. Validation covers
the complete tree before rendering, including nested or currently hidden items.

`NavIcon.shapes` accepts only `path`, `circle`, `line`, `polyline`, `polygon`,
and `rect` primitives with their documented geometry fields. Svelte binds those
fields as attributes; the component does not parse or render raw markup. The
same structured object works through the `worn-sidebar` custom-element property.

| Primitive | Geometry fields |
|-----------|-----------------|
| `path` | `d` |
| `circle` | `cx`, `cy`, `r` |
| `line` | `x1`, `y1`, `x2`, `y2` |
| `polyline`, `polygon` | `points` |
| `rect` | `x`, `y`, `width`, `height`, optional `rx`, `ry` |

Unknown primitives and fields are rejected. Event handlers, `href`/`xlink:href`,
`style`, URL-bearing paint values, `foreignObject`, and arbitrary attribute
spreads are not part of the icon contract.

## Theming

The component uses CSS custom properties. Wrap in a container with `.worn-sidebar` class:

```css
.worn-sidebar {
  --worn-nav-radius: 8px;
  --worn-sidebar-collapsed-width: 72px;
  --worn-sidebar-collapsed-item-size: 44px;
  --worn-sidebar-accent: #0d9488;
  --worn-sidebar-accent-text: #fff;
  --worn-sidebar-focus: #21322b;
  --worn-sidebar-text: #21322b;
  --worn-sidebar-text-muted: #506058;
  --worn-sidebar-hover: #eaf4f0;
  --worn-sidebar-border: #e2ddd5;
  --worn-sidebar-surface: #fdfbf7;
  --worn-sidebar-bg: #f5f0e8;
  --worn-sidebar-danger: #e74c3c; /* Danger badge background */
  --worn-sidebar-danger-text: #fff; /* Danger badge foreground */
}
```

## License

MIT

---

**Part of [Wornpage](https://github.com/wornpage/wornpage)** — a Svelte 5 component library.
Browse all packages in the [monorepo](https://github.com/wornpage/wornpage).
