/**
 * @module @arraypress/ui-astro/menu
 *
 * A menu that drops from a button, as `<InstallCommand>` and `<SplitButton>`
 * use: the button opens and closes it with `aria-expanded` in step, the
 * arrow keys, Home and End move between its items, Escape closes it and
 * hands the focus back to the button, Tab and a click outside close it.
 * Items are the elements with a `menuitem`, `menuitemradio` or
 * `menuitemcheckbox` role that are not disabled or hidden. The keys it
 * handles go no further than the menu, so a page's own shortcuts on the
 * arrow keys stay still while it is open.
 */

/** The items the keys move between. */
const ITEMS = ['menuitem', 'menuitemradio', 'menuitemcheckbox'].map((role) => `[role="${role}"]:not([disabled])`).join(', ');

/** The keys that move between items. */
const MOVES = ['ArrowDown', 'ArrowUp', 'Home', 'End'];

/** The arrow keys a vertical menu has no use for, kept from the page while the focus is in it. */
const SIDEWAYS = ['ArrowLeft', 'ArrowRight'];

/**
 * Whether an item shows: neither it nor anything round it inside the menu
 * is `hidden`.
 *
 * @param {HTMLElement} item The item.
 * @param {HTMLElement} menu The menu it is in.
 * @returns {boolean} False when it or a group round it is hidden.
 */
export function itemShows(item, menu) {
	for (let at = /** @type {HTMLElement | null} */ (item); at && at !== menu; at = at.parentElement) if (at.hidden) return false;
	return true;
}

/**
 * Where a key moves the focus in a list of items: down and up wrap round
 * (or stop at the ends), Home and End go to the ends. From no item (`at`
 * -1), down goes to the first and up to the last.
 *
 * @param {number} at The item with the focus, or -1 for none.
 * @param {string} key The key (`ArrowDown`, `ArrowUp`, `Home`, `End`).
 * @param {number} length How many items there are.
 * @param {boolean} [wrap=true] Past the last comes the first, and before
 *   the first the last; false stops at the ends, as a listbox does.
 * @returns {number} The item to focus; `at` for any other key, -1 for an empty list.
 */
export function menuStep(at, key, length, wrap = true) {
	if (length <= 0) return -1;
	if (key === 'Home') return 0;
	if (key === 'End') return length - 1;
	if (key === 'ArrowDown') return at < 0 ? 0 : wrap ? (at + 1) % length : Math.min(at + 1, length - 1);
	if (key === 'ArrowUp') return at < 0 ? length - 1 : wrap ? (at - 1 + length) % length : Math.max(at - 1, 0);
	return at;
}

/**
 * Wires a drop-down menu to its button.
 *
 * @param {HTMLElement} root What holds the button and the menu; a click outside it closes the menu.
 * @param {HTMLElement} trigger The button that opens it.
 * @param {HTMLElement} menu The menu, `hidden` while closed.
 * @param {{ initial?: () => HTMLElement | null | undefined }} [options] `initial` picks the item
 *   focused on opening (the selected one); the first otherwise.
 * @returns {{ open: (from?: 'first' | 'last') => void, close: (refocus?: boolean) => void, isOpen: () => boolean, items: () => HTMLElement[], stop: () => void }}
 *   Opens it, closes it (and focuses the button with `refocus`), says whether it is open, lists its items, and stops it.
 */
export function popupMenu(root, trigger, menu, options = {}) {
	/** @returns {HTMLElement[]} The items the keys move between: those that show. */
	const items = () => [.../** @type {NodeListOf<HTMLElement>} */ (menu.querySelectorAll(ITEMS))].filter((item) => itemShows(item, menu));
	/** @returns {boolean} Whether the menu shows. */
	const isOpen = () => !menu.hidden;

	/**
	 * Opens the menu and focuses an item.
	 *
	 * @param {'first' | 'last'} [from='first'] Which end to focus when no item is picked out.
	 */
	const open = (from = 'first') => {
		menu.hidden = false;
		trigger.setAttribute('aria-expanded', 'true');
		root.classList.add('is-open');
		const list = items();
		const target = options.initial?.() ?? (from === 'last' ? list[list.length - 1] : list[0]);
		target?.focus();
	};

	/**
	 * Closes the menu.
	 *
	 * @param {boolean} [refocus=false] Hand the focus back to the button.
	 */
	const close = (refocus = false) => {
		if (menu.hidden) return;
		menu.hidden = true;
		trigger.setAttribute('aria-expanded', 'false');
		root.classList.remove('is-open');
		if (refocus) trigger.focus();
	};

	/** Toggles the menu from the button. */
	const onTrigger = () => (isOpen() ? close() : open());

	/**
	 * Opens the menu from the button with the arrow keys: down on the first
	 * item, up on the last. The key goes no further, so the menu's own keys
	 * do not move it on a second item.
	 *
	 * @param {KeyboardEvent} e The key.
	 */
	const onTriggerKey = (e) => {
		if (isOpen() || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
		e.preventDefault();
		e.stopPropagation();
		open(e.key === 'ArrowUp' ? 'last' : 'first');
	};

	/**
	 * Escape, Tab and the arrow keys while the menu is open. The keys it
	 * handles, and the sideways arrows from inside the menu, stop here.
	 *
	 * @param {KeyboardEvent} e The key.
	 */
	const onKey = (e) => {
		if (!isOpen()) return;
		if (e.key === 'Escape') {
			e.stopPropagation();
			close(true);
			return;
		}
		if (e.key === 'Tab') {
			close();
			return;
		}
		if (SIDEWAYS.includes(e.key) && menu.contains(/** @type {Node} */ (e.target))) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}
		if (!MOVES.includes(e.key)) return;
		e.preventDefault();
		e.stopPropagation();
		const list = items();
		const next = menuStep(list.indexOf(/** @type {HTMLElement} */ (document.activeElement)), e.key, list.length);
		list[next]?.focus();
	};

	/**
	 * Closes the menu on a click outside it.
	 *
	 * @param {MouseEvent} e The click.
	 */
	const onOutside = (e) => {
		if (!root.contains(/** @type {Node} */ (e.target))) close();
	};

	trigger.addEventListener('click', onTrigger);
	trigger.addEventListener('keydown', onTriggerKey);
	root.addEventListener('keydown', onKey);
	document.addEventListener('click', onOutside);
	return {
		open,
		close,
		isOpen,
		items,
		stop: () => {
			trigger.removeEventListener('click', onTrigger);
			trigger.removeEventListener('keydown', onTriggerKey);
			root.removeEventListener('keydown', onKey);
			document.removeEventListener('click', onOutside);
		},
	};
}
