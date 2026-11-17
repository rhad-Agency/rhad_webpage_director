# QA checklist (run before checkpoints 4 and 5)

Mark each line pass, fail (fixed), or n/a in `handoff.md`. Do not present a page with an open fail.

## Verification and critique

- [ ] The first message was read for brand, page type, information, goal, platform and audience. Every gap was asked about, none guessed
- [ ] The brief was read back and confirmed (checkpoint 1)
- [ ] Page plan, design direction and copy, built page and final pack each went through a critique round (checkpoints 2 to 5): own critique first, user critique asked, changes shown
- [ ] Assumptions the user accepted are listed in `handoff.md`; decisions and changes recorded

## Brand

- [ ] One brand and one direction (RHAD, RHAD45 A or B, campaign). No cross-contamination
- [ ] Tokens only. Fonts are the packaged Unbounded and Plus Jakarta Sans, self-hosted, OFL files kept
- [ ] Logo from `assets/`, correct variant, clear space, never altered
- [ ] Geometry per brand file (square unless a depicted device)
- [ ] No gradients, glow, glass, shadows at rest, icon cards, pills, eyebrows (except where the brand file allows the exact use)

## Honesty

- [ ] Every claim, number, name, quote and logo is real, sourced and permitted
- [ ] No fake dashboards, counters, ratings or testimonials. Agency credentials labelled as such
- [ ] Price, grant and outcome language is conditional; exclusions sit next to the price
- [ ] No lorem ipsum, placeholders or `[NEEDS]` left (`web-lint --final` passes)
- [ ] Forms show success only after a confirmed receipt; no PII in analytics; credentials server-side

## Mechanical

- [ ] `web-lint.mjs --brand <brand> --final` returns no failures
- [ ] `shoot.mjs --probe` run at 360, 390, 768, 1024, 1440; screenshots opened and read
- [ ] No horizontal overflow, JS errors, broken images or failed fonts
- [ ] `--reduced-motion` run shows end states and no movement
- [ ] Full-page screenshot with scripts blocked shows all content and the primary action
- [ ] Lighthouse run if available; budgets in `ux-standards.md` met
- [ ] `npx impeccable detect` run if available; findings handled

## Directors

- [ ] `ai-slop-director` returned PASS (rounds: __ of 3)
- [ ] `ux-flow-director` returned PASS (rounds: __ of 3)
- [ ] Any user overrule recorded per finding in `handoff.md`

## Content and SEO

- [ ] Title, description, canonical, Open Graph present and correct for the environment; previews `noindex`
- [ ] One H1; outline valid; descriptive links; alt text on every image
- [ ] JSON-LD only where true and valid

## Delivery

- [ ] Folder runs locally; `PRODUCT.md`, `DESIGN.md`, `handoff.md`, `verification/` present
- [ ] Open configuration listed (endpoint, privacy URL, analytics, domain, content to supply)
- [ ] **Asked for approval. Nothing deployed, published or submitted**
