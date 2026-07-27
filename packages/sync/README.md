# @wornpage/sync

Demo state sync codes — generation, normalization, and hashing for
no-account sharing. Pure TypeScript, zero dependencies.

A sync code lets one browser hand its demo state to another device without
sign-in: generate a code, derive a stable client id from it, and any browser
using the same code reads the same server row.

## Install

```bash
bun add @wornpage/sync
```

## Usage

```ts
import { generateSyncCode, syncClientId, normalizeSyncCode } from '@wornpage/sync';

const code = generateSyncCode();          // 'ABCD-2345-WXYZ-6789'
const id = await syncClientId(code);      // 'sync-<base64url>'

normalizeSyncCode('abcd 2345 wxyz 6789'); // 'ABCD-2345-WXYZ-6789'
normalizeSyncCode('too-short');           // null
```

## API

| Function | Signature | Description |
|----------|-----------|-------------|
| `generateSyncCode` | `() => string` | 16 crypto-random chars as `XXXX-XXXX-XXXX-XXXX` |
| `syncClientId` | `(code: string) => Promise<string>` | SHA-256 of `projects-web-demo-sync:<code>`, as `sync-<base64url>` |
| `normalizeSyncCode` | `(raw: string) => string \| null` | Uppercase, strip whitespace, re-insert dashes; `null` if not 16 chars |
| `syncQrSvg` | `(value: string) => string` | QR code for any string, as an inline SVG |
| `syncQR` | `(code: string, baseUrl: string) => string` | QR for `<baseUrl>?sync=<code>`, as an inline SVG |

## QR codes

The QR encoder is dependency-free and returns SVG markup, so it can be
inlined directly rather than loaded as an image:

```svelte
{@html syncQR(code, location.origin)}
```

The returned `<svg>` carries a `viewBox` and no intrinsic width, so it fills
its container — **give that container a size**, or the QR collapses to zero
width and silently renders as nothing.

## Alphabet

Codes use `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` — no `0`/`O` or `1`/`I`, so a code
read off a screen or a QR code is unambiguous when typed by hand.

## Requirements

Needs Web Crypto (`crypto.getRandomValues`, `crypto.subtle`). Available in
browsers, bun, node 19+, and Cloudflare Workers.

## Security

A sync code is a bearer token: anyone holding it can read and write that state.
Codes carry ~80 bits of entropy, which is enough that they cannot be guessed,
but they are not a substitute for authentication. Share only demo data, and
treat a leaked code as a leaked state.

## Tests

```bash
bun test
```

## License

MIT
