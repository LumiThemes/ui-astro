/**
 * @module @arraypress/ui-astro/forms/dropdown
 *
 * A `<select data-dropdown>` drawn as a list of its own: a button that
 * shows the choice, and a listbox under it (or over it, when there is
 * no room below) with descriptions (`data-desc` on an option), colour
 * dots (`data-swatch`), groups, an optional filter (`data-search` on the
 * select, its placeholder) and the keys a listbox takes: the arrows,
 * Home and End, Enter or Space to choose, Escape, Tab, and typing to jump.
 *
 * The select stays in the form, out of sight: it keeps the value, is
 * sent, and `required` still stops the form (the focus then goes to the
 * button). A first option with no value is the placeholder, not a
 * choice. A change to the select from elsewhere (a reset, a script) is
 * followed. Without the script it is the plain select.
 */

import { menuStep } from '../menu.js';
import { element } from './dom.js';

/** How long a pause starts a new type-to-jump search, in ms. */
const TYPE_GAP = 700;

/** Numbers each dropdown, for its elements' ids. */
let count = 0;

/**
 * Whether a list should open upward: when it would not fit below (up to
 * 300px of it, with a margin) and there is more room above.
 *
 * @param {number} below The room under the button, in px.
 * @param {number} above The room over it, in px.
 * @param {number} height The list's height, in px.
 * @returns {boolean} Whether to open it upward.
 */
export function opensUp(below, above, height) {
	return below < Math.min(height, 300) + 12 && above > below;
}

/**
 * What has been typed to jump to an option: a key after a pause starts
 * afresh, one straight after adds to what came before.
 *
 * @param {string} typed What has been typed so far.
 * @param {string} key The key just pressed.
 * @param {number} elapsed How long since the last key, in ms.
 * @returns {string} What to look for, in lower case.
 */
export function typeAhead(typed, key, elapsed) {
	return elapsed > TYPE_GAP ? key.toLowerCase() : typed + key.toLowerCase();
}

/**
 * The colour dot an option asks for.
 *
 * @param {HTMLOptionElement} option The option.
 * @returns {HTMLSpanElement | null} The dot, or null without `data-swatch`.
 */
function swatch(option) {
	if (!option.dataset.swatch) return null;
	const dot = element('span', 'dropdown-swatch');
	dot.style.background = option.dataset.swatch;
	return dot;
}

/**
 * Puts an attribute back as it was.
 *
 * @param {Element} el The element.
 * @param {string} name The attribute.
 * @param {string | null} value Its old value; null removes it.
 */
function restore(el, name, value) {
	if (value === null) el.removeAttribute(name);
	else el.setAttribute(name, value);
}

/**
 * Draws a select as a dropdown.
 *
 * @param {HTMLElement} el The `<select data-dropdown>` (not `multiple`).
 * @returns {() => void} Stops it and puts the plain select back.
 */
