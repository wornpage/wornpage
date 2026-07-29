// src/qr.ts
var SYNC_QR_VERSION = 5;
var SYNC_QR_SIZE = 21 + (SYNC_QR_VERSION - 1) * 4;
var SYNC_QR_DATA_CODEWORDS = 108;
var SYNC_QR_ERROR_CODEWORDS = 26;
var SYNC_QR_QUIET_MODULES = 4;
var SYNC_QR_MAX_BYTES = 106;
function syncQrSvg(value) {
  const matrix = syncQrMatrix(value);
  const viewBoxSize = SYNC_QR_SIZE + SYNC_QR_QUIET_MODULES * 2;
  const rects = [];
  matrix.forEach((row, rowIndex) => {
    row.forEach((dark, columnIndex) => {
      if (dark) {
        rects.push(`<rect x="${columnIndex + SYNC_QR_QUIET_MODULES}" y="${rowIndex + SYNC_QR_QUIET_MODULES}" width="1" height="1"/>`);
      }
    });
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" shape-rendering="crispEdges" aria-hidden="true" focusable="false"><rect width="${viewBoxSize}" height="${viewBoxSize}" fill="#fff"/><g fill="#111">${rects.join("")}</g></svg>`;
}
function syncQrMatrix(value) {
  const dataCodewords = syncQrDataCodewords(value);
  const codewords = dataCodewords.concat(qrReedSolomonRemainder(dataCodewords, SYNC_QR_ERROR_CODEWORDS));
  const modules = Array.from({ length: SYNC_QR_SIZE }, () => Array(SYNC_QR_SIZE).fill(false));
  const reserved = Array.from({ length: SYNC_QR_SIZE }, () => Array(SYNC_QR_SIZE).fill(false));
  setupSyncQrFunctionPatterns(modules, reserved);
  placeSyncQrCodewords(modules, reserved, codewords);
  applySyncQrMask(modules, reserved);
  placeSyncQrFormatBits(modules, reserved);
  return modules;
}
function syncQrDataCodewords(value) {
  const bytes = Array.from(new TextEncoder().encode(value));
  if (bytes.length > SYNC_QR_MAX_BYTES) {
    throw new Error("Sync link is too long for the built-in QR code.");
  }
  const bits = [];
  pushQrBits(bits, 4, 4);
  pushQrBits(bits, bytes.length, 8);
  bytes.forEach((byte) => pushQrBits(bits, byte, 8));
  const capacityBits = SYNC_QR_DATA_CODEWORDS * 8;
  const terminatorBits = Math.min(4, capacityBits - bits.length);
  for (let index = 0;index < terminatorBits; index += 1) {
    bits.push(0);
  }
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }
  const codewords = [];
  for (let index = 0;index < bits.length; index += 8) {
    codewords.push(bits.slice(index, index + 8).reduce((sum, bit) => sum << 1 | bit, 0));
  }
  const padBytes = [236, 17];
  let padIndex = 0;
  while (codewords.length < SYNC_QR_DATA_CODEWORDS) {
    codewords.push(padBytes[padIndex % padBytes.length]);
    padIndex += 1;
  }
  return codewords;
}
function pushQrBits(bits, value, length) {
  for (let index = length - 1;index >= 0; index -= 1) {
    bits.push(value >>> index & 1);
  }
}
function setupSyncQrFunctionPatterns(modules, reserved) {
  placeQrFinder(modules, reserved, 0, 0);
  placeQrFinder(modules, reserved, 0, SYNC_QR_SIZE - 7);
  placeQrFinder(modules, reserved, SYNC_QR_SIZE - 7, 0);
  placeQrAlignment(modules, reserved, 30, 30);
  placeQrTiming(modules, reserved);
  reserveQrFormatAreas(modules, reserved);
  setQrFunctionModule(modules, reserved, 4 * SYNC_QR_VERSION + 9, 8, true);
}
function placeQrFinder(modules, reserved, top, left) {
  for (let rowOffset = -1;rowOffset <= 7; rowOffset += 1) {
    for (let columnOffset = -1;columnOffset <= 7; columnOffset += 1) {
      const row = top + rowOffset;
      const column = left + columnOffset;
      if (!isQrModuleInBounds(row, column)) {
        continue;
      }
      const separator = rowOffset === -1 || rowOffset === 7 || columnOffset === -1 || columnOffset === 7;
      const dark = !separator && (rowOffset === 0 || rowOffset === 6 || columnOffset === 0 || columnOffset === 6 || rowOffset >= 2 && rowOffset <= 4 && columnOffset >= 2 && columnOffset <= 4);
      setQrFunctionModule(modules, reserved, row, column, dark);
    }
  }
}
function placeQrAlignment(modules, reserved, centerRow, centerColumn) {
  for (let rowOffset = -2;rowOffset <= 2; rowOffset += 1) {
    for (let columnOffset = -2;columnOffset <= 2; columnOffset += 1) {
      const distance = Math.max(Math.abs(rowOffset), Math.abs(columnOffset));
      const dark = distance === 2 || distance === 0;
      setQrFunctionModule(modules, reserved, centerRow + rowOffset, centerColumn + columnOffset, dark);
    }
  }
}
function placeQrTiming(modules, reserved) {
  for (let index = 8;index < SYNC_QR_SIZE - 8; index += 1) {
    const dark = index % 2 === 0;
    setQrFunctionModule(modules, reserved, 6, index, dark);
    setQrFunctionModule(modules, reserved, index, 6, dark);
  }
}
function reserveQrFormatAreas(modules, reserved) {
  for (let index = 0;index <= 8; index += 1) {
    if (index !== 6) {
      setQrFunctionModule(modules, reserved, 8, index, false);
      setQrFunctionModule(modules, reserved, index, 8, false);
    }
  }
  for (let index = 0;index < 8; index += 1) {
    setQrFunctionModule(modules, reserved, SYNC_QR_SIZE - 1 - index, 8, false);
    setQrFunctionModule(modules, reserved, 8, SYNC_QR_SIZE - 1 - index, false);
  }
}
function placeSyncQrCodewords(modules, reserved, codewords) {
  const bits = [];
  codewords.forEach((codeword) => pushQrBits(bits, codeword, 8));
  let bitIndex = 0;
  let upward = true;
  for (let rightColumn = SYNC_QR_SIZE - 1;rightColumn >= 1; rightColumn -= 2) {
    if (rightColumn === 6) {
      rightColumn -= 1;
    }
    for (let rowStep = 0;rowStep < SYNC_QR_SIZE; rowStep += 1) {
      const row = upward ? SYNC_QR_SIZE - 1 - rowStep : rowStep;
      for (let columnOffset = 0;columnOffset < 2; columnOffset += 1) {
        const column = rightColumn - columnOffset;
        if (!reserved[row][column]) {
          modules[row][column] = bitIndex < bits.length ? Boolean(bits[bitIndex]) : false;
          bitIndex += 1;
        }
      }
    }
    upward = !upward;
  }
}
function applySyncQrMask(modules, reserved) {
  for (let row = 0;row < SYNC_QR_SIZE; row += 1) {
    for (let column = 0;column < SYNC_QR_SIZE; column += 1) {
      if (!reserved[row][column] && (row + column) % 2 === 0) {
        modules[row][column] = !modules[row][column];
      }
    }
  }
}
function placeSyncQrFormatBits(modules, reserved) {
  const bits = qrFormatBits(0);
  for (let index = 0;index <= 5; index += 1) {
    setQrFunctionModule(modules, reserved, 8, index, qrBit(bits, index));
  }
  setQrFunctionModule(modules, reserved, 8, 7, qrBit(bits, 6));
  setQrFunctionModule(modules, reserved, 8, 8, qrBit(bits, 7));
  setQrFunctionModule(modules, reserved, 7, 8, qrBit(bits, 8));
  for (let index = 9;index < 15; index += 1) {
    setQrFunctionModule(modules, reserved, 14 - index, 8, qrBit(bits, index));
  }
  for (let index = 0;index < 8; index += 1) {
    setQrFunctionModule(modules, reserved, 8, SYNC_QR_SIZE - 1 - index, qrBit(bits, index));
  }
  for (let index = 8;index < 15; index += 1) {
    setQrFunctionModule(modules, reserved, SYNC_QR_SIZE - 15 + index, 8, qrBit(bits, index));
  }
  setQrFunctionModule(modules, reserved, 4 * SYNC_QR_VERSION + 9, 8, true);
}
function qrFormatBits(mask) {
  const errorCorrectionLevelBits = 1;
  const data = errorCorrectionLevelBits << 3 | mask;
  let remainder = data << 10;
  for (let bit = 14;bit >= 10; bit -= 1) {
    if ((remainder >>> bit & 1) !== 0) {
      remainder ^= 1335 << bit - 10;
    }
  }
  return (data << 10 | remainder & 1023) ^ 21522;
}
function qrBit(value, index) {
  return Boolean(value >>> index & 1);
}
function setQrFunctionModule(modules, reserved, row, column, dark) {
  if (!isQrModuleInBounds(row, column)) {
    return;
  }
  modules[row][column] = Boolean(dark);
  reserved[row][column] = true;
}
function isQrModuleInBounds(row, column) {
  return row >= 0 && row < SYNC_QR_SIZE && column >= 0 && column < SYNC_QR_SIZE;
}
function qrReedSolomonRemainder(dataCodewords, degree) {
  const generator = qrReedSolomonGenerator(degree);
  const result = Array(degree).fill(0);
  dataCodewords.forEach((codeword) => {
    const factor = codeword ^ result.shift();
    result.push(0);
    generator.slice(1).forEach((coefficient, index) => {
      result[index] ^= qrGaloisMultiply(coefficient, factor);
    });
  });
  return result;
}
function qrReedSolomonGenerator(degree) {
  let generator = [1];
  for (let factor = 0;factor < degree; factor += 1) {
    const next = Array(generator.length + 1).fill(0);
    generator.forEach((coefficient, index) => {
      next[index] ^= coefficient;
      next[index + 1] ^= qrGaloisMultiply(coefficient, qrGaloisExponent(factor));
    });
    generator = next;
  }
  return generator;
}
function qrGaloisMultiply(left, right) {
  if (left === 0 || right === 0) {
    return 0;
  }
  return qrGaloisExponent(qrGaloisLog(left) + qrGaloisLog(right));
}
var galoisCache = null;
function qrGaloisTables() {
  if (galoisCache) {
    return galoisCache;
  }
  const exponents = Array(255).fill(0);
  const logs = Array(256).fill(0);
  let value = 1;
  for (let index = 0;index < 255; index += 1) {
    exponents[index] = value;
    logs[value] = index;
    value <<= 1;
    if (value & 256) {
      value ^= 285;
    }
  }
  galoisCache = { exponents, logs };
  return galoisCache;
}
function qrGaloisExponent(exponent) {
  let normalized = exponent % 255;
  if (normalized < 0) {
    normalized += 255;
  }
  return qrGaloisTables().exponents[normalized];
}
function qrGaloisLog(value) {
  return qrGaloisTables().logs[value];
}

// src/index.ts
function generateSyncCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments = 4;
  const segmentLen = 4;
  const bytes = new Uint8Array(segments * segmentLen);
  crypto.getRandomValues(bytes);
  const parts = [];
  for (let s = 0;s < segments; s++) {
    let part = "";
    for (let i = 0;i < segmentLen; i++) {
      part += chars[bytes[s * segmentLen + i] % chars.length];
    }
    parts.push(part);
  }
  return parts.join("-");
}
async function syncClientId(syncCode) {
  const data = new TextEncoder().encode("projects-web-demo-sync:" + syncCode);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(hash);
  const base64url = btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return "sync-" + base64url.slice(0, 64);
}
function normalizeSyncCode(raw) {
  const cleaned = raw.toUpperCase().replace(/\s/g, "");
  let normalized = cleaned.replace(/[^A-Z0-9]/g, "");
  if (normalized.length !== 16)
    return null;
  normalized = normalized.replace(/(.{4})(.{4})(.{4})(.{4})/, "$1-$2-$3-$4");
  if (!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(normalized)) {
    return null;
  }
  return normalized;
}
function syncQR(syncCode, baseUrl) {
  return syncQrSvg(baseUrl + "?sync=" + encodeURIComponent(syncCode));
}
export {
  syncQrSvg,
  syncQR,
  syncClientId,
  normalizeSyncCode,
  generateSyncCode
};
