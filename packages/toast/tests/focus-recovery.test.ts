import { describe, expect, it } from 'bun:test';
import { recoverKeyboardDismissFocus } from '../src/focus-recovery';

class FakeDocument {
	activeElement: FakeElement | null = null;
	documentElement: FakeElement;
	defaultView: {
		ShadowRoot: typeof FakeShadowRoot;
		HTMLElement: typeof FakeElement;
		getComputedStyle: (element: FakeElement) => { visibility: string };
	};

	constructor() {
		this.defaultView = {
			ShadowRoot: FakeShadowRoot,
			HTMLElement: FakeElement,
			getComputedStyle: (element) => ({ visibility: element.visibility })
		};
		this.documentElement = new FakeElement('Document root', this, -1);
	}
}

class FakeElement {
	ownerDocument: FakeDocument;
	label: string;
	tagName = 'DIV';
	visible = true;
	visibility = 'visible';
	tabIndex: number;
	disabled = false;
	hidden = false;
	inert = false;
	ariaHidden = false;
	focused = false;
	parentElement: FakeElement | null = null;
	root: FakeDocument | FakeShadowRoot;
	children: FakeElement[] = [];
	shadowRoot: FakeShadowRoot | null = null;
	assigned: FakeElement[] = [];
	assignedSlot: FakeElement | null = null;

	constructor(label: string, ownerDocument: FakeDocument, tabIndex = 0) {
		this.label = label;
		this.ownerDocument = ownerDocument;
		this.root = ownerDocument;
		this.tabIndex = tabIndex;
	}

	append(...children: FakeElement[]) {
		for (const child of children) {
			child.parentElement = this;
			child.root = this.root;
			this.children.push(child);
		}
	}

	attachShadowRoot() {
		const shadow = new FakeShadowRoot(this);
		this.shadowRoot = shadow;
		return shadow;
	}

	assignedElements() {
		return this.assigned;
	}

	getAttribute(name: string) {
		return name === 'aria-hidden' && this.ariaHidden ? 'true' : null;
	}

	getClientRects() {
		return { length: this.visible ? 1 : 0 };
	}

	getRootNode() {
		return this.root;
	}

	focus() {
		this.focused = true;
		this.ownerDocument.activeElement = this;
	}

	matches(selector: string) {
		return selector === ':disabled' ? this.disabled : true;
	}
}

class FakeShadowRoot {
	host: FakeElement;
	children: FakeElement[] = [];

	constructor(host: FakeElement) {
		this.host = host;
	}

	append(...children: FakeElement[]) {
		for (const child of children) {
			child.parentElement = null;
			child.root = this;
			this.children.push(child);
		}
	}
}

function fixture() {
	const document = new FakeDocument();
	const toast = new FakeElement('Toast', document, -1);
	const dismiss = new FakeElement('Dismiss', document);
	toast.append(dismiss);
	document.documentElement.append(toast);
	return { document, toast, dismiss };
}

function setDocumentOrder(document: FakeDocument, ...elements: FakeElement[]) {
	document.documentElement.children = [];
	document.documentElement.append(...elements);
}

function recover(detail: number, toast: FakeElement, dismiss: FakeElement) {
	recoverKeyboardDismissFocus(
		{ detail, currentTarget: dismiss } as unknown as MouseEvent,
		toast as unknown as HTMLElement,
		() => true
	);
}

