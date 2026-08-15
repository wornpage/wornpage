interface VisibleScrollOptions {
	scrollLeft: number;
	clientWidth: number;
	scrollWidth: number;
	itemLeft: number;
	itemRight: number;
	padding?: number;
}

export function visibleScrollLeft({
	scrollLeft,
	clientWidth,
	scrollWidth,
	itemLeft,
	itemRight,
	padding = 8,
}: VisibleScrollOptions) {
	let next = scrollLeft;
	if (itemLeft < padding) next += itemLeft - padding;
	else if (itemRight > clientWidth - padding) next += itemRight - (clientWidth - padding);

	return Math.max(0, Math.min(Math.max(0, scrollWidth - clientWidth), next));
}
