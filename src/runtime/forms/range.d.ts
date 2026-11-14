/**
 * Follows a slider: keeps `--fill` (0–100%) on it and writes its value, then the output's `data-unit`,
 * into every `<output for>` naming it. Returns a function that stops it.
 */
export function formRange(el: HTMLElement): () => void;
