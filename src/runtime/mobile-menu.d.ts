/**
 * Is a link the page being shown, or a section it sits in? `/` matches the home page only; trailing slashes,
 * queries, hashes and a same-site origin are ignored. A hash-only link (`#part`) matches only an identical `path`.
 */
export function isCurrent(href: string, path: string): boolean;

/** A mobile menu's settings. */
export interface MobileMenuConfig {
	/** Widths above this (px) close it; 0 for none. */
	breakpoint?: number;
}

/**
 * Starts a mobile menu (a `<details data-ui-mobile-menu>` with a `[data-ui-mobile-menu-panel]`): closes it on
 * a link click, on Escape and past the breakpoint, and keeps `--ui-mobile-menu-h` set to the room from the
 * panel's top to the foot of the window while open. Returns a function that stops it.
 */
export function mobileMenu(el: HTMLElement, config: MobileMenuConfig): () => void;
