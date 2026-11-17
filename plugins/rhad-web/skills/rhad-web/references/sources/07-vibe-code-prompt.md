# Copy-paste build prompt

Paste the instruction below into your coding tool after attaching or opening this handoff folder.

---

Build the RHAD45 landing page from the files in this handoff. Implement it in the current repository, following its existing framework and conventions. Inspect the repository before choosing dependencies. If starting from an empty project, choose a simple maintainable TypeScript web stack suitable for a static product page with a real lead endpoint.

Read these sources before building:
- 01-brand-identity.md
- 02-brand-guide.md
- 03-landing-page-copy.json (canonical exact visible copy)
- 04-design-system.md
- 06-build-brief.md
- design-system.css and 05-design-system-preview.html

Use the supplied assets in assets/logos/, assets/icons/ and assets/fonts/. The logo uses the owner's edited Join symbol: preserve it. Do not recreate, regenerate or substitute it. The logo contains embedded raster parent lettering; retain the supplied SVG instead of approximating RHAD in a font.

Copy design-system.css and assets/ together into public/brand/, then load /brand/design-system.css. Its relative font URLs must continue to resolve. Use the r45 component classes or implement an equivalent design directly from those tokens without drifting from them. Keep the SIL font licence notices.

Build this sequence: sticky header; hero with a three-step process graphic; static WhatsApp lead-response illustration; compact RHAD provenance; four-product grid and one-product price panel; three FAQ accordions; business-review form; footer. Follow the precise layout and responsive rules in the build brief. This is a confident white/paper/ink/red editorial design, with Unbounded display type and Plus Jakarta Sans body. Use real HTML for the demonstration and product graphics. Do not add gradients, glass panels, generic AI artwork, fake charts, stock client logos, testimonials or invented metrics.

The offer is ANY ONE product for S$100/month, including monitoring and support within agreed scope. Setup, WhatsApp/API usage and third-party software are separate. Never imply all four products are included. Retain the exclusion note beside the hero price and the offer price. Do not invent free trials, free setup, cancellation terms, tax treatment, unlimited support or guaranteed outcomes.

Use the exact JSON copy. Product CTAs should prefill the matching interest option, scroll to #business-review and never auto-submit. The conversation is an illustrative static example, not a live chat. Submission requests a 45-minute business review; it does not book or confirm a time.

Implement accessible semantics, one H1, a skip link, working keyboard navigation, mobile menu disclosure with Escape handling, native FAQ details, persistent form labels, associated errors, useful focus handling and reduced-motion behaviour. Validate at 360, 390, 768, 1024 and 1440px and at 200% zoom. No overflow or clipped display type. Use action red for normal-size buttons/text and master red for logo/decorative accents. Keep the white form panel's text/focus colours readable inside the dark section.

Wire the form to a configurable real server endpoint. Validate on client and server, handle pending/duplicate requests, preserve entered values on failure and show success only after confirmed durable receipt. Do not simulate success with a timer or local storage. If the real endpoint or privacy URL is absent, still complete the UI and integration adapter, explicitly report those missing configuration items and do not claim a working public submission flow. Do not create a dead privacy link or fabricate policy text. Keep credentials server-side.

Populate metadata from the JSON. Keep preview deployments out of search indexing. Add only configured analytics; event payloads must exclude personal form data. Complete appropriate build/type checks and exercise form states, CTA prefills, mobile navigation and FAQs. Report what is implemented, what was verified and any remaining live configuration. Do not publish or change an external account as part of this local build.

---
