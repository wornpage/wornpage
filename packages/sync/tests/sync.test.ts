import { describe, it, expect } from 'bun:test';
import { generateSyncCode, normalizeSyncCode, syncClientId } from '../src/index.ts';

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
});
