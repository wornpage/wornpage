import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { catalogOutputDirectory, prepareCatalogOutput } from './catalog-browser-output.mjs';
import { observePreviewStartup, waitForPreview } from './catalog-preview-readiness.mjs';
import { COMPONENT_SOURCES } from './component-repositories.ts';

const HOST = '127.0.0.1';
const PORT = 4173;
const BASE_URL = `http://${HOST}:${PORT}`;
const REPOSITORY_ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUTPUT_DIR = catalogOutputDirectory(REPOSITORY_ROOT);
const THEMES = ['light', 'dark', 'forest', 'ocean', 'sepia', 'halloween', 'winter', 'holiday'];
const THEME_LABELS = Object.fromEntries(THEMES.map((theme) => [theme, theme[0].toUpperCase() + theme.slice(1)]));
const VIEWPORTS = [
  { id: 'compact-touch', viewport: { width: 320, height: 900 }, hasTouch: true, isMobile: true },
  { id: 'desktop-fine', viewport: { width: 1440, height: 1000 }, hasTouch: false, isMobile: false },
];
const EXPECTED_IDS = COMPONENT_SOURCES.map(({ name }) => name);
const REQUIRED_TOKENS = [
  '--worn-bg', '--worn-bg-secondary', '--worn-surface', '--worn-surface-raised', '--worn-text',
  '--worn-text-secondary', '--worn-text-muted', '--worn-border', '--worn-border-strong', '--worn-accent',
  '--worn-accent-text', '--worn-accent-50', '--worn-link', '--worn-hover-bg', '--worn-focus',
  '--worn-success-bg', '--worn-success-border', '--worn-success-text', '--worn-warning-bg',
  '--worn-warning-border', '--worn-warning-text', '--worn-danger-bg', '--worn-danger-border', '--worn-danger-text',
];
const browserArguments = process.argv.slice(2);
const unsupportedArguments = browserArguments.filter((argument) => argument !== '--focus-ordering');
if (unsupportedArguments.length) throw new Error(`Unsupported catalog browser option: ${unsupportedArguments.join(', ')}`);
const focusOrderingOnly = browserArguments.includes('--focus-ordering');

function rgb(value) {
  const channels = value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  assert.equal(channels?.length, 3, `Expected an RGB color, received ${value}`);
  return channels;
}

function contrast(foreground, background) {
  const luminance = (value) => {
    const linear = rgb(value).map((channel) => {
      const normalized = channel / 255;
      return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  };
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function watchPage(page, label) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('requestfailed', (request) => errors.push(`requestfailed: ${request.method()} ${request.url()} ${request.failure()?.errorText ?? ''}`));
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`response: ${response.status()} ${response.url()}`);
  });
  return () => assert.deepEqual(errors, [], `${label} had unexpected browser/network errors`);
}

async function expectText(locator, pattern, message) {
  await locator.waitFor();
  assert.match(await locator.innerText(), pattern, message);
}

