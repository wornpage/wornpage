import type { NavIcon, NavIconShape } from './types.js';

const VIEW_BOX = /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?(?:[ ,]+[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?){3}$/iu;
const POINTS = /^[-+\d.e,\s]+$/iu;
const MAX_SHAPES = 64;
const MAX_SVG_VALUE_LENGTH = 4096;

const SHAPE_KEYS: Record<NavIconShape['type'], readonly string[]> = {
	path: ['type', 'd'],
	circle: ['type', 'cx', 'cy', 'r'],
	line: ['type', 'x1', 'y1', 'x2', 'y2'],
	polyline: ['type', 'points'],
	polygon: ['type', 'points'],
	rect: ['type', 'x', 'y', 'width', 'height', 'rx', 'ry'],
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function assertExactKeys(value: Record<string, unknown>, allowed: readonly string[], field: string): void {
	const unexpected = Object.keys(value).find((key) => !allowed.includes(key));
	if (unexpected) throw new TypeError(`${field}.${unexpected} is not a supported icon field.`);
}

function assertFiniteNumber(value: unknown, field: string): void {
	if (typeof value !== 'number' || !Number.isFinite(value)) {
		throw new TypeError(`${field} must be a finite number.`);
	}
}

function assertSvgString(value: unknown, field: string, pattern?: RegExp): void {
	if (typeof value !== 'string' || value.length === 0 || value.length > MAX_SVG_VALUE_LENGTH || (pattern && !pattern.test(value))) {
		throw new TypeError(`${field} is not a valid SVG value.`);
	}
}

function assertNavIconShape(value: unknown, field: string): asserts value is NavIconShape {
	if (!isRecord(value) || typeof value.type !== 'string' || !Object.hasOwn(SHAPE_KEYS, value.type)) {
		throw new TypeError(`${field}.type must name a supported SVG primitive.`);
	}

	const type = value.type as NavIconShape['type'];
	assertExactKeys(value, SHAPE_KEYS[type], field);

	switch (type) {
		case 'path':
			assertSvgString(value.d, `${field}.d`);
			break;
		case 'circle':
			assertFiniteNumber(value.cx, `${field}.cx`);
			assertFiniteNumber(value.cy, `${field}.cy`);
			assertFiniteNumber(value.r, `${field}.r`);
			break;
		case 'line':
			assertFiniteNumber(value.x1, `${field}.x1`);
			assertFiniteNumber(value.y1, `${field}.y1`);
			assertFiniteNumber(value.x2, `${field}.x2`);
			assertFiniteNumber(value.y2, `${field}.y2`);
			break;
		case 'polyline':
		case 'polygon':
			assertSvgString(value.points, `${field}.points`, POINTS);
			break;
		case 'rect':
			assertFiniteNumber(value.x, `${field}.x`);
			assertFiniteNumber(value.y, `${field}.y`);
			assertFiniteNumber(value.width, `${field}.width`);
			assertFiniteNumber(value.height, `${field}.height`);
			if (value.rx !== undefined) assertFiniteNumber(value.rx, `${field}.rx`);
			if (value.ry !== undefined) assertFiniteNumber(value.ry, `${field}.ry`);
			break;
	}
}

export function assertNavIcon(value: unknown, field = 'icon'): NavIcon {
	if (!isRecord(value)) throw new TypeError(`${field} must be a structured icon object.`);
	assertExactKeys(value, ['viewBox', 'shapes'], field);
	if (value.viewBox !== undefined) assertSvgString(value.viewBox, `${field}.viewBox`, VIEW_BOX);
	if (!Array.isArray(value.shapes) || value.shapes.length === 0 || value.shapes.length > MAX_SHAPES) {
		throw new TypeError(`${field}.shapes must contain between 1 and ${MAX_SHAPES} SVG primitives.`);
	}
	value.shapes.forEach((shape, index) => assertNavIconShape(shape, `${field}.shapes[${index}]`));
	return value as unknown as NavIcon;
}
