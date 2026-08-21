# @wornpage/navigation-surfaces

Compact Svelte 5 breadcrumbs, destination lists, and pagination with native navigation, named
landmarks, hostile-label containment, complete touch targets, reduced-motion
support, and standalone theme fallbacks.

<!-- wornpage-delivery:v2 source -->
## Delivery

`src/` is the canonical implementation and published runtime. This package is source-only; it does not ship a generated `dist/` directory.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Install

```sh
bun add @wornpage/navigation-surfaces
```

## Usage

```svelte
<script>
  import { Breadcrumb, NavigationList, Pagination } from '@wornpage/navigation-surfaces';

  let page = $state(1);
</script>

<Breadcrumb
  items={[{ label: 'Work', href: '/work' }, { label: 'Release evidence' }]}
/>

<NavigationList
  label="Workspace tools"
  items={[
    { label: 'Search', href: '/search', description: 'Find work and evidence.' },
    { label: 'Settings', href: '/settings', description: 'Manage workspace preferences.' }
  ]}
/>

<Pagination bind:current={page} total={12} label="Search results pages" />
```

## Breadcrumb

Breadcrumb uses native anchors for linked ancestors and assigns
`aria-current="page"` only to the final item. Intermediate unlinked items remain
plain text. Separators align with the first line when a hostile label wraps.
Empty item arrays render no empty navigation landmark.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{ label: string; href?: string }>` | required | Ordered path from ancestor to current page |
| `label` | `string` | `Breadcrumb` | Accessible navigation landmark name |

## NavigationList

NavigationList renders a named navigation landmark containing native full-row
links. Optional descriptions add scanning context without changing the link's
accessible name. The list uses one column in compact containers and two columns
when its own available width reaches 520px; hostile labels wrap without widening
the page. Empty item arrays render no empty landmark.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `readonly Array<{ label: string; href: string; description?: string; current?: boolean }>` | required | Ordered native-link destinations |
| `label` | `string` | `Navigation` | Accessible navigation landmark name |

## Pagination

Pagination normalizes invalid totals and bound page values. It keeps native
buttons and the full numeric range when space permits, then uses a compact
previous, compact current/total status, and next layout based on its own container width.
Consumers with multiple paginators should give each one a distinct `label`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `current` | `number` | `1` | Bindable current page, clamped to the available range |
| `total` | `number` | `1` | Total pages, normalized to an integer of at least one |
| `label` | `string` | `Pagination` | Accessible navigation landmark name |
| `onchange` | `(page: number) => void` | none | Called after a user chooses a different valid page |

## Theme tokens

All components consume the existing `--cockpit-*` and `--font-typewriter`
tokens with complete light fallbacks. They do not impose outer page spacing;
the pagination control only owns its 16px leading separation from results.
