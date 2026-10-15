import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readConfig } from '../src/runtime/mount.js';
import { prefersReducedMotion } from '../src/runtime/device.js';
import { countdown } from '../src/runtime/countdown.js';

/** Stands in for the browser's HTMLElement, which the runtime checks its parts against. */
class FakeElement {
	textContent = '';
	hidden = false;
}

/**
 * Makes a part of a countdown.
 *
 * @param {boolean} [hidden=false] Whether it starts hidden.
 * @returns {FakeElement} The part.
 */
function part(hidden = false) {
	const node = new FakeElement();
	node.hidden = hidden;
	return node;
}

/**
 * A countdown's element, just enough of one for the runtime: its parts'
 * text and `hidden` can be read back.
 *
 * @param {number} target The end, epoch ms.
 * @returns {{ el: any, parts: Record<string, FakeElement> }} The element and its parts.
 */
function fakeCountdown(target) {
	/** @type {Record<string, FakeElement>} */
	const parts = {
		days: part(),
		hours: part(),
		minutes: part(),
		seconds: part(),
		'.units': part(),
		'.still': part(),
		'.ended': part(true),
	};
	const el = {
		dataset: { target: String(target) },
		/**
		 * Finds a part by its selector.
		 *
		 * @param {string} selector `[data-cd="…"]` or a class.
		 * @returns {object | null} The part.
		 */
		querySelector: (selector) => parts[selector.match(/data-cd="(\w+)"/)?.[1] ?? selector] ?? null,
	};
	return { el, parts };
}

test('readConfig parses data-ui-config, and falls back to empty', () => {
	assert.deepEqual(readConfig(/** @type {any} */ ({ dataset: { uiConfig: '{"currency":"GBP"}' } })), { currency: 'GBP' });
	assert.deepEqual(readConfig(/** @type {any} */ ({ dataset: { uiConfig: 'not json' } })), {});
	assert.deepEqual(readConfig(/** @type {any} */ ({ dataset: {} })), {});
});

test('prefersReducedMotion answers with motion allowed outside a browser', () => {
	assert.equal(prefersReducedMotion(), false);
});

test('countdown writes the time left, and its message once the target has passed', () => {
	globalThis.window = /** @type {any} */ ({ setInterval: () => 0 });
	globalThis.HTMLElement = /** @type {any} */ (FakeElement);
	try {
		const ahead = fakeCountdown(Date.now() + 2 * 86_400_000 + 3 * 3_600_000 + 4 * 60_000 + 5_500);
		countdown(ahead.el)();
		assert.deepEqual(
			['days', 'hours', 'minutes', 'seconds'].map((unit) => ahead.parts[unit].textContent),
			['02', '03', '04', '05'],
		);
		assert.equal(ahead.parts['.ended'].hidden, true);

		const past = fakeCountdown(Date.now() - 1000);
		countdown(past.el)();
		assert.equal(past.parts['.units'].hidden, true);
		assert.equal(past.parts['.still'].hidden, true);
		assert.equal(past.parts['.ended'].hidden, false);
	} finally {
		delete (/** @type {any} */ (globalThis).window);
		delete (/** @type {any} */ (globalThis).HTMLElement);
	}
});
