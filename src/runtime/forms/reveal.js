/**
 * @module @arraypress/ui-astro/forms/reveal
 *
 * A button that shows or hides a password: `button[data-reveal="id"]`
 * turns its field between `password` and `text`, with `aria-pressed` in
 * step. Its own words ask to show it ("Show" if it has none); `data-hide`
 * gives the words to hide it again (default "Hide").
 */

import { byId } from './dom.js';

/**
 * Wires a reveal button to its password field.
 *
 * @param {HTMLElement} el The button, naming its field in `data-reveal`.
 * @returns {(() => void) | void} Stops it; nothing when the field is missing.
 */
export function revealPassword(el) {
	const field = /** @type {HTMLInputElement | null} */ (byId(el.dataset.reveal));
	if (!field) return;
	const show = el.textContent?.trim() || 'Show';
	const hide = el.dataset.hide || 'Hide';
	el.setAttribute('aria-pressed', 'false');

	/** Shows the password if it is hidden, and hides it if it shows. */
	const toggle = () => {
		const shown = field.type === 'password';
		field.type = shown ? 'text' : 'password';
		el.setAttribute('aria-pressed', String(shown));
		el.textContent = shown ? hide : show;
	};
	el.addEventListener('click', toggle);
	return () => el.removeEventListener('click', toggle);
}
