/** Where closes are remembered, per notice id (`ui-notice:<id>`). */
export const STORAGE_PREFIX: string;

/** Has a notice's last day (`YYYY-MM-DD`, inclusive, UTC) passed? */
export function noticeEnded(until: string | undefined, now?: number): boolean;

/**
 * Starts a notice bar: hides it after its last day or once closed (remembered per id), and keeps
 * `--ui-notice-h` on the root set to its height. Returns a function that stops it.
 */
export function noticeBar(el: HTMLElement, config: { id?: string; until?: string }): () => void;
