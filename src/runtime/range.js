/**
 * @module @arraypress/ui-astro/range
 *
 * A range slider that shows how far along it is: keeps `--fill` (0–100%)
 * on the input for the filled part of the track, and writes the value,
 * formatted, into the `<output>` that names it in its `for`. The fill on
 * its own is `rangeFill`, which the form kit's sliders use too.
 */

import { numberFormat } from './number-format.js';

/**
 * How far along its track a slider's value sits.
 *
 * @param {{ value: string, min: string, max: string }} input The input, or
 *   anything with its `value`, `min` and `max`.
 * @returns {number} From 0 at `min` (default 0) to 1 at `max` (default
 *   100); 0 when the range is empty.
 */
export function rangeShare({ value, min, max }) {
	const low = Number(min || 0);
	const high = Number(max || 100);
	return high > low ? (Number(value) - low) / (high - low) : 0;
}

/**
 * Fills a slider's track up to its thumb: sets `--fill` on it.
 *
 * @param {HTMLInputElement} input The `<input type="range">`.
 */
export function rangeFill(input) {
	input.style.setProperty('--fill', `${(rangeShare(input) * 100).toFixed(2)}%`);
}

/**
 * Follows a range input.
 *
 * @param {HTMLElement} el The `<input type="range">`.
 * @param {import('./number-format.js').NumberStyle} config How to write the value.
 * @returns {() => void} Stops it.
 */
export function range(el, config) {
	const input = /** @type {HTMLInputElement} */ (el);
	const write = numberFormat(config);
	const output = input.id ? document.querySelector(`output[for~="${CSS.escape(input.id)}"]`) : null;

	/** Shows the current value. */
	const update = () => {
		rangeFill(input);
		if (output) output.textContent = write(Number(input.value));
	};
	input.addEventListener('input', update);
	update();
	return () => input.removeEventListener('input', update);
}
