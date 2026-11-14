import type { NumberStyle } from './number-format.js';

/**
 * How far along its track a slider's value sits: 0 at `min` (default 0) to 1 at `max` (default 100);
 * 0 when the range is empty. Takes the input, or anything with its `value`, `min` and `max`.
 */
export function rangeShare(input: { value: string; min: string; max: string }): number;

/** Fills a slider's track up to its thumb: sets `--fill` (0–100%) on it. */
export function rangeFill(input: HTMLInputElement): void;

/**
 * Follows a range input: keeps `--fill` (0–100%) on it and writes its
 * value, formatted, into the `<output for>` naming it. Returns a function that stops it.
 */
export function range(el: HTMLElement, config: NumberStyle): () => void;
