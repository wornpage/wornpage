# apca-lc

APCA perceptual contrast calculator (SAPC, 0.0.98G-4g constants).

**Tiny. MIT-licensed. Zero dependencies.**

## Why

The reference [`apca-w3`](https://github.com/Myndex/apca-w3) package carries a W3 license. This is an independent, math-only implementation using the published SAPC algorithm and constants. Same math, permissive license.

## Install

```bash
bun add apca-lc     # or: npm install apca-lc
```

## Usage

```ts
import { apcaLc } from "apca-lc";

// Dark text on light background → positive Lc
apcaLc("#1a1a1a", "#f5f3ef");  // ~92

// Light text on dark background → negative Lc
apcaLc("#e0e0e0", "#0f1714");  // ~-88

// Compare magnitudes against readability levels:
//   90  preferred body text
//   75  body text minimum
//   60  content text
//   45  large/heavy headlines
//   30  non-text UI elements
//   15  discernibility threshold
```

## API

### `apcaLc(textHex, bgHex) → number`

Takes hex colors (3, 4, 6, or 8 digit, with or without `#`). Returns signed Lc — positive for dark-on-light, negative for light-on-dark. Throws on unparseable input.

### `hexToRgb(hex) → [r, g, b]`
### `sRGBtoY(hex) → number`
### `wcagRatio(hexA, hexB) → number`

Additional exports for interoperability with WCAG 2.x ratio checks.

## License

MIT
