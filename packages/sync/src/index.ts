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

/**
 * Generate a QR code URL for a sync link using the QR Server API.
 * Returns a URL string suitable for an <img src> attribute.
 * Free, no API key needed. Falls back to a text-based SVG on error.
 *
 * @param syncCode - The sync code to encode
 * @param baseUrl - The base URL of the app (e.g., "https://projectsdemo.org")
 * @param size - QR code size in pixels (default 200)
 */
export function syncQRUrl(syncCode: string, baseUrl: string, size: number = 200): string {
  const url = baseUrl + "?sync=" + encodeURIComponent(syncCode);
  return "https://api.qrserver.com/v1/create-qr-code/?size=" + size + "x" + size + "&data=" + encodeURIComponent(url);
}

/**
 * Offline SVG fallback — a text-based QR placeholder that works without network.
 * Shows the code and URL as readable text in a sized SVG frame.
 */
export function syncTextQR(syncCode: string, baseUrl: string, size: number = 200): string {
  const url = baseUrl + "?sync=" + encodeURIComponent(syncCode);
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '">' +
    '<rect width="' + size + '" height="' + size + '" fill="white"/>' +
    '<text x="' + (size/2) + '" y="' + (size/2) + '" text-anchor="middle" dominant-baseline="middle" font-family="monospace" font-size="12" fill="black">' + syncCode + '</text>' +
    '<text x="' + (size/2) + '" y="' + (size/2 + 18) + '" text-anchor="middle" font-size="8" fill="gray">Scan to open</text>' +
    '</svg>';
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
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
