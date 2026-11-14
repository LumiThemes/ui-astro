export { formRange } from './forms/range.js';
export { fieldCount, countState } from './forms/count.js';
export { revealPassword } from './forms/reveal.js';
export { colorPair, hexValue } from './forms/color.js';
export { fileDrop, checkFiles, fileSize, fileTag } from './forms/files.js';
export type { FileRules } from './forms/files.js';
export { dropdown, opensUp, typeAhead } from './forms/dropdown.js';

/**
 * Starts the form kit (`forms.css`) on the page: sliders in a `.form` (or with `.range`) and their
 * `<output for>`, `.field-count[data-count-for]`, `button[data-reveal]`, `input[data-color-for]`,
 * `.dropzone` and `select[data-dropdown]`. Each starts once per element, again after a view transition,
 * and stops when its element leaves the page: safe to run twice, and run again after adding controls.
 * Does nothing outside a browser.
 */
export function forms(): void;