async function settleFrames(page) {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function exerciseFamilies(page, label) {
  const exercised = [];
  const mark = (id) => exercised.push(id);

  const alert = page.locator('#alert');
  await alert.getByRole('button', { name: 'Dismiss Review needed', exact: true }).click();
  await expectText(alert, /dismissed without changing catalog data/i, `${label} alert dismissal was not visible`);
  await alert.getByRole('button', { name: 'Restore alert', exact: true }).click();
  await alert.getByText('Review needed', { exact: true }).waitFor();
  mark('alert');

  const asyncStates = page.locator('#async-states');
  await asyncStates.getByRole('button', { name: 'success', exact: true }).click();
  await asyncStates.locator('[data-async-state="success"]').waitFor();
  await asyncStates.getByRole('button', { name: 'empty', exact: true }).click();
  await asyncStates.getByText('No matching previews', { exact: true }).waitFor();
  await asyncStates.getByRole('button', { name: 'error', exact: true }).click();
  await asyncStates.getByRole('button', { name: 'Retry', exact: true }).click();
  await asyncStates.getByRole('button', { name: 'empty', exact: true }).click();
  await page.waitForTimeout(120);
  assert.equal(await asyncStates.locator('[data-async-state="empty"]').count(), 1, `${label} stale async retry overwrote a newer choice`);
  await asyncStates.getByRole('button', { name: 'error', exact: true }).click();
  await asyncStates.getByRole('button', { name: 'Retry', exact: true }).click();
  await asyncStates.locator('[data-async-state="success"]').waitFor();
  await asyncStates.getByRole('button', { name: 'loading', exact: true }).click();
  await asyncStates.locator('[data-async-state="loading"]').waitFor();
  mark('async-states');

  const binary = page.locator('#binary-controls');
  await binary.getByRole('checkbox', { name: 'Include archived', exact: true }).click();
  await expectText(binary.locator('[data-output="binary"]'), /Archived: included/, `${label} binary control did not update its model`);
  await binary.getByRole('button', { name: 'Reset controls', exact: true }).click();
  await expectText(binary.locator('[data-output="binary"]'), /Archived: hidden; updates: on/, `${label} binary reset failed`);
  assert.equal(await binary.getByRole('switch', { name: 'Managed by policy', exact: true }).isDisabled(), true);
  mark('binary-controls');

  const buttons = page.locator('#button');
  await buttons.getByRole('button', { name: 'Primary', exact: true }).click();
  await buttons.getByRole('button', { name: 'Primary', exact: true }).click();
  await expectText(buttons.locator('[data-output="button"]'), /Primary action prepared locally — run 2/, `${label} repeated button action was not observable`);
  await buttons.getByRole('button', { name: 'Danger', exact: true }).click();
  await expectText(buttons.locator('[data-output="button"]'), /nothing was deleted — run 3/, `${label} danger outcome was not honest`);
  await buttons.getByRole('button', { name: 'Reset outcome', exact: true }).click();
  mark('button');

  const paletteTrigger = page.locator('#cmdk').getByRole('button', { name: 'Open command palette', exact: true });
  await paletteTrigger.click();
  await page.getByRole('dialog', { name: 'Command palette' }).waitFor();
  await page.keyboard.press('Escape');
  await page.waitForFunction((selector) => document.activeElement === document.querySelector(selector), '#cmdk button');
  mark('cmdk');

  const commands = page.locator('#command-surfaces');
  const draft = commands.getByLabel('Local document title');
  await draft.fill('Reviewed notes');
  await draft.press(process.platform === 'darwin' ? 'Meta+S' : 'Control+S');
  await expectText(commands, /Saved “Reviewed notes” in this local example/, `${label} scoped save shortcut did not update the model`);
  await commands.getByRole('button', { name: 'Preview', exact: true }).click();
  await expectText(commands.locator('[data-output="toolbar-preview"]'), /Reviewed notes/, `${label} toolbar preview did not use draft data`);
  await commands.getByRole('button', { name: 'Reset document', exact: true }).click();
  mark('command-surfaces');

  const dataDisplay = page.locator('#data-display');
  await dataDisplay.getByRole('button', { name: /Assigned to me/ }).click();
  assert.equal(await dataDisplay.getByRole('button', { name: /Assigned to me/ }).getAttribute('aria-pressed'), 'true');
  await dataDisplay.getByRole('button', { name: 'Advance progress', exact: true }).click();
  assert.equal(await dataDisplay.getByRole('progressbar').getAttribute('aria-valuenow'), '8');
  await dataDisplay.getByRole('button', { name: 'Reset display', exact: true }).click();
  assert.equal(await dataDisplay.getByRole('progressbar').getAttribute('aria-valuenow'), '7');
  mark('data-display');

  const date = page.locator('#date-input');
  await date.getByLabel('Due date').fill('2026-09-10');
  await expectText(date, /Selected: 2026-09-10/, `${label} date input did not bind its value`);
  await date.getByRole('button', { name: 'Reset date', exact: true }).click();
  assert.equal(await date.getByLabel('Due date').inputValue(), '2026-08-22');
  assert.equal(await date.getByLabel('Locked release date').isDisabled(), true);
  mark('date-input');

  const dialogSection = page.locator('#dialog');
  const dialogTrigger = dialogSection.getByRole('button', { name: 'Open dialog', exact: true });
  await dialogTrigger.click();
  const dialog = page.getByRole('dialog', { name: 'Confirm catalog review' });
  assert.equal(await dialog.evaluate((node) => node.contains(document.activeElement)), true, `${label} dialog did not receive focus`);
  await dialog.getByRole('button', { name: 'Confirm', exact: true }).click();
  await expectText(dialogSection.locator('[data-output="dialog"]'), /1/, `${label} dialog confirmation did not update content`);
  await page.waitForFunction((selector) => document.activeElement === document.querySelector(selector), '#dialog button');
  await dialogSection.getByRole('button', { name: 'Reset approvals', exact: true }).click();
  mark('dialog');

  const disclosure = page.locator('#disclosure');
  await disclosure.getByRole('button', { name: 'Inspect disclosure contract', exact: true }).click();
  await disclosure.getByText(/controlled disclosure uses a real button/).waitFor();
  await disclosure.getByRole('button', { name: 'Collapse controlled panel', exact: true }).click();
  await disclosure.getByText(/controlled disclosure uses a real button/).waitFor({ state: 'hidden' });
  mark('disclosure');

  const drawerSection = page.locator('#drawer');
  const beforePadding = await drawerSection.locator('[data-output="drawer-preview"]').evaluate((node) => getComputedStyle(node).paddingTop);
  await drawerSection.getByRole('button', { name: 'Open details drawer', exact: true }).click();
  const drawer = page.getByRole('dialog', { name: 'Component details' });
  assert.equal(await drawer.evaluate((node) => node.contains(document.activeElement)), true, `${label} drawer did not receive focus`);
  await drawer.evaluate(async (node) => {
    const animations = node.getAnimations({ subtree: true });
    await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
  });
  const drawerGeometry = await drawer.evaluate((node) => {
    const box = node.getBoundingClientRect();
    return { left: box.left, top: box.top, right: box.right, bottom: box.bottom, viewportWidth: innerWidth, viewportHeight: innerHeight, opacity: getComputedStyle(node).opacity };
  });
  assert.ok(drawerGeometry.left >= 0 && drawerGeometry.top >= 0 && drawerGeometry.right <= drawerGeometry.viewportWidth && drawerGeometry.bottom <= drawerGeometry.viewportHeight, `${label} drawer was not fully contained before capture`);
  assert.equal(drawerGeometry.opacity, '1', `${label} drawer was not opaque before capture`);
  await page.screenshot({ path: join(OUTPUT_DIR, `${label}-overlay.png`) });
  await drawer.getByLabel('Preview density').selectOption('compact');
  await drawer.getByRole('button', { name: 'Apply', exact: true }).click();
  await expectText(drawerSection.locator('[data-output="drawer"]'), /compact/, `${label} drawer apply did not update the model`);
  const afterPadding = await drawerSection.locator('[data-output="drawer-preview"]').evaluate((node) => getComputedStyle(node).paddingTop);
  assert.notEqual(afterPadding, beforePadding, `${label} drawer density did not change rendered spacing`);
  await drawerSection.getByRole('button', { name: 'Reset density', exact: true }).click();
  mark('drawer');

  const form = page.locator('#form-fields');
  await form.getByLabel('Project').fill('');
  await form.getByRole('button', { name: 'Validate locally', exact: true }).click();
  await expectText(form.locator('[data-output="form"]'), /Project is required/, `${label} form error state was not visible`);
  await form.getByLabel('Project').fill('Browser matrix');
  await form.getByRole('button', { name: 'Validate locally', exact: true }).click();
  await expectText(form.locator('[data-output="form"]'), /passed for “Browser matrix”/, `${label} form success state was not visible`);
  await form.getByRole('button', { name: 'Reset form', exact: true }).click();
  assert.equal(await form.getByLabel('Project').inputValue(), 'Catalog coverage');
  assert.equal(await form.getByLabel('Verified source').isEditable(), false);
  mark('form-fields');

  const layout = page.locator('#layout-surfaces');
  await layout.getByText('Read-only composition example', { exact: true }).waitFor();
  await layout.getByRole('heading', { name: 'Launch readiness' }).waitFor();
  await layout.getByText(/browser checks are required/).waitFor();
  mark('layout-surfaces');

  const multi = page.locator('#multi-select');
  await multi.getByLabel('Priorities').selectOption(['low', 'high']);
  await expectText(multi.locator('[data-output="multi-select"]'), /low, high/, `${label} multi-select did not bind values`);
  await multi.getByRole('button', { name: 'Reset priorities', exact: true }).click();
  await expectText(multi.locator('[data-output="multi-select"]'), /Selected: high/, `${label} multi-select reset failed`);
  mark('multi-select');

  const navigation = page.locator('#navigation-surfaces');
  await expectText(navigation.locator('[data-output="pagination"]'), /Alert/, `${label} pagination initial rows were missing`);
  await navigation.getByRole('button', { name: 'Next page', exact: true }).click();
  await expectText(navigation.locator('[data-output="pagination"]'), /Toast/, `${label} pagination did not render page 2 rows`);
  assert.equal((await navigation.locator('[data-output="pagination"]').innerText()).includes('Alert'), false, `${label} pagination retained page 1 rows`);
  await navigation.getByRole('button', { name: 'Reset page', exact: true }).click();
  await expectText(navigation, /Showing 1–4 of 26 components/, `${label} pagination denominator/reset drifted`);
  mark('navigation-surfaces');

  const receipt = page.locator('#receipt');
  await receipt.getByRole('button', { name: 'Undo', exact: true }).click();
  await expectText(receipt.locator('[data-output="receipt-model"]'), /active/, `${label} receipt undo did not restore content`);
  await receipt.getByRole('button', { name: 'Archive again', exact: true }).click();
  await receipt.getByRole('button', { name: 'Dismiss', exact: true }).click();
  await expectText(receipt.locator('[data-output="receipt-model"]'), /archived/, `${label} receipt dismiss changed the model`);
  assert.equal(await receipt.locator('.worn-receipt').count(), 0);
  mark('receipt');

  const scenarios = page.locator('#scenarios');
  await expectText(scenarios, /showing 5 of \d+ canonical scenarios/i, `${label} scenario subset denominator was missing`);
  assert.equal(await scenarios.locator('[aria-label="Scenario catalog output"] > div').count(), 5);
  mark('scenarios');

  const segmented = page.locator('#segmented-control');
  await segmented.getByRole('radio', { name: 'Day', exact: true }).click();
  await expectText(segmented.locator('[data-output="period"]'), /Period: day/, `${label} segmented control did not bind`);
  await segmented.getByRole('button', { name: 'Reset period', exact: true }).click();
  mark('segmented-control');

  const selectCard = page.locator('#select-card');
  await selectCard.getByRole('button', { name: /Standard Core catalog checks/ }).click();
  await expectText(selectCard.locator('[data-output="select-card"]'), /standard/, `${label} select card did not update selection`);
  assert.equal(await selectCard.getByRole('button', { name: /Enterprise/ }).isDisabled(), true);
  await selectCard.getByRole('button', { name: 'Reset plan', exact: true }).click();
  mark('select-card');

  const sidebar = page.locator('.demo-sidebar');
  const navToggle = sidebar.getByRole('button', { name: /navigation/ });
  if ((await navToggle.getAttribute('aria-expanded')) === 'false') await navToggle.click();
  await sidebar.getByRole('searchbox', { name: 'Filter navigation' }).fill('Theme');
  await sidebar.locator('a[href="#theme"]').click();
  await page.locator('#theme-heading:focus').waitFor();
  if ((await navToggle.getAttribute('aria-expanded')) === 'true') await sidebar.getByRole('searchbox', { name: 'Filter navigation' }).fill('');
  mark('sidebar');

  const sync = page.locator('#sync');
  await sync.getByRole('button', { name: 'Generate local sync code', exact: true }).click();
  await sync.locator('[data-output="sync"] svg').waitFor();
  await sync.getByRole('button', { name: 'Reset code', exact: true }).click();
  assert.equal(await sync.locator('[data-output="sync"]').count(), 0);
  mark('sync');

  const tabs = page.locator('#tabs');
  await tabs.getByRole('tab', { name: 'Evidence', exact: true }).click();
  await tabs.getByRole('tabpanel').filter({ visible: true }).getByText(/Evidence content/).waitFor();
  await tabs.getByRole('button', { name: 'Reset tab', exact: true }).click();
  await tabs.getByRole('tabpanel').filter({ visible: true }).getByText(/Overview content/).waitFor();
  mark('tabs');

  const theme = page.locator('#theme');
  assert.equal(await theme.locator('.theme-swatches span').count(), 4);
  const swatches = await theme.locator('.theme-swatches span').evaluateAll((nodes) => nodes.map((node) => `${getComputedStyle(node).backgroundColor}|${getComputedStyle(node).color}`));
  assert.equal(new Set(swatches).size, 4, `${label} theme token samples did not resolve to distinct roles`);
  mark('theme');

  const toast = page.locator('#toast');
  await toast.getByRole('button', { name: 'Show local notification', exact: true }).click();
  await toast.getByRole('status').waitFor();
  await toast.getByRole('button', { name: 'Dismiss catalog notification', exact: true }).click();
  await toast.getByRole('status').waitFor({ state: 'detached' });
  mark('toast');

  const undo = page.locator('#undo');
  await undo.getByRole('button', { name: 'Rename local draft', exact: true }).click();
  await expectText(undo.locator('[data-output="undo-model"]'), /Reviewed catalog/, `${label} undo model mutation was missing`);
  await undo.getByRole('button', { name: /Undo Renamed catalog draft/ }).click();
  await expectText(undo.locator('[data-output="undo-model"]'), /Draft catalog/, `${label} undo did not restore content`);
  await undo.getByRole('button', { name: /Redo Renamed catalog draft/ }).click();
  await expectText(undo.locator('[data-output="undo-model"]'), /Reviewed catalog/, `${label} redo did not reapply content`);
  await undo.getByRole('button', { name: 'Reset history', exact: true }).click();
  mark('undo');

  const workflow = page.locator('#workflow');
  await workflow.getByRole('button', { name: 'Clear local blocker', exact: true }).click();
  await expectText(workflow.locator('[data-output="workflow"]'), /Navigation coverage.*active/s, `${label} workflow output did not recompute`);
  await expectText(workflow.locator('tbody tr').first(), /Navigation coverage\s+active\s+Open/, `${label} workflow row did not change`);
  await workflow.getByRole('button', { name: 'Reset workflow', exact: true }).click();
  await expectText(workflow.locator('tbody tr').first(), /blocked\s+Review blocker/, `${label} workflow reset failed`);
  mark('workflow');

  assert.deepEqual([...exercised].sort(), [...EXPECTED_IDS].sort(), `${label} did not exercise every family`);
  return exercised.length;
}

async function assertCatalogCell(browser, viewportConfig, theme) {
  const label = `${viewportConfig.id}-${theme}`;
  const context = await browser.newContext({
    viewport: viewportConfig.viewport,
    hasTouch: viewportConfig.hasTouch,
    isMobile: viewportConfig.isMobile,
    colorScheme: 'light',
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  const assertClean = watchPage(page, label);
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: THEME_LABELS[theme], exact: true }).click();
    await page.locator(`html[data-theme="${theme}"]`).waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('wrn-theme')), theme, `${label} did not persist the selected theme`);
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator(`html[data-theme="${theme}"]`).waitFor();

    const coverage = await page.evaluate(({ expectedIds, requiredTokens, compact }) => {
      const rootStyle = getComputedStyle(document.documentElement);
      const sections = [...document.querySelectorAll('[data-component]')];
      const metadata = [...document.querySelectorAll('[data-component-meta]')];
      const examples = [...document.querySelectorAll('[data-example-id]')];
      const tokenValues = Object.fromEntries(requiredTokens.map((token) => [token, rootStyle.getPropertyValue(token).trim()]));
      const inputSizes = [...document.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]), textarea, select')]
        .filter((element) => element.getClientRects().length > 0)
        .map((element) => Number.parseFloat(getComputedStyle(element).fontSize));
      const targets = compact
        ? [...document.querySelectorAll('button')].filter((element) => element.getClientRects().length > 0).map((element) => {
            const box = element.getBoundingClientRect();
            return { label: element.getAttribute('aria-label') || element.textContent?.trim() || 'button', width: box.width, height: box.height };
          })
        : [];
      const primary = document.querySelector('#button .worn-btn.is-primary');
      const primaryStyle = primary ? getComputedStyle(primary) : null;
      const guide = document.querySelector('.guide-link');
      const bodyStyle = getComputedStyle(document.body);
      return {
        sectionIds: sections.map((section) => section.id),
        metadataIds: metadata.map((node) => node.getAttribute('data-component-meta')),
        exampleIds: examples.map((node) => node.getAttribute('data-example-id')),
        revisionsValid: metadata.every((node) => /^[0-9a-f]{40}$/.test(node.getAttribute('data-source-revision') || '')),
        tokenValues,
        scrollWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
        body: { color: bodyStyle.color, background: bodyStyle.backgroundColor },
        primary: primaryStyle ? { color: primaryStyle.color, background: primaryStyle.backgroundColor } : null,
        palette: {
          background: bodyStyle.backgroundColor,
          surface: getComputedStyle(document.querySelector('.demo-sidebar')).backgroundColor,
          accent: primaryStyle?.backgroundColor || '',
        },
        inputSizes,
        targets,
        guide: guide ? {
          href: guide.href,
          visible: guide.getClientRects().length > 0,
          width: guide.getBoundingClientRect().width,
          height: guide.getBoundingClientRect().height,
        } : null,
      };
    }, { expectedIds: EXPECTED_IDS, requiredTokens: REQUIRED_TOKENS, compact: viewportConfig.id === 'compact-touch' });

    const expectedSorted = [...EXPECTED_IDS].sort();
    assert.deepEqual([...coverage.sectionIds].sort(), expectedSorted, `${label} section coverage drifted`);
    assert.deepEqual([...coverage.metadataIds].sort(), expectedSorted, `${label} metadata coverage drifted`);
    assert.deepEqual([...coverage.exampleIds].sort(), expectedSorted, `${label} example coverage drifted`);
    assert.equal(coverage.revisionsValid, true, `${label} contains an unreviewed or unknown source revision`);
    assert.deepEqual(Object.entries(coverage.tokenValues).filter(([, value]) => !value), [], `${label} has unresolved semantic tokens`);
    assert.ok(coverage.scrollWidth <= coverage.viewportWidth, `${label} overflows horizontally: ${coverage.scrollWidth}/${coverage.viewportWidth}`);
    assert.ok(contrast(coverage.body.color, coverage.body.background) >= 4.5, `${label} body text contrast is below 4.5`);
    assert.ok(coverage.primary, `${label} did not render the primary button variant`);
    assert.ok(contrast(coverage.primary.color, coverage.primary.background) >= 4.5, `${label} primary button contrast is below 4.5`);
    assert.ok(coverage.guide?.visible, `${label} does not expose a visible setup guide link`);
    assert.equal(coverage.guide?.href, 'https://github.com/wornpage/wornpage/blob/main/docs/getting-started.md', `${label} setup guide link target drifted`);
    if (viewportConfig.id === 'compact-touch') {
      assert.deepEqual(coverage.inputSizes.filter((size) => size < 16), [], `${label} has editable text below 16px`);
      const undersized = coverage.targets.filter(({ width, height }) => width < 43.5 || height < 43.5);
      assert.deepEqual(undersized, [], `${label} has undersized touch targets`);
      assert.ok(coverage.guide.width >= 43.5 && coverage.guide.height >= 43.5, `${label} setup guide link is not a 44px touch target`);
    }

    const outcomes = await exerciseFamilies(page, label);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'auto' }));
    await settleFrames(page);
    await page.screenshot({ path: join(OUTPUT_DIR, `${label}-header-nav.png`) });
    const formSection = page.locator('#form-fields');
    await formSection.evaluate((node) => node.scrollIntoView({ behavior: 'auto', block: 'start' }));
    await settleFrames(page);
    const formHeadingBox = await page.locator('#form-fields-heading').boundingBox();
    assert.ok(formHeadingBox && formHeadingBox.y >= 0 && formHeadingBox.y < viewportConfig.viewport.height / 3, `${label} form heading was not positioned for capture`);
    await page.screenshot({ path: join(OUTPUT_DIR, `${label}-form.png`) });
    const formMeta = page.locator('#form-fields .component-meta');
    if (!(await formMeta.evaluate((node) => node.open))) await formMeta.locator('summary').click();
    await formMeta.evaluate((node) => node.scrollIntoView({ behavior: 'auto', block: 'start' }));
    await settleFrames(page);
    const metaSummaryBox = await formMeta.locator('summary').boundingBox();
    assert.ok(metaSummaryBox && metaSummaryBox.y >= 0 && metaSummaryBox.y < viewportConfig.viewport.height / 3, `${label} metadata summary was not positioned for capture`);
    await page.screenshot({ path: join(OUTPUT_DIR, `${label}-metadata.png`) });
    assertClean();
    return { label, theme, viewport: viewportConfig.id, sectionsPresent: coverage.sectionIds.length, outcomesExercised: outcomes, metadata: coverage.metadataIds.length, examples: coverage.exampleIds.length, palette: coverage.palette };
  } catch (error) {
    console.error(`catalog browser cell failed: ${label}\n${error?.stack || error}`);
    throw error;
  } finally {
    try { await context.close(); } catch (error) { console.error(`catalog browser cell cleanup failed: ${label}\n${error?.stack || error}`); throw error; }
  }
}

