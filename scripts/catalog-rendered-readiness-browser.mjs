import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';
import { chromium } from 'playwright';
import { observeRenderedReadiness, renderedSampleStatus } from './catalog-rendered-readiness.mjs';

let browser;
let page;

before(async () => {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage({ viewport: { width: 320, height: 240 } });
});

after(async () => {
  await browser?.close();
});

describe('catalog rendered readiness', () => {
  test('waits for a moving overlay to settle inside the viewport', async () => {
    await page.setContent('<div id="target" style="position: fixed; top: 16px; right: 16px; width: 160px; height: 80px; background: black"></div>');
    await page.locator('#target').evaluate((node) => {
      node.animate(
        [{ transform: 'translateX(280px)' }, { transform: 'translateX(0)' }],
        { duration: 80 },
      );
    });

    const readiness = await observeRenderedReadiness(page.locator('#target'), { maxFrames: 20, stableFrames: 2 });

    assert.equal(readiness.ready, true);
    assert.deepEqual(renderedSampleStatus(readiness.final), { contained: true, opaque: true, animationsSettled: true });
    assert.equal(readiness.samples.some((sample) => sample.animations.some(({ playState }) => playState === 'running')), true);
  });

  test('reports a persistently out-of-bounds overlay with measured geometry', async () => {
    await page.setContent('<div id="target" style="position: fixed; top: 16px; left: 330px; width: 40px; height: 80px; opacity: 1"></div>');

    const readiness = await observeRenderedReadiness(page.locator('#target'), { maxFrames: 3, stableFrames: 1 });

    assert.equal(readiness.ready, false);
    assert.deepEqual(renderedSampleStatus(readiness.final), { contained: false, opaque: true, animationsSettled: true });
    assert.equal(readiness.final.left, 330);
    assert.equal(readiness.final.right, 370);
    assert.equal(readiness.final.viewportWidth, 320);
  });

  test('reports a persistently nonopaque overlay with computed opacity', async () => {
    await page.setContent('<div id="target" style="position: fixed; inset: 16px; opacity: 0.5"></div>');

    const readiness = await observeRenderedReadiness(page.locator('#target'), { maxFrames: 3, stableFrames: 1 });

    assert.equal(readiness.ready, false);
    assert.deepEqual(renderedSampleStatus(readiness.final), { contained: true, opaque: false, animationsSettled: true });
    assert.equal(readiness.final.opacity, '0.5');
  });
});
