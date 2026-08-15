# @wornpage/disclosure

Native Svelte 5 accordion and collapsible controls for the Wornpage design system.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Svelte

```svelte
<script>
  import { Accordion, Collapsible } from '@wornpage/disclosure';
  let sourceOpen = $state(false);
</script>

<Accordion label="Release notes" description="August 14">
  <p>Responsive disclosure behavior shipped.</p>
</Accordion>

<Collapsible
  summary="Source"
  ariaLabel="Source for Button"
  bind:open={sourceOpen}
>
  <pre><code>&lt;Button&gt;Save&lt;/Button&gt;</code></pre>
</Collapsible>
```

`Accordion` uses native `<details>` and `<summary>`. `Collapsible` uses one native button with `aria-expanded` and a hydration-stable `aria-controls` relationship. Use `ariaLabel` when multiple visible summaries are intentionally identical, such as repeated `Source` disclosures.

Both controls own a 44 px trigger target, keyboard focus, narrow containment, hostile-label wrapping, theme tokens, and reduced-motion behavior. Accordion deliberately uses the browser's native open/close behavior rather than declaring a Svelte transition on an always-mounted body.

## Browser bundle

```html
<script type="module" src="./dist/worn-disclosure.js"></script>

<worn-accordion label="Release notes" description="August 14">
  <p>Responsive disclosure behavior shipped.</p>
</worn-accordion>

<worn-collapsible summary="Source" aria-label="Source for Button">
  <pre><code>&lt;Button&gt;Save&lt;/Button&gt;</code></pre>
</worn-collapsible>
```

The bundle registers `<worn-accordion>` and `<worn-collapsible>`. Their `change` event bubbles with `detail.open`.

## Props

### Accordion

- `label: string`
- `description?: string`
- `open?: boolean`
- `panelId?: string`
- `onchange?: (open: boolean) => void`

### Collapsible

- `summary: string`
- `open?: boolean`
- `ariaLabel?: string`
- `panelId?: string`
- `onchange?: (open: boolean) => void`

## Theme tokens

- `--cockpit-bg`
- `--cockpit-surface`
- `--cockpit-border`
- `--cockpit-text`
- `--cockpit-text-secondary`
- `--cockpit-text-muted`
- `--cockpit-accent`
- `--cockpit-hover-bg`
- `--cockpit-radius-sm`
- `--font-typewriter`
