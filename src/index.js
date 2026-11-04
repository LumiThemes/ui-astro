/**
 * @arraypress/ui-astro
 *
 * Small UI pieces for Astro sites, as components imported from their own
 * paths (`@arraypress/ui-astro/Countdown.astro`, …). This entry is the
 * runtime underneath, for use without Astro or to build more: each
 * component's script as a plain function, number formatting, file
 * matching, drop-down menus, copying, colour formatting, the
 * reduced-motion check and view-transition-safe mounting.
 *
 * @module @arraypress/ui-astro
 */

export { countdown } from './runtime/countdown.js';
export { range } from './runtime/range.js';
export { numberFormat } from './runtime/number-format.js';
export { dropzone, accepts } from './runtime/dropzone.js';
export { timeline } from './runtime/timeline.js';
export { scrollChrome } from './runtime/scroll-chrome.js';
export { noticeBar, noticeEnded } from './runtime/notice-bar.js';
export { installCommand } from './runtime/install-command.js';
export { mobileMenu, isCurrent } from './runtime/mobile-menu.js';
export { splitButton } from './runtime/split-button.js';
export { copySwatch } from './runtime/copy-swatch.js';
export { popupMenu, menuStep } from './runtime/menu.js';
export { copyText, flash } from './runtime/clipboard.js';
export { parseColor, formatColor, inkFor } from './runtime/color.js';
export { prefersReducedMotion } from './runtime/device.js';
export { mount, readConfig } from './runtime/mount.js';
