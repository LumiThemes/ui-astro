/**
 * @module @arraypress/ui-astro/forms/count
 *
 * A running count of what has been typed: a `.field-count` with
 * `data-count-for="id"` shows "12 / 60" for a field with a `maxlength`
 * (just "12" without one), picked out with `.is-near` from 90% of the
 * limit and `.is-over` past it.
 */

import { byId } from './dom.js';

/**
 * What a count shows for a length of text.
 *
 * @param {number} length How many characters there are.
 * @param {number} max The field's limit, or 0 for none.
 * @returns {{ text: string, near: boolean, over: boolean }} The words, and
 *   whether it is near (from 90%) or over the limit.
 */
export function countState(length, max) {
	return {
		text: max > 0 ? `${length} / ${max}` : `${length}`,
		near: max > 0 && length >= max * 0.9 && length <= max,
		over: max > 0 && length > max,
	};
}

/**
 * Keeps a count in step with its field.
 *
 * @param {HTMLElement} el The count, naming its field in `data-count-for`.
 * @returns {(() => void) | void} Stops it; nothing when the field is missing.
 */
export function fieldCount(el) {
	const field = /** @type {HTMLInputElement | HTMLTextAreaElement | null} */ (byId(el.dataset.countFor));
	if (!field) return;
	const max = field.maxLength > 0 ? field.maxLength : 0;

	/** Writes the count. */
	const update = () => {
		const { text, near, over } = countState(field.value.length, max);
		el.textContent = text;
		el.classList.toggle('is-near', near);
		el.classList.toggle('is-over', over);
	};
	field.addEventListener('input', update);
	update();
	return () => field.removeEventListener('input', update);
}
