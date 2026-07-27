/**
 * Generate a random sync code in the format XXXX-XXXX-XXXX-XXXX.
 * Uses crypto.randomUUID() and maps to an alphanumeric code.
 */
export function generateSyncCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/I/1 for readability
  const segments = 4;
  const segmentLen = 4;
  const bytes = new Uint8Array(segments * segmentLen);
  crypto.getRandomValues(bytes);
  const parts: string[] = [];
  for (let s = 0; s < segments; s++) {
    let part = '';
    for (let i = 0; i < segmentLen; i++) {
      part += chars[bytes[s * segmentLen + i] % chars.length];
    }
    parts.push(part);
  }
  return parts.join('-');
}

/**
 * Derive a stable client ID from a sync code using SHA-256.
 * Returns "sync-<base64url>" — safe for headers and localStorage keys.
 */
export async function syncClientId(syncCode: string): Promise<string> {
  const data = new TextEncoder().encode("projects-web-demo-sync:" + syncCode);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hash);
  const base64url = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return "sync-" + base64url.slice(0, 64);
}

/**
 * Normalize a user-entered sync code (uppercase, strip whitespace, validate format).
 * Returns the normalized code or null if invalid.
 */
export function normalizeSyncCode(raw: string): string | null {
  const cleaned = raw.toUpperCase().replace(/\s/g, '');
  // Accept with or without dashes — insert dashes if missing
  let normalized = cleaned.replace(/[^A-Z0-9]/g, '');
  if (normalized.length !== 16) return null;
  normalized = normalized.replace(/(.{4})(.{4})(.{4})(.{4})/, '$1-$2-$3-$4');
  if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(normalized)) {
    return null;
  }
  return normalized;
}
