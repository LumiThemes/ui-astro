/**
 * Starts a copyable swatch (`[data-ui-copy-swatch]`): a click on its `[data-value]` chip copies the value,
 * puts `.is-copied` on the chip for a moment and writes "Copied" into its `[role="status"]`. Returns a
 * function that stops it.
 */
export function copySwatch(el: HTMLElement): () => void;
