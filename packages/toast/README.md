# @wornpage/toast

> Part of **[Wornpage Components](https://github.com/wornpage/wornpage#component-library)**.
> [Browse the catalog](https://wornpage-components.pages.dev) · [Setup guide](https://github.com/wornpage/wornpage/blob/main/docs/getting-started.md) · [Wornpage overview](https://github.com/wornpage/wornpage)

Svelte 5 toast notification with CSP-compatible motion, auto-dismiss, and zero dependencies.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/wornpage/blob/main/packages/cli/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

## Source use

This package is not published to npm. Install the immutable package archive linked by the [catalog](https://wornpage-components.pages.dev). The `@wornpage/toast` import
below resolves from the installed archive; it does not resolve from the public npm registry.

## Usage (Svelte)

```svelte
<script>
  import { Toast } from '@wornpage/toast';
  let show = $state(true);
</script>

{#if show}
  <Toast message="Saved!" kind="success" ondismiss={() => show = false} />
{/if}
```

## Usage (web component)

```html
<worn-toast id="t"></worn-toast>
<script type="module">
  import '@wornpage/toast';
  const t = document.getElementById('t');
  t.message = 'Saved!';
  t.kind = 'success';
  t.addEventListener('worn-dismiss', () => t.remove());
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `message` | `string` | required | Toast text |
| `kind` | `'info' \| 'error' \| 'success'` | `'info'` | Visual variant |
| `dismissLabel` | `string` | `'Dismiss notification'` | Accessible name for the dismiss control |
| `duration` | `number` | `3000` | Auto-dismiss ms (0 = sticky) |
| `ondismiss` | `() => void` | — | Called when toast is dismissed |

## Interaction

Toasts use stylesheet animations instead of inline transition styles, so they work with strict Content Security Policies. Reduced-motion users receive no animation. Reduced-motion dismissal completes immediately instead of waiting for an exit animation that is not rendered. Automatic dismissal pauses while the notification is hovered or contains keyboard focus, then resumes with the remaining time. Messages wrap inside narrow hosts, and the dismiss control is 44px on coarse pointers while the desktop presentation remains compact. Supply a distinct `dismissLabel` when multiple toasts can be visible together.

## Events (web component)

| Event | Description |
|-------|-------------|
| `worn-dismiss` | Fired when the dismiss control is used or the toast auto-dismisses |

## Theming

Put the shared host palette on an ancestor that contains every toast (often `:root` when notifications render at the document level). Success and error variants use their semantic palette when it is present, then fall back to the component base pair (`--wrn-toast-bg` / `--wrn-toast-text`) and the shared host pair (`--worn-surface` / `--worn-text`). This keeps a minimal light or dark host palette coherent without requiring status tokens.

Status-specific background and text tokens are paired overrides: set `--wrn-toast-error-bg` with `--wrn-toast-error-text`, and `--wrn-toast-success-bg` with `--wrn-toast-success-text`. The shared `--worn-danger-*` and `--worn-success-*` pairs remain the next precedence level.

```css
:root {
  --worn-surface: #fdfbf7;
  --worn-text: #21322b;
}

.toast-host {
  --wrn-toast-bg: #fdfbf7;
  --wrn-toast-border: #e2ddd5;
  --wrn-toast-text: #21322b;
  --wrn-toast-error-bg: #fdf0ef;
  --wrn-toast-error-text: #8f2119;
  --wrn-toast-error-border: #e74c3c;
  --wrn-toast-success-bg: #edf9f0;
  --wrn-toast-success-text: #176b3a;
  --wrn-toast-success-border: #27ae60;
  --wrn-toast-focus: #21322b;
}
```

## License

MIT
