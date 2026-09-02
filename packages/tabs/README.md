# @wornpage/tabs

Svelte 5 tabs with named tablists, roving keyboard selection, stable tab-panel
relationships, bounded long labels, compact horizontal overflow, visible focus,
touch-safe targets, and measured previous/next overflow controls.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Source use

This package is not published to npm. Check out this repository at a reviewed commit and consume it
from a local workspace after installing dependencies from `bun.lock`. The `@wornpage/tabs` import
below assumes that workspace mapping; it does not resolve from the public npm registry.

## Svelte

```svelte
<script>
  import { Tabs, tabDomIds } from '@wornpage/tabs';
  const tabs = [{ id: 'overview', label: 'Overview' }, { id: 'history', label: 'History' }];
  let active = $state('overview');
</script>

<Tabs id="project" label="Project sections" {tabs} bind:active />
{#each tabs as tab (tab.id)}
  {@const ids = tabDomIds('project', tab.id)}
  <section id={ids.panelId} role="tabpanel" aria-labelledby={ids.tabId} hidden={tab.id !== active}>
    {#if tab.id === active}
      Current panel content
    {/if}
  </section>
{/each}
```

`id` and `label` are optional for backward compatibility. Supply both whenever
the control switches panels. `tabDomIds()` gives the consumer the exact IDs used
by the component. Individual options may override `tabId` or `panelId`. Keep one
matching `tabpanel` element in the DOM for every tab, hiding inactive panels as
needed. Visual labels are capped with an ellipsis while their full text remains
the tab's accessible name. When `active` is set externally, including from a
deep link, the selected tab is brought fully into the strip without scrolling
the page. When the strip has real horizontal overflow, labeled previous and
next buttons appear outside the tablist. They scroll a bounded horizontal page,
remain disabled at their respective edges, respect reduced-motion preferences,
and disappear when every tab fits. When a keyboard-triggered scroll reaches an
edge and disables its source control, focus moves to the enabled opposite
control. Tabs and overflow controls share the public `--worn-tabs-focus` token;
its state-aware fallback is each control's current foreground color.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `{ id, label, tabId?, panelId? }[]` | required | Tab definitions |
| `active` | `string` | `""` | Bindable selected id |
| `onchange` | `(id: string) => void` | none | Selection handler |
| `id` | `string` | none | Stable ID namespace for tabs and panels |
| `label` | `string` | `"Sections"` | Accessible tablist name |

## Commands

```bash
bun test
bun run build
```

## License

MIT