async function assertSystemCase(browser, colorScheme) {
  const label = `system-${colorScheme}`;
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 }, colorScheme });
  const page = await context.newPage();
  const assertClean = watchPage(page, label);
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'System', exact: true }).click();
    await page.locator(`html[data-theme="${colorScheme}"]`).waitFor();
    assert.equal(await page.evaluate(() => localStorage.getItem('wrn-theme')), 'system');
    const signature = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      const sidebar = getComputedStyle(document.querySelector('.demo-sidebar'));
      const primary = getComputedStyle(document.querySelector('#button .worn-btn.is-primary'));
      return { background: body.backgroundColor, surface: sidebar.backgroundColor, accent: primary.backgroundColor };
    });
    const opposite = colorScheme === 'light' ? 'dark' : 'light';
    await page.emulateMedia({ colorScheme: opposite });
    await page.locator(`html[data-theme="${opposite}"]`).waitFor();
    await page.emulateMedia({ colorScheme });
    await page.locator(`html[data-theme="${colorScheme}"]`).waitFor();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'auto' }));
    await settleFrames(page);
    await page.screenshot({ path: join(OUTPUT_DIR, `${label}-header-nav.png`) });
    assertClean();
    return { label, effectiveTheme: colorScheme, liveOsChange: true, palette: signature };
  } catch (error) {
    console.error(`catalog browser System case failed: ${label}\n${error?.stack || error}`);
    throw error;
  } finally {
    try { await context.close(); } catch (error) { console.error(`catalog browser System cleanup failed: ${label}\n${error?.stack || error}`); throw error; }
  }
}

