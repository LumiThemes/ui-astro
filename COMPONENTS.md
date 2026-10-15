# Components

Every component in `@arraypress/ui-astro`, with every prop. Generated from the components' own types by `node scripts/components-doc.mjs`; do not edit by hand.

Import each from its own path: `import Name from '@arraypress/ui-astro/Name.astro'`.

## `<BackToTop>`

BackToTop: a round button that floats in once the page has been scrolled a little way and takes you back to the top; it hides near the bottom so it never covers the footer, and while hidden it cannot be tabbed to. Smooth scrolling unless reduced motion is asked for. See src/runtime/scroll-chrome.js.

```astro
<BackToTop label="Back to top" />
```

| Prop | Type | |
|---|---|---|
| `label` | `string` | Its label, for screen readers and the tooltip. Default `Back to top`. |
| `after` | `number` | Scroll depth before it appears, in screen heights. Default 0.4. |
| `side` | `'left' \| 'right'` | Which corner. Default `right`. |
| `class` | `string` | Classes for the element. |

## `<Countdown>`

Countdown: days, hours, minutes and seconds to a date, as tiles, that swap to a message when the date passes. A drop, a sale's end, a launch. Rendered with the right numbers at build time and kept ticking in the browser (src/runtime/countdown.js). With reduced motion, the end date instead of a number that changes every second.

```astro
<Countdown target="2026-12-07T18:00:00Z" label="Drop 07 goes live in" ended="Live now" />
```

| Prop | Type | |
|---|---|---|
| `target` (required) | `string \| Date` | When it ends: an ISO date, or a Date. |
| `label` | `string` | A line above the tiles. |
| `hideSeconds` | `boolean` | Leave the seconds out. Default false. |
| `ended` | `string` | Shown once it has passed. Default `Ended`. |
| `units` | `{ days: string; hours: string; minutes: string; seconds: string }` | The units' labels, for other languages. Default English. |
| `locale` | `string` | The locale the still end date is written in. Default `en-GB`. |
| `class` | `string` | Classes for the element. |

## `<Dropzone>`

Dropzone: a file drop target that looks alive. A light circles its edge, another runs along its top and a glow breathes inside; dragging files over lifts it, and a drop that nothing is accepted from shakes it. Set `data-busy` on it while the files are processed and a scanning line sweeps down over the `busy` slot. Clicking or pressing Enter opens the file picker; dropped files land in the same input and fire its `change`, so it works inside a form. See src/runtime/dropzone.js.

```astro
<Dropzone name="statement" accept=".csv,.pdf" color="#f43f5e">
  <strong>Drop your statement</strong> or click to choose
  <span slot="busy">Scanning…</span>
</Dropzone>
```

| Prop | Type | |
|---|---|---|
| `name` | `string` | The input's name, for forms. |
| `accept` | `string` | File types taken, as for an input's `accept` (`.csv,.pdf`, `image/*`). Default anything. |
| `multiple` | `boolean` | Take several files. Default false. |
| `color` | `string` | The lights' colour. Default the text colour. |
| `busy` | `boolean` | Start busy (scanning). Default false. |
| `disabled` | `boolean` | Disable it. Default false. |
| `label` | `string` | The input's accessible label, when the visible text is not enough. |
| `class` | `string` | Classes for the element. |

## `<Equalizer>`

Equalizer: a few bars that rise into place with an overshoot, one after another, and, while `playing` (or `.is-playing` set from your player), bounce like a level meter. A logo mark for a music store, a "now playing" sign on a track. Pure CSS; still with reduced motion.

```astro
<Equalizer bars={5} playing color="#a3e635" />
```

| Prop | Type | |
|---|---|---|
| `bars` | `number` | How many bars. Default 5. |
| `playing` | `boolean` | Bounce like a meter. Default false. |
| `color` | `string` | The bars' colour. Default the text colour. |
| `heights` | `number[]` | The bars' resting heights, 0–1, one a bar (repeated if fewer). |
| `width` | `string` | Width, a CSS length. Default `1.25em`. |
| `height` | `string` | Height, a CSS length. Default `1em`. |
| `label` | `string` | A label for screen readers; without one it is decoration. |
| `class` | `string` | Classes for the element. |

## `<Range>`

