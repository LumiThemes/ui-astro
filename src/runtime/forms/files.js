/**
 * @module @arraypress/ui-astro/forms/files
 *
 * A form kit dropzone: a `.dropzone` label round a file input takes
 * dropped files as well as picked ones (through `dropzone`, every file
 * kept and a multiple input added to). Each time the files change it
 * checks them against the input's `accept`, `data-max-mb` (on the zone
 * or the input) and `data-max-files`, sets the input's message (so the
 * form will not send), and marks the zone `.is-invalid` and `.has-file`.
 * It lists them in the `.file-list[data-files-for="id"]` naming the
 * input, images as thumbnails, each with a button to remove it; and a
 * `.dropzone.is-image` shows the one picture in its `.dropzone-preview
 * img`. Previews are `data:` URLs, so a Content Security Policy needs
 * `img-src data:` (not `blob:`).
 */

import { formatSize } from '@arraypress/file-utils';
import { accepts, dropzone, putFiles } from '../dropzone.js';
import { element } from './dom.js';

/** A megabyte, as `data-max-mb` counts them. */
const MB = 1024 ** 2;

/** Images larger than this are listed without a preview. */
const PREVIEW_LIMIT = 15 * MB;

/** The remove button's cross (trusted markup). */
const CROSS = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

/**
 * A size in words: 820 KB, 2.4 MB.
 *
 * @param {number} bytes The size in bytes.
 * @returns {string} The size, in whole units where it is a round number.
 */
export function fileSize(bytes) {
	return formatSize(bytes, { wholeUnits: true });
}

/**
 * The short tag that stands in for a file without a preview: its
 * extension, at most four letters.
 *
 * @param {string} name The file's name.
 * @returns {string} The tag (the name's start when it has no extension).
 */
export function fileTag(name) {
	return (name.split('.').pop() ?? '').slice(0, 4);
}

/**
 * Checks files against what an input takes.
 *
 * @param {Pick<File, 'name' | 'type' | 'size'>[]} files The files.
 * @param {{ accept?: string, maxMb?: number, maxFiles?: number }} [rules] The
 *   input's `accept`, the largest file in megabytes and the most files; 0
 *   (or none) for no limit.
 * @returns {{ problems: string[], message: string }} What is wrong with each
 *   file ('' when nothing is), and the one message for the input ('' when
 *   all is well): too many files first, then the first file's problem.
 */
export function checkFiles(files, { accept = '', maxMb = 0, maxFiles = 0 } = {}) {
	const problems = files.map((file) => (!accepts(file, accept) ? 'Not a file type this takes' : maxMb && file.size > maxMb * MB ? `Over ${maxMb} MB` : ''));
	const tooMany = maxFiles && files.length > maxFiles ? `Up to ${maxFiles} file${maxFiles > 1 ? 's' : ''}` : '';
	return { problems, message: tooMany || problems.find(Boolean) || '' };
}

/**
 * Reads an image as a `data:` URL, for a preview.
 *
 * @param {File} file The file.
 * @returns {Promise<string | null>} The URL; null for a file that is not
 *   an image, is too large, or cannot be read.
 */
function preview(file) {
	return new Promise((done) => {
		if (!file.type.startsWith('image/') || file.size > PREVIEW_LIMIT) return done(null);
		const reader = new FileReader();
		reader.onload = () => done(typeof reader.result === 'string' ? reader.result : null);
		reader.onerror = () => done(null);
		reader.readAsDataURL(file);
	});
}

/**
 * Makes a file's row in the list.
 *
 * @param {File} file The file.
 * @param {number} index Its place in the input, which its remove button carries.
 * @param {string} problem What is wrong with it, or ''.
 * @param {string | null} thumb Its preview, if it has one.
 * @returns {HTMLLIElement} The row.
 */
function fileRow(file, index, problem, thumb) {
	const row = element('li', problem ? 'file is-error' : 'file');
	const tag = element('span', 'file-thumb', thumb ? undefined : fileTag(file.name));
	if (thumb) {
		const img = element('img');
		img.src = thumb;
		img.alt = '';
		tag.append(img);
	}
	const name = element('span', 'file-name');
	name.append(element('b', '', file.name), element('small', '', problem || fileSize(file.size)));
	const remove = element('button', 'file-remove');
	remove.type = 'button';
	remove.dataset.i = String(index);
	remove.setAttribute('aria-label', `Remove ${file.name}`);
	remove.innerHTML = CROSS;
	row.append(tag, name, remove);
	return row;
}

/**
 * Starts a dropzone.
 *
 * @param {HTMLElement} el The `.dropzone`, holding an `<input type="file">`.
 * @returns {(() => void) | void} Stops it; nothing when it holds no file input.
 */
export function fileDrop(el) {
	const input = /** @type {HTMLInputElement | null} */ (el.querySelector('input[type="file"]'));
	if (!input) return;
	const list = input.id ? /** @type {HTMLElement | null} */ (document.querySelector(`.file-list[data-files-for="${CSS.escape(input.id)}"]`)) : null;
	const img = /** @type {HTMLImageElement | null} */ (el.querySelector('.dropzone-preview img'));
	const maxMb = Number(el.dataset.maxMb ?? input.dataset.maxMb ?? 0);
	const maxFiles = Number(el.dataset.maxFiles ?? 0);
	const stopDrop = dropzone(el, { filter: false, add: true });
	let pass = 0;

	/** Checks the chosen files, sets the input's message, and shows them; a later change wins over one still reading. */
	const render = async () => {
		const run = ++pass;
		const files = [...(input.files ?? [])];
		const { problems, message } = checkFiles(files, { accept: input.accept, maxMb, maxFiles });
		input.setCustomValidity(message);
		el.classList.toggle('is-invalid', Boolean(message));
		el.classList.toggle('has-file', files.length > 0);
		if (img) {
			const src = files[0] ? await preview(files[0]) : null;
			if (run !== pass) return;
			if (src) img.src = src;
			else img.removeAttribute('src');
			el.classList.toggle('has-file', Boolean(src));
		}
		if (!list) return;
		const thumbs = await Promise.all(files.map(preview));
		if (run !== pass) return;
		list.replaceChildren(...files.map((file, i) => fileRow(file, i, problems[i], thumbs[i])));
	};

	/**
	 * Takes a file out when its remove button is pressed.
	 *
	 * @param {MouseEvent} e The click in the list.
	 */
	const remove = (e) => {
		const button = /** @type {HTMLElement | null} */ (/** @type {Element} */ (e.target).closest('.file-remove'));
		if (!button) return;
		putFiles(
			input,
			[...(input.files ?? [])].filter((_, i) => i !== Number(button.dataset.i)),
		);
	};

	input.addEventListener('change', render);
	list?.addEventListener('click', remove);
	// The browser can bring files back with the page (going back to it): show them.
	if (input.files?.length) render();
	return () => {
		stopDrop();
		input.removeEventListener('change', render);
		list?.removeEventListener('click', remove);
	};
}
