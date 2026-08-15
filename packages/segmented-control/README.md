# @wornpage/segmented-control

Svelte 5 segmented radio control. It preserves native arrow-key behavior,
isolates repeated component instances, keeps the public form field name, and
wraps labels inside compact equal-width segments.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Install

```bash
bun add @wornpage/segmented-control
```

## Svelte

```svelte
<script>
  import { SegmentedControl } from '@wornpage/segmented-control';
  let period = $state('day');
</script>

<SegmentedControl
  label="Period"
  name="period"
  options={[{ id: 'day', label: 'Day' }, { id: 'week', label: 'Week' }]}
  bind:active={period}
/>
```

Each component instance gives its radios a private native group name. A hidden
input retains the supplied `name` and current value for form submission, so two
controls can safely reuse a field name without changing each other's selection.

## Web component

```html
<worn-segmented-control id="period" label="Period"></worn-segmented-control>
<script type="module">
  import '@wornpage/segmented-control';
  period.name = 'period';
  period.options = [{ id: 'day', label: 'Day' }, { id: 'week', label: 'Week' }];
  period.active = 'day';
</script>
```

The web component emits `change` with `{ detail: { id } }`.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `{ id: string, label: string }[]` | required | Segment options |
| `active` | `string` | `""` | Bindable selected id |
| `name` | `string` | required | Public form field name |
| `label` | `string` | `name` | Accessible group label |
| `onchange` | `(id: string) => void` | none | Selection handler |

## Commands

```bash
bun test
bun run build
```

## License

MIT
