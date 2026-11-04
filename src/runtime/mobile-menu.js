/**
 * @module @arraypress/ui-astro/mobile-menu
 *
 * The behaviour behind `<MobileMenu>`, a `<details>` whose panel covers the
 * screen under the header: it closes when a link in it is followed, on
 * Escape (handing the focus back to its button), and when the screen grows
 * past its breakpoint; while open, `--ui-mobile-menu-h` on it holds the
 * room from the panel's top to the foot of the window, so the panel ends
 * there whatever it is positioned against. The page's scroll is held by
 * CSS (`:root:has(.ui-mobile-menu[open])`).
 */

/**
 * Is a link the page being shown, or a section the page sits in? The home
 * page (`/`) matches itself only; trailing slashes, queries and hashes are
 * ignored. A link to a part of this page (`#releases`) matches only when
 * `path` is that same hash.
 *
 * @param {string} href The link's address (a path, or a full URL on the same site).
 * @param {string} path The page's path (`Astro.url.pathname`).
 * @returns {boolean} Whether the link is the current page.
 */
export function isCurrent(href, path) {
	/**
	 * A path without its origin, query, hash or trailing slash.
	 *
	 * @param {string} p The path or URL.
	 * @returns {string} Its bare path; `/` for the home page.
	 */
	const bare = (p) => p.replace(/^[a-z][a-z\d+.-]*:\/\/[^/]+/i, '').replace(/[?#].*$/, '').replace(/\/+$/, '') || '/';
	if (href === path) return true;
	if (href.startsWith('#')) return false;
	const link = bare(href);
	const here = bare(path);
	if (link === '/') return here === '/';
	return here === link || here.startsWith(`${link}/`);
}

/**
 * Starts a mobile menu.
 *
 * @param {HTMLElement} el The `<details>` (`[data-ui-mobile-menu]`).
 * @param {{ breakpoint?: number }} config Widths above `breakpoint` (px) close it; 0 for none.
 * @returns {() => void} Stops it.
 */
export function mobileMenu(el, config) {
	const details = /** @type {HTMLDetailsElement} */ (el);
	const summary = details.querySelector('summary');
	const panel = /** @type {HTMLElement | null} */ (details.querySelector('[data-ui-mobile-menu-panel]'));

	/** Sets the panel's height to reach the foot of the window. */
	const size = () => {
		if (!details.open || !panel) return;
		// less any slide the opening animation has it at, so the measure is where it settles
		const t = getComputedStyle(panel).transform;
		const slide = t && t !== 'none' && typeof DOMMatrixReadOnly === 'function' ? new DOMMatrixReadOnly(t).m42 : 0;
		const top = panel.getBoundingClientRect().top - slide;
		details.style.setProperty('--ui-mobile-menu-h', `${Math.max(0, window.innerHeight - top)}px`);
	};

	/** Sizes the panel as it opens. */
	const onToggle = () => size();

	/**
	 * Closes the menu as one of its links is followed.
	 *
	 * @param {MouseEvent} e The click.
	 */
	const onClick = (e) => {
		if (/** @type {Element} */ (e.target).closest('a[href]')) details.open = false;
	};

	/**
	 * Closes the menu on Escape.
	 *
	 * @param {KeyboardEvent} e The key.
	 */
	const onKey = (e) => {
		if (e.key !== 'Escape' || !details.open) return;
		details.open = false;
		summary?.focus();
	};

	const breakpoint = Number(config.breakpoint ?? 0);
	const wide = breakpoint > 0 && typeof window.matchMedia === 'function' ? window.matchMedia(`(min-width: ${breakpoint + 1}px)`) : null;
	/**
	 * Closes the menu once the screen is past the breakpoint.
	 *
	 * @param {MediaQueryListEvent} e The change.
	 */
	const onWide = (e) => {
		if (e.matches) details.open = false;
	};

	details.addEventListener('toggle', onToggle);
	panel?.addEventListener('click', onClick);
	document.addEventListener('keydown', onKey);
	window.addEventListener('resize', size);
	wide?.addEventListener('change', onWide);
	size();

	return () => {
		details.removeEventListener('toggle', onToggle);
		panel?.removeEventListener('click', onClick);
		document.removeEventListener('keydown', onKey);
		window.removeEventListener('resize', size);
		wide?.removeEventListener('change', onWide);
	};
}
