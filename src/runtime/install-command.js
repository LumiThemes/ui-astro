/**
 * @module @arraypress/ui-astro/install-command
 *
 * The behaviour behind `<InstallCommand>`: its menu (see menu.js) switches
 * the bar between options — the label and icon on the button, the prefix
 * and command in the bar, what the copy button copies and the note under
 * the bar — and the copy button copies, with a tick for a moment and
 * "Copied" for screen readers. Each option carries its parts as `data-*`
 * on its menu item.
 */

import { copyText, flash } from './clipboard.js';
import { popupMenu } from './menu.js';

/**
 * Starts an install command bar.
 *
 * @param {HTMLElement} el The component's root (`[data-ui-install-command]`).
 * @returns {() => void} Stops it.
 */
export function installCommand(el) {
	/**
	 * Finds one of the bar's parts.
	 *
	 * @param {string} part Its `data-ui-install` name.
	 * @returns {HTMLElement | null} The part.
	 */
	const find = (part) => el.querySelector(`[data-ui-install="${part}"]`);
	const trigger = find('trigger');
	const menuEl = find('menu');
	const copy = find('copy');
	const status = find('status');
	if (!trigger || !menuEl || !copy) return () => {};
	const menu = popupMenu(el, trigger, menuEl, { initial: () => menuEl.querySelector('[aria-checked="true"]') });
	const options = [.../** @type {NodeListOf<HTMLElement>} */ (menuEl.querySelectorAll('[data-command]'))];

	/**
	 * Shows an option in the bar.
	 *
	 * @param {HTMLElement} option Its menu item.
	 */
	const select = (option) => {
		const d = option.dataset;
		/**
		 * Writes a part's text.
		 *
		 * @param {string} part Its `data-ui-install` name.
		 * @param {string | undefined} text The text.
		 */
		const set = (part, text) => {
			const node = find(part);
			if (node) node.textContent = text ?? '';
		};
		set('label', d.label);
		set('prefix', d.prefix);
		set('text', d.command);
		const note = find('note');
		if (note) {
			note.innerHTML = d.note ?? '';
			note.hidden = !d.note;
		}
		const icon = find('icon');
		if (icon) icon.innerHTML = option.querySelector('.ui-install-icon')?.innerHTML ?? '';
		copy.dataset.copy = d.copy ?? d.command ?? '';
		for (const o of options) o.setAttribute('aria-checked', String(o === option));
		el.dataset.selected = d.id ?? '';
	};

	/** @type {Array<[HTMLElement, () => void]>} */
	const bound = options.map((option) => {
		/** Shows this option and closes the menu. */
		const onPick = () => {
			select(option);
			menu.close(true);
		};
		option.addEventListener('click', onPick);
		return [option, onPick];
	});

	const links = [.../** @type {NodeListOf<HTMLElement>} */ (menuEl.querySelectorAll('a[role="menuitem"]'))];
	/** Closes the menu as a link is followed. */
	const onLink = () => menu.close();
	for (const a of links) a.addEventListener('click', onLink);

	/** Copies the shown command. */
	const onCopy = async () => {
		if (!(await copyText(copy.dataset.copy ?? ''))) return;
		if (status) status.textContent = 'Copied';
		flash(copy, 'is-done', 1400, () => {
			if (status) status.textContent = '';
		});
	};
	copy.addEventListener('click', onCopy);

	return () => {
		menu.stop();
		for (const [option, onPick] of bound) option.removeEventListener('click', onPick);
		for (const a of links) a.removeEventListener('click', onLink);
		copy.removeEventListener('click', onCopy);
	};
}
