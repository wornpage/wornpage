import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { visualViewportBox } from '../src/modal-layer';

const source = readFileSync(new URL('../src/WornDrawer.svelte', import.meta.url), 'utf8');
const modalLayer = readFileSync(new URL('../src/modal-layer.ts', import.meta.url), 'utf8');
const entry = readFileSync(new URL('../src/index.ts', import.meta.url), 'utf8');
const element = readFileSync(new URL('../src/DrawerElement.svelte', import.meta.url), 'utf8');
const elementsEntry = readFileSync(new URL('../src/elements.ts', import.meta.url), 'utf8');
const viteConfig = readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8');
const demo = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

describe('hydration and interaction contract', () => {
  test('uses a hydration-stable component id without browser crypto', () => {
    expect(source).toContain('const componentId = $props.id();');
    expect(source).not.toContain('crypto.randomUUID');
  });

  test('keeps keyboard, backdrop, and close-button dismissal', () => {
    expect(source).toContain("if (e.key === 'Escape')");
    expect(source).toContain('if (e.target === e.currentTarget)');
    expect(source).toContain('aria-label="Close"');
  });

  test('owns mobile viewport, every edge, and reduced-motion behavior', () => {
    expect(source).toContain('height: 100dvh;');
    expect(source).toContain('height: var(--worn-visual-viewport-height, 100dvh);');
    expect(source).toContain('width: var(--worn-visual-viewport-width, 100vw);');
    expect(source).toContain('var(--worn-visual-viewport-left, 0px)');
    expect(source).toContain('var(--worn-visual-viewport-top, 0px)');
    expect(source).toContain('class:is-start');
    expect(source).toContain('class:is-end');
    expect(source).toContain('class:is-bottom');
    expect(source).toContain('prefersReducedMotion.current');
  });

  test('keeps every drawer edge clear of standalone display safe areas', () => {
    expect(source).toContain('width: min(380px, calc(100% - 32px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)));');
    expect(source).toContain('max-height: calc(100% - 32px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));');
    expect(source).toContain('top: calc(16px + env(safe-area-inset-top, 0px));');
    expect(source).toContain('bottom: calc(16px + env(safe-area-inset-bottom, 0px));');
    expect(source).toContain('left: calc(16px + env(safe-area-inset-left, 0px));');
    expect(source).toContain('right: calc(16px + env(safe-area-inset-right, 0px));');
    expect(source).toContain('box-sizing: border-box;');
  });

  test('maps the visible viewport to stable CSS lengths', () => {
    expect(visualViewportBox({
      offsetLeft: 4.25,
      offsetTop: 76.5,
      width: 357.33,
      height: 605.5,
    })).toEqual({
      left: '4.25px',
      top: '76.5px',
      width: '357.33px',
      height: '605.5px',
    });
    expect(visualViewportBox({
      offsetLeft: Number.NaN,
      offsetTop: Number.POSITIVE_INFINITY,
      width: Number.NEGATIVE_INFINITY,
      height: Number.NaN,
    })).toEqual({ left: '0px', top: '0px', width: '0px', height: '0px' });
  });

  test('renders the modal layer at body level and isolates the background', () => {
    expect(source).toContain('bind:this={backdropEl} use:portal');
    expect(source).toContain('activateModalLayer(backdropEl)');
    expect(modalLayer).toContain('document.body.appendChild(node);');
    expect(modalLayer).toContain("child.toggleAttribute('inert', child !== activeModal);");
    expect(modalLayer).toContain('new MutationObserver(applyModalIsolation)');
    expect(modalLayer).toContain('const modalStack: HTMLElement[] = [];');
    expect(modalLayer).toContain("viewport.addEventListener('scroll', schedule, { passive: true });");
    expect(modalLayer).toContain("viewport.addEventListener('resize', schedule, { passive: true });");
    expect(modalLayer).toContain("window.addEventListener('scroll', schedule, { passive: true });");
    expect(modalLayer).toContain('releaseVisualViewport();');
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
    expect(source).toContain('current === document.body || activeDrawer.contains(current)');
    expect(source).toContain('previous.focus({ preventScroll: true });');
  });

  test('contains hostile content and filters hidden focus targets', () => {
    expect(source).toContain('overflow-wrap: anywhere;');
    expect(source).toContain('overflow-x: auto;');
    expect(source).toContain('max-width: 100%;');
    expect(source).toContain('[contenteditable]:not([contenteditable="false"])');
    expect(source).toContain("!item.closest('[inert]')");
    expect(source).toContain('item.getClientRects().length > 0');
  });

  test('keeps Svelte source and the browser custom element on explicit entries', () => {
    expect(entry).toContain("export { default as Drawer } from './WornDrawer.svelte';");
    expect(entry).toContain("export type { DrawerProps } from './types';");
    expect(elementsEntry).toBe("import './DrawerElement.svelte';\n");
    expect(element).toContain("tag: 'worn-drawer'");
    expect(element).toContain("shadow: 'none'");
    expect(element).toContain('<Drawer bind:open {title} {side} onclose={handleClose}>');
    expect(element).toContain("setTimeout(() => host.dispatchEvent(new CustomEvent('close')), 0);");
    expect(viteConfig).toContain("entry: 'src/elements.ts'");
    expect(viteConfig).toContain("customElement: filename.endsWith('Element.svelte')");
    expect(viteConfig).not.toContain('rollupOptions');
    expect(demo).toContain("await customElements.whenDefined('worn-drawer');");
  });
});
