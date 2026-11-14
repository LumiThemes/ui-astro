/** A size in words, in whole units where it is a round number: 820 KB, 2.4 MB. */
export function fileSize(bytes: number): string;

/** The tag that stands in for a file without a preview: its extension, at most four letters. */
export function fileTag(name: string): string;

/** What a file input takes: its `accept`, the largest file in megabytes and the most files (0 for no limit). */
export interface FileRules {
	accept?: string;
	maxMb?: number;
	maxFiles?: number;
}

/**
 * Checks files against what an input takes: what is wrong with each ('' when nothing is), and the one
 * message for the input ('' when all is well): too many files first, then the first file's problem.
 */
export function checkFiles(files: Pick<File, 'name' | 'type' | 'size'>[], rules?: FileRules): { problems: string[]; message: string };

/**
 * Starts a `.dropzone`: dropped files land in its input, every change is checked (`accept`, `data-max-mb`,
 * `data-max-files`) and listed in the `.file-list[data-files-for="id"]` naming the input, each removable;
 * `.dropzone.is-image` shows the picture in its `.dropzone-preview img`. Sets `.is-invalid`, `.has-file`
 * and the input's message. Returns a function that stops it; nothing when it holds no file input.
 */
export function fileDrop(el: HTMLElement): (() => void) | void;
