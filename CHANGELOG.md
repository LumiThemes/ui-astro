# Changelog

All notable changes to `@arraypress/ui-astro` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — Unreleased

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
