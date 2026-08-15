# @wornpage/dialog

Accessible Svelte 5 modal dialog with focus trapping, static size presets, and reduced-motion transitions.

Dialogs remain inside dynamic mobile viewports and standalone-display safe areas,
including notches, status bars, landscape edges, and home indicators. The modal layer is
ported to `body`, locks the page at its current position, and makes non-modal body content
inert until the final open dialog closes.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

```svelte
<script>
  import { Dialog } from '@wornpage/dialog';
  let open = false;
</script>

<Dialog bind:open title="Confirm" dismissible={!busy}>Content</Dialog>
```

`title` supplies the accessible dialog name. Escape, a direct backdrop click, or the close
button dismisses the dialog. Focus remains inside the dialog while open and returns to the
previously focused element after close. Long unbroken content wraps or scrolls inside the
dialog body instead of widening the modal or page.

Set `dismissible={false}` while an action is in flight to disable Escape, backdrop, and
close-button dismissal as one coherent state. Content actions remain owned by the caller.

## Browser bundle

```html
<script type="module" src="./dist/worn-dialog.js"></script>

<button id="open-dialog" type="button">Archive workspace</button>
<worn-dialog
  id="archive-dialog"
  title="Archive customer workspace?"
  description="Archived history remains available."
  size="sm"
  dismissible
></worn-dialog>

<script type="module">
  await customElements.whenDefined('worn-dialog');
  const trigger = document.querySelector('#open-dialog');
  const dialog = document.querySelector('#archive-dialog');
  trigger.addEventListener('click', () => { dialog.open = true; });
  dialog.addEventListener('close', () => trigger.focus());
</script>
```

The bundle registers `<worn-dialog>` with reflected `open`, `title`, `description`, and
`size` and `dismissible` properties. It dispatches `close` after Escape, backdrop, or
close-button dismissal when dismissal is enabled.
