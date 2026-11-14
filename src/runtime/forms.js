/**
 * @module @arraypress/ui-astro/forms
 *
 * The script behind `forms.css`: sliders with their fill and value,
 * running counts, password reveals, colour inputs with their hex,
 * dropzones with their file lists, and dropdowns. Each part is in
 * `./forms/`, one concern a file, and can be started on its own; this
 * starts them all.
 *
 * Everything here is an enhancement: without it the controls still work
 * as plain HTML. Each part starts once on an element (through `mount`),
 * again after an Astro view transition, and stops when its element
 * leaves the page, so running `forms()` twice is safe, and running it
 * after adding controls starts just the new ones.
 */

import { mount } from './mount.js';
import { formRange } from './forms/range.js';
import { fieldCount } from './forms/count.js';
import { revealPassword } from './forms/reveal.js';
import { colorPair } from './forms/color.js';
import { fileDrop } from './forms/files.js';
import { dropdown } from './forms/dropdown.js';

export { formRange } from './forms/range.js';
export { fieldCount, countState } from './forms/count.js';
export { revealPassword } from './forms/reveal.js';
export { colorPair, hexValue } from './forms/color.js';
export { fileDrop, checkFiles, fileSize, fileTag } from './forms/files.js';
export { dropdown, opensUp, typeAhead } from './forms/dropdown.js';

/**
 * Each part, and the elements it starts on. Sliders in a `.form` or with
 * `.range`, except `<Range>`'s own, which writes its value its way.
 *
 * @type {[string, (el: HTMLElement) => (() => void) | void][]}
 */
const PARTS = [
	['.form input[type="range"]:not([data-ui-range]), input.range:not([data-ui-range])', formRange],
	['.field-count[data-count-for]', fieldCount],
	['button[data-reveal]', revealPassword],
	['input[data-color-for]', colorPair],
	['.dropzone', fileDrop],
	['select[data-dropdown]:not([multiple])', dropdown],
];

/**
 * Starts the form kit on the page: every part on every element it
 * belongs to that is not running yet, now and after each view
 * transition. Does nothing outside a browser.
 */
export function forms() {
	for (const [selector, setup] of PARTS) mount(selector, setup);
}
