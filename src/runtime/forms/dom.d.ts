/** The element with an id, when there is one to look for: null without an id or a match. */
export function byId(id: string | undefined): HTMLElement | null;

/** Makes an element with a class and, optionally, its text (set as text, never as markup). */
export function element<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K];
