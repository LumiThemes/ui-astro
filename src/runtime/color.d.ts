/** A colour as red, green and blue (0–255) and alpha (0–1). */
export interface Rgba {
	r: number;
	g: number;
	b: number;
	a: number;
}

/** How `formatColor` writes a colour. */
export type ColorFormat = 'hex' | 'rgb' | 'hsl';

/**
 * Reads a hex (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`) or `rgb()`/`rgba()` colour, with commas or spaces and
 * an optional alpha. Null for anything else.
 */
export function parseColor(color: string): Rgba | null;

/**
 * Writes a colour as upper-case hex, `rgb(r g b)` or `hsl(h s% l%)` (with `/ alpha` when see-through).
 * Without a format, or for a colour it cannot read, returns it as given.
 */
export function formatColor(color: string, format?: ColorFormat): string;

/** The ink that reads best on a colour: `dark` or `light`, by WCAG contrast. Null if it cannot be read. */
export function inkFor(color: string, dark?: string, light?: string): string | null;
