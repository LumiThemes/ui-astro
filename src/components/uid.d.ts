/** A short, stable hash of a string (FNV-1a, 32-bit, base 36). */
export function shortHash(text: string): string;

/** An id for one instance of a component, the same on every build: `prefix-hash` of `content`, with `-2`, `-3`… for later ones alike on the same `page` (`Astro.request`). */
export function stableId(prefix: string, page: object, content: unknown): string;
