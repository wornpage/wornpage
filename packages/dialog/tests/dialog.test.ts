import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/WornDialog.svelte', import.meta.url), 'utf8');
const modalLayer = readFileSync(new URL('../src/modal-layer.ts', import.meta.url), 'utf8');
const entry = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8');
const element = readFileSync(new URL('../src/DialogElement.svelte', import.meta.url), 'utf8');
const elementsEntry = readFileSync(new URL('../src/elements.ts', import.meta.url), 'utf8');
const viteConfig = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8');
const demo = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

describe('hydration and interaction contract', () => {
  test('uses a hydration-stable component id without browser crypto', () => {
    expect(source).toContain('const componentId = $props.id();');
    expect(source).not.toContain('crypto.randomUUID');
  });

  test('keeps keyboard, backdrop, and close-button dismissal', () => {
    expect(source).toContain("if (e.key === 'Escape' && dismissible)");
    expect(source).toContain('if (dismissible && e.target === e.currentTarget)');
    expect(source).toContain('aria-label="Close"');
  });

  test('locks every dismissal path while an action is in flight', () => {
    expect(source).toContain('dismissible?: boolean;');
    expect(source).toContain('dismissible = true');
    expect(source).toContain('disabled={!dismissible}');
    expect(source).toContain('.worn-dialog-close:disabled');
    expect(element).toContain("dismissible: { reflect: true, type: 'Boolean' }");
    expect(element).toContain('<Dialog bind:open {title} {size} {dismissible} onclose={handleClose}>');
  });

  test('keeps static size classes and reduced-motion behavior', () => {
    expect(source).toContain('class:is-sm');
    expect(source).toContain('class:is-lg');
    expect(source).toContain('prefersReducedMotion.current');
  });

  test('owns the dynamic viewport and standalone-display safe areas', () => {
    expect(source).toContain('height: 100dvh;');
    expect(source).toContain('padding: calc(24px + env(safe-area-inset-top, 0px))');
    expect(source).toContain('padding: calc(8px + env(safe-area-inset-top, 0px))');
    expect(source).toContain('max-height: 100%;');
    expect(source).toContain('overscroll-behavior: contain;');
  });

  test('contains long titles and keeps touch dismissal responsive', () => {
    expect(source).toContain('overflow-wrap: anywhere;');
    expect(source).toContain('touch-action: manipulation;');
    expect(source).toContain('overflow-x: auto;');
    expect(source).toContain('max-width: 100%;');
  });

  test('renders the modal layer at body level and isolates the background', () => {
    expect(source).toContain('bind:this={backdropEl} use:portal');
    expect(source).toContain('activateModalLayer(backdropEl)');
    expect(modalLayer).toContain('document.body.appendChild(node);');
    expect(modalLayer).toContain("child.toggleAttribute('inert', child !== activeModal);");
    expect(modalLayer).toContain('new MutationObserver(applyModalIsolation)');
    expect(modalLayer).toContain('const modalStack: HTMLElement[] = [];');
  });

  test('locks and restores page position for the complete modal lifecycle', () => {
    expect(modalLayer).toContain("root.style.overflow = 'hidden';");
    expect(modalLayer).toContain("root.style.touchAction = 'none';");
    expect(modalLayer).toContain("body.style.overflow = 'hidden';");
    expect(modalLayer).toContain("body.style.touchAction = 'none';");
    expect(modalLayer).toContain('window.innerWidth - root.clientWidth');
    expect(modalLayer).toContain('body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;');
    expect(modalLayer).toContain('window.scrollX !== state.scrollX || window.scrollY !== state.scrollY');
    expect(modalLayer).toContain('window.scrollTo(state.scrollX, state.scrollY);');
    expect(source).toContain('current === document.body || activeDialog.contains(current)');
    expect(source).toContain('previous.focus({ preventScroll: true });');
  });

  test('filters hidden and inert controls out of the focus loop', () => {
    expect(source).toContain('[contenteditable]:not([contenteditable="false"])');
    expect(source).toContain("!item.closest('[inert]')");
    expect(source).toContain('item.getClientRects().length > 0');
  });

  test('keeps Svelte source and the browser custom element on explicit entries', () => {
    expect(entry).toBe("export { default as Dialog } from './WornDialog.svelte';\n");
    expect(elementsEntry).toBe("import './DialogElement.svelte';\n");
    expect(element).toContain("tag: 'worn-dialog'");
    expect(element).toContain("shadow: 'none'");
    expect(element).toContain('<Dialog bind:open {title} {size} {dismissible} onclose={handleClose}>');
    expect(element).toContain("setTimeout(() => host.dispatchEvent(new CustomEvent('close')), 0);");
    expect(viteConfig).toContain("entry: 'src/elements.ts'");
    expect(viteConfig).toContain("customElement: filename.endsWith('Element.svelte')");
    expect(viteConfig).not.toContain('rollupOptions');
    expect(demo).toContain("await customElements.whenDefined('worn-dialog');");
  });
});
