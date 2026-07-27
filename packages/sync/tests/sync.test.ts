import { describe, it, expect } from 'bun:test';
import { generateSyncCode, normalizeSyncCode, syncClientId, syncQR } from '../src/index.ts';

describe('generateSyncCode', () => {
  it('produces a code in XXXX-XXXX-XXXX-XXXX format', () => {
    const code = generateSyncCode();
    expect(code).toMatch(/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/);
  });
  it('generates unique codes', () => {
    expect(generateSyncCode()).not.toBe(generateSyncCode());
  });
  it('never contains ambiguous characters', () => {
    for (let i = 0; i < 100; i++) expect(generateSyncCode()).not.toMatch(/[0O1I]/);
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
    expect(normalizeSyncCode('')).toBeNull();
  });
});

describe('syncClientId', () => {
  it('returns a sync- prefixed base64url string', async () => {
    const id = await syncClientId('TEST-CODE-0000-0000');
    expect(id).toMatch(/^sync-[A-Za-z0-9_-]+$/);
  });
  it('is deterministic', async () => {
    expect(await syncClientId('SAME-CODE-1234-5678')).toBe(await syncClientId('SAME-CODE-1234-5678'));
  });
  it('differs for different codes', async () => {
    expect(await syncClientId('CODE-AAAA-AAAA-AAAA')).not.toBe(await syncClientId('CODE-BBBB-BBBB-BBBB'));
  });
});

describe('syncQR', () => {
  it('returns an SVG string', () => {
    const svg = syncQR('ABCD-EFGH-JKLM-NPQR', 'https://example.com');
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });
  it('encodes the full URL in the QR', () => {
    const svg = syncQR('TEST-CODE', 'https://example.com');
    expect(svg).toContain('viewBox');
  });
});