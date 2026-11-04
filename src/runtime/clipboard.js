/**
 * @module @arraypress/ui-astro/clipboard
 *
 * Copying text, for every component with a copy button: the Clipboard API
 * where the page may use it, and the old hidden-textarea copy where it may
 * not (a page served over plain http), so the button still works. Plus a
 * class that comes on for a moment after a copy, for the tick or the
 * "Copied" note.
 */

/** Each element's pending timer, so a second copy restarts the flash. */
/** @type {WeakMap<Element, ReturnType<typeof setTimeout>>} */
const timers = new WeakMap();

/**
 * Copies with a hidden textarea and `execCommand`, for pages where the
 * Clipboard API is missing or blocked. Puts the focus back where it was.
 *
 * @param {string} text What to copy.
 * @returns {boolean} Whether it was copied.
 */
function legacyCopy(text) {
	if (typeof document === 'undefined') return false;
	const active = /** @type {HTMLElement | null} */ (document.activeElement);
	const area = document.createElement('textarea');
	area.value = text;
	area.setAttribute('readonly', '');
	area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
	document.body.append(area);
	area.select();
	let ok = false;
	try {
		ok = document.execCommand('copy');
	} catch {
		ok = false;
	}
	area.remove();
	active?.focus?.({ preventScroll: true });
	return ok;
}

/**
 * Copies text to the clipboard.
 *
 * @param {string} text What to copy.
 * @returns {Promise<boolean>} Whether it was copied (false when the browser refused).
 */
export async function copyText(text) {
	try {
		if (typeof navigator === 'undefined' || !navigator.clipboard) return legacyCopy(text);
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		return legacyCopy(text);
	}
}

/**
 * Puts a class on an element for a moment (the copied tick), restarting the
 * moment if it is already on.
 *
 * @param {Element} el The element.
 * @param {string} [className='is-copied'] The class.
 * @param {number} [ms=1400] How long it stays on.
 * @param {() => void} [done] Runs when it comes off.
 */
export function flash(el, className = 'is-copied', ms = 1400, done) {
	clearTimeout(timers.get(el));
	el.classList.add(className);
	timers.set(
		el,
		setTimeout(() => {
			el.classList.remove(className);
			timers.delete(el);
			done?.();
		}, ms),
	);
}
