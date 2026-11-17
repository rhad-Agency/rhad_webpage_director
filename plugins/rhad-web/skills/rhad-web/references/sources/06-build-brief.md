# RHAD45 — Landing-page build brief

Version 1.0 | 23 October 2026

## Goal

Build a responsive, accessible product LP at 45.rhad.agency that gets suitable Singapore service businesses to request a 45-minute business review. The public offer is any one automation product for S$100/month, including ongoing monitoring and support within the agreed scope. Setup, WhatsApp/API usage and third-party software cost extra.

The owner accepted the logo direction using their edited Join SVG. Use this package's current assets. Do not search the historical identity folders for alternatives.

## Authority and file mapping

1. Exact visible text and data: 03-landing-page-copy.json. The matching Markdown is a reading copy.
2. Visual usage and voice: 02-brand-guide.md.
3. Layout/state behaviour: 04-design-system.md.
4. Concrete tokens/components: design-system.css and 05-design-system-preview.html.
5. Real assets: assets/logos/, assets/icons/ and assets/fonts/.
6. Copy-paste coding instruction: 07-vibe-code-prompt.md.

Existing brand knowledge is background, not a reason to reintroduce an earlier price, audience or logo. The original PDF's instructions to preserve comic artwork and the old section structure belong to that earlier copy-replacement task. This brief supplies the current build direction, retaining the useful content sequence without requiring obsolete superhero treatments.

## Section-by-section art direction

### Header

White sticky bar, thin bottom divider, full primary logo, three in-page links and review CTA. At under 960px, a simple disclosure menu replaces desktop navigation. Avoid sticky stacks that consume most of a phone screen. Logo links to #top.

### 1. Hero / #top

White, generous whitespace, large left-aligned Unbounded H1, then the two supplied body paragraphs. Use the price line, inclusion line and exclusion note as a compact group. Primary CTA to review; secondary to products.

Right: a dark three-step HTML flow, using the exact graphic title, steps and caption. It is a visual explanation, not a second headline or a pretend dashboard. On mobile, copy and actions precede the graphic. Keep exclusions in the hero rather than hiding them in a tooltip.

### 2. Demo / #how-it-works

Paper background. One column explains the task and team handoff; the other shows the supplied six-message conversation as a static semantic list. Visible labels distinguish Customer and Example automated reply. No typing cursor, input box, invented timestamp, claimed live connection or WhatsApp brand endorsement. Show the result and illustrative disclaimer.

### 3. Provenance / #from-rhad

Compact white section linking RHAD45 to the parent. Use the supplied text and parent-work link. No invented client logo strip, testimonials, numbers or product case studies. If the owner later supplies approved agency projects, label them as agency credentials and retain the distinction from RHAD45 outcomes.

### 4. Products / #products

Paper background. Two-by-two numbered product grid, stacking to one column below 600px. Each card has its full product name, benefit, description, human handoff/boundary line and a prefill CTA. Below the grid, one price panel states one selected product at S$100/month. Follow with the separately scoped agency-services note.

### 5. FAQ / #faqs

White. Exactly three native accordions from the JSON, with a clear question hierarchy and comfortable reading width. Keep answers readable without animation dependencies.

### 6. Review / #business-review

Ink background with reverse treatment where branding is needed. Left: conversion headline and explanation. Right: white form panel. Persistent labels, plain error messages, 48px controls and one submit action. Do not treat this as a scheduling widget. Submission asks the RHAD team to arrange a time.

### Footer

Dark footer, reverse logo, brand line, parent attribution, copyright and actual configured privacy link. Keep it compact. Do not add fake office locations, certifications, awards or unverifiable trust badges.

## Required form behaviour

Name, business email, company and selected interest are required. Mobile and context are optional. Use normal email validity, not an invented corporate-domain allowlist. Accept international phone input without forcing a +65-only format.

Product and demo CTAs set the interest option and navigate to the form. Do not submit automatically. Preserve any context already entered.

Suggested endpoint contract: POST JSON to a configured same-origin lead endpoint with name, email, phone, company, interest, context, source="rhad45-lp", and page URL. Validate on the server, constrain lengths, rate-limit, and use appropriate anti-spam handling. Return a definite accepted/success result only after the lead is actually durably stored or acknowledged by the configured destination. Avoid logging submitted personal details in frontend analytics.

The frontend must not manufacture success using a timer, localStorage or a mock network response. While pending, prevent duplicates. On failure preserve values and show the supplied failure text. On success show the supplied receipt message and appointment note. The form endpoint is an integration dependency, not something this document claims to provide.

## Configuration to provide before public launch

| Item | Current status | Build treatment |
| --- | --- | --- |
| Real lead destination/endpoint | Not supplied | Add explicit config; show a developer-only setup warning in local development; no fake submissions |
| Privacy destination | Not supplied/verified | Configurable actual URL; do not use a dead # or invent a policy |
| Tax treatment | Not confirmed | Keep supplied S$100/month statement; obtain commercial confirmation before adding tax claims |
| Setup amounts, support boundaries, additional-product pricing, contract terms | Not supplied | Use agreed-scope copy; do not invent detailed terms |
| Final domain | Existing product domain 45.rhad.agency | Use canonical only if deploying at that destination; previews should not be indexed |
| Analytics service | Not supplied | Use a small adapter; no requirement to add an unconfigured third-party tracker |

These unresolved integrations do not block building and reviewing the full interface. They do block claiming the production form and policy link are operational.

## Analytics and success measurement

Optional event names: review_cta_click, product_interest_select, review_form_start, review_form_error, review_request_accepted. Include only placement, product/interest and coarse error type. Never send names, email addresses, telephone numbers or free-text context in event payloads. Emit acceptance only after the successful server response.

Internal two-month aim: ten active S$100 subscribers, or S$1,000 MRR. Track qualified reviews, review attendance, paid conversion, activation, source and retained subscribers. This target is not public social proof.

## Technical handoff defaults

Use the receiving codebase's existing framework and conventions. For a new project, a simple semantic page in React/TypeScript is acceptable; server-rendered/static content is preferred where the existing stack supports it. The visual system does not require a framework or animation library.

Copy design-system.css and assets/ together into public/brand/. Link /brand/design-system.css, use /brand/assets/logos/RHAD45-logo-primary.svg and the corresponding reverse asset. Render content from the supplied JSON or faithfully transcribe it into typed constants. Keep secrets and destination credentials on the server.

Use explicit image dimensions/aspect ratios, native controls where possible, no unnecessary hero video and no blocking animation. Populate title/description/social metadata from the JSON; social preview needs an actual exported image if used, not a nonexistent filename.

## Completion checks

Confirm: exact latest logo; one-product pricing; visible separate charges; correct CTA anchors/prefills; three FAQs; working mobile menu and keyboard focus; responsive widths and zoom; no invented proof; proper form validation; real success/error response behaviour; reduced motion; correct metadata; resolved parent/privacy links; no preview indexing; no secret keys in the client. Preserve source assets and font licence notices.
