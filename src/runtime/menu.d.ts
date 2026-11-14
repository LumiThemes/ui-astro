/**
 * Where a key moves the focus in a list of items: `ArrowDown` and `ArrowUp` wrap round (or, with `wrap`
 * false, stop at the ends), `Home` and `End` go to the ends; from no item (`at` -1), down goes to the
 * first and up to the last. Any other key returns `at`; an empty list returns -1.
 */
export function menuStep(at: number, key: string, length: number, wrap?: boolean): number;

/** A drop-down menu wired to its button. */
export interface PopupMenu {
	/** Opens it and focuses the picked-out item, or the first (or last) item. */
	open(from?: 'first' | 'last'): void;
	/** Closes it; `refocus` hands the focus back to the button. */
	close(refocus?: boolean): void;
	/** Whether it shows. */
	isOpen(): boolean;
	/** The items the keys move between: `menuitem`, `menuitemradio` and `menuitemcheckbox` roles, not disabled. */
	items(): HTMLElement[];
	/** Removes its listeners. */
	stop(): void;
}

/**
 * Wires a drop-down menu (`hidden` while closed) to the button that opens it: `aria-expanded` in step,
 * `.is-open` on `root`, arrow keys, Home and End between items, Escape closes and refocuses the button,
 * Tab and a click outside `root` close it. `initial` picks the item focused on opening.
 */
export function popupMenu(
	root: HTMLElement,
	trigger: HTMLElement,
	menu: HTMLElement,
	options?: { initial?: () => HTMLElement | null | undefined },
): PopupMenu;
