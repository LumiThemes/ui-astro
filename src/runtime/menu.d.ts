/**
 * Where a key moves the focus in a list of items: `ArrowDown` and `ArrowUp` wrap round (or, with `wrap`
 * false, stop at the ends), `Home` and `End` go to the ends; from no item (`at` -1), down goes to the
 * first and up to the last. Any other key returns `at`; an empty list returns -1.
 */
export function menuStep(at: number, key: string, length: number, wrap?: boolean): number;

/** Whether a menu item shows: neither it nor anything round it inside `menu` is `hidden`. */
export function itemShows(item: HTMLElement, menu: HTMLElement): boolean;

/** A drop-down menu wired to its button. */
export interface PopupMenu {
	/** Opens it and focuses the picked-out item, or the first (or last) item. */
	open(from?: 'first' | 'last'): void;
	/** Closes it; `refocus` hands the focus back to the button. */
	close(refocus?: boolean): void;
	/** Whether it shows. */
	isOpen(): boolean;
	/** The items the keys move between: `menuitem`, `menuitemradio` and `menuitemcheckbox` roles, not disabled or hidden. */
	items(): HTMLElement[];
	/** Removes its listeners. */
	stop(): void;
}

/**
 * Wires a drop-down menu (`hidden` while closed) to the button that opens it: `aria-expanded` in step,
 * `.is-open` on `root`, arrow keys, Home and End between the items that show, Escape closes and refocuses the
 * button, Tab and a click outside `root` close it. The keys it handles (and the sideways arrows from inside the
 * menu) go no further, so the page's own arrow-key shortcuts stay still. `initial` picks the item focused on opening.
 */
export function popupMenu(
	root: HTMLElement,
	trigger: HTMLElement,
	menu: HTMLElement,
	options?: { initial?: () => HTMLElement | null | undefined },
): PopupMenu;
