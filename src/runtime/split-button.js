/**
 * @module @arraypress/ui-astro/split-button
 *
 * The behaviour behind `<SplitButton>`: the arrow opens its menu (see
 * menu.js), choosing an item closes it, and the main action and any menu
 * item that is a button (not a link) send a `ui-action` event from the
 * root with the item's `data-action` in `detail.action`, for the page to
 * act on.
 */

import { popupMenu } from './menu.js';

/**
 * Starts a split button.
 *
 * @param {HTMLElement} el The component's root (`[data-ui-split-button]`).
 * @returns {() => void} Stops it.
 */
export function splitButton(el) {
	const trigger = /** @type {HTMLElement | null} */ (el.querySelector('[data-ui-split="more"]'));
	const menuEl = /** @type {HTMLElement | null} */ (el.querySelector('[data-ui-split="menu"]'));
	if (!trigger || !menuEl) return () => {};
	const menu = popupMenu(el, trigger, menuEl);

	/**
	 * Sends the action of a clicked button, and closes the menu after a menu item.
	 *
	 * @param {MouseEvent} e The click.
	 */
	const onClick = (e) => {
		const target = /** @type {HTMLElement | null} */ (/** @type {Element} */ (e.target).closest('[data-action], [role="menuitem"]'));
		if (!target || !el.contains(target) || target === trigger) return;
		const inMenu = menuEl.contains(target);
		if (inMenu) menu.close(target.tagName !== 'A');
		const action = target.dataset.action;
		if (action && target.tagName !== 'A') el.dispatchEvent(new CustomEvent('ui-action', { bubbles: true, detail: { action } }));
	};
	el.addEventListener('click', onClick);

	return () => {
		menu.stop();
		el.removeEventListener('click', onClick);
	};
}
