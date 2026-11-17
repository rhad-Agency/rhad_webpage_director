# RHAD for the web: brand and design language

Use this for RHAD (agency) pages and for campaign pages built in the RHAD family, such as the EDGE grant page. RHAD45 has its own file: `rhad45-web.md`.

Sources, verbatim in `sources/`: `edge-DESIGN.md` (the RHAD EDGE landing page design language, 1.0) and `edge-PRODUCT.md`. Observed live: rhad.agency (captured in `assets/references/`). RHAD has no signed-off brand manual. Where this file says "observed", it comes from the live site or shipped pages.

**The idea of the language: the name as a monument.** One enormous word set at architectural scale on a flat field, the RHAD open cube as the single object, then a deliberately calm editorial page in charcoal on white. One red, used as a field and on the action, never as decoration.

## Colour

| Token | Hex | Use |
|---|---|---|
| `red` | `#D90A2C` | Hero field, primary action, the cube, the coupon form. A field and an action, not a tint |
| `red-press` | `#B00822` | Pressed and hover red, small red text on white |
| `on-red` | `#FFFFFF` | Text on red. White on red is 4.9:1: fine for 17 px and up |
| `ink` | `#1F2124` | All running text, dark ink on red (charcoal on red is 3.4:1: monument size only) |
| `ink-soft` | `#5B6169` | Notes and captions only (7.0:1 on white) |
| `canvas` | `#FFFFFF` | Page ground |
| `canvas-step` | `#F3F2EF` | One tone step: bars, inputs on light ground, alternate sections |
| `paper` | `#F5F5F3` | Slips and receipts |
| `field-dark` | `#1F2124` | Process and footer fields |
| `field-dark-step` | `#2C2F33` | One step on a dark field |
| `on-dark-soft` | `#D6D7D9` | Legal and credits on dark (12:1) |
| `focus` | `#1F2124` | 3 px focus ring on light. `#FFFFFF` on red and dark |

Rules: surfaces separate by tone (`canvas`, `canvas-step`, `field-dark`), never by lines or shadows. Red is a field in at most two places per page (the hero and the form) plus the primary button and the cube. Running text is always full ink.

## Typography

Two families, self-hosted from `assets/fonts/`: **Unbounded** (display) and **Plus Jakarta Sans** (everything read).

| Role | Family and weight | Size | Line | Tracking |
|---|---|---|---|---|
| `monument` | Unbounded 800 | `clamp(110px, 21vw, 340px)` (21vw phone, about 18vw desktop) | 0.82 | -0.05em |
| `display-xl` (section openers) | Unbounded 700 | `clamp(40px, 4.4vw, 68px)` | 0.98 | -0.035em |
| `display-md` (H1 in hero, H2, FAQ questions) | Unbounded 600 | `clamp(24px, 2.6vw, 40px)` | 1.1 | -0.02em |
| `body-lg` | Plus Jakarta Sans 400 | 19 px | 1.55 | 0 |
| `body` | Plus Jakarta Sans 400 | 17 px | 1.55 | 0 |
| `small` | Plus Jakarta Sans 500 | 14 px | 1.45 | 0 |

- Five sizes on a page, no more.
- Every headline is two lines or fewer at every width. Monument line breaks are authored.
- **No eyebrows, no tracked micro-caps, no monospace, no index numbers.** A process order is a real `<ol>`.
- Unbounded never sets paragraphs. Body text never goes below 16 px on phones.
- Observed on rhad.agency: Unbounded 800 in capitals for the hero headline with a red accent word, uppercase small CTA. The accent word on the live site has a subtle red gradient. Do not copy that gradient: this language forbids gradients. Use flat `red`.

## Layout

- One pair of outer margins (`--margin: clamp(16px, 2.2vw, 32px)`) used by every section. 12-column grid, 24 px gutter.
- Sections 120 to 200 px apart (`clamp(120px, 14vw, 200px)`). Neighbouring sections never share a composition.
- **Phone layouts are their own compositions**, not stacked desktops.
- Radius **0** everywhere: buttons, inputs, images, cards. The only allowed rounding is on a depicted physical device (a phone mock) and it must be the only rounded object on the page.

## Components

- **Buttons**: square, 52 px tall, Plus Jakarta Sans 600 16 px. Primary is red fill with white text (white fill and red text on a red field). Secondary is a text link with a 2 px underline at 4 px offset. Press: `translateY(1px)` and the darker fill.
- **Inputs and forms**: visible labels above every field (never placeholder-as-label). Fields are 52 px filled blocks in `canvas-step` (white on red). Errors under the field, linked with `aria-describedby`, announced in a polite live region.
- **Signature components** (from the EDGE page, reusable as patterns):
  - *Monument hero*: a single enormous word (PSG over EDGE) with the 3D cube as the full stop
  - *Route finder*: "If your business needs to..." rows; choosing one reveals what RHAD does and pre-fills the form
  - *Process slip*: the steps printed as a receipt with who owns each step on the right
  - *Coupon form*: the enquiry form as a red cut-out card
  - *Cropped wordmark footer*: `RHAD` at 28 vw cut by the bottom edge

## Imagery

White ground, monochrome photographic people with horizontal scanline displacement, the red thread, the red cube, fragmented image tiles. See `imagery-web.md` and `assets/imagery/site/`.

## Voice for the web

Confident, commercially focused, plain. Short sentences, concrete nouns, a named situation. First person plural ("we") on the site. No hype words. Present grant or price support conditionally every time ("where eligible", "activity-specific"). See `copy-web.md`.

## Do and do not

Do:
- Keep the applicant-submits and "your team stays in charge" boundaries visible where they apply
- Credit every open-licence photograph in the footer
- Let one monument moment be the only loud thing on the page

Do not:
- Gradients, glows, glass, drop shadows at rest, icon cards, pill badges
- A second big headline under the monument
- "guaranteed", "approved vendor", "apply now", "secure funding", "claim grant" language on grant pages
- Scroll-triggered reveals that hide content until the visitor scrolls (observed on the live agency home page: a headless capture shows an empty page above the hero)

## Logo

`assets/rhad/logos/`: `rhad-logo-red-tight.png` on white, `rhad-logo-white-tight.png` on red or ink, `rhad-logo-thick.svg` for small sizes. Never stretch, recolour, outline, shadow or place on a busy photo. Clear space is the height of the "R".

## Campaign pages in the family

EDGE and similar pages (grant, product, event) keep the tokens, faces and square geometry, and add exactly one signature idea each. Grant pages carry the conditional-language rule on every claim and a visible applicant-submits rule. Always ask which family member the page belongs to.
