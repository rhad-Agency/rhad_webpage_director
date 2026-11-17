# Imagery for RHAD web pages

Every image on a page is a visible version of what its section says. No decoration. Write the concept brief before generating, picking or placing one.

## Concept brief (write it first)

```
CONCEPT BRIEF
Section and message: <the one thing this section says>
Visible metaphor: <one real, physical scene or an authored graphic>
Element map:
  - <object> = <what it stands for>
Why this and not a cliché: <one sentence>
Read-test: <what a stranger would say it is about with the headline covered>
Source: <supplied, generated, or built in HTML/SVG>
Left out on purpose: <what would confuse or repeat the copy>
```

Delete any object with no row in the Element map. Read-test fails mean the objects change, not the headline.

## What RHAD web imagery looks like

Reference set: `assets/imagery/site/` (portraits, collages, the isometric EDGE city) and the live pages in `assets/references/`. Open the matching images before choosing.

- Monochrome photographic people on a white or pale ground, horizontal scanline displacement, one sharp subject
- Fragmented grey image tiles, the **red thread** with small dark nodes, one **red cube** as the only colour
- The RHAD45 live page's editorial banner (two people at work beside a Singapore skyline collage joined by the red thread)
- The light isometric EDGE city, for programme and ecosystem pages only

## Rules

- Prefer an image that works as a **mechanism** over a mood: a labelled example conversation built in HTML, a process slip, a real screenshot supplied by the user.
- **Built in HTML or SVG** beats a raster for anything with words: diagrams, phone mocks, slips, charts. No text baked into raster images.
- Real people only if supplied and consented. Generated people are labelled illustrative where they could mislead. Never present a generated person as a client, a team member or a customer.
- No generic stock (handshakes, laptops and coffee, glass-table teams). No isometric "tech" blobs, no neon, no orbs, no fake dashboards.
- One editorial image band per page is usually plenty.
- Credit open-licence photographs in the footer.

## Image generation

Through **ChatGPT** (built-in ImageGen if you are already in ChatGPT or Codex). Write a prompt that includes the concept brief, the style references from `assets/imagery/site/`, the page's aspect ratio and the clean space the layout needs, and ends with a **NO-TEXT block**:

```
ABSOLUTELY NO TEXT OF ANY KIND IN THE IMAGE. No headlines, titles, captions, labels, category names, numbers, digits, dates, logos, watermarks, signage, UI text or letter-like marks, including on screens, clothing and packaging. Leave clean empty space. All words are added later in layout.
```

If the model returns text or artefacts, change the prompt and regenerate. Do not keep an image and cover the text. Log the final prompt and the date in `handoff.md`.

## Delivery

- Format: WebP or AVIF with a JPEG fallback only if needed. Hero 200 kB or less, others as small as quality allows.
- Provide `width` and `height`, `srcset` and `sizes` for content images, `loading="lazy"` and `decoding="async"` below the fold, and no lazy loading on the hero.
- Alt text: what is shown and why it matters, one or two sentences. Decorative images get `alt=""`.
- Convert with ffmpeg or `cwebp`. Strip metadata. Keep the original in a source folder outside the deployed bundle.
