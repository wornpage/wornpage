import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, preview } from '../demo/node_modules/vite/dist/node/index.js';
import { svelte } from '../demo/node_modules/@sveltejs/vite-plugin-svelte/src/index.js';
import { chromium } from 'playwright';

const root = fileURLToPath(new URL('..', import.meta.url));
const outputRoot = join(root, 'output', 'playwright', 'toast-focus');
const runId = `${new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-')}-${process.pid}`;
const output = join(outputRoot, 'runs', runId);
const app = join(output, 'app');
// The owning gate builds this bundle in pack:components before running this check.
const bundle = await readFile(join(root, 'packages', 'toast', 'dist', 'worn-toast.js'));
await mkdir(output, { recursive: true });
await mkdir(join(root, 'demo', 'dist'), { recursive: true });
// Build within demo's dependency scope without aliases or source changes.
const entry = await mkdtemp(join(root, 'demo', 'dist', 'toast-focus-fixture-'));
assert.equal(dirname(entry), resolve(root, 'demo', 'dist'));
for (const name of ['index.html', 'fixture.js']) {
  await writeFile(join(entry, name), await readFile(join(root, 'scripts', 'fixtures', 'toast-focus', name)));
}
const viteConfig = {
  root: join(root, 'demo'),
  configFile: false,
  plugins: [svelte({ onwarn(warning) { throw new Error(`[svelte:${warning.code}] ${warning.message}`); } })],
  base: './',
  build: { outDir: app, emptyOutDir: true, rollupOptions: { input: join(entry, 'index.html') } },
};
try {
  await build(viteConfig);
} finally {
  await rm(entry, { recursive: true, force: true });
}

async function findHtml(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) found.push(...await findHtml(path));
    else if (entry.name.endsWith('.html')) found.push(path);
  }
  return found;
}
const html = await findHtml(app);
assert.equal(html.length, 1, 'Toast fixture build must emit exactly one HTML entry');
const server = await preview({ ...viteConfig, preview: { host: '127.0.0.1', port: 4192, strictPort: true } });
let browser;
const report = {
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  toastBundleSha256: createHash('sha256').update(bundle).digest('hex'),
  runId, expected: 72, passed: 0, cases: [],
};
try {
  browser = await chromium.launch({ headless: true });
  for (const surface of ['svelte', 'wrapper']) for (const reducedMotion of ['no-preference', 'reduce']) {
    const keyboardLayouts = ['next', 'previous', 'shadow-next', 'shadow-previous', 'slot-next', 'modal-fallback', 'delegates-previous'];
    const cases = keyboardLayouts.flatMap(layout => ['Enter', 'Space'].map(activation => ({ layout, activation })));
    cases.push({ layout: 'next', activation: 'pointer' }, { layout: 'next', activation: 'automatic' },
      { layout: 'redirect', activation: 'Enter' }, { layout: 'removed-target', activation: 'Enter' });
    for (const { layout, activation } of cases) {
      const label = `${surface}-${layout}-${reducedMotion}-${activation}`;
      const context = await browser.newContext({ viewport: { width: 1000, height: 800 }, reducedMotion });
      const page = await context.newPage();
      page.setDefaultTimeout(5000);
      page.setDefaultNavigationTimeout(10000);
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('requestfailed', request => errors.push(`${request.url()}: ${request.failure()?.errorText}`));
      page.on('response', response => { if (response.status() >= 400) errors.push(`${response.url()}: HTTP ${response.status()}`); });
      const result = { label, surface, reducedMotion, layout, activation, passed: false, errors };
      try {
        const params = new URLSearchParams({ surface, layout, activation });
        const path = relative(app, html[0]).replaceAll('\\', '/');
        await page.goto(`http://127.0.0.1:4192/${path}?${params}`, { waitUntil: 'load' });
        await page.waitForFunction(() => window.fixtureReady);
        const dismiss = page.getByRole('button', { name: 'Dismiss notification', exact: true });
        await dismiss.waitFor({ state: 'visible' });
        if (activation === 'pointer') await dismiss.click();
        else if (activation === 'automatic') await page.locator('#previous').focus();
        else {
          await page.keyboard.press('Tab');
          await dismiss.focus();
          assert.equal(await dismiss.evaluate(node => node.matches(':focus-visible')), true, `${label}: keyboard precondition`);
          await dismiss.press(activation);
        }
        await dismiss.waitFor({ state: 'detached' });
        result.evidence = await page.evaluate(() => ({ active: window.deepActive(), expected: window.expectedTarget,
          dismissals: window.dismissals, focusCalls: window.focusCalls,
          modalOpen: document.querySelector('#modal')?.matches(':modal') ?? false }));
        assert.equal(result.evidence.dismissals, 1, `${label}: one dismissal notification`);
        assert.deepEqual(errors, [], `${label}: browser errors`);
        if (activation === 'pointer') {
          assert.equal(result.evidence.focusCalls.length, 0, `${label}: pointer dismissal must not relocate focus`);
        } else {
          const expected = activation === 'automatic' ? 'previous' : result.evidence.expected;
          assert.equal(result.evidence.active.at(-1)?.id, expected, `${label}: surviving focus target`);
          if (activation === 'automatic') assert.equal(result.evidence.focusCalls.length, 0, `${label}: automatic dismissal must not relocate focus`);
        }
        result.passed = true;
        report.passed++;
      } catch (error) {
        result.error = error.stack;
        await page.screenshot({ path: join(output, `${label}.png`), fullPage: true });
      } finally {
        report.cases.push(result);
        console.log(`toast focus ${result.passed ? 'PASS' : 'FAIL'} ${label}`);
        await context.close();
        await writeFile(join(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
      }
    }
  }
  assert.equal(report.cases.length, report.expected);
  assert.equal(report.passed, report.expected, `Toast focus browser failures; evidence: ${output}`);
  console.log(`toast focus browser: ${report.passed}/${report.expected} cases passed; evidence: ${output}`);
} finally {
  await writeFile(join(outputRoot, 'latest.json'), `${JSON.stringify(report, null, 2)}\n`);
  await browser?.close();
  await new Promise((resolveClose, reject) => server.httpServer.close(error => error ? reject(error) : resolveClose()));
}
