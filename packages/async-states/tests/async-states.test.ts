import { describe, expect, it } from 'bun:test';
import { readFileSync } from 'node:fs';
import { compile } from 'svelte/compiler';

const read = (name: string) => readFileSync(new URL(`../src/${name}.svelte`, import.meta.url), 'utf8');
const empty = read('Empty');
const error = read('ErrorState');
const skeleton = read('Skeleton');
const spinner = read('Spinner');

describe('@wornpage/async-states', () => {
	it('declares source delivery and exact shared dependencies', () => {
		const pkg = require('../package.json');
		expect(pkg.name).toBe('@wornpage/async-states');
		expect(pkg.version).toBe('0.1.4');
		expect(pkg.wornpage).toEqual({ contractVersion: 2, delivery: 'source' });
		expect(pkg.dependencies['@wornpage/button']).toContain('1f55c470c20ec3ef900706d313c16609184394b8');
	});

	it('exports all four stable component surfaces', async () => {
		const mod = await import('../src/index.ts');
		expect(mod.Empty).toBeDefined();
		expect(mod.ErrorState).toBeDefined();
		expect(mod.Skeleton).toBeDefined();
		expect(mod.Spinner).toBeDefined();
	});

	it('compiles every Svelte source', () => {
		for (const [name, source] of Object.entries({ Empty: empty, ErrorState: error, Skeleton: skeleton, Spinner: spinner })) {
			expect(() => compile(source, { filename: `${name}.svelte`, generate: 'client' })).not.toThrow();
		}
	});

	it('contains hostile empty and error text without owning outer spacing', () => {
		for (const source of [empty, error]) {
			expect(source).toContain('inline-size: 100%;');
			expect(source).toContain('max-inline-size: 100%;');
			expect(source).toContain('min-inline-size: 0;');
			expect(source).toContain('overflow-wrap: anywhere;');
		}
		expect(error).not.toMatch(/\bmargin(?:-[a-z-]+)?\s*:/u);
	});

	it('preserves assertive error and serialized retry behavior', () => {
		expect(error).toContain('role="alert"');
		expect(error).toContain('aria-busy={busy}');
		expect(error).toContain("import { Button } from '@wornpage/button';");
		expect(error).toMatch(/async function retry\(\)[\s\S]*?busy = true;[\s\S]*?await onretry\?\.\(\);[\s\S]*?finally \{[\s\S]*?busy = false;/u);
		expect(error).toContain('duration: prefersReducedMotion.current ? 0 : 250');
	});

	it('keeps spinner announcements default-on with an explicit decorative opt-out', () => {
		expect(spinner).toContain('announce?: boolean;');
		expect(spinner).toContain('announce = true');
		expect(spinner).toContain("role={announce ? 'status' : undefined}");
		expect(spinner).toContain("aria-live={announce ? 'polite' : undefined}");
		expect(spinner).toContain("aria-hidden={announce ? undefined : 'true'}");
		expect(spinner).toContain('{#if announce}<span class="sr-only">{label}</span>{/if}');
	});

	it('stops spinner motion without hiding the visual state', () => {
		expect(spinner).toContain("import { prefersReducedMotion } from 'svelte/motion';");
		expect(spinner).toMatch(/\{#if !prefersReducedMotion\.current\}[\s\S]*?<animate/u);
		expect(spinner).toContain('@media (prefers-reduced-motion: reduce)');
		expect(spinner).toContain('.worn-spinner.is-sm .worn-spinner-dots { gap: 4px; }');
	});

	it('keeps skeleton as a named, non-interactive loading status with bounded presets and optional shimmer', () => {
		expect(skeleton).toContain('role="status" aria-busy="true" aria-label="Loading"');
		expect(skeleton).toContain('max-inline-size: 100%;');
		expect(skeleton).toContain('min-inline-size: 0;');
		expect(skeleton).toContain('.worn-skeleton.is-half { inline-size: 50%; }');
		expect(skeleton).toContain('@media (prefers-reduced-motion: reduce)');
	});
});
