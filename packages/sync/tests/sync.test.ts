import { describe, it, expect } from 'bun:test';
import { generateSyncCode, normalizeSyncCode, syncClientId, syncQRUrl, syncTextQR } from '../src/index.ts';

describe('generateSyncCode', () => {
  it('produces a code in XXXX-XXXX-XXXX-XXXX format', () => {
    const code = generateSyncCode();
    expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });

  it('generates unique codes', () => {
    const a = generateSyncCode();
    const b = generateSyncCode();
    expect(a).not.toBe(b);
  });

  it('never contains ambiguous characters', () => {
    for (let i = 0; i < 100; i++) {
      const code = generateSyncCode();
      expect(code).not.toMatch(/[0O1I]/);
    }
  });
});

describe('normalizeSyncCode', () => {
  it('accepts valid codes', () => {
    expect(normalizeSyncCode('ABCD-EFGH-JKLM-NPQR')).toBe('ABCD-EFGH-JKLM-NPQR');
  });

  it('uppercases and strips spaces', () => {
    expect(normalizeSyncCode('abcd efgh jklm npqr')).toBe('ABCD-EFGH-JKLM-NPQR');
  });

  it('rejects invalid formats', () => {
    expect(normalizeSyncCode('not-a-code')).toBeNull();
    expect(normalizeSyncCode('ABC-EFG')).toBeNull();
    expect(normalizeSyncCode('')).toBeNull();
  });
});

describe('syncClientId', () => {
  it('returns a sync- prefixed base64url string', async () => {
    const id = await syncClientId('TEST-CODE-0000-0000');
    expect(id).toMatch(/^sync-[A-Za-z0-9_-]+$/);
  });

  it('is deterministic', async () => {
    const a = await syncClientId('SAME-CODE-1234-5678');
    const b = await syncClientId('SAME-CODE-1234-5678');
    expect(a).toBe(b);
  });

  it('differs for different codes', async () => {
    const a = await syncClientId('CODE-AAAA-AAAA-AAAA');
    const b = await syncClientId('CODE-BBBB-BBBB-BBBB');
    expect(a).not.toBe(b);
  });

describe("syncQRUrl", () => {
  it("returns a qrserver URL with the sync code", () => {
    const url = syncQRUrl("ABCD-EFGH-JKLM-NPQR", "https://example.com");
    expect(url).toContain("api.qrserver.com");
    expect(url).toContain("ABCD-EFGH-JKLM-NPQR");
    expect(decodeURIComponent(url)).toContain('https://example.com');
  });

  it("accepts a custom size", () => {
    const url = syncQRUrl("TEST-CODE-0000-0000", "https://x.com", 400);
    expect(url).toContain("400x400");
  });
});

describe("syncTextQR", () => {
  it("returns a data URI SVG", () => {
    const svg = syncTextQR("ABCD-EFGH-JKLM-NPQR", "https://example.com");
    expect(svg).toContain("data:image/svg+xml");
    expect(decodeURIComponent(svg)).toContain('ABCD-EFGH-JKLM-NPQR');
  });

  it("includes a scannable message", () => {
    const svg = syncTextQR("TEST-CODE", "https://x.com");
    expect(decodeURIComponent(svg)).toContain('Scan to open');
  });
});
});
