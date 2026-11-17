# RHAD web design system

Tokens and base components: `assets/tokens/rhad-web.css` (RHAD family), `assets/tokens/rhad45-design-system.css` and `rhad45-design-tokens.json` (RHAD45 direction A). Brand specifics are in `brand-rhad-web.md` and `rhad45-web.md`. This file is how to compose them into a page.

## Breakpoints and validation

Design and test at **360, 390, 768, 1024 and 1440 px**, and at 200 percent zoom and 320 px reflow. Mobile first: write the phone composition first, then add columns. Container maximum 1680 px (RHAD family) or 1200 px (RHAD45 direction A). No fixed section heights; content decides height.

## Grid and rhythm

| Property | Rule |
|---|---|
| Margins | One pair (`--margin`), identical in every section |
| Columns | 12 on desktop, 24 px gutter. Phone is one column with its own composition |
| Section spacing | `--section-gap`: 120 to 200 px (RHAD family), 56 px mobile to 112 px desktop (RHAD45 A) |
| Space scale | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px |
| Neighbouring sections | Never the same composition. If two sections could swap places with nothing lost, one is redundant |
| Surfaces | Separate by tone (`canvas`, `canvas-step`, `field-dark`), not lines or shadows |

## Type usage

Five sizes per page. Display (Unbounded) for headlines, numbers and short titles only. Plus Jakarta Sans for everything read and every button. Tracking is tightened on display and 0 on text. Sentence case except where the brand file says otherwise (the live agency hero uses capitals in the monument style). No italics. Headlines two lines or fewer.

## Section composition vocabulary

Pick a different one for each section. Name the composition in the plan.

| Composition | Use for | Notes |
|---|---|---|
| **Monument** | The single hero moment | One enormous word or short phrase, an object (cube, image), nothing else competing |
| **Split statement** | A claim plus the reason to believe it | Large headline left, plain paragraph right, offset on the grid |
| **Slip (receipt)** | Process, price, inclusions | White paper block, 2 px ink rules top and bottom, dashed rules between rows, owner on the right |
| **Route finder** | "If you need X" decisions | Rows that reveal a result and pre-fill the form |
| **Studio** | Showing a mechanism working | One depicted device, labelled example, tabs, honest note |
| **Editorial image band** | The one image of the page | Full-width monochrome collage, square corners, a clip reveal from a visible state |
| **Definition list** | Services, what is and is not included | Term in display-md, description in body, rules between |
| **Quote line** | Real, permitted testimonials | Verbatim, named, labelled agency credential when it is not product proof |
| **Coupon form** | The conversion | The form as a red cut-out card or a white panel on dark |
| **Cropped wordmark footer** | Sign-off | `RHAD` at 28 vw cut by the bottom edge |

## Component catalogue and states

Every component below has default, hover, focus-visible, active and disabled where it can be interacted with. Build the states, do not leave them to browser defaults.

| Component | Contract |
|---|---|
| Header | Logo links home or to the top. Three in-page links at most. One CTA. Compact on phones. Disclosure menu under 960 px with `aria-expanded`, `aria-controls`, Escape to close, focus returned |
| Hero | One H1, one primary CTA, optional secondary text link, the signature visual. First viewport explains the offer without scrolling |
| Primary action | Red fill, white text, 52 px, square. On red fields: white fill, red text |
| Secondary action | Text link, 2 px underline at 4 px offset, or ink outline on dark |
| Product or service block | Name, one-line benefit, plain description, the boundary line (what it does not promise), a CTA that pre-fills the form |
| Price panel | One price, what it includes, what is separate, a CTA. Exclusions beside the price, never in a tooltip |
| Process | A real `<ol>` with an owner per step |
| FAQ | Native `details`/`summary`, no conflicting roles, more than one may be open. Answers readable without scripts |
| Form | Persistent labels, 52 px controls, errors linked by `aria-describedby`, `aria-invalid`, live region for status, pending state, preserved values |
| Proof | Real quote or logo with permission, labelled. Never a counter or rating that is not sourced |
| Footer | Logo (reverse on dark), parent link, privacy link that exists, licence credits for photographs |
| Floating contact button | Optional (WhatsApp). Never covers content or the form. Hides over the form and footer |

## Elevation, borders, radius

Flat by default. No shadows at rest. A press or lifted state may use `translateY(1px)` and a darker fill. Borders only where they carry information (the slip rules, input hover). Radius 0, except the depicted device exception.

## Iconography and glyphs

One authored SVG sprite, 2 px stroke, square caps, one set. No icon library mixed with it, no tinted circles. Icons never head identical cards in a row. Logos are separate from the icon set.

## Imagery on the page

Monochrome editorial images and the red thread and cube objects. Optimised WebP or AVIF, sized and dimensioned. One editorial image band per page is plenty. Never a stock photo of "a team". See `imagery-web.md`.

## Accessibility in the system

Contrast: 4.5:1 normal text, 3:1 large text and UI. `red` on white is about 4.9:1: 17 px and up. Use `red-press` for small red text. Colour never carries meaning alone. Focus ring 3 px, offset 3 px, `#fff` on dark and red. Target size 44 px preferred. Semantic landmarks, one H1, a skip link.

## Motion tokens

UI state changes 120 to 200 ms. Section entrances 240 to 320 ms, at most 24 px of travel, from a visible resting state, once. See `motion-and-3d.md`.

## Page file structure (static default)

```
index.html
css/site.css          imports ../assets/tokens/rhad-web.css, then page rules only
js/site.js            menu, form adapter, enhancements. No framework needed
assets/fonts/         packaged fonts (keep OFL files)
assets/img/           optimised images with width and height
assets/tokens/        rhad-web.css
PRODUCT.md DESIGN.md  project truth
```
