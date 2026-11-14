/**
 * @module @arraypress/ui-astro/forms/color
 *
 * A colour input with its hex beside it: a text input with
 * `data-color-for="id"` shows the colour input's value in capitals, and
 * typing a six-digit hex into it (with or without the `#`) sets the
 * colour.
 */

import { byId } from './dom.js';

/**
 * Reads a six-digit hex colour as typed.
 *
 * @param {string} text The text, with or without its `#`.
 * @returns {string | null} The colour as a colour input takes it
 *   (`#rrggbb`, lower case), or null if it is not one.
 */
export function hexValue(text) {
	const hex = text.trim().replace(/^#?/, '#');
	return /^#[0-9a-f]{6}$/i.test(hex) ? hex.toLowerCase() : null;
}

/**
 * Keeps a text input and its colour input in step.
 *
 * @param {HTMLElement} el The text input, naming the colour input in `data-color-for`.
 * @returns {(() => void) | void} Stops it; nothing when the colour input is missing.
 */
export function colorPair(el) {
	const text = /** @type {HTMLInputElement} */ (el);
	const picker = /** @type {HTMLInputElement | null} */ (byId(text.dataset.colorFor));
	if (!picker) return;

	/** Writes the picked colour as text. */
	const fromPicker = () => {
		text.value = picker.value.toUpperCase();
	};

	/** Sets the colour from the text, once it is a whole hex colour. */
	const fromText = () => {
		const hex = hexValue(text.value);
		if (hex) picker.value = hex;
	};
	fromPicker();
	picker.addEventListener('input', fromPicker);
	text.addEventListener('input', fromText);
	return () => {
		picker.removeEventListener('input', fromPicker);
		text.removeEventListener('input', fromText);
	};
}
