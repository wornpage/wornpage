import type { NavItem } from './types.js';
import { assertNavIcon } from './nav-icon.js';

export interface NavigationClick {
	altKey: boolean;
	button: number;
	ctrlKey: boolean;
	defaultPrevented: boolean;
	metaKey: boolean;
	shiftKey: boolean;
}

const SAFE_ABSOLUTE_SCHEMES = new Set(['https', 'mailto', 'tel']);
const ABSOLUTE_SCHEME = /^([a-z][a-z\d+.-]*):/iu;
const FORBIDDEN_NAVIGATION_CODE_POINT = /[\p{Cc}\p{Cf}\p{Z}]/u;

export function isSafeNavigationHref(href: unknown): href is string {
	if (typeof href !== 'string' || href.length === 0) return false;
	if (FORBIDDEN_NAVIGATION_CODE_POINT.test(href) || href.includes('\\')) return false;
	if (href.startsWith('//')) return false;

	const scheme = ABSOLUTE_SCHEME.exec(href)?.[1];
	return !scheme || SAFE_ABSOLUTE_SCHEMES.has(scheme.toLowerCase());
}

export function assertSafeNavigationHref(href: unknown, field = 'href'): string {
	if (!isSafeNavigationHref(href)) {
		throw new TypeError(`${field} must be a non-empty relative URL or use https:, mailto:, or tel:.`);
	}
	return href;
}

export function validateNavItems(items: unknown, field = 'items'): NavItem[] {
	if (!Array.isArray(items)) throw new TypeError(`${field} must be an array.`);

	for (const [index, item] of items.entries()) {
		const itemField = `${field}[${index}]`;
		if (!item || typeof item !== 'object' || Array.isArray(item)) {
			throw new TypeError(`${itemField} must be an object.`);
		}

		const candidate = item as Partial<NavItem>;
		if (candidate.href !== undefined) assertSafeNavigationHref(candidate.href, `${itemField}.href`);
		if (candidate.icon !== undefined) assertNavIcon(candidate.icon, `${itemField}.icon`);
		if (candidate.children !== undefined) validateNavItems(candidate.children, `${itemField}.children`);
	}

	return items as NavItem[];
}

export function shouldInterceptNavigationClick(event: NavigationClick, hasHandler: boolean): boolean {
	return hasHandler
		&& !event.defaultPrevented
		&& event.button === 0
		&& !event.altKey
		&& !event.ctrlKey
		&& !event.metaKey
		&& !event.shiftKey;
}
