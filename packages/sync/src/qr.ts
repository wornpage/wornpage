// Sync-share QR generator — byte-faithful port of the vanilla implementation
// in src/demo/demo.js (syncQrSvg and helpers). Version-5 QR, error correction
// level M, mask 0, byte mode. Pure string-in/SVG-string-out: no inline styles
// (fill lives on attributes, which CSP style-src does not govern), so the
// output is safe to inject under the shared `style-src 'self'` policy.

const SYNC_QR_VERSION = 5;
const SYNC_QR_SIZE = 21 + (SYNC_QR_VERSION - 1) * 4;
const SYNC_QR_DATA_CODEWORDS = 108;
const SYNC_QR_ERROR_CODEWORDS = 26;
const SYNC_QR_QUIET_MODULES = 4;
const SYNC_QR_MAX_BYTES = 106;

export function syncQrSvg(value: string): string {
	const matrix = syncQrMatrix(value);
	const viewBoxSize = SYNC_QR_SIZE + SYNC_QR_QUIET_MODULES * 2;
	const rects: string[] = [];
	matrix.forEach((row, rowIndex) => {
		row.forEach((dark, columnIndex) => {
			if (dark) {
				rects.push(
					`<rect x="${columnIndex + SYNC_QR_QUIET_MODULES}" y="${rowIndex + SYNC_QR_QUIET_MODULES}" width="1" height="1"/>`
				);
			}
		});
	});

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" shape-rendering="crispEdges" aria-hidden="true" focusable="false"><rect width="${viewBoxSize}" height="${viewBoxSize}" fill="#fff"/><g fill="#111">${rects.join('')}</g></svg>`;
}

function syncQrMatrix(value: string): boolean[][] {
	const dataCodewords = syncQrDataCodewords(value);
	const codewords = dataCodewords.concat(
		qrReedSolomonRemainder(dataCodewords, SYNC_QR_ERROR_CODEWORDS)
	);
	const modules: boolean[][] = Array.from({ length: SYNC_QR_SIZE }, () =>
		Array(SYNC_QR_SIZE).fill(false)
	);
	const reserved: boolean[][] = Array.from({ length: SYNC_QR_SIZE }, () =>
		Array(SYNC_QR_SIZE).fill(false)
	);

	setupSyncQrFunctionPatterns(modules, reserved);
	placeSyncQrCodewords(modules, reserved, codewords);
	applySyncQrMask(modules, reserved);
	placeSyncQrFormatBits(modules, reserved);

	return modules;
}

function syncQrDataCodewords(value: string): number[] {
	const bytes = Array.from(new TextEncoder().encode(value));
	if (bytes.length > SYNC_QR_MAX_BYTES) {
		throw new Error('Sync link is too long for the built-in QR code.');
	}

	const bits: number[] = [];
	pushQrBits(bits, 0b0100, 4);
	pushQrBits(bits, bytes.length, 8);
	bytes.forEach((byte) => pushQrBits(bits, byte, 8));

	const capacityBits = SYNC_QR_DATA_CODEWORDS * 8;
	const terminatorBits = Math.min(4, capacityBits - bits.length);
	for (let index = 0; index < terminatorBits; index += 1) {
		bits.push(0);
	}
	while (bits.length % 8 !== 0) {
		bits.push(0);
	}

	const codewords: number[] = [];
	for (let index = 0; index < bits.length; index += 8) {
		codewords.push(bits.slice(index, index + 8).reduce((sum, bit) => (sum << 1) | bit, 0));
	}

	const padBytes = [0xec, 0x11];
	let padIndex = 0;
	while (codewords.length < SYNC_QR_DATA_CODEWORDS) {
		codewords.push(padBytes[padIndex % padBytes.length]);
		padIndex += 1;
	}

	return codewords;
}

function pushQrBits(bits: number[], value: number, length: number): void {
	for (let index = length - 1; index >= 0; index -= 1) {
		bits.push((value >>> index) & 1);
	}
}

