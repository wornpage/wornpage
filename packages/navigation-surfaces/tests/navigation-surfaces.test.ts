import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';

const read = (name: string) => readFileSync(new URL(`../src/${name}.svelte`, import.meta.url), 'utf8');
const breadcrumb = read('Breadcrumb');
const pagination = read('Pagination');

describe('@wornpage/navigation-surfaces', () => {
	it('declares one source-delivered v2 package', () => {
		const pkg = require('../package.json');
		expect(pkg.name).toBe('@wornpage/navigation-surfaces');
		expect(pkg.version).toBe('0.1.2');
		expect(pkg.wornpage).toEqual({ contractVersion: 2, delivery: 'source' });
		expect(pkg.main).toBe('./src/index.ts');
		expect(pkg.files).not.toContain('dist');
	});

	it('exports and compiles both navigation surfaces without warnings', async () => {
		const mod = await import('../src/index.ts');
		expect(Object.keys(mod).sort()).toEqual(['Breadcrumb', 'Pagination']);
		for (const [name, source] of Object.entries({ Breadcrumb: breadcrumb, Pagination: pagination })) {
			const result = compile(source, { filename: `${name}.svelte`, generate: 'client' });
			expect(result.warnings).toHaveLength(0);
		}
	});

	it('gives only the final breadcrumb item current-page ownership', () => {
		expect(breadcrumb).toContain('{#if items.length > 0}');
		expect(breadcrumb).toContain('aria-label={label}');
		expect(breadcrumb).toContain("{:else if i === items.length - 1}");
		expect(breadcrumb.match(/aria-current="page"/gu)).toHaveLength(1);
		expect(breadcrumb).toContain('class="worn-breadcrumb-text"');
	});

	it('contains hostile breadcrumb labels and gives links complete touch targets', () => {
		expect(breadcrumb).toMatch(/\.worn-breadcrumb,[\s\S]*?max-inline-size: 100%;[\s\S]*?min-inline-size: 0;/u);
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
		expect(pagination).toContain('var(--cockpit-surface, #ffffff)');
		expect(pagination).toContain('var(--cockpit-text-muted, #506058)');
		expect(pagination).toContain('var(--cockpit-accent, #287f73)');
		expect(pagination).toContain('min-block-size: 44px;');
		expect(pagination).toContain('min-inline-size: 44px;');
		expect(pagination).toContain('touch-action: manipulation;');
		expect(pagination).toContain('@media (prefers-reduced-motion: reduce)');
	});
});