Range: a slider with its label and its value, the track filled up to the thumb and the thumb swelling as it is held. For calculators and filters: pair it with `<CountUp>` (from `@arraypress/effects-astro`) to show a result that glides as it moves. It is a real `<input type="range">` (keyboard, forms, `input` events); the value is written the reader's way. See src/runtime/range.js.

```astro
<Range id="sales" label="Monthly sales" min={0} max={50000} step={500} value={5000} currency="GBP" color="#ff6b6b" />
```

| Prop | Type | |
|---|---|---|
| `locale` | `string` | A BCP 47 language tag. Default the page's `lang`, else the browser's. |
| `currency` | `string` | An ISO 4217 code (`GBP`, `USD`) to write it as money. |
| `decimals` | `number` | Decimal places. Default as many as the number has, or a currency's own. |
| `compact` | `boolean` | Short form: 1.2K, 3.4M. Default false. |
| `id` (required) | `string` | The input's id, which the value's `<output>` refers to. |
| `label` (required) | `string` | The label. |
| `name` | `string` | The input's name, for forms. |
| `min` | `number` | Lowest value. Default 0. |
| `max` | `number` | Highest value. Default 100. |
| `step` | `number` | Step between values. Default 1. |
| `value` | `number` | Starting value. Default the middle. |
| `color` | `string` | The fill and thumb colour. Default the text colour. |
| `class` | `string` | Classes for the element. |

## `<ScrollProgress>`

ScrollProgress: a thin bar along the top of the window that fills as the page is read. Decoration (`aria-hidden`); the scroll position is not news. See src/runtime/scroll-chrome.js.

```astro
<ScrollProgress color="#a78bfa" />
```

| Prop | Type | |
|---|---|---|
| `color` | `string` | The bar's colour. Default the text colour. |
| `height` | `string` | Its thickness, CSS length. Default `3px`. |
| `position` | `'top' \| 'bottom'` | Where it sits. Default `top`. |
| `class` | `string` | Classes for the element. |

## `<Skeleton>`

Skeleton: a loading placeholder with a shimmer passing over it, the shape of what is coming (a card, a row, lines of text), so a page that fills in late does not jump. Still with reduced motion. Colours follow the text colour, so it suits light and dark grounds.

```astro
<Skeleton variant="card" />
<Skeleton variant="text" lines={4} />
```

| Prop | Type | |
|---|---|---|
| `variant` | `'card' \| 'row' \| 'text'` | The shape. Default `text`. |
| `lines` | `number` | Lines, for `text`. Default 3. |
| `label` | `string` | A label for screen readers. Default `Loading`. |
| `class` | `string` | Classes for the element. |

## `<Timeline>`

Timeline: dated steps down a line that fills with colour as the page scrolls, each dot lighting as the fill reaches it, and the `current` step's dot breathing. For a company's story, a roadmap, how an order is made. See src/runtime/timeline.js.

```astro
<Timeline color="#d334cc" current={3} items={[
  { date: '2016', title: 'First pack', text: 'Recorded in a spare room.' },
  { date: '2020+', title: 'The foundry', text: 'Now a team of six.' },
]} />
```

| Prop | Type | |
|---|---|---|
| `items` (required) | `{ date: string; title: string; text?: string }[]` | The steps, in order. `text` is optional. |
| `current` | `number` | The index of the step that is happening now, which breathes. Default none. |
| `color` | `string` | The fill and dot colour. Default the text colour. |
| `class` | `string` | Classes for the element. |

## `<VinylSleeve>`

VinylSleeve: a record in its sleeve. The cover is the sleeve; on hover or focus the disc slides out from behind it, its grooves catching a sheen and the cover as its centre label, and while `.is-playing` is on the element (set it from your player) the disc spins. For labels, beat stores and anything sold as a release. Pure CSS; the disc stops for reduced motion.

```astro
<VinylSleeve cover="/covers/drop-07.jpg" alt="Drop 07" />
```

| Prop | Type | |
|---|---|---|
| `cover` (required) | `string` | The cover image. |
| `alt` | `string` | Its alt text ('' when the title is next to it). |
| `playing` | `boolean` | Start spinning, as if playing. Default false. |
| `speed` | `number` | Seconds a turn takes. Default 1.8. |
| `class` | `string` | Classes for the element. |
