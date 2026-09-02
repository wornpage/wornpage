# @wornpage/alert

Inline Svelte 5 alerts for the Wornpage design system.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

```svelte
<script>
  import { Alert } from '@wornpage/alert';
</script>

<Alert tone="danger" title="Deployment failed" dismissible ondismiss={clearError}>
  Check the build logs and retry.
</Alert>
```

Danger alerts use an assertive live region; info, success, and warning alerts use a polite status region. All tones own narrow containment, hostile-text wrapping, theme-safe icons, reduced-motion entry, and a 44 px dismiss target.

When `dismissible` is true, `dismissLabel` overrides the accessible button name. Otherwise a titled alert uses `Dismiss {title}` and an untitled alert uses `Dismiss alert`. Keyboard dismissal hands focus to the next surviving focusable control in document order, or the previous control when nothing follows; pointer dismissal does not force a focus change.

The dismiss button's keyboard-focus outline uses `--worn-alert-focus` when supplied. Its default fallback prefers the host's shared `--worn-focus` token, then `--worn-accent`, then the current text color so every alert tone can retain a high-contrast focus indicator without consumer selector overrides.

## Browser bundle

```html
<script type="module" src="./dist/worn-alert.js"></script>

<worn-alert tone="warning" title="Review needed" dismissible>
  Two checks remain.
</worn-alert>
```

The bundle registers `<worn-alert>`. Dismissal emits a bubbling, composed `dismiss` event.

## Props

- `tone?: 'info' | 'success' | 'warning' | 'danger'`
- `dismissible?: boolean`
- `title?: string`
- `dismissLabel?: string`
- `ondismiss?: () => void`

The default slot contains the alert message.

## Theme tokens

- `--worn-alert-focus`
- `--worn-focus`
- `--worn-accent-50`
- `--worn-accent`
- `--worn-text`
- `--worn-success-bg`
- `--worn-success-border`
- `--worn-success-text`
- `--worn-warning-bg`
- `--worn-warning-border`
- `--worn-warning-text`
- `--worn-danger-bg`
- `--worn-danger-border`
- `--worn-danger-text`
- `--worn-radius`
- `--font-typewriter`
