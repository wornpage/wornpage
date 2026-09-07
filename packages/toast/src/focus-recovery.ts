function isShadowRoot(root: Node, ownerDocument: Document): root is ShadowRoot {
	const ShadowRootCtor = ownerDocument.defaultView?.ShadowRoot;
	return Boolean(ShadowRootCtor && root instanceof ShadowRootCtor);
}

function composedParent(element: HTMLElement): HTMLElement | null {
	if (element.assignedSlot) return element.assignedSlot;
	if (element.parentElement) return element.parentElement;
	const root = element.getRootNode();
	return isShadowRoot(root, element.ownerDocument) ? root.host as HTMLElement : null;
}

function composedContains(root: HTMLElement, candidate: HTMLElement): boolean {
	let current: HTMLElement | null = candidate;
	while (current) {
		if (current === root) return true;
		current = composedParent(current);
	}
	return false;
}

function hasExcludedComposedAncestor(candidate: HTMLElement): boolean {
	let current: HTMLElement | null = candidate;
	while (current) {
		if (current.hidden || current.inert || current.getAttribute('aria-hidden') === 'true') return true;
		current = composedParent(current);
	}
	return false;
}

function isVisibleFocusable(candidate: HTMLElement, toastRoot: HTMLElement): boolean {
	if (composedContains(toastRoot, candidate) || candidate.tabIndex < 0 || candidate.matches(':disabled')) return false;
	if (hasExcludedComposedAncestor(candidate) || candidate.getClientRects().length === 0) return false;
	const visibility = candidate.ownerDocument.defaultView?.getComputedStyle(candidate).visibility;
	return visibility !== 'hidden' && visibility !== 'collapse';
}

function composedChildren(element: HTMLElement): Element[] {
	if (element.tagName === 'SLOT') {
		const assigned = (element as HTMLSlotElement).assignedElements({ flatten: true });
		if (assigned.length > 0) return assigned;
	}
	if (element.shadowRoot) return [...element.shadowRoot.children];
	return [...element.children];
}

function composedElements(ownerDocument: Document): HTMLElement[] {
	const HTMLElementCtor = ownerDocument.defaultView?.HTMLElement;
	if (!HTMLElementCtor || !ownerDocument.documentElement) return [];
	const elements: HTMLElement[] = [];
	const visited = new Set<Element>();
	const visit = (element: Element) => {
		if (visited.has(element)) return;
		visited.add(element);
		if (element instanceof HTMLElementCtor) {
			elements.push(element as HTMLElement);
			for (const child of composedChildren(element as HTMLElement)) visit(child);
		}
	};
	visit(ownerDocument.documentElement);
	return elements;
}

export function adjacentFocusTarget(toastRoot: HTMLElement): HTMLElement | undefined {
	const elements = composedElements(toastRoot.ownerDocument);
	const toastIndex = elements.indexOf(toastRoot);
	if (toastIndex < 0) return undefined;
	for (let index = toastIndex + 1; index < elements.length; index += 1) {
		const candidate = elements[index];
		if (isVisibleFocusable(candidate, toastRoot)) return candidate;
	}
	for (let index = toastIndex - 1; index >= 0; index -= 1) {
		const candidate = elements[index];
		if (isVisibleFocusable(candidate, toastRoot)) return candidate;
	}
	return undefined;
}

export function recoverKeyboardDismissFocus(
	event: MouseEvent,
	toastRoot: HTMLElement,
	isFocusVisible = (target: HTMLElement) => target.matches(':focus-visible')
): void {
	const HTMLElementCtor = toastRoot.ownerDocument.defaultView?.HTMLElement;
	const source = event.currentTarget;
	if (event.detail !== 0 || !HTMLElementCtor || !(source instanceof HTMLElementCtor) || !isFocusVisible(source)) return;
	adjacentFocusTarget(toastRoot)?.focus();
}
