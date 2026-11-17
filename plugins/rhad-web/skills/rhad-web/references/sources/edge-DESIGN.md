---
version: 1.0
name: RHAD-EDGE-landing
description: The RHAD design language applied to the /edge-grant/ campaign page. "The name as a monument" — the word EDGE set at architectural scale on a flat RHAD-red field, the RHAD open cube as the page's single object, then a deliberately calm editorial page in charcoal on white. Unbounded carries display, Plus Jakarta Sans carries everything read. One red, used as a field and on the action; never as decoration.

colors:
  red: "#D90A2C"          # RHAD red — hero field, primary action, the cube, coupon form
  red-press: "#B00822"    # pressed / hover state of red
  on-red: "#FFFFFF"
  ink: "#1F2124"          # charcoal — all running text, dark ink on red
  ink-soft: "#5B6169"     # secondary notes only (7.0:1 on white)
  canvas: "#FFFFFF"
  canvas-step: "#F3F2EF"  # one tone step for bars, inputs on light ground
  field-dark: "#1F2124"   # process + footer fields
  paper: "#F5F5F3"        # the process slip
  field-dark-step: "#2C2F33"  # one tone step on the dark field (the promise box)
  on-dark-soft: "#D6D7D9"     # legal + credits text on the dark footer (12:1)
  focus: "#1F2124"        # 3px focus ring on light; #FFFFFF on red/dark

typography:
  monument:
    fontFamily: Unbounded, "Arial Black", sans-serif
    fontSize: clamp(110px, 21vw, 340px)   # 21vw phone, ~18vw desktop
    fontWeight: 800
    lineHeight: 0.82
    letterSpacing: -0.05em
  display-xl:            # section openers (intro, process)
    fontFamily: Unbounded
    fontSize: clamp(40px, 4.4vw, 68px)
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: -0.035em
  display-md:            # h1 in hero, section h2s, FAQ questions
    fontFamily: Unbounded
    fontSize: clamp(24px, 2.6vw, 40px)
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Plus Jakarta Sans, system-ui, sans-serif
    fontSize: 19px
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.55
  small:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.45

spacing:
  margin: clamp(16px, 2.2vw, 32px)
  section-gap: clamp(120px, 14vw, 200px)
  stack: 24px

radius: 0px              # square everywhere: buttons, inputs, images, cards
---

## Overview

RHAD's main site already speaks in heavy Unbounded capitals and a single red. This page keeps both and
gives them one idea: **the RHAD cube has three faces meeting at one edge; EDGE folds PSG, EDG and MRA into
one framework.** The hero says it with the monument (`PSG` → `EDGE`) and the live 3D cube; every section
after it is quiet, square and readable, so the monument stays the only loud moment.

## Colors

- **Red is a field, not a tint.** The hero is a full red field; the contact coupon is the second (and last)
  red field. Inside white sections red appears only on the primary button and the cube.
- **Running text is always full ink** (`#1F2124`). `ink-soft` is for notes and captions only.
- **Surfaces separate by tone**, never by lines or shadows: `canvas` → `canvas-step` → `field-dark`.
- **Contrast:** white on red is 4.9:1 — fine for 17px+ text. Charcoal on red is 3.4:1 — used only for the
  monument (display-size).

## Typography

- Two families. Unbounded for anything at display size; Plus Jakarta Sans for anything read.
- Five sizes on the page: monument, display-xl, display-md, body (17–19), small (14).
- Every headline ≤ 2 lines at every width. Line breaks in the monument are authored.
- No eyebrows, no tracked micro-caps, no monospace, no index numbers (process order is a real `<ol>`).

## Layout

- One pair of outer margins (`--margin`) used by every section. 12-column grid, 24px gutter.
- Sections are 120–200px apart. Neighbouring sections never share a composition.
- Phone layouts are their own compositions (see each section in `css/edge.css`).

## Components

### Buttons
Square, 52px tall, Plus Jakarta Sans 600 16px. Primary: red fill, white text (on red fields: white fill,
red text). Secondary: text link with a 2px underline offset 4px. Press: `translateY(1px)` + darker fill.

### Inputs & Forms
Visible labels above every field (never placeholder-as-label). Fields are 52px filled blocks in
`canvas-step` (on red: white). Errors are written under the field, linked with `aria-describedby`,
announced via a polite live region.

