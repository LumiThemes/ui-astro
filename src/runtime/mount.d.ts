/** An element's `data-ui-config`, parsed; empty when missing or invalid. */
export function readConfig(el: HTMLElement): Record<string, unknown>;

/**
 * Registers a component: `setup` runs once for every element matching
 * `selector`, now and after each Astro view transition, with its parsed
 * `data-ui-config`. The function it returns runs when the element leaves the page.
 */
export function mount<T>(selector: string, setup: (el: HTMLElement, config: T) => (() => void) | void): void;
