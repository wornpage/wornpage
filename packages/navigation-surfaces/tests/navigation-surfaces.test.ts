import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';
import { assertSafeHref } from '../src/safe-href';

const read = (name: string) => readFileSync(new URL(`../src/${name}.svelte`, import.meta.url), 'utf8');
const breadcrumb = read('Breadcrumb');
const navigationList = read('NavigationList');
const pagination = read('Pagination');

describe('@wornpage/navigation-surfaces', () => {
	it('declares one source-delivered v2 package', () => {
		const pkg = require('../package.json');
		expect(pkg.name).toBe('@wornpage/navigation-surfaces');
		expect(pkg.version).toBe('0.2.2');
		expect(pkg.wornpage).toEqual({ contractVersion: 2, delivery: 'source' });
		expect(pkg.main).toBe('./src/index.ts');
		expect(pkg.files).not.toContain('dist');
	});

	it('exports and compiles every navigation surface without warnings', async () => {
		const mod = await import('../src/index.ts');
		expect(Object.keys(mod).sort()).toEqual(['Breadcrumb', 'NavigationList', 'Pagination']);
		for (const [name, source] of Object.entries({ Breadcrumb: breadcrumb, NavigationList: navigationList, Pagination: pagination })) {
			const result = compile(source, { filename: `${name}.svelte`, generate: 'client' });
			expect(result.warnings).toHaveLength(0);
		}
	});

	it('renders a named native destination list without empty landmarks', () => {
		expect(navigationList).toContain('export interface NavigationListItem');
		expect(navigationList).toContain('items: readonly NavigationListItem[];');
		expect(navigationList).toContain('{#if items.length > 0}');
		expect(navigationList).toContain('aria-label={label}');
		expect(navigationList).toContain('<ul>');
		expect(navigationList).toContain('<a href={href} aria-current={item.current ? \'page\' : undefined}>');
		expect(navigationList).toContain('data-worn-navigation-list');
	});

	it('contains hostile destination content in full-row touch targets', () => {
		expect(navigationList).toMatch(/\.worn-navigation-list \{[\s\S]*?container-type: inline-size;[\s\S]*?max-inline-size: 100%;[\s\S]*?min-inline-size: 0;/u);
		expect(navigationList).toMatch(/a \{[\s\S]*?inline-size: 100%;[\s\S]*?min-block-size: 52px;[\s\S]*?min-inline-size: 0;/u);
		expect(navigationList).toContain('overflow-wrap: anywhere;');
		expect(navigationList).toContain('touch-action: manipulation;');
		expect(navigationList).toContain('@container (min-width: 520px)');
		expect(navigationList).toContain('grid-template-columns: repeat(2, minmax(0, 1fr));');
	});

	it('owns focus, theme, selected, forced-color, and reduced-motion presentation', () => {
		expect(navigationList).toContain('outline: 2px dashed var(--worn-navigation-focus, currentColor);');
		expect(navigationList).toContain("a[aria-current='page']");
		expect(navigationList).toContain('var(--worn-selected-bg, var(--worn-accent-50, #e5f2ef))');
		expect(navigationList).toContain('@media (forced-colors: active)');
		expect(navigationList).toMatch(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?a \{[\s\S]*?transition: none;/u);
	});

	it('gives only the final breadcrumb item current-page ownership', () => {
		expect(breadcrumb).toContain('{#if items.length > 0}');
		expect(breadcrumb).toContain('aria-label={label}');
		expect(breadcrumb).toContain("{:else if i === items.length - 1}");
		expect(breadcrumb.match(/aria-current="page"/gu)).toHaveLength(1);
		expect(breadcrumb).toContain('class="worn-breadcrumb-text"');
	});

	it('accepts only relative and explicitly supported navigation destinations', () => {
		for (const href of [
			'/projects', './settings', '../home', 'projects/42', '?filter=open', '#details',
			'https://example.com/path',
			'mailto:security@example.com', 'tel:+15551234567'
		]) {
			expect(assertSafeHref(href)).toBe(href);
		}
		expect(breadcrumb).toContain('item.href === undefined ? undefined : assertSafeHref(item.href)');
		expect(navigationList).toContain('const href = assertSafeHref(item.href)');
	});

	it('rejects executable, ambiguous, and control-obfuscated navigation destinations', () => {
		for (const href of [
			'', ' javascript:alert(1)', 'javascript:alert(1)', 'JAVASCRIPT:alert(1)',
			'java\nscript:alert(1)', 'data:text/html,boom', 'vbscript:msgbox(1)',
			'http://localhost:3000', 'ftp://example.com/file', '//example.com/path',
			'\\\\example.com\\path', 'https://example.com/a b',
			'java\u200bscript:alert(1)', 'https://example.com/\u0000path'
		]) {
			expect(() => assertSafeHref(href)).toThrow(TypeError);
		}
	});

	it('contains hostile breadcrumb labels and gives links complete touch targets', () => {
		expect(breadcrumb).toMatch(/\.worn-breadcrumb,[\s\S]*?max-inline-size: 100%;[\s\S]*?min-inline-size: 0;/u);
		expect(breadcrumb).toMatch(/\.worn-breadcrumb-item \{[\s\S]*?align-items: baseline;/u);
		expect(breadcrumb).toContain('overflow-wrap: anywhere;');
		expect(breadcrumb).toContain('min-block-size: 44px;');
		expect(breadcrumb).toContain('min-inline-size: 44px;');
		expect(breadcrumb).toContain('touch-action: manipulation;');
	});

	it('normalizes pagination state before rendering or notifying consumers', () => {
		expect(pagination).toContain('let normalizedTotal = $derived(');
		expect(pagination).toContain('let normalizedCurrent = $derived(');
		expect(pagination).toContain('if (current !== normalizedCurrent) current = normalizedCurrent;');
		expect(pagination).toContain('if (target === normalizedCurrent) return;');
		expect(pagination).toContain('onchange?.(target);');
		expect(pagination).toContain('{#if normalizedTotal > 1}');
	});

	it('names pagination instances and exposes one compact live page status', () => {
		expect(pagination).toContain('aria-label={label}');
		expect(pagination).toContain('aria-label={`Page ${page}`}');
		expect(pagination).toContain('aria-label={`Page ${normalizedCurrent} of ${normalizedTotal}`}');
		expect(pagination).toContain('aria-live="polite"');
		expect(pagination).toContain('aria-atomic="true"');
		expect(pagination).toContain('aria-hidden="true"');
	});

	it('switches to compact pagination from available component width', () => {
		expect(pagination).toContain('container-type: inline-size;');
		expect(pagination).toContain('@container (max-width: 439px)');
		expect(pagination).toMatch(/@container \(max-width: 439px\) \{[\s\S]*?\.worn-pagination-pages \{[\s\S]*?display: none;/u);
		expect(pagination).toMatch(/@container \(max-width: 439px\) \{[\s\S]*?\.worn-pagination-status \{[\s\S]*?display: inline-flex;/u);
		expect(pagination).toContain('grid-template-columns: 44px minmax(0, auto) 44px;');
		expect(pagination).toContain('@container (max-width: 167px)');
		expect(pagination).toMatch(/\.worn-pagination-status \{[\s\S]*?min-inline-size: 0;/u);
	});

	it('owns standalone fallbacks, 44px controls, and reduced motion', () => {
		expect(pagination).toContain('var(--worn-surface, #ffffff)');
		expect(pagination).toContain('var(--worn-text-muted, #506058)');
		expect(pagination).toContain('var(--worn-accent, #287f73)');
		expect(pagination).toContain('min-block-size: 44px;');
		expect(pagination).toContain('min-inline-size: 44px;');
		expect(pagination).toContain('touch-action: manipulation;');
		expect(pagination).toContain('@media (prefers-reduced-motion: reduce)');
	});

	it('uses one state-aware focus owner across every navigation surface', () => {
		const focusRule = 'outline: 2px dashed var(--worn-navigation-focus, currentColor);';
		for (const source of [breadcrumb, navigationList, pagination]) expect(source).toContain(focusRule);
		expect([breadcrumb, navigationList, pagination].join('\n').match(/--worn-navigation-focus/gu)).toHaveLength(3);
		for (const source of [breadcrumb, navigationList, pagination]) {
			expect(source).not.toContain('outline: 2px dashed var(--worn-accent, #287f73);');
		}
	});

	it('hands terminal pagination focus to the enabled opposite edge without overriding consumer focus', () => {
		expect(pagination).toContain("import { tick } from 'svelte';");
		expect(pagination).toContain('onchange?: (page: number) => void;');
		expect(pagination).toContain('let previousButton = $state<HTMLButtonElement>();');
		expect(pagination).toContain('let nextButton = $state<HTMLButtonElement>();');
		expect(pagination).toContain('async function go(page: number, source: HTMLButtonElement)');
		expect(pagination).toContain('source === previousButton && target === 1');
		expect(pagination).toContain('source === nextButton && target === normalizedTotal');
		expect(pagination).toMatch(/current = target;[\s\S]*?if \(recoveryTarget\) \{[\s\S]*?await tick\(\);[\s\S]*?await new Promise<void>[\s\S]*?\}\s*onchange\?\.\(target\);/u);
		expect(pagination).toContain('await tick();');
		expect(pagination).toContain('await new Promise<void>((resolve) => requestAnimationFrame(() => {');
		expect(pagination).toContain('if (document.activeElement === document.body || document.activeElement === source) {');
		expect(pagination).toContain('recoveryTarget.focus();');
		expect(pagination).toContain('resolve();');
		expect(pagination).toContain("throw new Error('Pagination boundary focus target is unavailable');");
		expect(pagination).toContain('bind:this={previousButton}');
		expect(pagination).toContain('bind:this={nextButton}');
		expect(pagination.match(/onclick=\{\(event\) => go\(/gu)).toHaveLength(3);
	});
});
