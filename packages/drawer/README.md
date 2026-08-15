# @wornpage/drawer

Accessible Svelte 5 drawer for mobile navigation and focused secondary content.

Drawers remain inside dynamic mobile viewports and standalone-display safe areas,
including notches, status bars, landscape edges, and home indicators. The modal layer is
ported to `body`, locks the page at its current position, and makes non-modal body content
inert until the final open drawer closes. While open, it follows `visualViewport` scroll
and resize changes so mobile browser chrome, pinch movement, and the on-screen keyboard
cannot displace the backdrop or panel outside the visible screen.

<!-- wornpage-delivery:v2 browser-bundle -->
## Delivery

`src/` is the canonical implementation and the Svelte consumer entry. `dist/` is a generated browser bundle; run `bun run build` after source changes and never edit `dist/` directly.

Repository text is checked out as LF through `.gitattributes`, so generated output is byte-stable across Windows and Linux.

The shared [component delivery contract](https://github.com/wornpage/cli/blob/master/docs/component-delivery.md) checks this declaration, package exports, packed files, and generated output on every push and pull request.
<!-- /wornpage-delivery -->

```svelte
<script>
  import { Drawer } from '@wornpage/drawer';
  let open = false;
</script>

<Drawer bind:open side="start" title="Navigation">Content</Drawer>
```

`title` supplies the accessible dialog name. Escape, a direct backdrop click, or the close
button dismisses the drawer. Focus remains inside the drawer while open and returns to the
previously focused element after close. Long unbroken content wraps or scrolls inside the
drawer body instead of widening the panel or page.

## Browser bundle

```html
<script type="module" src="./dist/worn-drawer.js"></script>

<button id="open-drawer" type="button">Open project details</button>
<worn-drawer
  id="project-drawer"
  title="Project details"
  description="Review ownership, evidence, and the next release step."
  side="end"
></worn-drawer>

<script type="module">
  await customElements.whenDefined('worn-drawer');
  const trigger = document.querySelector('#open-drawer');
  const drawer = document.querySelector('#project-drawer');
  trigger.addEventListener('click', () => { drawer.open = true; });
  drawer.addEventListener('close', () => trigger.focus());
</script>
```

The bundle registers `<worn-drawer>` with reflected `open`, `title`, `description`, and
`side` properties. It dispatches `close` after Escape, backdrop, or close-button dismissal.
