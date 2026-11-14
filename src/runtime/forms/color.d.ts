/** Reads a six-digit hex colour as typed (with or without its `#`): `#rrggbb` in lower case, or null. */
export function hexValue(text: string): string | null;

/**
 * Keeps a text input with `data-color-for="id"` and its colour input in step: the colour in capitals as
 * text, and a typed hex as the colour. Returns a function that stops it; nothing when the colour input is missing.
 */
export function colorPair(el: HTMLElement): (() => void) | void;
