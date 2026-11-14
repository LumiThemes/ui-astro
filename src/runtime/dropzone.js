/**
 * @module @arraypress/ui-astro/dropzone
 *
 * A file drop target: the element's file input takes files dropped on it
 * as well as picked, keeping only those its `accept` allows. While files
 * are dragged over it the element carries `data-state="over"`, and
 * `"rejected"` for a moment when nothing dropped was accepted. Dropped
 * files land in the input and fire its `change`, so a form or a listener
 * sees them exactly as if they had been picked. A file dropped on it is
 * never opened in the tab, even while the input is disabled.
 *
 * The form kit's dropzones use it with `filter` off and `add` on: every
 * file goes in, to be checked and listed, and a multiple input keeps
 * what it has.
 */

/**
 * Whether a file matches an input's `accept` list: extensions (`.pdf`),
 * MIME types (`text/csv`) and wildcards (`image/*`). An empty list takes
 * anything.
 *
 * @param {Pick<File, 'name' | 'type'>} file The file.
 * @param {string} accept The input's `accept` attribute.
 * @returns {boolean} Whether it is accepted.
 */
export function accepts(file, accept) {
	const rules = accept
		.split(',')
		.map((rule) => rule.trim().toLowerCase())
		.filter(Boolean);
	if (!rules.length) return true;
	const name = file.name.toLowerCase();
	const type = file.type.toLowerCase();
	return rules.some((rule) =>
		rule.startsWith('.') ? name.endsWith(rule) : rule.endsWith('/*') ? type.startsWith(rule.slice(0, -1)) : type === rule,
	);
}

/**
 * The files an input should hold once more arrive: a single input takes
 * only the first; a multiple one adds them to those it holds with `add`,
 * and holds just them otherwise.
 *
 * @template T
 * @param {T[]} current The files it holds now.
 * @param {T[]} incoming The files arriving.
 * @param {{ multiple: boolean, add?: boolean }} how Whether the input takes
 *   several, and whether to add to what it holds (default false).
 * @returns {T[]} What it should hold.
 */
export function nextFiles(current, incoming, { multiple, add = false }) {
	const taken = multiple ? incoming : incoming.slice(0, 1);
	return add && multiple ? [...current, ...taken] : taken;
}

/**
 * Puts files in a file input and fires its `change`, as if they had been picked.
 *
 * @param {HTMLInputElement} input The `<input type="file">`.
 * @param {File[]} files The files it should hold.
 */
export function putFiles(input, files) {
	const transfer = new DataTransfer();
	files.forEach((file) => transfer.items.add(file));
	input.files = transfer.files;
	input.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * Whether a drag carries files (not text or a link).
 *
 * @param {DragEvent} e The drag event.
 * @returns {boolean} Whether it does.
 */
const carriesFiles = (e) => Boolean(e.dataTransfer?.types.includes('Files'));

/**
 * @typedef {object} DropzoneOptions
 * @property {boolean} [filter=true] Keep only the files the input's `accept`
 *   allows, and show `rejected` when none is. Off, every file goes in, for
 *   the page to check.
 * @property {boolean} [add=false] A multiple input adds dropped files to
 *   those it holds, rather than replacing them.
 */

/**
 * Makes an element a drop target for the file input inside it.
 *
 * @param {HTMLElement} el The element, holding an `<input type="file">`.
 * @param {DropzoneOptions} [options] How dropped files are taken.
 * @returns {() => void} Stops it.
 */
export function dropzone(el, { filter = true, add = false } = {}) {
	const input = /** @type {HTMLInputElement | null} */ (el.querySelector('input[type="file"]'));
	if (!input) return () => {};
	let depth = 0;
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let timer;

	/**
	 * Sets the state the styles follow.
	 *
	 * @param {'idle' | 'over' | 'rejected'} state The state.
	 */
	const show = (state) => {
		clearTimeout(timer);
		el.dataset.state = state;
		if (state === 'rejected') timer = setTimeout(() => show('idle'), 900);
	};

	/**
	 * Lets files dragged over the element drop here, not open in the tab.
	 *
	 * @param {DragEvent} e The drag event.
	 */
	const over = (e) => {
		if (!carriesFiles(e)) return;
		e.preventDefault();
		/** @type {DataTransfer} */ (e.dataTransfer).dropEffect = 'copy';
	};

	/**
	 * Counts the drag in: enter and leave fire for every child crossed.
	 *
	 * @param {DragEvent} e The drag event.
	 */
	const enter = (e) => {
		if (!carriesFiles(e) || input.disabled) return;
		depth++;
		show('over');
	};

	/** Counts the drag out, back to idle once it has left the element. */
	const leave = () => {
		depth = Math.max(0, depth - 1);
		if (!depth && el.dataset.state === 'over') show('idle');
	};

	/**
	 * Puts the dropped files in the input and fires its `change`; ignores
	 * them while the input is disabled.
	 *
	 * @param {DragEvent} e The drop event.
	 */
	const drop = (e) => {
		if (!carriesFiles(e)) return;
		e.preventDefault();
		depth = 0;
		show('idle');
		if (input.disabled) return;
		const dropped = [...(e.dataTransfer?.files ?? [])];
		const files = filter ? dropped.filter((file) => accepts(file, input.accept)) : dropped;
		if (!files.length) return show('rejected');
		putFiles(input, nextFiles([...(input.files ?? [])], files, { multiple: input.multiple, add }));
	};

	el.addEventListener('dragover', over);
	el.addEventListener('dragenter', enter);
	el.addEventListener('dragleave', leave);
	el.addEventListener('drop', drop);
	show('idle');
	return () => {
		clearTimeout(timer);
		el.removeEventListener('dragover', over);
		el.removeEventListener('dragenter', enter);
		el.removeEventListener('dragleave', leave);
		el.removeEventListener('drop', drop);
	};
}
