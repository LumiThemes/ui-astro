/**
 * @module @arraypress/ui-astro/copy-swatch
 *
 * The behaviour behind `<CopySwatch>`: a click copies the swatch's value
 * (its `data-value`), shows "Copied" on the chip for a moment, and says so
 * to screen readers.
 */

import { copyText, flash } from './clipboard.js';

/**
 * Starts a copyable swatch.
 *
 * @param {HTMLElement} el The component's root (`[data-ui-copy-swatch]`), holding the chip button.
 * @returns {() => void} Stops it.
 */
export function copySwatch(el) {
	const chip = /** @type {HTMLElement | null} */ (el.querySelector('[data-value]'));
	const status = el.querySelector('[role="status"]');
	if (!chip) return () => {};

	/** Copies the value and shows the note. */
	const onCopy = async () => {
		if (!(await copyText(chip.dataset.value ?? ''))) return;
		if (status) status.textContent = `Copied ${chip.dataset.value}`;
		flash(chip, 'is-copied', 1400, () => {
			if (status) status.textContent = '';
		});
	};
	chip.addEventListener('click', onCopy);
	return () => chip.removeEventListener('click', onCopy);
}
