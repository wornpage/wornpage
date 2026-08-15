# @wornpage/navigation-surfaces

Compact Svelte 5 breadcrumbs and pagination with native navigation, named
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
  import { Breadcrumb, Pagination } from '@wornpage/navigation-surfaces';

  let page = $state(1);
</script>

<Breadcrumb
  items={[{ label: 'Work', href: '/work' }, { label: 'Release evidence' }]}
/>

<Pagination bind:current={page} total={12} label="Search results pages" />
```

## Breadcrumb

Breadcrumb uses native anchors for linked ancestors and assigns
`aria-current="page"` only to the final item. Intermediate unlinked items remain
plain text. Empty item arrays render no empty navigation landmark.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array<{ label: string; href?: string }>` | required | Ordered path from ancestor to current page |
| `label` | `string` | `Breadcrumb` | Accessible navigation landmark name |

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

Both components consume the existing `--cockpit-*` and `--font-typewriter`
tokens with complete light fallbacks. They do not impose outer page spacing;
the pagination control only owns its 16px leading separation from results.
