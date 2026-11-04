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

## `<CopySwatch>`

CopySwatch: a colour chip for a press kit or a style guide, filled with the colour and showing its name and value; a click copies the value, with a brief "Copied" on the chip (and said to screen readers). The value can be written as hex, `rgb()` or `hsl()` from a hex or `rgb()` colour, and the text on the chip picks near-black or white to read on it. Sits in any grid; it fills its cell. See src/runtime/copy-swatch.js.

```astro
<CopySwatch color="#D4FF3A" name="Yellow" />
```

| Prop | Type | |
|---|---|---|
| `color` (required) | `string` | The colour, as CSS (`#D4FF3A`, `rgb(…)`, anything CSS reads). Required. |
| `name` | `string` | Its name, shown large. Default none. |
| `value` | `string` | The value shown and copied. Default the colour, written in `format`. |
| `format` | `'hex' \| 'rgb' \| 'hsl'` | Write the colour as `hex`, `rgb` or `hsl` (works from a hex or `rgb()` colour). Default as given. |
| `ink` | `string` | The text colour on the chip. Default near-black or white, whichever reads better (near-black for a colour it cannot read). |
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

## `<Faq>`

Faq: questions that open to their answers — borderless rows with a drawn chevron that turns — and, by default, the same questions as FAQPage structured data for search engines. With `exclusive`, opening one closes the others (the native `<details name>`, no script). Answers are trusted HTML (links and emphasis); the structured data gets their plain text.

```astro
<Faq items={[{ q: 'Is it free?', a: 'Yes — see the <a href="/licence">licence</a>.' }]} />
```

| Prop | Type | |
|---|---|---|
| `items` (required) | `Item[]` | The questions and answers. Required. |
| `jsonLd` | `boolean` | Also publish them as FAQPage JSON-LD. Default true (turn it off if the page already has one). |
| `exclusive` | `boolean` | Only one open at a time. Default false. |
| `openFirst` | `boolean` | The first one starts open. Default false. |
| `class` | `string` | Classes for the element. |

## `<InstallCommand>`

InstallCommand: one copyable command bar whose button opens a menu of ways to get the thing — a package manager, a CLI, a prompt to hand an agent — grouped under titles. Choosing one swaps the bar's label and icon, the command shown, what the copy button copies and the note under the bar; plain links (downloads, a page with every way) can sit at the foot of the menu. Arrow keys, Home and End move through the menu, Escape and a click outside close it, and a copy shows a tick for a moment. See src/runtime/install-command.js.

```astro
<InstallCommand groups={[{ title: 'Install', options: [{ label: 'npm', prefix: '$ ', command: 'npm i my-lib' }, { label: 'pnpm', prefix: '$ ', command: 'pnpm add my-lib' }] }]} />
```

| Prop | Type | |
|---|---|---|
| `groups` (required) | `Group[]` | The options, in titled groups (`{ title, options: [{ id, label, icon, prefix, command, copy, note, tag }] }`). The first option shows at first. Required. |
| `links` | `Link[]` | Plain links at the foot of the menu (`{ label, href, icon, tag, download }`). Default none. |
| `linksTitle` | `string` | The heading over the links. Default `Download`; empty for none. |
| `selected` | `string` | The option to show at first, by id. Default the first. |
| `align` | `'start' \| 'center'` | Line the bar and its note up at the start or the centre. Default `start`. |
| `copyLabel` | `string` | The copy button's name for screen readers. Default `Copy the command`. |
| `class` | `string` | Classes for the element. |

## `<MobileMenu>`

MobileMenu: a 44px menu button for small screens that opens a panel over the whole screen under the header — the main links large, each with an arrow and the current page picked out, an optional call-to-action button, and smaller secondary links at the foot. The page does not scroll behind it. A `<details>`, so it opens without script; the script closes it when a link is followed, on Escape and when the screen grows past `breakpoint`, where the button hides (hide your wide-screen links below it yourself). Place it in the header. See src/runtime/mobile-menu.js.

```astro
<MobileMenu links={[{ label: 'Work', href: '/work' }, { label: 'About', href: '/about' }]} cta={{ label: 'Get in touch', href: '/contact' }} top="64px" />
```

