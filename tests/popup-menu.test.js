import { test } from 'node:test';
import assert from 'node:assert/strict';
import { itemShows, popupMenu } from '../src/runtime/menu.js';
import { splitButton } from '../src/runtime/split-button.js';

/** Just enough of an element for the menu: a tree, `hidden`, attributes, events that bubble, and focus. */
class FakeElement extends EventTarget {
	/**
	 * @param {string} tag Its tag name.
	 * @param {Record<string, string>} [attrs] Its attributes.
	 */
	constructor(tag, attrs = {}) {
		super();
		this.tagName = tag.toUpperCase();
		this.attrs = { ...attrs };
		this.hidden = 'hidden' in attrs;
		this.disabled = 'disabled' in attrs;
		/** @type {FakeElement | null} */
		this.parentElement = null;
		/** @type {FakeElement[]} */
		this.children = [];
		this.dataset = {};
		const classes = new Set();
		this.classList = { add: (c) => classes.add(c), remove: (c) => classes.delete(c), contains: (c) => classes.has(c) };
	}
	/** @param {...FakeElement} kids Children to add. @returns {this} Itself. */
	append(...kids) {
		for (const kid of kids) {
			kid.parentElement = this;
			this.children.push(kid);
		}
		return this;
	}
	/** @param {string} name @param {string} value */
	setAttribute(name, value) {
		this.attrs[name] = value;
	}
	/** @param {string} name @returns {string | null} */
	getAttribute(name) {
		return this.attrs[name] ?? null;
	}
	/** @param {FakeElement | null} node @returns {boolean} Whether it is this or inside it. */
	contains(node) {
		for (let at = node; at; at = at.parentElement) if (at === this) return true;
		return false;
	}
	/** @returns {FakeElement[]} Every element under it, in order. */
	all() {
		return this.children.flatMap((kid) => [kid, ...kid.all()]);
	}
	/** Matches the menu's one selector: menu roles, not disabled. @returns {FakeElement[]} */
	querySelectorAll() {
		return this.all().filter((el) => /^menuitem/.test(el.attrs.role ?? '') && !el.disabled);
	}
	/** @param {string} selector `[data-ui-split="…"]` only. @returns {FakeElement | null} */
	querySelector(selector) {
		const part = selector.match(/data-ui-split="(\w+)"/)?.[1];
		return this.all().find((el) => el.attrs['data-ui-split'] === part) ?? null;
	}
	/** @param {string} selector Roles and data-action only. @returns {FakeElement | null} The nearest match, itself first. */
	closest(selector) {
		for (let at = /** @type {FakeElement | null} */ (this); at; at = at.parentElement) {
			if ((selector.includes('data-action') && 'data-action' in at.attrs) || (selector.includes('menuitem') && at.attrs.role === 'menuitem')) return at;
		}
		return null;
	}
	focus() {
		if (!this.hidden) globalThis.document.activeElement = this;
	}
	/**
	 * Sends an event up the tree to the document, as the browser does.
	 *
	 * @param {Event} event The event.
	 * @returns {boolean} False when its default was prevented.
	 */
	dispatchEvent(event) {
		Object.defineProperty(event, 'target', { value: this, configurable: true });
		let stopped = false;
		const stop = event.stopPropagation.bind(event);
		event.stopPropagation = () => {
			stopped = true;
			stop();
		};
		for (let at = /** @type {EventTarget | null} */ (this); at && !stopped; at = at instanceof FakeElement ? (at.parentElement ?? globalThis.document) : null) {
			EventTarget.prototype.dispatchEvent.call(at, Object.assign(event, {}));
			if (at === globalThis.document) break;
		}
		return !event.defaultPrevented;
	}
}

/**
 * A key press on an element.
 *
 * @param {FakeElement} el Where the focus is.
 * @param {string} key The key.
 * @returns {{ passed: boolean, prevented: boolean }} Whether it reached the document, and whether its default was prevented.
 */
