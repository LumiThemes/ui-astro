# @arraypress/ui-astro

Small UI pieces for Astro sites, as components: a countdown to a drop, loading skeletons, a range slider that writes its value the reader's way, a file dropzone, a timeline that fills as you scroll, tooltips from an attribute, page chrome, and the record sleeve and level meter a music shop wants. Plain CSS and a few lines of script, with no dependencies.

```astro
---
import Countdown from '@arraypress/ui-astro/Countdown.astro';
---
<Countdown target="2026-12-07T18:00:00Z" label="Drop 07 goes live in" ended="Live now" />
```

Every prop of every component is in **[COMPONENTS.md](COMPONENTS.md)**, generated from the components' own types.

## Install

```bash
npm install @arraypress/ui-astro
```

Astro 6 or 7. The runtime underneath (`@arraypress/ui-astro`) works without Astro.

## What every piece does for you

- **Respects reduced motion.** Each has a still state: an end date in place of ticking seconds, a timeline drawn in full, a shimmer that holds still.
- **Stays accessible.** Real form controls (`<input type="range">`, `<input type="file">`), labels, a hidden back-to-top button that cannot be tabbed to, decoration marked `aria-hidden`.
- **Survives view transitions.** Scripts start on `astro:page-load` and stop when their element leaves the page.
- **Follows the text colour** unless given one, so it suits light and dark grounds.
- **Sends nothing anywhere.** No telemetry, no network.

## The pieces

**Forms and data**

| Component | | Drawn with |
|---|---|---|
| `<Range>` | A slider with its label and value, filled to the thumb, the value written as a number, money or compact | CSS + JS |
| `<Dropzone>` | A file drop target with a light round its edge, and a scanning line while busy | CSS + JS |
| `<Countdown>` | Days, hours, minutes and seconds to a drop, swapping to a message when it passes | JS |
| `<Skeleton>` | A shimmering loading placeholder: a card, a row or lines of text | CSS |
| `<Timeline>` | Dated steps down a line that fills as the page scrolls | CSS + JS |

**Page chrome**

| Component | | Drawn with |
|---|---|---|
| `<ScrollProgress>` | A reading-progress bar along the top or bottom of the window | JS |
| `<BackToTop>` | A button that floats in once you have scrolled, and hides near the footer | JS |

**For music shops**

| Component | | Drawn with |
|---|---|---|
| `<VinylSleeve>` | A record that slides out of its sleeve and spins while playing | CSS |
| `<Equalizer>` | Level-meter bars that settle in and bounce while playing | CSS |

**Stylesheets**, for elements you render yourself:

| Import | Classes |
|---|---|
| `@arraypress/ui-astro/tooltip.css` | `data-tip="…"` on any element, `data-tip-side="bottom"` |

## Runtime

The package's main entry is the runtime the components are built on, for use without Astro or to build more: each component's script as a function (start it on an element, get back a function that stops it), and the parts they share. Each module can also be imported on its own: `import { numberFormat } from '@arraypress/ui-astro/runtime/number-format'`.

| Export | |
|---|---|
| `countdown(el)` | Keeps a countdown's tiles ticking to its `data-target` |
| `range(el, style)` | Keeps a range input's fill and its `<output>` in step |
| `numberFormat(style)` | Numbers the reader's way: language, currency, decimals, compact |
| `dropzone(el)`, `accepts(file, accept)` | A drop target for a file input, and whether a file matches an `accept` list |
| `timeline(el)` | Fills a timeline as the page scrolls |
| `scrollChrome()` | The one scroll listener behind `<ScrollProgress>` and `<BackToTop>` |
| `prefersReducedMotion()` | The reduced-motion check every piece makes |
| `mount(selector, setup)`, `readConfig` | Start a script on every matching element, now and after each view transition |

## Demo

`demo/` is an Astro site: one page with every piece in place, as a small record shop would use them.

```bash
cd demo && npm install && npm run dev   # http://127.0.0.1:4410
```

## Licence

MIT © ArrayPress Limited
