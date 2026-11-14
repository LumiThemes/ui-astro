/** Whether a file matches an input's `accept` list (extensions, MIME types, `image/*`); an empty list takes anything. */
export function accepts(file: Pick<File, 'name' | 'type'>, accept: string): boolean;

/**
 * The files an input should hold once more arrive: a single input takes only the first; a multiple one
 * adds them to those it holds with `add`, and holds just them otherwise.
 */
export function nextFiles<T>(current: T[], incoming: T[], how: { multiple: boolean; add?: boolean }): T[];

/** Puts files in a file input and fires its `change`, as if they had been picked. */
export function putFiles(input: HTMLInputElement, files: File[]): void;

/** How a dropzone takes dropped files. */
export interface DropzoneOptions {
	/**
	 * Keep only the files the input's `accept` allows, and show `rejected` when none is. Off, every file
	 * goes in, for the page to check. Default true.
	 */
	filter?: boolean;
	/** A multiple input adds dropped files to those it holds, rather than replacing them. Default false. */
	add?: boolean;
}

/**
 * Makes an element a drop target for the `<input type="file">` inside it:
 * dropped files land in the input and fire its `change`. Sets
 * `data-state` to `idle`, `over` or (briefly) `rejected`. A dropped file never
 * opens in the tab, even while the input is disabled. Returns a function that stops it.
 */
export function dropzone(el: HTMLElement, options?: DropzoneOptions): () => void;
