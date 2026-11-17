# Brand assets and guides index

What this skill ships for each brand. `tools/validate.mjs` checks that every path in backticks below exists, so this list cannot go stale.

Paths are relative to the skill folder.

## Shared by both brands

| What | Where |
|---|---|
| **Fonts are identical for RHAD and RHAD45: Unbounded and Plus Jakarta Sans only. No third font.** Display font Unbounded (variable, plus static 600, 700, 800) and licence | `assets/fonts/Unbounded-Variable.ttf`, `assets/fonts/static/`, `assets/fonts/OFL-Unbounded.txt` |
| Text font Plus Jakarta Sans (variable, plus static 400 to 700) and licence | `assets/fonts/PlusJakartaSans-Variable.ttf`, `assets/fonts/OFL-PlusJakartaSans.txt` |
| Web design system, page blueprints, copy, imagery, motion, SEO, build | `references/web-design-system.md`, `references/page-types.md`, `references/copy-web.md`, `references/imagery-web.md`, `references/motion-and-3d.md`, `references/seo-and-schema.md`, `references/build-stack.md` |
| Standards and director rubrics | `references/ai-slop-catalogue.md`, `references/ux-standards.md`, `references/directors/ai-slop-director.md`, `references/directors/ux-flow-director.md` |
| Base tokens and components (RHAD family, square, flat) | `assets/tokens/rhad-web.css` |
| Imagery reference set (monochrome portraits, red thread, cube, isometric EDGE city) | `assets/imagery/site/README.md`, `assets/imagery/rhad-master-imagery-reference.png` |
| Starter pages (service page, landing page) with CSS, JS, form adapter | `assets/templates/starter/service-page.html`, `assets/templates/starter/landing-page.html`, `assets/templates/starter/css/site.css`, `assets/templates/starter/js/site.js` |

## RHAD (agency, and campaign pages such as EDGE)

| What | Where |
|---|---|
| Web brand guide: colour, type scale, layout, components, voice, do and do not | `references/brand-rhad-web.md` |
| Logos: red, white, thick (PNG and SVG), tight crops for layouts | `assets/rhad/logos/rhad-logo-red.png`, `assets/rhad/logos/rhad-logo-white.png`, `assets/rhad/logos/rhad-logo-red-tight.png`, `assets/rhad/logos/rhad-logo-white-tight.png`, `assets/rhad/logos/rhad-logo-thick.svg` |
| Original design document of the EDGE landing page (tokens, components, do and do not) | `references/sources/edge-DESIGN.md` |
| Original product document (audience, offer, constraints, evidence) | `references/sources/edge-PRODUCT.md` |
| Live site capture (home page, desktop and phone) | `assets/references/rhad-agency-home-1440.png`, `assets/references/rhad-agency-home-390.png` |
| Scaffold | `node scripts/new-page.mjs <dir> --type service|lp --brand rhad` |

## RHAD45 (product line)

| What | Where |
|---|---|
| Web brand guide: offer facts, the two directions, page structure, rules from the critiques, banned claims | `references/rhad45-web.md` |
| Logos: primary, reverse, mono ink, mono white, mono red, review (PNG and SVG) | `assets/rhad45/logos/RHAD45-logo-primary.svg`, `assets/rhad45/logos/RHAD45-logo-reverse.svg`, `assets/rhad45/logos/RHAD45-logo-mono-ink.svg`, `assets/rhad45/logos/RHAD45-logo-mono-white.svg`, `assets/rhad45/logos/RHAD45-logo-mono-red.svg`, `assets/rhad45/logos/RHAD45-logo-review.svg` |
| Icons: The Join symbol in red, white and ink (PNG and SVG) | `assets/rhad45/icons/RHAD45-icon-red.svg`, `assets/rhad45/icons/RHAD45-icon-white.svg`, `assets/rhad45/icons/RHAD45-icon-ink.svg` |
| Direction A (light handoff) tokens: official design system and machine-readable tokens | `assets/tokens/rhad45-design-system.css`, `assets/tokens/rhad45-design-tokens.json` |
| Direction A layer over the base tokens | `assets/tokens/rhad45-web-a.css` |
| Direction B (live ink-hero site) layer over the base tokens | `assets/tokens/rhad45-web-b.css` |
| Handoff documents, verbatim: final landing page copy (Markdown and JSON), design system, build brief, build prompt, component catalogue | `references/sources/03-landing-page-copy.md`, `references/sources/03-landing-page-copy.json`, `references/sources/04-design-system.md`, `references/sources/06-build-brief.md`, `references/sources/07-vibe-code-prompt.md`, `references/sources/05-design-system-preview.html`, `references/sources/rhad45-design-system.css` |
| Art direction notes (current) and the superseded diorama direction (do not restore) | `references/sources/rhad45-master-art-direction.md`, `references/sources/rhad45-light-sme-direction-superseded.md` |
| Live page capture (desktop and phone) | `assets/references/rhad45-live-lp-1440.png`, `assets/references/rhad45-live-lp-390.png` |
| RHAD45 portraits for imagery reference | `assets/imagery/site/portraits/rhad45-business-portraits.webp`, `assets/imagery/site/portraits/sme-rhad-editorial.webp` |
| Scaffold (direction required, ask the user) | `node scripts/new-page.mjs <dir> --type service|lp --brand rhad45 --direction a|b` |

## Not included, and why

- The RHAD45 identity exploration rounds and rejected logo routes: the owner's edited Join symbol is the selected direction. Do not search for alternatives.
- Team headshots from the live sites: personal photos, use only with the person's consent.
- The glossy 3D icon set and the warm diorama: superseded, do not restore.
- Client logos and testimonials: only real, permitted ones supplied for a specific page.
