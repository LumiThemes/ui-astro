/**
 * @module @arraypress/ui-astro/forms/dom
 *
 * The two small DOM helpers the form kit's parts share: finding the
 * control an attribute names by its id, and making an element with its
 * class and text. Text is always set as text, never as markup, so names
 * and labels from the page or a visitor's files cannot inject any.
 */

/**
 * The element with an id, when there is one to look for.
 *
 * @param {string | undefined} id The id, as an attribute gives it.
 * @returns {HTMLElement | null} The element, or null without an id or a match.
 */
export function byId(id) {
	return id ? document.getElementById(id) : null;
}

/**
 * Makes an element with a class and, optionally, its text.
 *
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tag The tag name.
 * @param {string} [className=''] Its classes.
 * @param {string} [text] Its text.
 * @returns {HTMLElementTagNameMap[K]} The element.
 */
export function element(tag, className = '', text) {
	const el = document.createElement(tag);
	if (className) el.className = className;
	if (text !== undefined) el.textContent = text;
	return el;
}
