/** What a count shows for a length of text: "12 / 60" (or "12" with no limit), and whether it is near (from 90%) or over the limit. */
export function countState(length: number, max: number): { text: string; near: boolean; over: boolean };

/**
 * Keeps a `.field-count[data-count-for="id"]` in step with its field, with `.is-near` and `.is-over`.
 * Returns a function that stops it; nothing when the field is missing.
 */
export function fieldCount(el: HTMLElement): (() => void) | void;