function setupSyncQrFunctionPatterns(modules: boolean[][], reserved: boolean[][]): void {
	placeQrFinder(modules, reserved, 0, 0);
	placeQrFinder(modules, reserved, 0, SYNC_QR_SIZE - 7);
	placeQrFinder(modules, reserved, SYNC_QR_SIZE - 7, 0);
	placeQrAlignment(modules, reserved, 30, 30);
	placeQrTiming(modules, reserved);
	reserveQrFormatAreas(modules, reserved);
	setQrFunctionModule(modules, reserved, 4 * SYNC_QR_VERSION + 9, 8, true);
}

function placeQrFinder(
	modules: boolean[][],
	reserved: boolean[][],
	top: number,
	left: number
): void {
	for (let rowOffset = -1; rowOffset <= 7; rowOffset += 1) {
		for (let columnOffset = -1; columnOffset <= 7; columnOffset += 1) {
			const row = top + rowOffset;
			const column = left + columnOffset;
			if (!isQrModuleInBounds(row, column)) {
				continue;
			}

			const separator =
				rowOffset === -1 || rowOffset === 7 || columnOffset === -1 || columnOffset === 7;
			const dark =
				!separator &&
				(rowOffset === 0 ||
					rowOffset === 6 ||
					columnOffset === 0 ||
					columnOffset === 6 ||
					(rowOffset >= 2 && rowOffset <= 4 && columnOffset >= 2 && columnOffset <= 4));
			setQrFunctionModule(modules, reserved, row, column, dark);
		}
	}
}

function placeQrAlignment(
	modules: boolean[][],
	reserved: boolean[][],
	centerRow: number,
	centerColumn: number
): void {
	for (let rowOffset = -2; rowOffset <= 2; rowOffset += 1) {
		for (let columnOffset = -2; columnOffset <= 2; columnOffset += 1) {
			const distance = Math.max(Math.abs(rowOffset), Math.abs(columnOffset));
			const dark = distance === 2 || distance === 0;
			setQrFunctionModule(
				modules,
				reserved,
				centerRow + rowOffset,
				centerColumn + columnOffset,
				dark
			);
		}
	}
}

function placeQrTiming(modules: boolean[][], reserved: boolean[][]): void {
	for (let index = 8; index < SYNC_QR_SIZE - 8; index += 1) {
		const dark = index % 2 === 0;
		setQrFunctionModule(modules, reserved, 6, index, dark);
		setQrFunctionModule(modules, reserved, index, 6, dark);
	}
}

function reserveQrFormatAreas(modules: boolean[][], reserved: boolean[][]): void {
	for (let index = 0; index <= 8; index += 1) {
		if (index !== 6) {
			setQrFunctionModule(modules, reserved, 8, index, false);
			setQrFunctionModule(modules, reserved, index, 8, false);
		}
	}
	for (let index = 0; index < 8; index += 1) {
		setQrFunctionModule(modules, reserved, SYNC_QR_SIZE - 1 - index, 8, false);
		setQrFunctionModule(modules, reserved, 8, SYNC_QR_SIZE - 1 - index, false);
	}
}

