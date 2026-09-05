import { stripVTControlCharacters } from 'node:util';

const LOCAL_PREVIEW_RECEIPT = /(?:^|\s)Local:\s+https?:\/\/\S+/mu;

export function hasLocalPreviewReceipt(output) {
  return LOCAL_PREVIEW_RECEIPT.test(stripVTControlCharacters(output));
}

export function observePreviewStartup(child) {
  let output = '';
  let startupError = null;
  const append = (chunk) => { output += chunk.toString(); };

  child.stdout.on('data', append);
  child.stderr.on('data', append);
  child.once('error', (error) => { startupError = error; });

  return {
    get output() { return output; },
    get startupError() { return startupError; },
    hasReceipt() { return hasLocalPreviewReceipt(output); },
  };
}

function previewProcessFailure(child, startup) {
  if (startup.startupError) return `Preview failed to start: ${startup.startupError.message}`;
  if (child.exitCode !== null) return `Preview exited early with code ${child.exitCode}`;
  if (child.signalCode !== null) return `Preview exited early with signal ${child.signalCode}`;
  return null;
}

async function fetchWithin(fetchImpl, url, timeoutMs) {
  const controller = new AbortController();
  let timeout;
  const expired = new Promise((_, reject) => {
    timeout = setTimeout(() => {
      controller.abort();
      reject(new Error(`request exceeded ${timeoutMs}ms`));
    }, timeoutMs);
  });
  try {
    return await Promise.race([fetchImpl(url, { signal: controller.signal }), expired]);
  } finally {
    clearTimeout(timeout);
  }
}

export async function waitForPreview(child, startup, {
  url,
  fetchImpl = fetch,
  timeoutMs = 20_000,
  pollIntervalMs = 250,
  requestTimeoutMs = 1_000,
} = {}) {
  if (!url) throw new Error('Preview readiness requires a URL.');
  const deadline = Date.now() + timeoutMs;
  let httpReady = false;
  let lastHttpStatus = null;
  let lastHttpError = null;

  while (Date.now() < deadline) {
    const processFailure = previewProcessFailure(child, startup);
    if (processFailure) throw new Error(processFailure);

    const remainingMs = deadline - Date.now();
    try {
      const response = await fetchWithin(fetchImpl, url, Math.max(1, Math.min(requestTimeoutMs, remainingMs)));
      lastHttpStatus = response.status;
      lastHttpError = null;
      httpReady = response.ok;
    } catch (error) {
      httpReady = false;
      lastHttpStatus = null;
      lastHttpError = error;
    }

    const receiptReady = startup.hasReceipt();
    const processFailureAfterFetch = previewProcessFailure(child, startup);
    if (processFailureAfterFetch) throw new Error(processFailureAfterFetch);
    if (receiptReady && httpReady) return;

    const waitRemainingMs = deadline - Date.now();
    if (waitRemainingMs <= 0) break;
    await new Promise((resolve) => setTimeout(resolve, Math.min(pollIntervalMs, waitRemainingMs)));
  }

  const terminalProcessFailure = previewProcessFailure(child, startup);
  if (terminalProcessFailure) throw new Error(terminalProcessFailure);
  const missing = [];
  if (!startup.hasReceipt()) missing.push('owned child Local preview receipt not observed');
  if (!httpReady) {
    if (lastHttpStatus !== null) missing.push(`HTTP success not observed (last status ${lastHttpStatus})`);
    else if (lastHttpError) missing.push(`HTTP success not observed (last error: ${lastHttpError.message})`);
    else missing.push('HTTP success not observed');
  }
  throw new Error(`Preview did not become ready within ${timeoutMs}ms: ${missing.join('; ')}`);
}
