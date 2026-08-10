# @wornpage/cmdk

Svelte 5 command palette component. Fuzzy search, keyboard nav, zero dependencies.

<!-- wornpage-delivery:v1 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Features

- 🔍 Fuzzy search (subsequence match on label, hint, keywords)
- ⌨ ArrowUp/Down, Enter, Escape — full keyboard support
- 📂 Grouped results via `group` field on items
- 🎯 Native `<dialog>` focus trap + backdrop
- 🎨 CSS custom properties for theming
- 🪶 Zero dependencies (Svelte 5 peer only)

## Install

```bash
bun add @wornpage/cmdk
```

## Usage

```svelte
<script lang="ts">
  import { Cmdk } from '@wornpage/cmdk';
  import type { CmdkItem } from '@wornpage/cmdk';

  let open = $state(false);

  const items: CmdkItem[] = [
    { id: 'home', label: 'Go to Home', hint: 'Screen', onSelect: () => goto('/') },
    { id: 'settings', label: 'Open Settings', hint: 'Screen', group: 'Screens', onSelect: () => goto('/settings') },
    { id: 'theme', label: 'Dark mode', keywords: ['night', 'dark'], group: 'Actions', onSelect: () => applyTheme('dark') },
  ];
</script>

<button onclick={() => open = true}>Open palette (⌘K)</button>

<Cmdk items={items} placeholder="Search…" onclose={() => open = false} />

<!-- Call open() via exposed method from a ref -->
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `CmdkItem[]` | required | Items to search |
| `placeholder` | `string` | `'Search…'` | Input placeholder |
| `onclose` | `() => void` | — | Called when dialog closes |

### CmdkItem

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `label` | `string` | Primary search text |
| `hint` | `string` (optional) | Secondary text shown right-aligned |
| `keywords` | `string[]` (optional) | Extra search terms |
| `group` | `string` (optional) | Group label for sectioning results |
| `onSelect` | `() => void` | Called when item is selected |

### Exposed methods

Through `bind:this`:
- `open()` — open the palette dialog

## Theming

```css
:root {
  --cmdk-surface: #fdfbf7;
  --cmdk-text: #21322b;
  --cmdk-text-muted: #63746a;
  --cmdk-border: #e2ddd5;
  --cmdk-selected-bg: #d7efe7;
  --cmdk-radius: 8px;
  --cmdk-radius-sm: 6px;
}
```

## License

MIT
