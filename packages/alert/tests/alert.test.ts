import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8').replace(/\r\n/gu, '\n');
const alert = read('../src/Alert.svelte');
const element = read('../src/AlertElement.svelte');
const index = read('../src/index.ts');
const demo = read('../index.html');
const packageJson = JSON.parse(read('../package.json'));

describe('alert semantics', () => {
  test('reserves assertive announcements for danger', () => {
    expect(alert).toContain("role={tone === 'danger' ? 'alert' : 'status'}");
    expect(alert).toContain("aria-live={tone === 'danger' ? 'assertive' : 'polite'}");
    expect(alert).toContain('aria-atomic="true"');
    expect(alert).not.toContain('role="alert"');
  });

  test('names dismissal context and reports it once', () => {
    expect(alert).toContain("dismissLabel || (title ? `Dismiss ${title}` : 'Dismiss alert')");
    expect(alert).toContain('aria-label={accessibleDismissLabel}');
    expect(alert).toContain('ondismiss?.();');
    expect(alert).toContain('if (!visible) return;');
  });
});

describe('standalone behavior', () => {
  test('contains hostile content and owns the complete dismiss target', () => {
    expect(alert).toContain('inline-size: 100%;');
    expect(alert).toContain('max-inline-size: 100%;');
    expect(alert).toContain('min-inline-size: 0;');
    expect(alert).toContain('overflow-wrap: anywhere;');
    expect(alert).toContain('min-inline-size: 44px;');
    expect(alert).toContain('min-block-size: 44px;');
    expect(alert).toContain('touch-action: manipulation;');
  });

  test('uses theme-safe mask icons and reduced-motion entry', () => {
    for (const tone of ['info', 'success', 'warning', 'danger']) {
      expect(alert).toContain(`.worn-alert.is-${tone} {`);
    }
    expect(alert).toContain('mask: var(--worn-alert-icon) center / contain no-repeat;');
    expect(alert).toContain("import { prefersReducedMotion } from 'svelte/motion';");
    expect(alert).toContain('duration: prefersReducedMotion.current ? 0 : 200');
  });
});

describe('delivery', () => {
  test('exports one Svelte component and one browser bundle', () => {
    expect(index).toContain("export { default as Alert } from './Alert.svelte';");
    expect(packageJson.wornpage).toEqual({ contractVersion: 2, delivery: 'browser-bundle' });
    expect(packageJson.main).toBe('./dist/worn-alert.js');
    expect(demo).toContain('src="./dist/worn-alert.js"');
  });

  test('projects light DOM and emits one composed dismiss event', () => {
    expect(element).toContain("tag: 'worn-alert'");
    expect(element).toContain("const slot = document.createElement('slot');");
    expect(element).toContain('use:attachLightDomSlot');
    expect(element).toContain("new CustomEvent('dismiss'");
    expect(element).toContain('bubbles: true');
    expect(element).toContain('composed: true');
  });
});
