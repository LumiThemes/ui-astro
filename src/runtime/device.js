/**
 * @module @arraypress/ui-astro/device
 *
 * What the visitor has asked for: the one place every component reads it
 * from, so the choice is made the same way everywhere. Safe to call
 * during server rendering, where it answers with motion allowed.
 */

/**
 * Does a media query match? False outside a browser.
 *
 * @param {string} query The media query.
 * @returns {boolean} Whether it matches.
 */
function matches(query) {
	return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches;
}

/**
 * Has the visitor asked for less motion?
 *
 * @returns {boolean} True with prefers-reduced-motion: reduce.
 */
export function prefersReducedMotion() {
	return matches('(prefers-reduced-motion: reduce)');
}
