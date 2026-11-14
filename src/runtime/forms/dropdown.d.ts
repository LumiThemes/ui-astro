/** Whether a list should open upward: when it would not fit below (up to 300px of it, with a margin) and there is more room above. */
export function opensUp(below: number, above: number, height: number): boolean;

/** What has been typed to jump to an option: a key after a pause (700ms) starts afresh; in lower case. */
export function typeAhead(typed: string, key: string, elapsed: number): string;

/**
 * Draws a `<select data-dropdown>` (not `multiple`) as a button and a listbox of its own: descriptions
 * (`data-desc`), colour dots (`data-swatch`), groups, a filter (`data-search`) and the keys a listbox
 * takes. The select stays in the form and keeps the value. Returns a function that stops it and puts the
 * plain select back.
 */
export function dropdown(el: HTMLElement): () => void;
