# Changelog

All notable changes to `@arraypress/ui-astro` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] — 2026-11-15

### Added

- `forms.css`: a form kit. Inside a `.form` the plain controls are styled as they are (text, number, search, the dates and times, select, list box, textarea, checkbox, radio, range, colour, file, progress, meter, output), in every state, with a small markup contract for the rest: fields with labels, hints, counts and errors shown once used, rows, sections, add-ons, choices and choice cards, segmented controls, switches, dropzones and file lists, a drawn dropdown, statuses, actions with a busy spinner, inline forms, a honeypot and a spam-check slot. `.input`, `.select` and `.textarea` style controls outside a form. Themed by `--ui-form-*` custom properties, defaulting to the colour scheme and `--ui-accent`.
- `forms()` (`@arraypress/ui-astro/runtime/forms`): the kit's script, an enhancement throughout and safe to run again: sliders' fill and `<output>` (with `data-unit`), running counts, password reveals, colour inputs kept in step with their hex, dropzones that check, list and remove files (with image previews), and `select[data-dropdown]` drawn as a listbox with descriptions, colour dots, groups, a filter and the listbox keys. Each part is its own module in `runtime/forms/` (`formRange`, `fieldCount`, `revealPassword`, `colorPair`, `fileDrop`, `dropdown`), with the pure helpers `countState`, `hexValue`, `checkFiles`, `fileSize`, `fileTag`, `opensUp` and `typeAhead`.
- `rangeFill` and `rangeShare` (the slider fill `<Range>` and the form kit share); `nextFiles` and `putFiles` (putting files in an input, as `<Dropzone>` and the form kit do).
- `dropzone(el, { filter, add })`: keep every dropped file rather than only those `accept` allows, and add to a multiple input's files rather than replace them. The defaults are as before.
- `menuStep(at, key, length, wrap)`: `wrap` false stops at the ends, as a listbox does.
- COMPONENTS.md documents the stylesheets, from their header comments.
- A dependency, `@arraypress/file-utils`, for the file sizes in the kit's file lists.

### Changed

- `<Dropzone>` (and `dropzone`) claims every drag of files over it, so a file dropped on a disabled zone is ignored rather than opened in the tab.

## [0.4.0] — 2026-11-05

### Added

- `<InstallCommand icons>`: its own icons (`chevron`, `copy`, `check`, `download`, `arrow`) as trusted SVG markup, so a site draws them as it draws its other icons.
- `<InstallCommand more>`: one link set apart at the very foot of the menu, under a rule of its own, its icon after the words (an arrow by default), in `--ui-install-more` and bold: a page with every way to install.
- `<InstallCommand id>`: a base for its element ids.
- More `<InstallCommand>` custom properties: `--ui-install-text`, `--ui-install-hover` (the button), `--ui-install-item-hover` (menu rows), `--ui-install-size` and `--ui-install-pad` (the command), `--ui-install-link` (links in the note), `--ui-install-more`, `--ui-install-chev-turn` (how far the chevron turns when open; `0deg` holds it still), `--ui-menu-muted` (group titles, tags, icons), `--ui-menu-rule`, `--ui-menu-shadow` and `--ui-menu-leading`.

### Changed

- Element ids are the same on every build: a short hash of what the instance shows, with `-2`, `-3`… for later ones alike on the same page, in place of `Math.random` (`<InstallCommand>`, `<SplitButton>`, `<MobileMenu>`, `<Faq exclusive>`), so a site builds to the same bytes each time.
- `<InstallCommand>` reads every custom property with a fallback rather than setting `--ui-install-line` and `--ui-install-muted` on itself, so a site can set any of them on the element or an ancestor without outweighing its scoped selectors.

## [0.3.0] — 2026-11-04

### Added

- `<InstallCommand>`: a copyable command bar whose menu switches between grouped options (label, icon, prefix, the command shown, what is copied, a note under the bar), with optional download links at the foot of the menu, keyboard navigation, Escape, click-outside and a copied tick. Runtime: `installCommand`.
- `<MobileMenu>`: a 44px `<details>` button that opens a full-screen panel under the header (large links with arrows, the current page picked out, a call to action, secondary links at the foot); the page holds still behind it, and it closes on a link, on Escape and past its `breakpoint`. Runtime: `mobileMenu`, `isCurrent`.
- `<SplitButton>`: a main action with an attached arrow that opens a menu of links or buttons (notes, dividers, disabled items); buttons send a `ui-action` event. Runtime: `splitButton`.
- `<CopySwatch>`: a colour chip with its name and value that copies the value on click, with a brief "Copied" on it; writes the value as hex, `rgb()` or `hsl()` and picks a readable ink. Runtime: `copySwatch`.
- Shared runtime: `popupMenu` and `menuStep` (the drop-down menu behind `<InstallCommand>` and `<SplitButton>`), `copyText` and `flash` (copying, with a fallback where the Clipboard API is blocked), `parseColor`, `formatColor` and `inkFor`.

## [0.2.0] — 2026-11-04

### Added

- `<NoticeBar>`: an announcement bar (pill, line, wide-screen line, call to action, close). A close is remembered per `id`; `until` ends it after a day; `--ui-notice-h` holds its height for sticky headers; a closed bar never flashes. Runtime: `noticeBar`, `noticeEnded`.
- `<Faq>`: questions that open to their answers, with a drawn chevron, `exclusive` (one open at a time, native `<details name>`) and FAQPage JSON-LD by default.

## [0.1.0]

### Added

- Forms and data:
  - `<Range>`: a filled slider with a formatted value.
  - `<Dropzone>`: a file drop target with an edge light and a busy scan.
  - `<Countdown>`: tiles to a date, a still end date with reduced motion.
  - `<Skeleton>`: card, row and text placeholders with a shimmer.
  - `<Timeline>`: fills as the page scrolls; the current step breathes.
  - `tooltip.css`: tooltips from `data-tip`.
- Page chrome:
  - `<ScrollProgress>`.
  - `<BackToTop>`.
- For music shops:
  - `<VinylSleeve>`.
  - `<Equalizer>`.
- The runtime: `countdown`, `range`, `numberFormat`, `dropzone` and `accepts`, `timeline`, `scrollChrome`, `prefersReducedMotion`, and view-transition-safe `mount` with `readConfig`.
- COMPONENTS.md, generated from the components' types (`npm run docs`).
- A demo (`demo/`): one page with every piece in place.

Moved out of `@arraypress/effects-astro` (0.1.0, unreleased), which now keeps to visual effects. Root classes and script hooks are renamed from `effect-` / `data-effect-*` to `ui-` / `data-ui-*`. `<Dropzone>` has its own edge light in place of `border-sweep.css`, and `<Skeleton>`, `<Timeline>` and `<Equalizer>` carry the shimmer, live dot and settle they took from `motion.css`, so nothing depends on the effects package.