async function assertInteractions(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  const assertClean = watchPage(page, 'navigation-responsive');
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Search catalog', exact: true }).click();
    await page.getByRole('combobox', { name: 'Command palette search' }).fill('Workflow');
    await page.getByRole('combobox', { name: 'Command palette search' }).press('Enter');
    await page.waitForURL(/#workflow$/);
    await page.locator('#workflow-heading:focus').waitFor();

    await page.getByLabel('Jump to component').selectOption('dialog');
    await page.waitForURL(/#dialog$/);
    await page.locator('#dialog-heading:focus').waitFor();
    await page.goBack();
    await page.waitForURL(/#workflow$/);
    await page.locator('#workflow-heading:focus').waitFor();

    const sidebar = page.locator('.demo-sidebar');
    const toggle = sidebar.getByRole('button', { name: /Collapse navigation/ });
    assert.equal(await toggle.getAttribute('aria-expanded'), 'true', 'Desktop sidebar did not start expanded');
    await page.setViewportSize({ width: 320, height: 900 });
    await page.getByRole('button', { name: 'Expand navigation', exact: true }).waitFor();
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, 'Desktop-to-compact transition overflowed');
    await page.getByRole('button', { name: 'Expand navigation', exact: true }).click();
    const compactGeometry = await page.evaluate(() => {
      const aside = document.querySelector('.demo-sidebar').getBoundingClientRect();
      const main = document.querySelector('.demo-main').getBoundingClientRect();
      return { asideWidth: aside.width, mainWidth: main.width, viewport: innerWidth };
    });
    assert.ok(compactGeometry.asideWidth <= compactGeometry.viewport - 16, 'Expanded compact navigation exceeded its overlay boundary');
    assert.ok(compactGeometry.mainWidth >= compactGeometry.viewport - 1, 'Expanded compact navigation squeezed main content');
    const filter = sidebar.getByRole('searchbox', { name: 'Filter navigation' });
    await filter.fill('Toast');
    await sidebar.locator('a[href="#toast"]').click();
    await page.waitForURL(/#toast$/);
    await page.locator('#toast-heading:focus').waitFor();
    await page.getByRole('button', { name: 'Expand navigation', exact: true }).waitFor();

    assertClean();
    return { searchFocus: true, jumpFocus: true, hashHistory: true, desktopToCompact: true, mobileFilterNavigation: true };
  } catch (error) {
    console.error(`catalog browser navigation-responsive failed\n${error?.stack || error}`);
    throw error;
  } finally {
    try { await context.close(); } catch (error) { console.error(`catalog browser navigation-responsive cleanup failed\n${error?.stack || error}`); throw error; }
  }
}

async function assertPaletteCancellationNavigation(browser, reducedMotion, iterations = 20) {
  const label = `palette-cancel-navigation-${reducedMotion}`;
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 }, reducedMotion });
  const page = await context.newPage();
  const assertClean = watchPage(page, label);
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const search = page.getByRole('button', { name: 'Search catalog', exact: true });
    for (let iteration = 0; iteration < iterations; iteration += 1) {
      const destination = iteration % 2 === 0 ? 'workflow' : 'alert';
      console.log(`catalog browser focus ordering start: ${label} ${iteration + 1}/${iterations} -> ${destination}`);
      await search.click();
      await page.getByRole('dialog', { name: 'Command palette' }).waitFor();
      await page.evaluate((target) => {
        const opener = [...document.querySelectorAll('button')].find((node) => node.textContent?.trim() === 'Search catalog');
        const jump = document.querySelector('#catalog-jump');
        if (!opener || !(jump instanceof HTMLSelectElement)) throw new Error('Palette cancellation regression controls are unavailable');
        const navigateOnNativeRestore = (event) => {
          if (event.target !== opener) return;
          document.removeEventListener('focusin', navigateOnNativeRestore, true);
          jump.value = target;
          jump.dispatchEvent(new Event('change', { bubbles: true }));
        };
        document.addEventListener('focusin', navigateOnNativeRestore, true);
      }, destination);
      await page.keyboard.press('Escape');
      await page.locator(`#${destination}-heading:focus`).waitFor({ timeout: 5000 });
      await page.waitForTimeout(25);
      assert.equal(await page.locator(`#${destination}-heading`).evaluate((node) => node === document.activeElement), true, `${label} iteration ${iteration + 1} let delayed opener restoration steal focus`);
      assert.equal(new URL(page.url()).hash, `#${destination}`);
    }
    assertClean();
    return { label, passed: iterations, expected: iterations };
  } catch (error) {
    console.error(`catalog browser ${label} failed\n${error?.stack || error}`);
    throw error;
  } finally {
    try { await context.close(); } catch (error) { console.error(`catalog browser ${label} cleanup failed\n${error?.stack || error}`); throw error; }
  }
}