function placeSyncQrCodewords(
	modules: boolean[][],
	reserved: boolean[][],
	codewords: number[]
): void {
	const bits: number[] = [];
	codewords.forEach((codeword) => pushQrBits(bits, codeword, 8));
	let bitIndex = 0;
	let upward = true;

	for (let rightColumn = SYNC_QR_SIZE - 1; rightColumn >= 1; rightColumn -= 2) {
		if (rightColumn === 6) {
			rightColumn -= 1;
		}

		for (let rowStep = 0; rowStep < SYNC_QR_SIZE; rowStep += 1) {
			const row = upward ? SYNC_QR_SIZE - 1 - rowStep : rowStep;
			for (let columnOffset = 0; columnOffset < 2; columnOffset += 1) {
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

function applySyncQrMask(modules: boolean[][], reserved: boolean[][]): void {
	for (let row = 0; row < SYNC_QR_SIZE; row += 1) {
		for (let column = 0; column < SYNC_QR_SIZE; column += 1) {
			if (!reserved[row][column] && (row + column) % 2 === 0) {
				modules[row][column] = !modules[row][column];
			}
		}
	}
}

function placeSyncQrFormatBits(modules: boolean[][], reserved: boolean[][]): void {
	const bits = qrFormatBits(0);

	for (let index = 0; index <= 5; index += 1) {
		setQrFunctionModule(modules, reserved, 8, index, qrBit(bits, index));
	}
	setQrFunctionModule(modules, reserved, 8, 7, qrBit(bits, 6));
	setQrFunctionModule(modules, reserved, 8, 8, qrBit(bits, 7));
	setQrFunctionModule(modules, reserved, 7, 8, qrBit(bits, 8));
	for (let index = 9; index < 15; index += 1) {
		setQrFunctionModule(modules, reserved, 14 - index, 8, qrBit(bits, index));
	}

	for (let index = 0; index < 8; index += 1) {
		setQrFunctionModule(modules, reserved, 8, SYNC_QR_SIZE - 1 - index, qrBit(bits, index));
	}
	for (let index = 8; index < 15; index += 1) {
		setQrFunctionModule(modules, reserved, SYNC_QR_SIZE - 15 + index, 8, qrBit(bits, index));
	}
	setQrFunctionModule(modules, reserved, 4 * SYNC_QR_VERSION + 9, 8, true);
}

function qrFormatBits(mask: number): number {
	const errorCorrectionLevelBits = 0b01;
	const data = (errorCorrectionLevelBits << 3) | mask;
	let remainder = data << 10;
	for (let bit = 14; bit >= 10; bit -= 1) {
		if (((remainder >>> bit) & 1) !== 0) {
			remainder ^= 0x537 << (bit - 10);
		}
	}
	return ((data << 10) | (remainder & 0x3ff)) ^ 0x5412;
}

function qrBit(value: number, index: number): boolean {
	return Boolean((value >>> index) & 1);
}

function setQrFunctionModule(
	modules: boolean[][],
	reserved: boolean[][],
	row: number,
	column: number,
	dark: boolean
): void {
	if (!isQrModuleInBounds(row, column)) {
		return;
	}
	modules[row][column] = Boolean(dark);
	reserved[row][column] = true;
}

function isQrModuleInBounds(row: number, column: number): boolean {
	return row >= 0 && row < SYNC_QR_SIZE && column >= 0 && column < SYNC_QR_SIZE;
}

function qrReedSolomonRemainder(dataCodewords: number[], degree: number): number[] {
	const generator = qrReedSolomonGenerator(degree);
	const result: number[] = Array(degree).fill(0);

	dataCodewords.forEach((codeword) => {
		const factor = codeword ^ (result.shift() as number);
		result.push(0);
		generator.slice(1).forEach((coefficient, index) => {
			result[index] ^= qrGaloisMultiply(coefficient, factor);
		});
	});

	return result;
}

function qrReedSolomonGenerator(degree: number): number[] {
	let generator = [1];
	for (let factor = 0; factor < degree; factor += 1) {
		const next = Array(generator.length + 1).fill(0);
		generator.forEach((coefficient, index) => {
			next[index] ^= coefficient;
			next[index + 1] ^= qrGaloisMultiply(coefficient, qrGaloisExponent(factor));
		});
		generator = next;
	}
	return generator;
}

function qrGaloisMultiply(left: number, right: number): number {
	if (left === 0 || right === 0) {
		return 0;
	}
	return qrGaloisExponent(qrGaloisLog(left) + qrGaloisLog(right));
}

let galoisCache: { exponents: number[]; logs: number[] } | null = null;

function qrGaloisTables(): { exponents: number[]; logs: number[] } {
	if (galoisCache) {
		return galoisCache;
	}

	const exponents = Array(255).fill(0);
	const logs = Array(256).fill(0);
	let value = 1;
	for (let index = 0; index < 255; index += 1) {
		exponents[index] = value;
		logs[value] = index;
		value <<= 1;
		if (value & 0x100) {
			value ^= 0x11d;
		}
	}
	galoisCache = { exponents, logs };
	return galoisCache;
}

function qrGaloisExponent(exponent: number): number {
	let normalized = exponent % 255;
	if (normalized < 0) {
		normalized += 255;
	}
	return qrGaloisTables().exponents[normalized];
}

function qrGaloisLog(value: number): number {
	return qrGaloisTables().logs[value];
}