| Prop | Type | |
|---|---|---|
| `links` (required) | `Link[]` | The main links, shown large (`{ label, href }`). Required. |
| `current` | `string` | The current page's path, to pick out its link (`/` matches the home page only; a section matches its pages). Default the page's own path. |
| `cta` | `Cta` | A call-to-action button under the links (`{ label, href, icon }`). Default none. |
| `more` | `Link[]` | Smaller links at the foot of the panel, in two columns (`{ label, href }`). Default none. |
| `breakpoint` | `number` | The widest screen it shows on, in px; wider screens hide the button and close the menu. 0 shows it at every width. Default 860. |
| `top` | `string` | Where the panel starts, from the top of the window: the header's height, as a CSS length or `var()`. In a header with `backdrop-filter`, `filter` or `transform`, the panel is placed from the header instead, so pass `100%`. Default `4rem`. |
| `label` | `string` | The button's and the panel's name for screen readers. Default `Menu`. |
| `class` | `string` | Classes for the element. |

## `<NoticeBar>`

NoticeBar: a slim announcement bar across the top of the page — a launch, a sale, a new release — with an optional pill, a line, a longer line for wide screens, a call to action and a close button. A close is remembered per `id` (change the id to show a new notice to people who closed the last); `until` hides it after a day. While it shows, `--ui-notice-h` on the page's root holds its height, for sticky headers to sit under. A closed bar is hidden before the page paints, so it never flashes. See src/runtime/notice-bar.js.

```astro
<NoticeBar id="launch-2026" label="Live" text="We just launched on Product Hunt" cta="Upvote" href="https://www.producthunt.com/…" />
```

| Prop | Type | |
|---|---|---|
| `id` (required) | `string` | Names this notice; a close is remembered per id. Required. |
| `text` (required) | `string` | The main line. Required. |
| `href` | `string` | Where it links; without one the bar is plain text. |
| `label` | `string` | A small pill at the start (`Live`, `New`…). Default none. |
| `more` | `string` | A second line, shown on wide screens only. Default none. |
| `cta` | `string` | The call to action, as a button-like pill at the end. Default none. |
| `newTab` | `boolean` | Open the link in a new tab. Default false. |
| `until` | `string` | The last day it shows (`YYYY-MM-DD`, inclusive). Default no end. |
| `dismissible` | `boolean` | Show a close button. Default true. |
| `tone` | `'accent' \| 'dark'` | The colours: `accent` (a bright fill, set `--ui-notice-bg` and `--ui-notice-fg`) or `dark`. Default `accent`. |
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

## `<SplitButton>`

SplitButton: a main action with an arrow attached that opens a menu of further ones — Download SVG, and PNG sizes and a kit behind the arrow. The main action and each menu item are a link (`href`) or a button; a button sends a `ui-action` event from the root with its `action` in `detail.action`. Items can carry a small note at the end and be split by dividers. The arrow turns while the menu is open; arrow keys, Home and End move through it, Escape and a click outside close it. See src/runtime/split-button.js.

```astro
<SplitButton label="Download SVG" href="/logo.svg" download items={[{ label: 'PNG', note: '512 px', action: 'png-512' }, { divider: true }, { label: 'Favicon kit', note: '.zip', href: '/favicon.zip', download: true }]} />
```

| Prop | Type | |
|---|---|---|
| `label` (required) | `string` | The main action's text. Required. |
| `href` | `string` | Makes the main action a link to here; without one it is a button. Default none. |
| `download` | `boolean \| string` | For a linked main action: download it (`true`, or the file name). Default false. |
| `newTab` | `boolean` | For a linked main action: open in a new tab. Default false. |
| `action` | `string` | For a main action that is a button: what its `ui-action` event carries. Default `main`. |
| `icon` | `string` | An icon before the main action's text: trusted SVG markup, about 16px. Default none. |
| `items` (required) | `Item[]` | The menu (`{ label, note, href, download, newTab, action, disabled }`, or `{ divider: true }`). Required. |
| `menuLabel` | `string` | The arrow's and the menu's name for screen readers. Default `More options`. |
| `align` | `'start' \| 'end'` | Which edge the menu lines up with. Default `start`. |
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
