# Motion, video and 3D for RHAD web pages

Tools: **GSAP** (`gsap-skills`) for web animation, **scroll-craft** for scroll-driven pages (`scroll-pages.md`), **three.js** (`three-agent-skills`: `three-best-practices`, `r3f-best-practices`) for 3D, **Remotion** and **HyperFrames** for rendered video assets, **impeccable** and **taste-skill** for critique. The brand files decide; these skills advise (`precedence.md`).

## Principles

1. **One signature motion idea per page.** The monument entrance, the red thread drawing, the studio playing a labelled example, the cube turning. Everything else is quiet.
2. **Motion explains or confirms.** It shows a mechanism working, guides the eye to the action, or confirms a change. It is never decoration.
3. **Content is visible first.** Animations start from a visible resting state and enhance. Nothing is hidden until scrolled. A full-page screenshot with scripts blocked must show the whole page.
4. **The visitor stays in control.** No scroll-jacking, no pinned sections that trap scrolling, no custom scroll physics, no blocking intros. Auto-advancing content stops on hover, focus or a visitor's choice. **Exception:** a scroll-driven page the user asked for follows `scroll-pages.md`, which allows pinned acts and scrubbed video but still never touches native scroll.
5. **Reduced motion is a first-class path.** `prefers-reduced-motion: reduce` shows end states, no autoplay, no parallax, no scroll-linked transforms, no looping.
6. **Cheap to run.** Transform and opacity only. No layout thrash. Nothing animates offscreen. Budget stated before building.

## Timing and easing

| Use | Duration | Easing | Travel |
|---|---|---|---|
| Hover, press, focus | 120 to 200 ms | `ease-out` or `cubic-bezier(.2,0,0,1)` | 1 px press, colour only |
| Menu, disclosure, tab | 180 to 260 ms | decelerating | within the component |
| Section entrance | 240 to 320 ms | decelerating (`power3.out` or a custom bezier) | at most 24 px, once |
| Exits | about 0.65 of the entrance | accelerating | shorter |
| Signature moment | 600 to 1400 ms | authored per move | as the idea needs |

Do not apply the same fade-up and even stagger to everything. If you use more than two distinct entrance patterns, you are decorating. Lead with one element and let the rest react at uneven offsets.

## GSAP rules

- Register only the plugins used. Load GSAP from the packaged or npm build, not an unpinned CDN tag.
- Wrap all effects in `gsap.matchMedia()` with a `(prefers-reduced-motion: no-preference)` branch. In the reduce branch, set end states directly.
- ScrollTrigger: no pinning that holds the page for more than one viewport, `scrub` only for a single hero or story and with `fastScrollEnd`, refresh after fonts and images load, `invalidateOnRefresh` for responsive values, kill on cleanup.
- Never animate `top`, `left`, `width`, `height` or box-shadow. Use `x`, `y`, `scale`, `opacity`, `clip-path`.
- Set initial states in CSS so there is no flash. Never set `opacity: 0` in CSS for content that depends on a script to appear; use a `html.js` class added by an inline script, and remove the class on failure.
- Timelines are labelled and named; one master timeline per signature moment.
- Test with scripts blocked, with CPU throttling 4x, and with reduced motion.

## Video assets (Remotion, HyperFrames)

- Use rendered video for a hero loop, a product explainer or a social cut, not for UI.
- Hero video: 1080p or smaller, H.264 and WebM, under 1.5 MB, muted, `playsinline`, `poster` image, `preload="metadata"`, no autoplay when `prefers-reduced-motion` or save-data. The poster must carry the message alone.
- Captions or a transcript for any video with speech. No audio autoplay.
- Keep compositions in the repository; render with the project's pinned version. HyperFrames for HTML-built video, Remotion for React-built. Follow each skill's render contract.

## Three.js and 3D

Use 3D only when it carries the message (the RHAD cube as the EDGE full stop, a mechanism that needs depth). If a still image tells the story, use the still.

**Decision test**: (1) What does 3D say that 2D cannot? (2) What is the static fallback? (3) What does it cost? If you cannot answer all three, do not use 3D.

Budgets and rules:
- Total JavaScript for a 3D page: 350 kB compressed plus a justified model budget. Models under 500 kB (Draco or Meshopt), textures KTX2 or WebP, no texture over 2048 px.
- Initialise after first paint and after the page is interactive. Lazy-load the module with an `IntersectionObserver`. Show the poster image until ready.
- One canvas, `antialias` only if it earns it, `devicePixelRatio` capped at 2 (1.5 on mobile), `powerPreference: "high-performance"` only if needed.
- Pause the render loop offscreen and in background tabs. Render on demand where nothing moves.
- Skip 3D on `prefers-reduced-motion`, `saveData`, no WebGL, and small or low-end devices when the still tells the story. Provide a visible, accessible static fallback.
- The canvas is decorative (`aria-hidden="true"`) unless it conveys information; then provide a text equivalent.
- Dispose geometries, materials and textures on teardown. Handle context loss.
- Vanilla three.js for a single object; React Three Fiber only if the page is already React.
- RHAD assets in the EDGE page (`cube.js`, `rhad-cube-model.js`, `hero-city.js`, `sg-city.glb`) are the reference for how the cube and the city were built.

## Review checklist (the UX director runs this)

- [ ] Full-page screenshot with scripts blocked shows all content
- [ ] Reduced-motion run shows end states and no movement
- [ ] No scroll-jacking, no pinned trap (scroll-driven pages: the `scroll-pages.md` checklist instead)
- [ ] One signature motion idea, named
- [ ] Only transform, opacity and clip-path animated
- [ ] Offscreen animation paused
- [ ] 3D justified, budgeted, lazy, with a static fallback
- [ ] Video muted, captioned or transcribed, poster present, skipped on reduced motion or save-data