function press(el, key) {
	let passed = false;
	const listen = () => (passed = true);
	globalThis.document.addEventListener('keydown', listen);
	const event = new Event('keydown', { bubbles: true, cancelable: true });
	Object.defineProperty(event, 'key', { value: key });
	el.dispatchEvent(event);
	globalThis.document.removeEventListener('keydown', listen);
	return { passed, prevented: event.defaultPrevented };
}

/**
 * A menu with three items, the second hidden, in a root with its button.
 *
 * @returns {{ root: FakeElement, trigger: FakeElement, menu: FakeElement, items: FakeElement[], main: FakeElement }} The parts.
 */
function fakeMenu() {
	globalThis.document = /** @type {any} */ (Object.assign(new EventTarget(), { activeElement: null }));
	const items = [new FakeElement('button', { role: 'menuitem' }), new FakeElement('button', { role: 'menuitem', hidden: '' }), new FakeElement('a', { role: 'menuitem' })];
	const menu = new FakeElement('div', { role: 'menu', hidden: '', 'data-ui-split': 'menu' }).append(...items);
	const trigger = new FakeElement('button', { 'data-ui-split': 'more' });
	const main = new FakeElement('a', {});
	const root = new FakeElement('div', {}).append(main, trigger, menu);
	return { root, trigger, menu, items, main };
}

test('itemShows: an item, or a group round it, that is hidden does not show', () => {
	const item = new FakeElement('button', { role: 'menuitem' });
	const group = new FakeElement('div').append(item);
	const menu = new FakeElement('div', { hidden: '' }).append(group);
	assert.equal(itemShows(item, menu), true, 'the closed menu itself does not count');
	group.hidden = true;
	assert.equal(itemShows(item, menu), false);
	group.hidden = false;
	item.hidden = true;
	assert.equal(itemShows(item, menu), false);
});

test('popupMenu: the arrow keys pass over hidden items and stop at the menu', () => {
	const { root, trigger, menu, items } = fakeMenu();
	const m = popupMenu(/** @type {any} */ (root), /** @type {any} */ (trigger), /** @type {any} */ (menu));
	m.open();
	assert.deepEqual(m.items(), [items[0], items[2]]);
	assert.equal(document.activeElement, items[0]);
	assert.deepEqual(press(items[0], 'ArrowDown'), { passed: false, prevented: true });
	assert.equal(document.activeElement, items[2], 'past the hidden one');
	assert.deepEqual(press(items[2], 'ArrowDown'), { passed: false, prevented: true });
	assert.equal(document.activeElement, items[0], 'round to the first');
	for (const key of ['ArrowUp', 'Home', 'End', 'ArrowLeft', 'ArrowRight']) assert.deepEqual(press(items[0], key), { passed: false, prevented: true }, key);
	assert.equal(press(items[0], 'a').passed, true, 'other keys go on to the page');
	assert.equal(press(items[0], 'Escape').passed, false);
	assert.equal(m.isOpen(), false);
	assert.equal(document.activeElement, trigger, 'Escape hands the focus back');
	assert.deepEqual(press(trigger, 'ArrowRight'), { passed: true, prevented: false }, 'closed, the keys are the page’s');
	assert.deepEqual(press(trigger, 'ArrowDown'), { passed: false, prevented: true });
	assert.equal(document.activeElement, items[0], 'down on the button opens on the first item, not the second');
	press(items[0], 'Escape');
	press(trigger, 'ArrowUp');
	assert.equal(document.activeElement, items[2], 'up opens on the last');
	m.stop();
});

test('splitButton: the main action closes an open menu; an item closes it and refocuses a button', () => {
	const { root, trigger, menu, items, main } = fakeMenu();
	const stop = splitButton(/** @type {any} */ (root));
	trigger.dispatchEvent(new Event('click', { bubbles: true }));
	assert.equal(menu.hidden, false);
	main.dispatchEvent(new Event('click', { bubbles: true }));
	assert.equal(menu.hidden, true, 'the main action closed it');
	trigger.dispatchEvent(new Event('click', { bubbles: true }));
	items[0].dispatchEvent(new Event('click', { bubbles: true }));
	assert.equal(menu.hidden, true);
	assert.equal(document.activeElement, trigger);
	stop();
	delete (/** @type {any} */ (globalThis).document);
});