### Signature components
- **Monument hero:** `PSG` (white) over `EDGE` (charcoal) at 18–21vw; the 3D cube sits as EDGE's full stop.
- **Route finder:** "If your business needs to…" rows; choosing one reveals what RHAD defines and the
  possible EDGE route, and pre-fills the form.
- **Process slip:** the six steps printed as a receipt, with who owns each step on the right — makes
  "your company applies, RHAD does not" impossible to miss.
- **Coupon form:** the enquiry form as a red cut-out card.
- **Cropped wordmark footer:** `RHAD` at 28vw cut by the bottom edge.

## Do's and Don'ts

### Do
- Present grant support conditionally, every time ("where eligible", "activity-specific").
- Keep the applicant-submits rule visible in the process and FAQ.
- Credit every open-licence photograph in the footer.

### Don't
- No "guaranteed", "approved vendor", "apply now", "secure funding" or "claim grant" language.
- No gradients, glows, glass, drop shadows at rest, icon cards, pill badges.
- Don't add a second big headline under the monument.

---

## RHAD45 page (`rhad45/`): light-theme extension

Same tokens, faces and square geometry as above, set on a light ground. CSS lives in `rhad45/css/rhad45.css`.

- **Hero (ink stage, per the RHAD45 motion brief):** `#12161C` ground with a broad red radial glow and a masked halftone
  on the right; Sora for the hero only (eyebrow, 64–76px headline, copy). A 640x560 system diagram: the RHAD45 hub
  (official icon from `assets/rhad45/`) joined by angular paths to four equal off-white module cards (2px ink outline,
  10px radius, 5px red offset shadow). Motion is a pure function of one Web Animation clock (`window.RHAD45_CLOCK`):
  1.4s entrance, then an 8s cycle where each module, a quarter-cycle apart, gets one white marker in, one red marker out
  and one card highlight. Under 700px the paths drop and the cards stack 2x2, then 1 column.
- **Logo:** RHAD45 primary/reverse SVGs and the red icon, used unchanged. Logo red is the asset's own `#F03131`,
  also used as `red-hot` for red text and marks on ink. Page red is `#D21131`.
- **Phone mocks:** chat scenes use WhatsApp's own conventions (teal header, `#EFEAE2` wallpaper, `#D9FDD3` outgoing
  bubbles, blue ticks, "typing…" in the header); the review scene ends in a Google-style review sheet (Roboto, `#FBBC04`
  stars, blue Post button). RHAD45's own capture cards stay in RHAD styling on top.
