# Changelog

All notable changes to `@arraypress/ui-astro` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
