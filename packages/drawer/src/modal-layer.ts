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

interface VisualViewportBoxInput {
  offsetLeft: number;
  offsetTop: number;
  width: number;
  height: number;
}

export function visualViewportBox(viewport: VisualViewportBoxInput) {
  const cssLength = (value: number) => `${Number.isFinite(value) ? value : 0}px`;
  return {
    left: cssLength(viewport.offsetLeft),
    top: cssLength(viewport.offsetTop),
    width: cssLength(viewport.width),
    height: cssLength(viewport.height),
  };
}

function trackVisualViewport(root: HTMLElement) {
  const viewport = window.visualViewport;
  if (!viewport) return () => {};

  let frame: number | null = null;
  const update = () => {
    frame = null;
    const box = visualViewportBox(viewport);
    root.style.setProperty('--worn-visual-viewport-left', box.left);
    root.style.setProperty('--worn-visual-viewport-top', box.top);
    root.style.setProperty('--worn-visual-viewport-width', box.width);
    root.style.setProperty('--worn-visual-viewport-height', box.height);
  };
  const schedule = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  };

  update();
  viewport.addEventListener('scroll', schedule, { passive: true });
  viewport.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });

  return () => {
    if (frame !== null) cancelAnimationFrame(frame);
    viewport.removeEventListener('scroll', schedule);
    viewport.removeEventListener('resize', schedule);
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    root.style.removeProperty('--worn-visual-viewport-left');
    root.style.removeProperty('--worn-visual-viewport-top');
    root.style.removeProperty('--worn-visual-viewport-width');
    root.style.removeProperty('--worn-visual-viewport-height');
  };
}

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

  const releaseVisualViewport = trackVisualViewport(root);

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
    releaseVisualViewport();

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
