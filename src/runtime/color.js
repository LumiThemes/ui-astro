/**
 * @module @arraypress/ui-astro/color
 *
 * Reading and writing colours, for `<CopySwatch>`: hex and `rgb()` in, hex,
 * `rgb()` or `hsl()` out, and the ink (near-black or white) that reads best
 * on a colour. Pure functions, safe on the server; a colour it cannot read
 * (a name, `oklch()`, a custom property) is left as it was.
 */

/** A colour as red, green and blue (0–255) and alpha (0–1). */
/** @typedef {{ r: number, g: number, b: number, a: number }} Rgba */

/**
 * Reads a hex (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`) or `rgb()`/`rgba()`
 * colour, with commas or spaces and an optional alpha.
 *
 * @param {string} color The colour.
 * @returns {Rgba | null} Its channels, or null if it is not one of those.
 */
export function parseColor(color) {
	const s = String(color).trim().toLowerCase();
	const hex = s.match(/^#([\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/);
	if (hex) {
		let h = hex[1];
		if (h.length <= 4) h = [...h].map((c) => c + c).join('');
		/**
		 * Reads one hex pair.
		 *
		 * @param {number} i Where it starts.
		 * @returns {number} Its value, 0–255.
		 */
		const n = (i) => parseInt(h.slice(i, i + 2), 16);
		return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? Math.round((n(6) / 255) * 1000) / 1000 : 1 };
	}
	const fn = s.match(/^rgba?\(\s*([^)]+)\)$/);
	if (!fn) return null;
	const parts = fn[1].split(/[\s,/]+/).filter(Boolean);
	if (parts.length < 3 || parts.length > 4) return null;
	/**
	 * Reads one channel.
	 *
	 * @param {string} p The channel as written: a number or a percentage.
	 * @param {number} max Its full value (255, or 1 for alpha).
	 * @returns {number} The channel, clamped to 0…max; NaN if unreadable.
	 */
	const channel = (p, max) => {
		const v = p.endsWith('%') ? (parseFloat(p) / 100) * max : parseFloat(p);
		return Math.min(max, Math.max(0, v));
	};
	const [r, g, b] = parts.slice(0, 3).map((p) => Math.round(channel(p, 255)));
	const a = parts[3] === undefined ? 1 : channel(parts[3], 1);
	return [r, g, b, a].some(Number.isNaN) ? null : { r, g, b, a };
}

/**
 * Writes a colour as hex, `rgb()` or `hsl()`. Hex is upper-case and gains
 * an alpha pair only when the colour is see-through.
 *
 * @param {string} color The colour.
 * @param {'hex' | 'rgb' | 'hsl'} [format] How to write it; nothing to leave it as given.
 * @returns {string} The colour in that format; as given if it cannot be read.
 */
export function formatColor(color, format) {
	const c = format ? parseColor(color) : null;
	if (!c) return color;
	const alpha = c.a < 1 ? ` / ${Math.round(c.a * 100) / 100}` : '';
	if (format === 'rgb') return `rgb(${c.r} ${c.g} ${c.b}${alpha})`;
	if (format === 'hsl') {
		const [r, g, b] = [c.r, c.g, c.b].map((v) => v / 255);
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const l = (max + min) / 2;
		const d = max - min;
		const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
		let h = 0;
		if (d !== 0) {
			if (max === r) h = ((g - b) / d) % 6;
			else if (max === g) h = (b - r) / d + 2;
			else h = (r - g) / d + 4;
		}
		h = Math.round(h * 60 + 360) % 360;
		return `hsl(${h} ${Math.round(s * 100)}% ${Math.round(l * 100)}%${alpha})`;
	}
	/**
	 * Writes a channel as a hex pair.
	 *
	 * @param {number} v The channel, 0–255.
	 * @returns {string} Two hex digits.
	 */
	const pair = (v) => v.toString(16).padStart(2, '0');
	return `#${pair(c.r)}${pair(c.g)}${pair(c.b)}${c.a < 1 ? pair(Math.round(c.a * 255)) : ''}`.toUpperCase();
}

/**
 * The WCAG relative luminance of a colour.
 *
 * @param {Rgba} c The colour.
 * @returns {number} 0 (black) to 1 (white).
 */
function luminance(c) {
	const [r, g, b] = [c.r, c.g, c.b].map((v) => {
		const s = v / 255;
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * The ink that reads best on a colour: near-black or white, whichever has
 * the higher contrast with it.
 *
 * @param {string} color The colour.
 * @param {string} [dark='#0b0b0b'] The dark ink.
 * @param {string} [light='#ffffff'] The light ink.
 * @returns {string | null} The ink; null if the colour cannot be read.
 */
export function inkFor(color, dark = '#0b0b0b', light = '#ffffff') {
	const c = parseColor(color);
	if (!c) return null;
	const l = luminance(c);
	const ld = luminance(/** @type {Rgba} */ (parseColor(dark)));
	const ll = luminance(/** @type {Rgba} */ (parseColor(light)));
	const onDark = (l + 0.05) / (ld + 0.05);
	const onLight = (ll + 0.05) / (l + 0.05);
	return onDark >= onLight ? dark : light;
}