async function assertReducedMotionAndKeyboard(browser) {
  const context = await browser.newContext({ viewport: { width: 1024, height: 768 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const assertClean = watchPage(page, 'motion-keyboard');
  try {
    await page.addInitScript(() => {
      window.__catalogScrollBehaviors = [];
      const original = Element.prototype.scrollIntoView;
      Element.prototype.scrollIntoView = function patchedScrollIntoView(options) {
        window.__catalogScrollBehaviors.push(typeof options === 'object' ? options.behavior : 'legacy');
        return original.call(this, options);
      };
    });
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    const search = page.getByRole('button', { name: 'Search catalog', exact: true });
    await search.focus();
    const focusStyle = await search.evaluate((node) => {
      const style = getComputedStyle(node);
      return { outlineStyle: style.outlineStyle, outlineWidth: Number.parseFloat(style.outlineWidth), outlineColor: style.outlineColor, background: getComputedStyle(document.body).backgroundColor };
    });
    assert.notEqual(focusStyle.outlineStyle, 'none');
    assert.ok(focusStyle.outlineWidth >= 2);
    assert.ok(contrast(focusStyle.outlineColor, focusStyle.background) >= 3, 'Keyboard focus outline contrast is below 3');
    await search.click();
    const palette = page.getByRole('dialog', { name: 'Command palette' });
    const animationDuration = await palette.evaluate((node) => getComputedStyle(node).animationDuration);
    assert.ok(animationDuration === '0s' || Number.parseFloat(animationDuration) <= 0.001, `Reduced-motion animation remains ${animationDuration}`);
    assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
    await page.keyboard.press('Escape');
    await page.waitForFunction((selector) => document.activeElement === document.querySelector(selector), '.demo-header button');
    await page.getByLabel('Jump to component').selectOption('workflow');
    await page.locator('#workflow-heading:focus').waitFor();
    const reducedNavigation = await page.evaluate(async () => {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const firstScroll = window.scrollY;
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const box = document.querySelector('#workflow-heading').getBoundingClientRect();
      return { behaviors: window.__catalogScrollBehaviors, settled: firstScroll === window.scrollY, visible: box.top >= 0 && box.bottom <= innerHeight };
    });
    assert.equal(reducedNavigation.behaviors.at(-1), 'auto', 'Reduced-motion JS navigation did not request auto scrolling');
    assert.equal(reducedNavigation.settled, true, 'Reduced-motion navigation did not settle promptly');
    assert.equal(reducedNavigation.visible, true, 'Reduced-motion destination was not visible');
    assertClean();
    return { reducedMotionCss: true, reducedMotionJs: true, keyboardFocus: true, paletteReturnFocus: true };
  } catch (error) {
    console.error(`catalog browser motion-keyboard failed\n${error?.stack || error}`);
    throw error;
  } finally {
    try { await context.close(); } catch (error) { console.error(`catalog browser motion-keyboard cleanup failed\n${error?.stack || error}`); throw error; }
  }
}

await prepareCatalogOutput({ repositoryRoot: REPOSITORY_ROOT, clean: !focusOrderingOnly });
const viteCli = fileURLToPath(new URL('../demo/node_modules/vite/bin/vite.js', import.meta.url));
const preview = spawn(process.execPath, [viteCli, 'preview', '--host', HOST, '--port', String(PORT), '--strictPort'], {
  cwd: fileURLToPath(new URL('../demo/', import.meta.url)),
  stdio: ['ignore', 'pipe', 'pipe'],
});
const previewStartup = observePreviewStartup(preview);

let browser;
try {
  await waitForPreview(preview, previewStartup, { url: BASE_URL });
  console.log('catalog browser phase start: chromium launch');
  browser = await chromium.launch({ headless: true });
  if (focusOrderingOnly) {
    console.log('catalog browser phase start: palette cancellation navigation 20 no-preference + 20 reduce');
    const cases = [
      await assertPaletteCancellationNavigation(browser, 'no-preference'),
      await assertPaletteCancellationNavigation(browser, 'reduce'),
    ];
    const report = {
      passed: cases.reduce((total, scenario) => total + scenario.passed, 0),
      expected: cases.reduce((total, scenario) => total + scenario.expected, 0),
      cases,
    };
    await writeFile(join(OUTPUT_DIR, 'focus-ordering-report.json'), `${JSON.stringify(report, null, 2)}\n`);
    console.log(`catalog browser: ${report.passed}/${report.expected} cancellation-to-navigation focus ordering checks passed`);
  } else {
  const matrix = [];
  for (const viewport of VIEWPORTS) {
    for (const theme of THEMES) {
      console.log(`catalog browser cell start: ${viewport.id}-${theme}`);
      const cell = await assertCatalogCell(browser, viewport, theme);
      matrix.push(cell);
      console.log(`catalog browser cell: ${cell.label} — 26 present, 26 outcomes`);
    }
  }
  console.log('catalog browser phase start: System light/dark');
  const system = [await assertSystemCase(browser, 'light'), await assertSystemCase(browser, 'dark')];
  console.log('catalog browser phase start: navigation-responsive');
  const interactions = await assertInteractions(browser);
  console.log('catalog browser phase start: palette cancellation navigation 20 no-preference + 20 reduce');
  const paletteCancellationNavigation = [
    await assertPaletteCancellationNavigation(browser, 'no-preference'),
    await assertPaletteCancellationNavigation(browser, 'reduce'),
  ];
  console.log('catalog browser phase start: motion-keyboard');
  const accessibility = await assertReducedMotionAndKeyboard(browser);
  const paletteKey = (palette) => `${palette.background}|${palette.surface}|${palette.accent}`;
  for (const viewport of VIEWPORTS) {
    const signatures = new Set(matrix.filter((cell) => cell.viewport === viewport.id).map((cell) => paletteKey(cell.palette)));
    assert.equal(signatures.size, THEMES.length, `${viewport.id} does not expose eight distinct computed palettes`);
  }
  assert.equal(paletteKey(system[0].palette), paletteKey(matrix.find((cell) => cell.viewport === 'desktop-fine' && cell.theme === 'light').palette), 'System light palette differs from named light');
  assert.equal(paletteKey(system[1].palette), paletteKey(matrix.find((cell) => cell.viewport === 'desktop-fine' && cell.theme === 'dark').palette), 'System dark palette differs from named dark');
  const report = {
    namedThemeMatrix: {
      passed: matrix.length,
      expected: 16,
      presenceChecks: matrix.reduce((total, cell) => total + cell.sectionsPresent, 0),
      familyOutcomeChecks: matrix.reduce((total, cell) => total + cell.outcomesExercised, 0),
      distinctPaletteSignaturesPerViewport: 8,
      cells: matrix,
    },
    system: { passed: system.length, expected: 2, cases: system },
    interactions,
    paletteCancellationNavigation: {
      passed: paletteCancellationNavigation.reduce((total, scenario) => total + scenario.passed, 0),
      expected: paletteCancellationNavigation.reduce((total, scenario) => total + scenario.expected, 0),
      cases: paletteCancellationNavigation,
    },
    accessibility,
    screenshots: matrix.length * 4 + system.length,
    pendingDeviceCoverage: ['current iOS Safari', 'installed iOS PWA standalone'],
  };
  assert.equal(matrix.length, 16);
  assert.equal(system.length, 2);
  await writeFile(join(OUTPUT_DIR, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(`catalog browser: ${matrix.length}/16 named-theme cells, ${matrix.length * EXPECTED_IDS.length}/416 presence checks, ${matrix.length * EXPECTED_IDS.length}/416 family outcome checks`);
  console.log('catalog browser: 8/8 distinct computed palette signatures per viewport');
  console.log('catalog browser: 2/2 System light/dark cases; motion, keyboard, focus, state, and containment passed');
  console.log('catalog browser: 40/40 cancellation-to-navigation focus ordering checks passed');
  console.log('catalog browser: iOS Safari and installed iOS PWA remain pending real-device coverage');
  }
} catch (error) {
  if (previewStartup.output.trim()) console.error(previewStartup.output.trim());
  throw error;
} finally {
  await browser?.close();
  if (preview.exitCode === null) preview.kill();
}
