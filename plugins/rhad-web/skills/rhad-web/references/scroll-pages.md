# Scroll-driven pages (scroll-craft mode)

Use this mode when the user asks for a **scrollable, scroll-driven or scroll-told page**: "scrollable landing page", "scroll experience", "scrollytelling", "scroll animation site", "a page where scrolling plays a video", "cinematic or layered hero", "Apple-style landing page", "3D scroll world", "interactive landing page", or "make it feel like an experience, not a document". If the request is a plain page with ordinary section entrances, this mode does not apply.

Not sure which one they mean? Ask in Step 1: "Do you want a scroll-driven page, where scrolling moves the story (pinned scenes, video that scrubs with the scroll), or a standard page with light entrance motion?" Do not choose for them.

The engine and method come from **scroll-craft** (github.com/nateherkai/scroll-craft, MIT, Nate Herk), a companion skill installed by `scripts/install-skills`. RHAD supplies the brand, the brief, the standards and the gates. Precedence is in `precedence.md`: scroll-craft is a companion skill, so it advises on method and never decides palette, fonts, tone or imagery style.

## How the two skills fit together

| Stage | RHAD skill (decides) | scroll-craft (method) |
|---|---|---|
| Brief | Step 1 intake and read-back, as always | Add its eight questions to the same message, only the unanswered ones: vibe and references, the journey section by section, the energy curve, the feeling at each stage and the **one moment to remember**, the thing no other site does, distance from premium-minimal, **one unbroken world or distinct scenes**, assets on hand. One interview, not two |
| Brief file | `PRODUCT.md`, `DESIGN.md`, `handoff.md` | Also write its `BRIEF.md` (feeling curve, one engineered peak) in the project folder. Never invent user quotes |
| Plan (checkpoint 2) | Page job, section map, conversion path, signature idea | Page grammar, journey map, feeling curve with one peak, scroll score, at least four device families and never the same device twice in a row, one bespoke signature move, the fingerprint gate |
| Direction (checkpoint 3) | Brand files, copy, imagery concept briefs | Hero depth planes (`hero-depth.md`), worlds, devices. Photographic world unless the brand is illustrated |
| Build | Starter, tokens, fonts, forms, analytics | `engine/scrollcraft.js` and `scrollcraft.css`, themed with RHAD tokens |
| Verify | `web-lint`, `shoot.mjs --probe`, both directors | Its own scroll-position screenshots, desktop, mobile and reduced motion (`verify.md`) |

Read scroll-craft's `SKILL.md`, then `references/devices.md`, `uniqueness.md`, `feel.md`, `hero-depth.md` and `verify.md` from its installed folder (`~/.claude/skills/scroll-craft` or `~/.agents/skills/scroll-craft`).

## Brand overrides (non-negotiable)

- **Fonts**: `--sc-font-display: "Unbounded"` and `--sc-font-text: "Plus Jakarta Sans"`, the packaged files. Never Archivo, Geist or any font scroll-craft suggests.
- **Colour**: map its six colour roles to RHAD tokens (`rhad-web.css`, or the RHAD45 direction layer). One accent: the brand red. A colour drift between acts may move only between token colours (for example canvas, canvas-step and field-dark).
- **Aesthetic family**: its range question (brutalist, maximalist, playful, retro, editorial, premium-minimal) chooses structure and energy inside the RHAD look. It never changes palette, type or geometry. No glass, glow, gradients, soft shadows, eyebrows, pill badges or icon cards, even where a scroll-craft example uses them.
- **Imagery**: concept brief first (`imagery-web.md`). Generation goes through ChatGPT by default, using the RHAD imagery rules. scroll-craft's **kie.ai** generation is off unless the user says yes to it in this conversation after you state the estimated credit cost from scroll-craft's `.env.example`. The API key is theirs and lives in their `.env`, never in the repository.
- **Copy**: `copy-web.md`. No "scroll to explore" nudges, no `01 / 06` counters, no invented stats (scroll-craft bans these too).
- **Proof and claims**: hard rules 6 and 7 still apply to every act.

## Motion rules in this mode

These replace principle 4 and the ScrollTrigger pinning limit in `motion-and-3d.md` for scroll-driven pages only. Everything else in that file still applies.

1. **Native scroll is untouched.** The scrollbar, wheel, trackpad, touch, keyboard (Space, Page Down, arrows, Home, End) and find-in-page all work at their normal speed. No wheel or touch interception, no `preventDefault` on scroll input, no custom scroll physics, no smooth-scroll library that changes the scroll position, no mandatory `scroll-snap`. Smoothing a video playhead or a transform toward the scroll position is fine; moving the page is not.
2. **Pinning is allowed when it is the story.** An act may pin while its argument advances, up to **three viewports** of scroll per act, and the whole page at most four pinned acts. Each pinned act has a visible exit (the content keeps changing as you scroll) so it never feels stuck.
3. **The action is never more than one act away.** The primary CTA is in the header at all times and closes the page. A "skip to enquiry" link is the first focusable element.
4. **Content is real and readable everywhere.** Headlines and body are HTML text, never baked into video or images. With scripts blocked, every act's text and the form are visible in order. Text contrast holds at every scroll position, not just at rest (scroll-craft's screenshots prove this).
5. **Reduced motion is a designed composition.** `prefers-reduced-motion: reduce` shows a stacked, static page: posters instead of scrubbed video, end states, no pinning, no parallax, depth kept as a still composition.
6. **Phones are art-directed separately.** The mobile hero and each act are their own composition (scroll-craft's separate mobile composition rule), not the desktop scaled down. Pins shorten on phones.
7. **Budget.** Scrubbed video per act: H.264 with a short keyframe interval so it scrubs smoothly (scroll-craft's `encode.sh`: 1080p, `-g 8` desktop; 720p, `-g 4` phone), poster frames that carry the message alone. State the total page weight before building and keep the first view under the LCP target in `ux-standards.md`. Save-data and slow connections get posters.

## Verify (Step 6, both sets)

1. scroll-craft's `scripts/shoot.mjs` (needs `scripts/serve.mjs` running) at its scroll positions, desktop, mobile and `--reduced-motion`. Read every frame.
2. This skill's `web-lint.mjs` and `shoot.mjs --probe` at all five widths, plus a scripts-blocked capture.
3. Both directors. The UX director checks the motion rules above in place of the pinned-trap item; the slop director checks that the devices, signature move and structure are this page's own and that nothing slipped in from scroll-craft's examples.

## Checklist (both directors run it)

- [ ] Mode was chosen by the user, not assumed
- [ ] `BRIEF.md` has a feeling curve and exactly one peak
- [ ] At least four device families, none twice in a row; one named signature move
- [ ] Fonts are Unbounded and Plus Jakarta Sans only; colours are tokens only
- [ ] No kie.ai generation without the user's yes on cost
- [ ] Native scroll, keyboard and find-in-page work at normal speed; no snap trap
- [ ] Pinned acts at most three viewports each, at most four per page
- [ ] CTA always reachable; skip link first
- [ ] Scripts blocked: all text and the form visible in order
- [ ] Reduced motion: stacked static composition, no pinning, posters only
- [ ] Phone acts are their own compositions
- [ ] Contrast holds at every captured scroll position
