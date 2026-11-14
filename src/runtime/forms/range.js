/**
 * @module @arraypress/ui-astro/forms/range
 *
 * A form kit slider: its track filled up to the thumb (`--fill`, from
 * `rangeFill`), and its value written into every `<output for>` that
 * names it, as the plain number with the output's `data-unit` after it
 * ("96 px"). `<Range>` writes its value formatted instead, so its input
 * (`data-ui-range`) is left to it.
 */

import { rangeFill } from '../range.js';

/**
 * Follows a slider.
 *
 * @param {HTMLElement} el The `<input type="range">`.
 * @returns {() => void} Stops it.
 */
export function formRange(el) {
	const input = /** @type {HTMLInputElement} */ (el);
	const outputs = input.id ? [.../** @type {NodeListOf<HTMLOutputElement>} */ (document.querySelectorAll(`output[for~="${CSS.escape(input.id)}"]`))] : [];

	/** Fills the track and writes the value. */
	const update = () => {
		rangeFill(input);
		for (const output of outputs) output.value = `${input.value}${output.dataset.unit ?? ''}`;
	};
	input.addEventListener('input', update);
	update();
	return () => input.removeEventListener('input', update);
}
