/**
 * Copies text to the clipboard: the Clipboard API, or a hidden textarea where the page may not use it.
 * Resolves to whether it was copied.
 */
export function copyText(text: string): Promise<boolean>;

/**
 * Puts a class on an element for a moment (default `is-copied`, 1400 ms), restarting it if already on;
 * `done` runs when it comes off.
 */
export function flash(el: Element, className?: string, ms?: number, done?: () => void): void;
