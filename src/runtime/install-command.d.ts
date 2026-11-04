/**
 * Starts an install command bar (`[data-ui-install-command]`): its menu switches the shown option (label,
 * icon, prefix, command, what is copied, the note), and the copy button copies with a tick. Each option is a
 * `[data-command]` menu item carrying `data-id`, `data-label`, `data-prefix`, `data-command`, `data-copy`
 * and `data-note`. Sets `data-selected` on the root to the shown option's id. Returns a function that stops it.
 */
export function installCommand(el: HTMLElement): () => void;
