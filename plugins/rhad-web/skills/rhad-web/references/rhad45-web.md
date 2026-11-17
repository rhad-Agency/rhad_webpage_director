# RHAD45 for the web

RHAD45 is a named product line within RHAD: business automation products for Singapore service SMEs. Page: 45.rhad.agency. Source documents, verbatim in `sources/`: the build-ready handoff (`03-landing-page-copy.md/.json`, `04-design-system.md`, `05-design-system-preview.html`, `06-build-brief.md`, `07-vibe-code-prompt.md`, `rhad45-design-system.css`), `edge-PRODUCT.md`, `edge-DESIGN.md` (its "RHAD45 page" section), `rhad45-master-art-direction.md`. Live reference captured in `assets/references/rhad45-live-lp-*.png` (November 2026).

## Ask first: which direction?

The RHAD45 web work has two documented directions. **Ask the user which to follow. Do not choose.** Recommend the live direction if they want continuity with 45.rhad.agency.

| | A. Light handoff (23 Oct 2026) | B. Live site (Nov 2026) |
|---|---|---|
| Ground | White, paper `#F5F3EF`, ink `#191919` | Ink hero stage (`#12161C`), step `#F3F2EF` sections, `field-dark` for Our Work and footer |
| Red | Logo red `#F03131`, action red `#B62424` for buttons and small text | Page red `#D21131`, logo red `#F03131` (also `red-hot` on ink), CTA red |
| Type | Unbounded 600-700 headings, Plus Jakarta Sans body | Same two fonts (the live page's Sora hero is **not** used, by decision) |
| Hero | Large left-aligned H1, price and exclusion group, dark three-step HTML flow | Ink stage with broad red glow and masked halftone, a system diagram: RHAD45 hub joined by angular paths to four equal off-white module cards (2 px ink outline, 5 px red offset shadow) |
| Signature | The Join logo, HTML workflow demo | The kinetic type band (solid and outlined "Answer. Follow up. Ask. Know."), the CSS-built phone studio, the 3D cube accents |
| Geometry | Radius 6 px components, 4 px inputs, 8 px chat bubbles, no elevation | Square, except the depicted phone (the one rounded object) |
| Gradients | None | The hero glow only (allowed here, nowhere else on RHAD pages) |

Scaffold either one with `node scripts/new-page.mjs <dir> --brand rhad45 --direction a|b`. It swaps in the RHAD45 Join logo files and layers `assets/tokens/rhad45-web-a.css` or `rhad45-web-b.css` over `rhad-web.css`. **Fonts are the same for RHAD and RHAD45: Unbounded and Plus Jakarta Sans only.** The source documents mention Sora for the live hero; that is overridden. Use Unbounded for the hero headline.

Both share: Unbounded and Plus Jakarta Sans, self-hosted; real HTML for the demonstration; no fabricated metrics, testimonials as product results, or integrations; one primary CTA; honest boundaries next to claims.

Superseded and **not to be restored**: the glossy 3D red icon set, the warm miniature neighbourhood diorama (`rhad45-light-sme-direction-superseded.md`), beige and pill styling, the superhero and comic language.

## Offer facts (confirmed by the owner)

- Four products, **equal prominence**: WhatsApp Lead Response, Loyalty Loop, Review Engine, Dashboard Reporting & Recommendations. Never lead with WhatsApp alone.
- Price: **any one product S$100/month** (write `S$100/month`, `SGD 100` on the live page; ask which form). Setup, WhatsApp/API usage and third-party software are charged separately and confirmed before the client proceeds. Never imply all four are included. Ongoing monitoring and support are included within the agreed scope.
- CTA: **Arrange a 45-minute business review.** The live page label: "Arrange My 45-Minute Review" everywhere, form submit "Request My 45-Minute Review", panel buttons "Ask About This Product", hero secondary "See How It Works", FAQ "Chat on WhatsApp".
- Submitting the form requests a review. It never confirms a booking. Under the submit button: "We reply within 1 working day to arrange a time. No obligation, and sending this form doesn't book a slot yet."
- Word choice (approved document): marketing copy says **products**. "Module" is kept for configuration and subscription detail.
- Not defined, so never invent: setup amounts, tax treatment, contract or cancellation terms, support hours, response times, bundle pricing, additional-product pricing.
- Agency portfolio results and testimonials are **RHAD agency credentials**, labelled "not RHAD45 product results". No RHAD45 product metrics, customer results or case studies exist.

## Page structure (live, in order)

Sticky header (logo, three in-page links, one CTA) / Hero with the four product cards and price line / Kinetic band / How it works: the studio (phone mock plus four tabs and a detail panel) / Four products (one price, one disclosure for extra charges, one CTA, the approved RHAD line below) / Our work (story banner, agency clients line, testimonials marquee) / Review form / FAQ / Footer. Every CTA links to `#review-form`, not the section. Under 1024 px the review section reorders to heading, intro, form, dial, hosts. Say each thing once: the four modules appear in the hero and the studio only.

## Rules from the critiques (Oct 2026), keep them

- No section kickers. The only label is the hero eyebrow, marked with the cube.
- Hosts are a typographic lockup until a photo exists. No invented team photo.
- Phone mocks follow the messaging app's own conventions but carry a visible "Example conversation" note and never claim to be live. Never imitate an official endorsement.
- The testimonials marquee pauses on hover and keyboard focus, no Pause button, static scroll under reduced motion.
- The studio auto-advances until the visitor picks a tab, then plays once. No Pause control. Reduced motion shows each scene's end state.
- Controls are at least 44 px tall. The sticky phone CTA hides over the form and the footer.
- Preview deployments must not be indexed. The lead endpoint and privacy URL are configuration the page needs, not things to invent.

## Brand guide essentials (from the handoff)

- Logo: the owner-edited **Join** symbol, `assets/rhad45/logos/` and `icons/`. Never stretch, skew, rotate, redraw, outline, shadow, replace the numerals or close the seam. Reverse asset on ink. Full lockup at least 180 px wide. Clear space is half the symbol height.
- Colour system for direction A: brand red `#F03131` (logo, large display, decorative rules), action red `#B62424` (buttons, small red text, links), hover `#951D1D`, ink `#191919`, white, paper `#F5F3EF`, muted `#5B5B5B`, soft border `#D8D3CC`, input border `#76716B`, success `#176348`, error `#A21D24`. Brand red on white is 4.05:1: large text and logo only.
- Type scale (A): H1 36 to 68 px Unbounded 700 at 1.10; H2 28 to 44 px 600 at 1.18; H3 20 to 26 px; lead 18 to 21 px; body 16 to 18 px at 1.65; buttons 16 px 700. Sentence case. No body in Unbounded.
- Spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px. Container 1200 px, gutters 20 to 48 px, section rhythm 56 px mobile to 112 px desktop.
- Components and states: header, primary and secondary action, hero flow, chat demo, product card, price panel, FAQ (native `details`), form field and status, footer. Full contracts in `sources/04-design-system.md`, tokens in `assets/tokens/rhad45-design-system.css` and `rhad45-design-tokens.json`.

## Banned for RHAD45 pages

revolutionary, seamless with everything, guaranteed revenue, never miss a lead, unlimited, fully autonomous, instant bookings, five-star reviews guaranteed, no hidden fees, free setup, cancel anytime, 24/7 support (unless substantiated), and any guaranteed booking, sale, rating or repeat revenue. State product boundaries next to the claim they limit (handoff does not guarantee a sale; repeat revenue is measured, not guaranteed; no guaranteed rating; name the supported report sources).

## Form and data

Name, business email, company and interest required; mobile and context optional. Real endpoint from configuration; client and server validation; no fake success; values preserved on failure; success text only after confirmed receipt; no personal data in analytics events. Missing endpoint or privacy URL: finish the UI and the adapter, report them as configuration the owner must supply, never fake them.
