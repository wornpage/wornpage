# @wornpage/toast

Svelte 5 toast notification — fly-in, auto-dismiss, zero dependencies.

## Install

```bash
bun add @wornpage/toast
```

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
| `duration` | `number` | `3000` | Auto-dismiss ms (0 = sticky) |
| `ondismiss` | `() => void` | — | Called when toast is dismissed |

## Events (web component)

| Event | Description |
|-------|-------------|
| `worn-dismiss` | Fired when toast is clicked or auto-dismissed |

## Theming

```css
.wrn-toast {
  --wrn-toast-bg: #fdfbf7;
  --wrn-toast-border: #e2ddd5;
  --wrn-toast-text: #21322b;
  --wrn-toast-error-border: #e74c3c;
  --wrn-toast-success-border: #27ae60;
}
```

## License

MIT
