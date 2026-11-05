/**
 * Element ids for components that need them (a menu its button controls,
 * a `<details>` group), the same on every build: a prefix, a short hash of
 * what the instance shows, and a count when a page has two alike. No
 * `Math.random`, so a site builds to the same bytes each time.
 */

/** For each page being rendered (its request), how many of each id it has handed out. */
const pages = new WeakMap();

/**
 * A short, stable hash of a string (FNV-1a, 32-bit, in base 36).
 *
 * @param {string} text The string.
 * @returns {string} Up to seven characters, `a–z0–9`.
 */
export function shortHash(text) {
	let h = 0x811c9dc5;
	for (let i = 0; i < text.length; i++) {
		h ^= text.charCodeAt(i);
		h = Math.imul(h, 0x01000193);
	}
	return (h >>> 0).toString(36);
}

/**
 * An id for one instance of a component: `prefix-hash` of what it shows,
 * with `-2`, `-3`… for the second and later alike on the same page.
 *
 * @param {string} prefix The component's prefix (`ui-install`).
 * @param {object} page What identifies the page being rendered (`Astro.request`).
 * @param {unknown} content What the instance shows (its props), as JSON.
 * @returns {string} The id.
 */
export function stableId(prefix, page, content) {
	const base = `${prefix}-${shortHash(JSON.stringify(content) ?? '')}`;
	let seen = pages.get(page);
	if (!seen) pages.set(page, (seen = new Map()));
	const n = (seen.get(base) ?? 0) + 1;
	seen.set(base, n);
	return n === 1 ? base : `${base}-${n}`;
}
