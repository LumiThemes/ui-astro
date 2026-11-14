/**
 * Wires a `button[data-reveal="id"]` to its password field: a click turns it between `password` and
 * `text`, with `aria-pressed` in step and the button's words swapped (its own, then `data-hide`, default
 * "Hide"). Returns a function that stops it; nothing when the field is missing.
 */
export function revealPassword(el: HTMLElement): (() => void) | void;
