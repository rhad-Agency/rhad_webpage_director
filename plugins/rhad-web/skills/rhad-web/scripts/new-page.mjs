#!/usr/bin/env node
// Scaffold a RHAD web project from the starter. Copies the page, CSS, JS, tokens, fonts and logos into <dir>.
// Usage: node new-page.mjs <dir> [--type service|lp] [--brand rhad|rhad45] [--direction a|b] [--force]
// --direction is REQUIRED for rhad45 (ask the user): a = light handoff (23 Oct 2026), b = live ink-hero site (Nov 2026).
// Writes PRODUCT.md, DESIGN.md and handoff.md stubs. Never overwrites existing files without --force.
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const skill = resolve(here, '..');
const args = process.argv.slice(2);
let type = 'service', brand = 'rhad', direction = '', force = false, dir;
for (let i = 0; i < args.length; i++) { if (args[i] === '--type') type = args[++i]; else if (args[i] === '--brand') brand = args[++i]; else if (args[i] === '--direction') direction = args[++i]; else if (args[i] === '--force') force = true; else dir = args[i]; }
if (!dir || !['service', 'lp'].includes(type) || !['rhad', 'rhad45'].includes(brand)) { console.error('Usage: new-page.mjs <dir> [--type service|lp] [--brand rhad|rhad45] [--direction a|b] [--force]'); process.exit(2); }
if (brand === 'rhad45' && !['a', 'b'].includes(direction)) { console.error('RHAD45 needs --direction a|b. Ask the user which: a = light handoff, b = live ink-hero site (see references/rhad45-web.md). Do not choose for them.'); process.exit(2); }
const out = resolve(dir);
if (existsSync(join(out, 'index.html')) && !force) { console.error(`${out}/index.html exists. Use --force to overwrite.`); process.exit(1); }

const cp = (from, to) => { mkdirSync(dirname(to), { recursive: true }); cpSync(from, to, { recursive: true, force }); };
const starter = join(skill, 'assets/templates/starter');
cp(join(starter, type === 'lp' ? 'landing-page.html' : 'service-page.html'), join(out, 'index.html'));
cp(join(starter, 'css'), join(out, 'css')); cp(join(starter, 'js'), join(out, 'js'));
cp(join(skill, 'assets/tokens/rhad-web.css'), join(out, 'assets/tokens/rhad-web.css'));
cp(join(skill, 'assets/fonts'), join(out, 'assets/fonts'));
if (brand === 'rhad45') {
  cp(join(skill, 'assets/rhad45/logos'), join(out, 'assets/rhad45/logos')); cp(join(skill, 'assets/rhad45/icons'), join(out, 'assets/rhad45/icons'));
  cp(join(skill, 'assets/tokens/rhad45-design-system.css'), join(out, 'assets/tokens/rhad45-design-system.css'));
  cp(join(skill, 'assets/tokens/rhad45-design-tokens.json'), join(out, 'assets/tokens/rhad45-design-tokens.json'));
}
cp(join(skill, 'assets/rhad/logos'), join(out, 'assets/rhad/logos'));
mkdirSync(join(out, 'assets/img'), { recursive: true }); mkdirSync(join(out, 'verification'), { recursive: true });

if (brand === 'rhad45') {
  const idx = join(out, 'index.html'); let h = readFileSync(idx, 'utf8');
  const headerLogo = direction === 'b' ? 'RHAD45-logo-reverse.svg' : 'RHAD45-logo-primary.svg';
  h = h.replace(/<img src="assets\/rhad\/logos\/rhad-logo-red-tight\.png" alt="RHAD" width="166" height="38">/, `<img src="assets/rhad45/logos/${headerLogo}" alt="RHAD45" width="149" height="38">`)
       .replace(/<img src="assets\/rhad\/logos\/rhad-logo-white-tight\.png" alt="RHAD" width="166" height="38">/, '<img src="assets/rhad45/logos/RHAD45-logo-reverse.svg" alt="RHAD45" width="149" height="38">')
       .replace(/aria-label="RHAD home"/g, 'aria-label="RHAD45 home"').replace(/\| RHAD<\/title>/, '| RHAD45</title>')
       .replace('<link rel="stylesheet" href="css/site.css">', `<link rel="stylesheet" href="css/site.css">\n<link rel="stylesheet" href="assets/tokens/rhad45-web-${direction}.css"><!-- brand layer: must load after site.css -->`);
  writeFileSync(idx, h);
  cp(join(skill, `assets/tokens/rhad45-web-${direction}.css`), join(out, `assets/tokens/rhad45-web-${direction}.css`));
}
const stub = (name, body) => { const p = join(out, name); if (!existsSync(p) || force) writeFileSync(p, body); };
stub('PRODUCT.md', `# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

[NEEDS: confirmed stack, hosting and domain]

## Users

[NEEDS: the audience from the confirmed brief: who, where they arrive from, what they need to believe]

## Product Purpose

[NEEDS: page job and the primary conversion from the confirmed brief]

## Capabilities and Constraints

[NEEDS: price, inclusions, exclusions, legal and grant wording, anything that must never be implied]

## Brand Commitments

${brand === 'rhad45' ? (direction === 'b' ? 'RHAD45 direction B (live ink-hero site): ink stage #12161C, page red #D21131, logo red #F03131, Unbounded + Plus Jakarta Sans, Join logo, one allowed red hero glow.' : 'RHAD45 direction A (light handoff): white, paper #F5F3EF, ink #191919, action red #B62424, brand red #F03131 for logo and large display only, Unbounded + Plus Jakarta Sans, Join logo, radius 6px.') : 'RHAD logo, red #D90A2C, Unbounded + Plus Jakarta Sans, square geometry.'}

## Evidence on Hand

[NEEDS: real proof available with permission. Do not invent any.]

## Product Principles

1. Honest by default: conditional language on price and outcomes, every time.
2. Show the mechanism working rather than describing it.
3. One page job, one primary action.
`);
stub('DESIGN.md', `---
version: 1.0
name: ${brand}-page
description: "[NEEDS: the one signature idea for this page]"
colors:
  red: "#D90A2C"
  red-press: "#B00822"
  ink: "#1F2124"
  ink-soft: "#5B6169"
  canvas: "#FFFFFF"
  canvas-step: "#F3F2EF"
  field-dark: "#1F2124"
typography:
  display: "Unbounded 600-800, tight tracking"
  text: "Plus Jakarta Sans 400-700"
radius: 0px
---

## Overview

[NEEDS: the signature idea and how the page uses it]

## Rules

- Tokens only: assets/tokens/rhad-web.css. No gradients, glow, glass, shadows at rest, icon cards, pill badges, eyebrows.
- Phone layouts are their own compositions. One loud moment, calm everywhere else.
- Motion: one signature idea, GSAP with reduced-motion handling, content visible without scripts.
`);
stub('handoff.md', `# Handoff

## Confirmed brief
[NEEDS: paste the confirmed summary]

## Assumptions accepted by the user
none

## Decisions and changes
(record what changed after each critique and why)

## Open [NEEDS] and configuration to supply
- Lead endpoint (js/config.js)
- Privacy URL (js/config.js)
- Analytics (optional)

## Director reports
(paste verdicts and rounds)

## User overrules
(none; record per finding, in writing)

## Deploy steps (only after an explicit yes)
`);
console.log(`Scaffolded ${type} page (${brand}${brand === 'rhad45' ? ', direction ' + direction.toUpperCase() : ''}) in ${out}`);
console.log('Next: node scripts/web-lint.mjs ' + out + ' --brand ' + brand + '   then   node scripts/shoot.mjs ' + out + ' --probe');
