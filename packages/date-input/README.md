# @wornpage/date-input

Svelte 5 date input — thin wrapper around native `<input type="date">` with shared app-shell styling.

<!-- wornpage-delivery:v2 source -->
## Delivery

`src/` is the canonical implementation and Svelte consumer entry for this package.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, and package metadata on every relevant release.
<!-- /wornpage-delivery -->

## Install

```bash
npm install @wornpage/date-input
```

## Usage

```svelte
<script>
  import { DateInput } from '@wornpage/date-input';
</script>

<DateInput value={due} oninput={(e) => (due = e.currentTarget.value)} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | string | `""` | Bindable date value in `YYYY-MM-DD` format |
| `oninput` | `(e: Event) => void` | — | Live input handler |
| `onchange` | `(e: Event) => void` | — | Commit handler |
| `onkeydown` | `(e: KeyboardEvent) => void` | — | Keyboard handler |
| `onblur` | `(e: FocusEvent) => void` | — | Blur handler |
| `required` | boolean | `false` | Native required state |
| `disabled` | boolean | `false` | Disables the control |
| `min` | string | — | Minimum selectable date |
| `max` | string | — | Maximum selectable date |
| `step` | string | — | Native date step |
| `id` | string | — | Input id |
| `class` | string | `""` | Additional root class |
