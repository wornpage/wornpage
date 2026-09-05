import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { describe, expect, test } from 'bun:test';
import { hasLocalPreviewReceipt, observePreviewStartup, waitForPreview } from './catalog-preview-readiness.mjs';

function previewChild() {
  const child = new EventEmitter();
  child.stdout = new PassThrough();
  child.stderr = new PassThrough();
  child.exitCode = null;
  child.signalCode = null;
  return child;
}

describe('catalog preview readiness', () => {
  test('recognizes the plain Vite Local receipt', () => {
    expect(hasLocalPreviewReceipt('  ➜  Local:   http://127.0.0.1:4173/\n')).toBe(true);
  });

  test('normalizes color codes embedded between Local and its colon', () => {
    const colored = '\u001b[1;32m➜\u001b[0m  Local\u001b[36m:\u001b[0m   http://127.0.0.1:4173/\n';
    expect(colored.includes('Local:')).toBe(false);
    expect(hasLocalPreviewReceipt(colored)).toBe(true);
  });

  test('recognizes a colored receipt whose text and control sequences span chunks', () => {
    const child = previewChild();
    const startup = observePreviewStartup(child);
    child.stderr.write('\u001b[1;3');
    child.stderr.write('2m➜\u001b[0m  Loc');
    child.stderr.write('al\u001b[36');
    child.stderr.write('m:\u001b[0m   http://127.0.0.1:4173/\n');

    expect(startup.hasReceipt()).toBe(true);
  });

  test('requires both the owned child receipt and HTTP success', async () => {
    const httpOnlyChild = previewChild();
    const httpOnlyStartup = observePreviewStartup(httpOnlyChild);
    await expect(waitForPreview(httpOnlyChild, httpOnlyStartup, {
      url: 'http://127.0.0.1:4173',
      fetchImpl: async () => ({ ok: true, status: 200 }),
      timeoutMs: 15,
      pollIntervalMs: 1,
    })).rejects.toThrow(/owned child Local preview receipt not observed/);

    const receiptOnlyChild = previewChild();
    const receiptOnlyStartup = observePreviewStartup(receiptOnlyChild);
    receiptOnlyChild.stdout.write('Local: http://127.0.0.1:4173/\n');
    await expect(waitForPreview(receiptOnlyChild, receiptOnlyStartup, {
      url: 'http://127.0.0.1:4173',
      fetchImpl: async () => ({ ok: false, status: 503 }),
      timeoutMs: 15,
      pollIntervalMs: 1,
    })).rejects.toThrow(/HTTP success not observed \(last status 503\)/);

    const readyChild = previewChild();
    const readyStartup = observePreviewStartup(readyChild);
    readyChild.stderr.write('\u001b[32mLocal\u001b[0m: http://127.0.0.1:4173/\n');
    await waitForPreview(readyChild, readyStartup, {
      url: 'http://127.0.0.1:4173',
      fetchImpl: async () => ({ ok: true, status: 200 }),
      timeoutMs: 15,
      pollIntervalMs: 1,
    });
  });

  test('reports only the current readiness blockers after HTTP recovers', async () => {
    const child = previewChild();
    const startup = observePreviewStartup(child);
    let attempt = 0;
    let message = '';

    try {
      await waitForPreview(child, startup, {
        url: 'http://127.0.0.1:4173',
        fetchImpl: async () => {
          attempt += 1;
          if (attempt === 1) throw new Error('initial connection refused');
          return { ok: true, status: 200 };
        },
        timeoutMs: 100,
        pollIntervalMs: 1,
      });
    } catch (error) {
      message = error.message;
    }

    expect(message).toContain('owned child Local preview receipt not observed');
    expect(message).not.toContain('initial connection refused');
    expect(message).not.toContain('HTTP success not observed');
  });

  test('does not cache an HTTP success while waiting for a delayed receipt', async () => {
    const child = previewChild();
    const startup = observePreviewStartup(child);
    let attempt = 0;
    const receiptTimer = setTimeout(() => {
      child.stdout.write('Local: http://127.0.0.1:4173/\n');
    }, 0);

    await expect(waitForPreview(child, startup, {
      url: 'http://127.0.0.1:4173',
      fetchImpl: async () => {
        attempt += 1;
        return attempt === 1 ? { ok: true, status: 200 } : { ok: false, status: 503 };
      },
      timeoutMs: 30,
      pollIntervalMs: 1,
    })).rejects.toThrow(/HTTP success not observed \(last status 503\)/);
    clearTimeout(receiptTimer);
    expect(attempt).toBeGreaterThan(1);
  });

  test('fails immediately when the owned preview child exits', async () => {
    const child = previewChild();
    const startup = observePreviewStartup(child);
    child.exitCode = 7;

    await expect(waitForPreview(child, startup, {
      url: 'http://127.0.0.1:4173',
      fetchImpl: async () => ({ ok: true, status: 200 }),
      timeoutMs: 100,
      pollIntervalMs: 1,
    })).rejects.toThrow('Preview exited early with code 7');
  });

  test('fails immediately when the preview child is signaled or cannot spawn', async () => {
    const signaledChild = previewChild();
    const signaledStartup = observePreviewStartup(signaledChild);
    signaledChild.signalCode = 'SIGTERM';
    await expect(waitForPreview(signaledChild, signaledStartup, {
      url: 'http://127.0.0.1:4173',
      fetchImpl: async () => ({ ok: true, status: 200 }),
      timeoutMs: 100,
      pollIntervalMs: 1,
    })).rejects.toThrow('Preview exited early with signal SIGTERM');

    const spawnErrorChild = previewChild();
    const spawnErrorStartup = observePreviewStartup(spawnErrorChild);
    spawnErrorChild.emit('error', new Error('spawn denied'));
    await expect(waitForPreview(spawnErrorChild, spawnErrorStartup, {
      url: 'http://127.0.0.1:4173',
      fetchImpl: async () => ({ ok: true, status: 200 }),
      timeoutMs: 100,
      pollIntervalMs: 1,
    })).rejects.toThrow('Preview failed to start: spawn denied');
  });
});
