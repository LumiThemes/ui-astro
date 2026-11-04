/**
 * @module @arraypress/ui-astro/notice-bar
 *
 * The behaviour behind `<NoticeBar>`: hides it once its end date has passed,
 * remembers a close per notice id (so a new notice shows again to people who
 * closed the last), and keeps `--ui-notice-h` on the page's root set to its
 * height while it shows, for sticky headers and panels to sit under.
 */

/** Where closes are remembered, per notice id. */
export const STORAGE_PREFIX = 'ui-notice:';

/**
 * Has a notice's last day (`YYYY-MM-DD`, inclusive, UTC) passed?
 *
 * @param {string | undefined} until The last day it shows, or nothing for no end.
 * @param {number} [now=Date.now()] The time to check, epoch ms.
 * @returns {boolean} Whether it has ended.
 */
export function noticeEnded(until, now = Date.now()) {
	if (!until) return false;
	const end = Date.parse(`${until}T00:00:00Z`);
	return Number.isFinite(end) && now >= end + 86_400_000;
}

/**
 * Reads whether a notice was closed, quietly false where storage is blocked.
 *
 * @param {string} id The notice's id.
 * @returns {boolean} Whether it was closed.
 */
function wasClosed(id) {
	try {
		return localStorage.getItem(STORAGE_PREFIX + id) === '1';
	} catch {
		return false;
	}
}

/**
 * Starts a notice bar.
 *
 * @param {HTMLElement} el The bar.
 * @param {{ id?: string, until?: string }} config Its id and last day.
 * @returns {() => void} Stops it (and clears `--ui-notice-h`).
 */
export function noticeBar(el, config) {
	const id = config.id ?? '';
	const root = document.documentElement;
	/** Sets `--ui-notice-h` to the bar's height, or 0 while it's hidden. */
	const measure = () => root.style.setProperty('--ui-notice-h', el.hidden ? '0px' : `${el.offsetHeight}px`);
	if (noticeEnded(config.until) || (id && wasClosed(id))) el.hidden = true;
	const close = el.querySelector('[data-ui-notice-close]');
	/** Closes the bar and remembers it for this id. */
	const onClose = () => {
		el.hidden = true;
		try {
			if (id) localStorage.setItem(STORAGE_PREFIX + id, '1');
		} catch {
			/* storage blocked: closed for this page only */
		}
		measure();
	};
	close?.addEventListener('click', onClose);
	const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(measure) : null;
	ro?.observe(el);
	measure();
	return () => {
		close?.removeEventListener('click', onClose);
		ro?.disconnect();
		root.style.removeProperty('--ui-notice-h');
	};
}
