import { mount } from 'svelte';
import { Toast } from '../../../packages/toast/src/index.ts';
import '../../../packages/toast/dist/worn-toast.js';

const params = new URLSearchParams(location.search);
const layout = params.get('layout');
const surface = params.get('surface');
const duration = params.get('activation') === 'automatic' ? 400 : 0;
const fixture = document.querySelector('#fixture');
window.dismissals = 0;
window.focusCalls = [];
window.deepActive = () => {
  const chain = [];
  let element = document.activeElement;
  while (element) {
    chain.push({ tag: element.tagName, id: element.id, label: element.getAttribute('aria-label') });
    element = element.shadowRoot?.activeElement;
  }
  return chain;
};
const nativeFocus = HTMLElement.prototype.focus;
HTMLElement.prototype.focus = function (...args) {
  const result = nativeFocus.apply(this, args);
  window.focusCalls.push({ target: this.id || this.tagName, active: window.deepActive() });
  return result;
};

function button(parent, id) {
  const element = document.createElement('button');
  element.id = id;
  element.textContent = id;
  parent.append(element);
  return element;
}

function toast(parent) {
  const target = document.createElement(surface === 'wrapper' ? 'worn-toast' : 'div');
  target.id = 'toast-mount';
  parent.append(target);
  if (surface === 'wrapper') {
    target.setAttribute('message', 'Focus regression notification');
    target.setAttribute('duration', String(duration));
    target.addEventListener('worn-dismiss', () => window.dismissals++);
  } else if (surface === 'svelte') {
    mount(Toast, { target, props: { message: 'Focus regression notification', duration, ondismiss: () => window.dismissals++ } });
  } else {
    throw new Error(`Unknown Toast surface: ${surface}`);
  }
}

function shadow(delegatesFocus = false) {
  const host = document.createElement('div');
  host.id = 'shadow-host';
  if (delegatesFocus) host.tabIndex = 0;
  const root = host.attachShadow({ mode: 'open', delegatesFocus });
  const style = document.createElement('style');
  style.textContent = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules].map(rule => rule.cssText)).join('\n');
  root.append(style);
  fixture.append(host);
  return { host, root };
}

window.expectedTarget = 'next';
if (layout === 'next') {
  button(fixture, 'previous'); toast(fixture); button(fixture, 'next');
} else if (layout === 'previous') {
  button(fixture, 'previous'); toast(fixture); window.expectedTarget = 'previous';
} else if (layout === 'shadow-next') {
  const { root } = shadow(); button(root, 'previous'); toast(root); button(root, 'next');
  button(fixture, 'outside-next');
} else if (layout === 'shadow-previous' || layout === 'delegates-previous') {
  button(fixture, 'previous');
  const { root } = shadow(layout === 'delegates-previous'); toast(root);
  window.expectedTarget = 'previous';
} else if (layout === 'slot-next') {
  const { host, root } = shadow(); toast(root);
  const slot = document.createElement('slot'); slot.name = 'following'; root.append(slot);
  button(host, 'next').slot = 'following';
} else if (layout === 'modal-fallback') {
  const dialog = document.createElement('dialog'); dialog.id = 'modal'; fixture.append(dialog);
  button(dialog, 'previous'); toast(dialog); button(fixture, 'outside-next');
  dialog.showModal(); window.expectedTarget = 'previous';
} else if (layout === 'redirect') {
  toast(fixture);
  const redirect = document.createElement('h2'); redirect.id = 'redirected'; redirect.tabIndex = -1;
  redirect.textContent = 'Application-selected focus target';
  button(fixture, 'next').addEventListener('focus', () => redirect.focus());
  button(fixture, 'later'); fixture.append(redirect); window.expectedTarget = 'redirected';
} else if (layout === 'removed-target') {
  toast(fixture);
  const removed = button(fixture, 'removed'); removed.addEventListener('focus', () => removed.remove());
  button(fixture, 'next');
} else {
  throw new Error(`Unknown Toast layout: ${layout}`);
}
window.fixtureReady = true;
