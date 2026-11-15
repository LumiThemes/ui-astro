# AGENTS.md

Notes for coding agents. People should start at the [README](README.md). Two parts: using the components in a site, and working on this package.

## Using the components in a site

Import each component from its own path (`import Countdown from '@arraypress/ui-astro/Countdown.astro'`). Every prop is in [COMPONENTS.md](COMPONENTS.md).

Pick by what is asked for:

| Asked for | Use |
|---|---|
| A countdown to a drop, a sale's end or a launch | `<Countdown>` (pass `units` and `locale` for other languages) |
| Placeholders while something loads | `<Skeleton variant="card" \| "row" \| "text">` |
| A slider for a calculator, a price or a filter | `<Range>` (`currency`, `decimals`, `compact`); listen for its `input` events |
| An upload | `<Dropzone>` (set `data-busy` while processing) |
| A story, roadmap or process | `<Timeline>` |
| Tooltips | `tooltip.css` and `data-tip` (repeat the words in `aria-label`) |
| A form: fields, choices, sliders, uploads, a styled select | `forms.css` and `forms()` from `runtime/forms` (the markup is in COMPONENTS.md) |
| Page chrome | `<ScrollProgress>`, `<BackToTop>`, once in the layout |
| An announcement across the top (a launch, a sale) | `<NoticeBar>` (change its `id` to show a new one to people who closed the last) |
| Questions and answers | `<Faq>` (FAQPage JSON-LD comes with it; `jsonLd={false}` if the page has its own) |
| An install or setup command to copy, with a choice of ways | `<InstallCommand>` |
| The header's menu on phones | `<MobileMenu>` (hide your wide-screen links below its `breakpoint`) |
| A main action with more behind an arrow (download formats, buy options) | `<SplitButton>`; listen for `ui-action` |
| Brand colours to copy (a press kit, a style guide) | `<CopySwatch>` |
| A music or digital-goods shop | `<VinylSleeve>`, `<Equalizer>` (set `.is-playing` from your player) |

Things that trip people up:

- **`<Range>` needs an `id`.** Its `<output>` names the input by it.
- **`<Dropzone>` is a `<label>` round a real file input.** Dropped files land in the input and fire its `change`, so read them from `input.files` as for a picked file; put any other attributes (an `id`, `data-*`) straight on the component.
- **`<VinylSleeve>` and `<Equalizer>` play while `.is-playing` is on them.** Toggle the class from your player; `playing` only sets it at first.
- **Tooltips are not read out.** A tooltip drawn by CSS is invisible to screen readers: put the same words in `aria-label` or the element's text.
- **Styling a component's element** from the page needs `:global(.its-class)`, since the element belongs to the component. Every root class starts `ui-` (`.ui-dropzone`, `.ui-vinyl`…).
- **`<MobileMenu>`'s panel is fixed to the window,** so `top` is the header's height (`calc(4rem + var(--ui-notice-h, 0px))` under a `<NoticeBar>`). A `backdrop-filter`, `filter` or `transform` on the header fixes the panel to the header instead: then pass `top="100%"`. The panel's foot is measured, so it always ends at the window's.
- **`<SplitButton>` buttons do nothing by themselves.** Give the main action and menu items an `action` and listen for `ui-action` on the component (`e.detail.action`); links (`href`) just go.
- **A site with its own buttons:** `<SplitButton bare mainClass="…" moreClass="…" menuClass="…">` draws none of its own look; the `icon` and `arrow` slots take the site's icons, and the default slot its own `role="menuitem"` items in place of `items`. Style the menu's `[hidden]` yourself if your class sets a `display`.
- **Icons are SVG strings** (`icon` on `<InstallCommand>` options and links, `<SplitButton>`, `<MobileMenu>`'s `cta`): trusted markup, set as HTML. So are `<InstallCommand>` notes.
- **Menus and the mobile panel use `Canvas` and `CanvasText`** unless `--ui-menu-bg` / `--ui-menu-fg` (or `--ui-mobile-menu-bg` / `-fg`) are set, so a dark site needs `color-scheme: dark` or those set. Buttons and the current link use `--ui-accent` (default `#2563eb`) and `--ui-accent-ink`.
- **`forms.css` styles plain markup, not components.** Its classes (`.form`, `.field`, `.dropzone`…) and hooks (`data-count-for`, `data-dropdown`…) carry no `ui-` prefix: they are the markup you write. Call `forms()` again after adding controls; it starts only the new ones. Previews of chosen images are `data:` URLs, so a Content Security Policy needs `img-src data:`.
- **Theme `forms.css` on `:root`.** Its `--ui-form-*` defaults that follow others (`--ui-form-ring` from `--ui-form-on`…) are worked out there, so a value set lower down changes only that property.
- **Do not reimplement** reduced motion or view-transition restarts around the components: they do both.

## Working on this package

Plain ES modules in `src/` with hand-written `.d.ts` files beside them: components in `src/components/`, the runtime in `src/runtime/` (one concern a file; the form kit's parts in `src/runtime/forms/`), stylesheets in `src/styles/`. No build step, and one dependency: `@arraypress/file-utils` (dependency-free itself), for the form kit's file sizes. `demo/` is an Astro site (not published): one page with every piece in place.

| | |
|---|---|
| `npm test` | Node's test runner over `tests/*.test.js`. Run before every commit. |
| `npm run docs` | Regenerates COMPONENTS.md from the components' `Props`, the runtime `.d.ts` files and the stylesheets' header comments. Run after changing any prop or a stylesheet's header. |
| `cd demo && npm run dev` | The demo on http://127.0.0.1:4410. |

After changing a component, check it in the demo: it renders, the console is clean, and reduced motion gets its still state.

### House rules

- **A new component** is a component (`src/components/<Name>.astro`), a runtime module if it needs script (`src/runtime/<name>.js` + `.d.ts`, exporting `name(el, config) => stop`, started with `mount('[data-ui-<name>]', fn)`), exported from `src/index.js` and `index.d.ts`, and a section on the demo page.
- **Names:** root classes start `ui-`, script hooks are `data-ui-<name>`, settings go in `data-ui-config` as JSON, keyframes start `ui-<name>-`.
- **Independent of `@arraypress/effects-astro`.** This package keeps its own `mount` and `prefersReducedMotion`; do not import from the effects package or depend on it.
- **No repetition.** Anything two components need goes in its own runtime module and is imported.
- **JSDoc on every function**, nested ones included: a short description, `@param` for each parameter, `@returns`, `@throws` where it applies. Every prop has a doc comment with its default (COMPONENTS.md is built from them). Keep the `.d.ts` files in step. Plain, concise voice: what a thing does and why.
- **Every moving part has a still state** under `prefers-reduced-motion: reduce`.
- **No telemetry, no network, no dependencies beyond `@arraypress/file-utils`.** Components ship inside sites for other people's visitors.
- **Every change goes in CHANGELOG.md** (Keep a Changelog, SemVer). Commit and push only with the owner's go-ahead; the owner publishes to npm.
