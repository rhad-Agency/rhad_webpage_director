# Build stack and conventions

Follow the existing repository first. Inspect it before choosing anything. If you start fresh, use the defaults below.

## What RHAD already builds with

- **EDGE and campaign pages** (`/edge/`, `rhad45/`): static HTML, CSS and JS, one folder per campaign page, shared assets in `assets/`, Google Fonts or self-hosted Unbounded and Plus Jakarta Sans, three.js modules for the cube and the city (`js/cube.js`, `js/hero-city.js`), GSAP-style scroll effects authored in plain JS.
- **RHAD45 product LP** (`E:/RHAD/RHAD45/lp`): Vite with TypeScript, `src/main.ts`, CSS files per direction, six endpoint tests, a deployment config.
- **rhad.agency**: a WordPress site (uploads under `/wp-content/`). Pages built for it are delivered as static sections or as HTML the web team imports; ask.

## Defaults for a new page

| Need | Default | Why |
|---|---|---|
| Campaign or service page | Static HTML, CSS, JS, no framework | Fast, accessible, easy for the web team to hand over |
| Needs components or routing | Vite with TypeScript | RHAD45 LP precedent |
| 3D | Vanilla three.js module, lazy loaded | Smaller than R3F; use R3F only if the app is React |
| Animation | GSAP (core, plus ScrollTrigger only if needed) | Official skills available |
| Styling | The packaged token CSS plus page CSS. No utility framework needed | Tokens are the system |
| Icons | One authored SVG sprite | Brand consistency |
| Forms | Native HTML plus a small adapter to a configured endpoint | No fake success |
| Analytics | Small adapter, named events, no PII | Privacy and honesty |

## Folder structure (static)

```
<project>/
  index.html
  css/site.css
  js/site.js            enhancements; page works without it
  js/config.js          endpoint, privacy URL, analytics id (empty by default, never fake)
  assets/
    fonts/              packaged Unbounded and Plus Jakarta Sans + OFL files
    tokens/rhad-web.css
    img/                WebP/AVIF with width and height
    rhad/ rhad45/       logos and icons, as needed
  PRODUCT.md DESIGN.md  project truth for impeccable and the directors
  handoff.md            decisions, config to supply, deploy steps
  verification/         screenshots, probe and lint output
```

## Fonts

Self-host the packaged files. Variable files cover weights. `font-display: swap`. Preload the display face used in the hero (`<link rel="preload" as="font" type="font/ttf" crossorigin>`). Keep the OFL licence files. Subsetting and WOFF2 conversion are allowed and keep the licence.

## Forms and the lead endpoint

Contract (adapt to the real endpoint): `POST` JSON to a configured same-origin endpoint with name, email, phone, company, interest, context, `source` and page URL. Validate on client and server, constrain lengths, rate-limit and use anti-spam on the server. Return a definite accepted result only after the lead is durably stored or acknowledged. The frontend never manufactures success with a timer, `localStorage` or a mock response. While pending, prevent duplicates. On failure preserve values and show the failure text. Credentials stay on the server. If the endpoint is not supplied, finish the UI and the adapter, show a developer-only warning in local development, and list it under open configuration in `handoff.md`.

## Images and media

WebP or AVIF with `width` and `height`; hero not lazy and 200 kB or less; other images lazy. Video as in `motion-and-3d.md`. Alt text per `imagery-web.md`.

## Local preview and checks

```bash
node scripts/shoot.mjs <project> --probe                 # screenshots at 5 widths + measured probe
node scripts/shoot.mjs <project> --probe --reduced-motion
node scripts/web-lint.mjs <project> --brand rhad         # markup, accessibility, brand, slop patterns
node scripts/web-lint.mjs <project> --brand rhad --final # also fails on [NEEDS] and TODO
```

`shoot.mjs` serves the folder on a temporary local server (fonts do not load over `file://`). Lighthouse and `npx impeccable detect` are optional extras.

## Hosting and deployment

Not the agent's decision and never done without an explicit yes. Document the steps in `handoff.md`: build output, environment variables the owner must set, the canonical domain, redirects, `robots.txt` and sitemap changes, preview versus production indexing. The RHAD45 LP was published to a private static site first; production on 45.rhad.agency needs the owner.

## Handoff to the WordPress team (rhad.agency)

Deliver a self-contained folder: HTML sections, one CSS file scoped under a wrapper class, the JS, optimised assets, and a README listing the blocks, the fonts to enqueue, and what must not be altered. Do not claim the page is live.
