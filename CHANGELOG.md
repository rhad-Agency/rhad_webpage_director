# Changelog

## 1.1.0

- Scroll-driven pages: **scroll-craft** (github.com/nateherkai/scroll-craft, MIT) added as a companion skill, installed and verified by the installers and checked by preflight and validation
- The skill now triggers for any scrollable or scroll-driven webpage or landing page and runs it in scroll-craft mode: one merged brief (its eight questions folded into Step 1), its grammar, feeling curve, one peak, device variety, signature move and fingerprint gate in the plan, its engine, hero depth and encoding in the build, its scroll-position screenshots in the checks
- New `references/scroll-pages.md`: RHAD fonts and tokens override scroll-craft's, ChatGPT stays the image route (kie.ai only after the user's yes on cost), pinned acts and scrubbed video allowed within limits while native scroll, keyboard and find-in-page are never touched, a static reduced-motion composition, phone acts art-directed separately
- Both directors, `precedence.md`, `motion-and-3d.md`, `page-types.md` and the registry updated to match
- Windows installer fixes, found on a real install: `install-skills.ps1` no longer reports successful installs as failed (command output was being read as the exit code), and `-Only a,b` / `-Skip a,b` now work through `powershell -File` and from the root `install.ps1`, so the printed "retry only these" command actually retries them

## 1.0.0

First release.

- Skill `rhad-web`: design and build RHAD websites, landing pages and service pages (RHAD, RHAD45, EDGE-style campaign pages) from a verified brief
- Rules: verify never assume (brand, page type, information, goal, platform, audience asked and read back before any work), the user critiques at six checkpoints before anything is final, no AI slop, smooth by proof, never invent proof, tokens and fonts fixed, motion and 3D must earn their place, never deploy or submit without an explicit yes
- Two read-only director agents that gate the work, up to 3 rounds each, overruled only by the user: `ai-slop-director` and `ux-flow-director`. One source, built for Claude Code (`agents/*.md`, tool allowlist) and Codex (`codex-agents/*.toml`) by `tools/build-agents.mjs`. `install-directors.mjs` installs and verifies them
- Brand and web system: RHAD and RHAD45 web guides (two RHAD45 directions to choose from), web design system, page-type blueprints, copy, imagery, motion and 3D (GSAP and three.js budgets), SEO and schema, build stack, precedence rules, QA checklist
- Assets: logos, fonts (Unbounded, Plus Jakarta Sans, OFL), `rhad-web.css` tokens and base components, RHAD45 design system, starter service page and landing page, reference imagery and live-site screenshots, original source documents verbatim
- Scripts: `web-lint.mjs` (accessibility, brand tokens, slop patterns, honesty checks), `shoot.mjs` (five widths rendered at the exact viewport width, measured probe for overflow, errors, fonts, hidden content, tap targets, layout shift), `new-page.mjs`, `preflight.mjs`, installers
- Installers verify every third-party install, explain failures with next steps, offer retry, and exit 3 on failure. Third-party: impeccable, taste-skill, ui-ux-pro-max, gsap-skills, three-agent-skills, remotion, hyperframes, playwright-cli, ffmpeg
- Plugin for Claude Code and Codex from one folder, with validation and CI
- RHAD45 scaffolds are real: `new-page.mjs --brand rhad45 --direction a|b` swaps in the RHAD45 Join logo, layers `rhad45-web-a.css` (light handoff) or `rhad45-web-b.css` (live ink-hero) after the page CSS, and refuses to run without a direction. `references/brand-assets-index.md` lists every asset and guide per brand and is checked by validation
- One font pair for every brand: Unbounded and Plus Jakarta Sans on RHAD and RHAD45 pages. The live RHAD45 hero's Sora is not used and not packaged; `web-lint` fails any other font; validation fails if a third font file appears
- Proven by running both directors as subagents against test pages. Their feedback was folded in before release: reviewers must write output outside the repo (`shoot.mjs` now refuses to write into the skill folder), `shoot.mjs --serve` gives Lighthouse a URL, the probe names under-44 px tap targets, `web-lint` groups repeated hits and flags forms that would leak personal data into the URL without scripts, severity rules and valid options are stated in the briefs, the UX director returns "Requests for the main agent" for checks it cannot drive, and the starter page gained a visible phone CTA, a repeat CTA, a no-script fallback, a contact route, a scope line and a request timeout