describe('toast keyboard-dismiss focus recovery', () => {
	it('focuses the next visible light-DOM control', () => {
		const { document, toast, dismiss } = fixture();
		const previous = new FakeElement('Previous', document);
		const next = new FakeElement('Next', document);
		setDocumentOrder(document, previous, toast, next);
		recover(0, toast, dismiss);
		expect(document.activeElement?.label).toBe('Next');
	});

	it('falls back to the nearest previous visible control', () => {
		const { document, toast, dismiss } = fixture();
		const firstPrevious = new FakeElement('First previous', document);
		const nearestPrevious = new FakeElement('Nearest previous', document);
		setDocumentOrder(document, firstPrevious, nearestPrevious, toast);
		recover(0, toast, dismiss);
		expect(document.activeElement?.label).toBe('Nearest previous');
	});

	it('skips hidden, inert, disabled, and negative-tabindex candidates', () => {
		const { document, toast, dismiss } = fixture();
		const noRect = new FakeElement('No rect', document);
		noRect.visible = false;
		const hidden = new FakeElement('Hidden', document);
		hidden.visibility = 'hidden';
		const collapsed = new FakeElement('Collapsed', document);
		collapsed.visibility = 'collapse';
		const hiddenAttribute = new FakeElement('Hidden attribute', document);
		hiddenAttribute.hidden = true;
		const disabled = new FakeElement('Disabled', document);
		disabled.disabled = true;
		const untabbable = new FakeElement('Untabbable', document, -2);
		const inertParent = new FakeElement('Inert parent', document, -1);
		inertParent.inert = true;
		const inertChild = new FakeElement('Inert child', document);
		inertParent.append(inertChild);
		const next = new FakeElement('Next', document);
		setDocumentOrder(document, toast, noRect, hidden, collapsed, hiddenAttribute, disabled, untabbable, inertParent, next);
		recover(0, toast, dismiss);
		expect(document.activeElement?.label).toBe('Next');
	});

	it('excludes the complete composed toast subtree and leaves focus alone when no target remains', () => {
		const { document, toast, dismiss } = fixture();
		const nestedHost = new FakeElement('Nested host', document, -1);
		const nestedShadow = nestedHost.attachShadowRoot();
		const nestedControl = new FakeElement('Nested control', document);
		nestedShadow.append(nestedControl);
		toast.append(nestedHost);
		recover(0, toast, dismiss);
		expect(document.activeElement).toBeNull();
	});

	it('does not move focus for pointer dismissal', () => {
		const { document, toast, dismiss } = fixture();
		const next = new FakeElement('Next', document);
		setDocumentOrder(document, toast, next);
		recover(1, toast, dismiss);
		expect(document.activeElement).toBeNull();
		expect(next.focused).toBe(false);
	});

	it('does not move focus without visible keyboard focus', () => {
		const { document, toast, dismiss } = fixture();
		const next = new FakeElement('Next', document);
		setDocumentOrder(document, toast, next);
		recoverKeyboardDismissFocus(
			{ detail: 0, currentTarget: dismiss } as unknown as MouseEvent,
			toast as unknown as HTMLElement,
			() => false
		);
		expect(document.activeElement).toBeNull();
		expect(next.focused).toBe(false);
	});

	it('keeps recovery inside the shadow root when a following control exists', () => {
		const { document, toast, dismiss } = fixture();
		const host = new FakeElement('Host', document, -1);
		const shadow = host.attachShadowRoot();
		const inside = new FakeElement('Inside', document);
		const outside = new FakeElement('Outside', document);
		shadow.append(toast, inside);
		setDocumentOrder(document, host, outside);
		recover(0, toast, dismiss);
		expect(document.activeElement?.label).toBe('Inside');
		expect(outside.focused).toBe(false);
	});

	it('prefers an outer following control over an inner previous control', () => {
		const { document, toast, dismiss } = fixture();
		const host = new FakeElement('Host', document, -1);
		const shadow = host.attachShadowRoot();
		const innerPrevious = new FakeElement('Inner previous', document);
		const outsideNext = new FakeElement('Outside next', document);
		shadow.append(innerPrevious, toast);
		setDocumentOrder(document, host, outsideNext);
		recover(0, toast, dismiss);
		expect(document.activeElement?.label).toBe('Outside next');
		expect(innerPrevious.focused).toBe(false);
	});

	it('falls back across the shadow host when no internal target survives', () => {
		const { document, toast, dismiss } = fixture();
		const host = new FakeElement('Host', document, -1);
		const shadow = host.attachShadowRoot();
		const outside = new FakeElement('Outside', document);
		shadow.append(toast);
		setDocumentOrder(document, host, outside);
		recover(0, toast, dismiss);
		expect(document.activeElement?.label).toBe('Outside');
	});

	it('climbs nested shadow hosts to find the next outer control', () => {
		const { document, toast, dismiss } = fixture();
		const outerHost = new FakeElement('Outer host', document, -1);
		const outerShadow = outerHost.attachShadowRoot();
		const innerHost = new FakeElement('Inner host', document, -1);
		const innerShadow = innerHost.attachShadowRoot();
		const outside = new FakeElement('Outside', document);
		innerShadow.append(toast);
		outerShadow.append(innerHost);
		setDocumentOrder(document, outerHost, outside);
		recover(0, toast, dismiss);
		expect(document.activeElement?.label).toBe('Outside');
	});

	it('descends into the next sibling open shadow root before later controls', () => {
		const { document, toast, dismiss } = fixture();
		const nextHost = new FakeElement('Next host', document, -1);
		const nextShadow = nextHost.attachShadowRoot();
		const shadowControl = new FakeElement('Shadow control', document);
		const later = new FakeElement('Later', document);
		nextShadow.append(shadowControl);
		setDocumentOrder(document, toast, nextHost, later);
		recover(0, toast, dismiss);
		expect(document.activeElement?.label).toBe('Shadow control');
		expect(later.focused).toBe(false);
	});

	it('follows a slot to its next assigned control', () => {
		const { document, toast, dismiss } = fixture();
		const host = new FakeElement('Host', document, -1);
		const shadow = host.attachShadowRoot();
		const slot = new FakeElement('Slot', document, -1);
		slot.tagName = 'SLOT';
		const slottedControl = new FakeElement('Slotted control', document);
		host.append(slottedControl);
		slot.assigned = [slottedControl];
		slottedControl.assignedSlot = slot;
		shadow.append(toast, slot);
		setDocumentOrder(document, host);
		recover(0, toast, dismiss);
		expect(document.activeElement?.label).toBe('Slotted control');
	});

	it('skips an assigned control whose composed slot is inert', () => {
		const { document, toast, dismiss } = fixture();
		const host = new FakeElement('Host', document, -1);
		const shadow = host.attachShadowRoot();
		const slot = new FakeElement('Slot', document, -1);
		slot.tagName = 'SLOT';
		slot.inert = true;
		const slottedControl = new FakeElement('Slotted control', document);
		const later = new FakeElement('Later', document);
		host.append(slottedControl);
		slot.assigned = [slottedControl];
		slottedControl.assignedSlot = slot;
		shadow.append(toast, slot);
		setDocumentOrder(document, host, later);
		recover(0, toast, dismiss);
		expect(document.activeElement?.label).toBe('Later');
		expect(slottedControl.focused).toBe(false);
	});
});
