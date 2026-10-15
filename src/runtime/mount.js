/**
 * @module @arraypress/ui-astro/mount
 *
 * Starts every instance of a component on the page, and starts them again
 * after an Astro view transition swaps the page in. A component that needs
 * settings renders them as JSON in `data-ui-config`; the setup function is
 * called once per element with those settings, and the function it
 * returns is called when the element leaves the page.
 */

/** @type {Map<string, (el: HTMLElement, config: any) => (() => void) | void>} */
const components = new Map();
/** For each registered selector, its running elements and how to stop each. */
/** @type {Map<string, Map<HTMLElement, () => void>>} */
const running = new Map();
let listening = false;

/**
 * Reads an element's settings.
 *
 * @param {HTMLElement} el The element.
 * @returns {Record<string, unknown>} Its `data-ui-config`, parsed; empty
 *   when missing or not valid JSON.
 */
export function readConfig(el) {
	try {
		return JSON.parse(el.dataset.uiConfig ?? '{}') ?? {};
	} catch {
		return {};
	}
}

/** Sets up every registered component's elements that are not running yet, and stops those that left the page. */
function scan() {
	for (const [selector, setup] of components) {
		const live = running.get(selector) ?? new Map();
		running.set(selector, live);
		for (const [el, stop] of live) {
			if (!el.isConnected) {
				stop();
				live.delete(el);
			}
		}
		document.querySelectorAll(selector).forEach((node) => {
			const el = /** @type {HTMLElement} */ (node);
			if (live.has(el)) return;
			live.set(el, setup(el, readConfig(el)) ?? (() => {}));
		});
	}
}

/**
 * Registers a component: `setup` runs for every element matching
 * `selector`, now and after each view transition.
 *
 * @template T
 * @param {string} selector Matches the component's elements.
 * @param {(el: HTMLElement, config: T) => (() => void) | void} setup Starts
 *   it on one element; returns a function that stops it.
 */
export function mount(selector, setup) {
	if (typeof document === 'undefined') return;
	components.set(selector, setup);
	if (!listening) {
		listening = true;
		document.addEventListener('astro:page-load', scan);
	}
	if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scan, { once: true });
	else scan();
}
