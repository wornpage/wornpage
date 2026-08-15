interface InertState {
  hadAttribute: boolean;
}

interface ScrollLockState {
  scrollX: number;
  scrollY: number;
  rootOverflow: string;
  rootTouchAction: string;
  bodyOverflow: string;
  bodyTouchAction: string;
  bodyPaddingRight: string;
}

const modalStack: HTMLElement[] = [];
const inertStates = new Map<HTMLElement, InertState>();
let bodyObserver: MutationObserver | null = null;
let scrollLockState: ScrollLockState | null = null;

function lockPageScroll() {
  if (scrollLockState || typeof document === 'undefined') return;

  const root = document.documentElement;
  const body = document.body;
  scrollLockState = {
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    rootOverflow: root.style.overflow,
    rootTouchAction: root.style.touchAction,
    bodyOverflow: body.style.overflow,
    bodyTouchAction: body.style.touchAction,
    bodyPaddingRight: body.style.paddingRight,
  };

  const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
  if (scrollbarWidth > 0) {
    const paddingRight = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
    body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
  }
  root.style.overflow = 'hidden';
  root.style.touchAction = 'none';
  body.style.overflow = 'hidden';
  body.style.touchAction = 'none';
}

function unlockPageScroll() {
  if (!scrollLockState || typeof document === 'undefined') return;

  const state = scrollLockState;
  scrollLockState = null;
  const root = document.documentElement;
  const body = document.body;
  root.style.overflow = state.rootOverflow;
  root.style.touchAction = state.rootTouchAction;
  body.style.overflow = state.bodyOverflow;
  body.style.touchAction = state.bodyTouchAction;
  body.style.paddingRight = state.bodyPaddingRight;
  if (window.scrollX !== state.scrollX || window.scrollY !== state.scrollY) {
    window.scrollTo(state.scrollX, state.scrollY);
  }
}

function applyModalIsolation() {
  if (typeof document === 'undefined') return;

  const activeModal = modalStack.at(-1);
  for (const child of Array.from(document.body.children)) {
    if (!(child instanceof HTMLElement)) continue;
    if (!inertStates.has(child)) {
      inertStates.set(child, { hadAttribute: child.hasAttribute('inert') });
    }
    child.toggleAttribute('inert', child !== activeModal);
  }
}

function restoreBackground() {
  for (const [element, state] of inertStates) {
    element.toggleAttribute('inert', state.hadAttribute);
  }
  inertStates.clear();
}

export function portal(node: HTMLElement) {
  if (typeof document === 'undefined') return;
  document.body.appendChild(node);

  return {
    destroy() {
      node.remove();
    },
  };
}

export function activateModalLayer(root: HTMLElement) {
  if (typeof document === 'undefined') return () => {};

  if (modalStack.length === 0) {
    lockPageScroll();
    bodyObserver = new MutationObserver(applyModalIsolation);
    bodyObserver.observe(document.body, { childList: true });
  }

  modalStack.push(root);
  applyModalIsolation();
  let released = false;

  return () => {
    if (released) return;
    released = true;

    const index = modalStack.lastIndexOf(root);
    if (index >= 0) modalStack.splice(index, 1);

    if (modalStack.length > 0) {
      applyModalIsolation();
      return;
    }

    bodyObserver?.disconnect();
    bodyObserver = null;
    restoreBackground();
    unlockPageScroll();
  };
}
