# @wornpage/select-card

Svelte 5 card-based selection control. It renders one native button with
controlled `aria-pressed` state, readable disabled styling, visible keyboard
focus, stable touch targets, and long-label containment.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Install

```bash
bun add @wornpage/select-card
```

## Svelte

```svelte
<script>
  import { SelectCard } from '@wornpage/select-card';
  let plan = $state('pro');
</script>

<SelectCard
  label="Pro"
  description="Larger limits"
  pressed={plan === 'pro'}
  onclick={() => plan = 'pro'}
/>
```

Selection is controlled by the parent. The component reports clicks but never
changes `pressed` itself.

## Web component

```html
<worn-select-card label="Pro" description="Larger limits" pressed></worn-select-card>
<script type="module">import '@wornpage/select-card';</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Primary option label |
| `description` | `string` | none | Supporting text |
| `pressed` | `boolean` | `false` | Controlled selected state |
| `disabled` | `boolean` | `false` | Disables selection |
| `onclick` | `(event: MouseEvent) => void` | none | Selection handler |

Additional button attributes such as `aria-label` and `data-*` are forwarded.

## Commands

```bash
bun test
bun run build
```

## License

MIT