- **Testimonials:** one slow marquee, pauses on hover and keyboard focus (no Pause button); static scroll under reduced motion.
- **Ground:** `step` (#F3F2EF) for the module studio, the price section and the review section; `canvas` between them;
  `field-dark` only for Our Work and the footer. Red is never a section field here: it marks the hero glow, the 45-minute arc,
  the price figure and the primary action.
- **Added tones:** `step-2` #E8E6E1 (inactive tracks, chart bars, hover on step); dashed slip rules #C9C6BF;
  `red-wash` #FBE7EA (form prefill note only); the phone screen ground #EFEDE8.
- **Paper slips:** the hero to-do slip and the price slip are white sheets on `step`, 2px ink rules top and bottom,
  1px dashed rules between rows. The hero slip ticks itself off, one module per line, then loops.
- **The studio:** one CSS-built phone (the only rounded object on the page, because it depicts a device) between four
  equal tabs and a detail panel. Each module plays a scripted, labelled example; a 3-step journey lights in sync and a 4px
  red bar on the active tab shows progress. Auto-advances until the visitor picks a tab; a picked module plays once (tap its tab to replay). No Pause/Play control.
  Reduced motion shows each scene's end state with no autoplay.
- **The 45 dial:** three red arcs filling three quarters of a ring, one per part of the review.
- **Glyphs:** one authored SVG set (2px stroke, square caps) in the page sprite: lead, loop, review, dash, check, cart, idea.
- **Type additions:** phone-mock text runs 11–13.5px to read as a real screen; tab names switch to Plus Jakarta Sans 700
  under 1180px so the longest module name never clips.
- **Honesty:** every example carries a note under the phone; agency testimonials carry "not RHAD45 product results".
- **RHAD brand layer (from rhad.agency):** the parent site's imagery is carried in without touching the hero diagram
  or the phone studio.
  - **The cube:** the isometric red cube (`#g-cube`, three reds) is an accent in two places only: one large blurred
    cube drifting at the hero's top right, and the 3D cubes at the hero hub and on the form corner (see below). Motion is off under
    reduced motion.
  - **Kinetic type:** "Answer. Follow up. Ask. Know." in Unbounded 800 capitals, solid and outlined in turn, sits
    between the hero and How it works and slides sideways with scroll.
  - **Outlined giant type:** the outlined footer `RHAD45` mark and the outlined kinetic words use `paint-order: stroke fill`
    with a ground-coloured fill, which hides the font's inner overlaps.
  - **Editorial portraits:** RHAD's monochrome collages with the red thread: `rhad-story-banner` (two people at work beside a Singapore skyline collage, joined by the red thread; 2000x760) as a wide banner in Our Work under a heading row, the page's one editorial image. Square corners, a vertical rail label
    ("RHAD × 2026"), and a gentle clip reveal from a visible resting state.
  - **Labels:** no section kickers. The only label on the page is the hero eyebrow from the motion brief, marked
    with the RHAD cube instead of a red rule. Section headings carry themselves.
  - **Cubes:** the hero (one blurred, top right), the form corner (3D) and the kinetic band's separators only.
  - **Tabs:** each studio tab's line starts with the kinetic band's verb in bold ("**Answer** enquiries",
    "**Follow up** with customers", "**Ask** for genuine feedback", "**Know** your numbers"), so the band reads as
    the four modules.
- **Say it once (Oct 2026 critique):** the four modules are shown in the hero and the studio only. The Four Products
  section is one price (SGD 100, any one module), one `details` disclosure for setup/software/messaging charges, and
  one CTA. Under the CTA sit the approved two lines: "RHAD45 takes care of the follow-through. RHAD helps create more
  demand." plus a line naming SEO, Social Media and Marketing Strategy (scoped and quoted separately) with a link to
  rhad.agency. It is not a separate section. The FAQ answer repeats it for visitors who open it.
- **CTAs:** one primary label everywhere (header, menu, phone sticky bar, hero, pricing): "Arrange My 45-Minute
  Review". The form submit reads "Request My 45-Minute Review". Panel buttons read "Ask About This Product" and pre-fill
  the form; the hero secondary reads "See How It Works"; the FAQ button reads "Chat on WhatsApp".
- **Reassurance:** under the submit button, "We reply within 1 working day to arrange a time. No obligation, and sending
  this form doesn't book a slot yet." The success message repeats the 1-working-day window.
- **Phones:** under 520px the hero cards show icon, name and price only. Tapping a studio tab scrolls the phone into
  view if it is off screen. The sticky CTA hides over the form and the footer. Controls are
  at least 44px tall.
- **Hero tokens:** text on the ink uses `--on-ink-1…4` (#E4E6E9, #D9DCE0, #C9CDD3, #9EA4AC); card body text `--card-soft`.
- **Second critique (Oct 2026):**
  - Every CTA links to `#review-form`, not the section. Under 1024px the review section reorders to heading, intro,
    form, dial, hosts, so a tap lands on the form with the module prefill note visible.
  - The hero intro is one sentence ("RHAD45 answers leads, follows up with customers, asks for reviews and makes sense
    of your numbers…"); the "Meet RHAD45" line is gone.
  - Word choice (approved document): marketing copy says "products" (hero, meta, H2 "Four products. Fewer loose
    ends.", the price line, panel buttons, FAQ question). "Module" is kept for configuration and subscription detail:
    the extra-charges disclosure, the FAQ answer ("Subscribe to any one module") and the legal line. Tracking values
    (`module_view`, `data-cta-module`, `cta_location: modules`) keep their names.
  - Hosts are a typographic lockup ("Akash & Ashwin", red ampersand, rule above) until Akash's photo exists.
    Agency clients are one quiet line joined by red dots.
  - The FAQ heading carries a direct WhatsApp line. The footer sentence is display-md, not display-xl.
  - `--red-on-ink` #FF5A5F for small red text on the ink (the hub "45").
- **FAQ:** no image. Heading on the left (sticky on desktop), the four folding answers on the right; the first rule
  sits level with the top of the heading. One column under 1024px.
- **Floating WhatsApp widget:** as on rhad.agency, a WhatsApp-green (#25D366) disc fixed bottom-right with the WhatsApp
  glyph (dark #111B21). It opens to "Chat on WhatsApp" on hover or keyboard focus. On phones it sits above the sticky
  CTA bar while that bar is showing. It replaces the FAQ's WhatsApp button; the number is shown only in the footer.
- **Form cube in 3D:** the cube on the form's corner is six CSS 3D faces (top #F03131, sides #C40F2C/#8E0A20,
  bottom #6E0818) in the brand's isometric pose. It spins slowly while on screen, leans toward a mouse pointer
  anywhere in the review section, and can be dragged to spin (a flick eases back to the idle spin). Static
  isometric pose under reduced motion. No library and no build step.
- **Hero height (layout pass):** the hero sizes to its content (no 100svh min-height). On desktop the diagram's width is
  capped by viewport height (`(100svh - header - 160px) * 640/560`), short laptops (≤820px tall) scale the headline
  with `vh`, 1024–1279px splits the grid 1:1, tablets cap the diagram at 480px, and phones show the four modules as a
  compact 2×2 with the secondary action as a text link. Measured hero heights: 686px at 1440×900 (was 824),
  711 at 1920×1080 (was 1004), 619 at 1280×720 (whole hero now fits), 620 at 1024×768 (was 866), 1077 at 390×844
  (was 1246).
- **Hero diagram in RHAD imagery (Oct 2026):** same concept, cards, copy and 8s clock; new look.
  - **Hub:** the hub is a real 3D RHAD cube (CSS 3D, same as the form cube: idle spin, leans toward the pointer over
    the diagram, drag to spin) with "RHAD45" under it. On each arrival it swells (up to 10%)
    and its red glow brightens.
  - **Red thread:** curved threads (1.8px `--red-hot` with a soft glow) replace the angular grey lines. Each carries
    two fixed beads (ink fill, light ring). Activity travels in as a white bead and goes back out as a red one.
  - **Panels:** module cards are square light-grey collage panels (#E4E4E1, turning white on their highlight) with
    soft depth instead of the red offset shadow. Each has a ghost tile offset behind it, a dot-grid patch and window
    dots. The "e.g." flow sits under a hairline.
  - **Bubble and texture:** the bubble is a small grey UI window. Film grain sits over the hero. On phones the
    collage extras drop and the hub is the cube beside the wordmark.
- **Icons, bubble, pulse (Oct 2026):**
  - **Icons:** glyphs are 1.75px with round caps and joins. The module icons are redrawn simpler: chat bubble with three
    dots, a loop around a heart, a star, three bars. They sit in a soft red-tint circle on the hero panels instead of a
    square box.
  - **Bubble:** "Another follow-up?" is a dark frosted pill that appears only while the pointer is on the hub cube
    (a tap shows it for about 2s).
  - **Pulse:** on each arrival the hub cube swells (up to 10%) and its red glow brightens. No wireframe, no white halo.
- **Review Engine demo is SMS, not WhatsApp:** a plain Messages thread (light header with avatar and name, blue
  outgoing bubble #D3E3FD, link preview card, "Delivered", "Text message" input with a send button), still ending in
  the Google review sheet. Lead Response and Loyalty Loop stay on WhatsApp.
- **Readability floor:** nothing read on the page is under 13px (14px for notes, fine print, legal and per-month
  labels) and nothing in the phone mock under 12px. Small secondary text in Plus Jakarta Sans uses weight 500.
  Hero card benefit text is 14–15px/500, the "e.g." flow 13–13.5px, and prices 13–14px.
- **Custom cube pointer:** on desktop with a mouse (not touch, not under reduced motion), the cursor is a 16px 3D
  RHAD cube that follows the pointer and turns slowly. Over anything clickable (links, buttons, tabs, summaries,
  labels, checkboxes, the 3D cubes) it hops on a 1.1s loop: anticipation squash, stretch on take-off, a 9.6px apex
  where the cube morphs into a glossy red orb (faces round off, orb fades in, then back), stretch on the fall, squash
  on landing, a smaller second bounce, then settle. On click it spins fast
  and pulses like an arc reactor (swell, flickering red glow, two red rings expanding), then settles back within
  about a second. Text fields and the dropdown keep the native cursor and hide the cube.
- **Share image:** `assets/img/og-rhad45-1200x630.png` (1200x630). It shows the hero headline in Sora 700 on the ink
  ground with the red glow and halftone, the reverse RHAD45 logo, the red cube and "rhad.agency/rhad45". It is wired
  as `og:image` and `twitter:image` with alt text.