export function dropdown(el) {
	const select = /** @type {HTMLSelectElement} */ (el);
	const n = ++count;
	const before = { tabindex: select.getAttribute('tabindex'), hidden: select.getAttribute('aria-hidden') };
	const wrap = element('div', 'dropdown');
	select.before(wrap);
	wrap.append(select);
	select.tabIndex = -1;
	select.setAttribute('aria-hidden', 'true');

	const label = select.id ? /** @type {HTMLLabelElement | null} */ (document.querySelector(`label[for="${CSS.escape(select.id)}"]`)) : null;
	const labelHadId = Boolean(label?.id);
	if (label && !label.id) label.id = `ui-dd-${n}-label`;

	const trigger = element('button', 'dropdown-trigger');
	trigger.type = 'button';
	trigger.id = `ui-dd-${n}-trigger`;
	trigger.setAttribute('aria-haspopup', 'listbox');
	trigger.setAttribute('aria-expanded', 'false');
	if (label) trigger.setAttribute('aria-labelledby', `${label.id} ${trigger.id}`);
	const described = select.getAttribute('aria-describedby');
	if (described) trigger.setAttribute('aria-describedby', described);
	trigger.disabled = select.disabled;

	const panel = element('div', 'dropdown-panel');
	panel.hidden = true;
	const search = select.hasAttribute('data-search') ? element('input', 'dropdown-search') : null;
	if (search) {
		search.type = 'search';
		search.placeholder = select.dataset.search || 'Filter…';
		search.setAttribute('aria-label', 'Filter the options');
		search.autocomplete = 'off';
		panel.append(search);
	}
	const list = element('ul', 'dropdown-list');
	list.id = `ui-dd-${n}-list`;
	list.setAttribute('role', 'listbox');
	list.tabIndex = -1;
	if (label) list.setAttribute('aria-labelledby', label.id);
	trigger.setAttribute('aria-controls', list.id);
	const empty = element('li', 'dropdown-empty', 'Nothing matches');
	empty.hidden = true;
	panel.append(list);
	wrap.append(trigger, panel);

	/** @type {{ li: HTMLLIElement, option: HTMLOptionElement, text: string }[]} */
	const items = [];
	for (const node of select.children) {
		const group = node instanceof HTMLOptGroupElement ? node : null;
		if (group) {
			const title = element('li', 'dropdown-group', group.label);
			title.setAttribute('role', 'presentation');
			list.append(title);
		}
		for (const option of group ? [...group.children] : [node]) {
			if (!(option instanceof HTMLOptionElement) || (option.value === '' && !option.textContent?.trim())) continue;
			// The "Choose…" option is the placeholder, not a choice.
			if (option.value === '' && option === select.options[0]) continue;
			const dot = swatch(option);
			const li = element('li', dot ? 'dropdown-option' : 'dropdown-option has-no-lead');
			li.id = `ui-dd-${n}-${items.length}`;
			li.setAttribute('role', 'option');
			if (option.disabled || group?.disabled) li.setAttribute('aria-disabled', 'true');
			const words = element('span', '', option.textContent ?? '');
			if (option.dataset.desc) words.append(element('small', '', option.dataset.desc));
			li.append(...(dot ? [dot, words] : [words]));
			list.append(li);
			items.push({ li, option, text: [option.textContent, option.dataset.desc, group?.label].join(' ').toLowerCase() });
		}
	}
	list.append(empty);
	const first = select.options[0];
	const placeholder = first?.value === '' ? first.textContent?.trim() || 'Choose…' : '';
	let active = -1;
	let typed = '';
	let typedAt = 0;

	/** Shows the chosen option on the button and marks it in the list. */
	const show = () => {
		const chosen = select.selectedOptions[0];
		const none = !chosen || chosen.value === '';
		const dot = none ? null : swatch(chosen);
		const value = element('span', none ? 'dropdown-value is-placeholder' : 'dropdown-value', none ? placeholder || chosen?.textContent || '' : chosen.textContent ?? '');
		trigger.replaceChildren(...(dot ? [dot, value] : [value]));
		for (const item of items) item.li.setAttribute('aria-selected', String(item.option === chosen && !none));
	};

	/**
	 * Whether an option can be chosen.
	 *
	 * @param {{ li: HTMLLIElement }} item The option's entry.
	 * @returns {boolean} False when it is disabled.
	 */
	const enabled = (item) => item.li.getAttribute('aria-disabled') !== 'true';

	/** @returns {typeof items} The options the filter leaves that can be chosen. */
	const visible = () => items.filter((item) => !item.li.hidden && enabled(item));

	/**
	 * Picks out an option for the keys (without choosing it).
	 *
	 * @param {number} i The option, or -1 for none.
	 * @param {boolean} [scroll=true] Scroll it into view.
	 */
	const activate = (i, scroll = true) => {
		items.forEach((item) => item.li.classList.remove('is-active'));
		active = i;
		const item = items[i];
		if (!item) {
			list.removeAttribute('aria-activedescendant');
			search?.removeAttribute('aria-activedescendant');
			return;
		}
		item.li.classList.add('is-active');
		list.setAttribute('aria-activedescendant', item.li.id);
		search?.setAttribute('aria-activedescendant', item.li.id);
		if (scroll) item.li.scrollIntoView({ block: 'nearest' });
	};

	/**
	 * Moves the picked-out option with a key, stopping at the ends.
	 *
	 * @param {string} key `ArrowDown`, `ArrowUp`, `Home` or `End`.
	 */
	const move = (key) => {
		const shown = visible();
		const next = menuStep(shown.indexOf(items[active]), key, shown.length, false);
		if (next >= 0) activate(items.indexOf(shown[next]));
	};

	/** Hides the options the filter does not match, and the groups left empty. */
	const filter = () => {
		const query = (search?.value ?? '').trim().toLowerCase();
		for (const item of items) item.li.hidden = Boolean(query) && !item.text.includes(query);
		for (const title of /** @type {NodeListOf<HTMLElement>} */ (list.querySelectorAll('.dropdown-group'))) {
			let next = title.nextElementSibling;
			let any = false;
			while (next && !next.classList.contains('dropdown-group')) {
				if (next.classList.contains('dropdown-option') && !(/** @type {HTMLElement} */ (next).hidden)) any = true;
				next = next.nextElementSibling;
			}
			title.hidden = !any;
		}
		const shown = visible();
		empty.hidden = shown.length > 0;
		if (!shown.includes(items[active])) activate(shown.length ? items.indexOf(shown[0]) : -1);
	};

	/** Opens the list, upward when there is no room below, with the chosen option picked out. */
	const open = () => {
		if (trigger.disabled || !panel.hidden) return;
		panel.hidden = false;
		wrap.classList.add('is-open');
		trigger.setAttribute('aria-expanded', 'true');
		const box = trigger.getBoundingClientRect();
		wrap.classList.toggle('is-up', opensUp(innerHeight - box.bottom, box.top, panel.offsetHeight));
		const chosen = items.findIndex((item) => item.li.getAttribute('aria-selected') === 'true');
		activate(chosen >= 0 ? chosen : items.indexOf(visible()[0]));
		(search ?? list).focus();
	};

	/**
	 * Closes the list and clears its filter.
	 *
	 * @param {boolean} [refocus=true] Hand the focus back to the button.
	 */
	const close = (refocus = true) => {
		if (panel.hidden) return;
		panel.hidden = true;
		wrap.classList.remove('is-open', 'is-up');
		trigger.setAttribute('aria-expanded', 'false');
		if (search) {
			search.value = '';
			filter();
		}
		if (refocus) trigger.focus();
	};

	/**
	 * Chooses an option: sets the select (firing its `input` and `change`
	 * when the value changes) and closes the list.
	 *
	 * @param {number} i The option.
	 */
	const choose = (i) => {
		const item = items[i];
		if (!item || !enabled(item)) return;
		if (select.value !== item.option.value) {
			select.value = item.option.value;
			select.dispatchEvent(new Event('input', { bubbles: true }));
			select.dispatchEvent(new Event('change', { bubbles: true }));
		}
		show();
		close();
	};

	/**
	 * The keys while the list is open.
	 *
	 * @param {KeyboardEvent} e The key.
	 */
	const onKey = (e) => {
		const { key } = e;
		if (key === 'ArrowDown' || key === 'ArrowUp') {
			e.preventDefault();
			move(key);
		} else if (key === 'Home' || key === 'End') {
			if (e.target === search) return;
			e.preventDefault();
			move(key);
		} else if (key === 'Enter' || (key === ' ' && e.target !== search)) {
			e.preventDefault();
			choose(active);
		} else if (key === 'Escape') {
			e.preventDefault();
			e.stopPropagation();
			close();
		} else if (key === 'Tab') {
			close(false);
		} else if (!search && key.length === 1 && !e.metaKey && !e.ctrlKey) {
			const now = performance.now();
			typed = typeAhead(typed, key, now - typedAt);
			typedAt = now;
			const hit = visible().find((item) => item.text.startsWith(typed));
			if (hit) activate(items.indexOf(hit));
		}
	};

	/**
	 * The option an event happened on.
	 *
	 * @param {Event} e The event in the list.
	 * @returns {number} The option, or -1.
	 */
	const optionAt = (e) => {
		const li = /** @type {Element} */ (e.target).closest('.dropdown-option');
		return items.findIndex((item) => item.li === li);
	};

	/** Opens or closes the list from the button. */
	const onTrigger = () => (panel.hidden ? open() : close());

	/**
	 * Opens the list from the button with the arrow keys.
	 *
	 * @param {KeyboardEvent} e The key.
	 */
	const onTriggerKey = (e) => {
		if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
		e.preventDefault();
		open();
	};

	/**
	 * Picks out the option under the pointer.
	 *
	 * @param {MouseEvent} e The move.
	 */
	const onHover = (e) => {
		const i = optionAt(e);
		if (i >= 0 && enabled(items[i])) activate(i, false);
	};

	/**
	 * Chooses the option clicked.
	 *
	 * @param {MouseEvent} e The click.
	 */
	const onPick = (e) => {
		const i = optionAt(e);
		if (i >= 0) choose(i);
	};

	/**
	 * Closes the list on a press outside it.
	 *
	 * @param {PointerEvent} e The press.
	 */
	const onOutside = (e) => {
		if (!wrap.contains(/** @type {Node} */ (e.target))) close(false);
	};

	/**
	 * A click on the label goes to the button, as it would focus the select.
	 *
	 * @param {MouseEvent} e The click.
	 */
	const onLabel = (e) => {
		e.preventDefault();
		trigger.focus();
	};

	/** After a reset, shows the value the select goes back to (once it has). */
	const onReset = () => setTimeout(show);

	/** The form refused the select (`required`, nothing chosen): puts the focus where it can be fixed. */
	const onInvalid = () => trigger.focus();

	trigger.addEventListener('click', onTrigger);
	trigger.addEventListener('keydown', onTriggerKey);
	list.addEventListener('keydown', onKey);
	search?.addEventListener('keydown', onKey);
	search?.addEventListener('input', filter);
	list.addEventListener('mousemove', onHover);
	list.addEventListener('click', onPick);
	document.addEventListener('pointerdown', onOutside);
	label?.addEventListener('click', onLabel);
	select.addEventListener('change', show);
	select.addEventListener('invalid', onInvalid);
	const form = select.form;
	form?.addEventListener('reset', onReset);
	show();

	return () => {
		document.removeEventListener('pointerdown', onOutside);
		label?.removeEventListener('click', onLabel);
		select.removeEventListener('change', show);
		select.removeEventListener('invalid', onInvalid);
		form?.removeEventListener('reset', onReset);
		if (label && !labelHadId) label.removeAttribute('id');
		wrap.replaceWith(select);
		restore(select, 'tabindex', before.tabindex);
		restore(select, 'aria-hidden', before.hidden);
	};
}
