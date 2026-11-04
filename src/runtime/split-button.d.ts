/** What a split button's `ui-action` event carries. */
export interface SplitActionDetail {
	/** The clicked button's `data-action`. */
	action: string;
}

/**
 * Starts a split button (`[data-ui-split-button]`): the arrow (`[data-ui-split="more"]`) opens its menu
 * (`[data-ui-split="menu"]`), choosing an item closes it, and a button with a `data-action` sends a
 * bubbling `ui-action` event from the root with `{ action }` as its detail. Returns a function that stops it.
 */
export function splitButton(el: HTMLElement): () => void;
