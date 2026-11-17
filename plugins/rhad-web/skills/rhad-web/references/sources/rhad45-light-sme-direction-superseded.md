# Light SME neighbourhood direction

The latest owner request replaces the prior aesthetic with a light interpretation of the NORVA scroll-led miniature-world reference. Services, four module capabilities, S$100/month for one selected module, separate charges and existing form behaviour are preserved.

## What is used

- Original daytime miniature scene showing a café/customer, independent shop/owner, service studio/receptionist and a professional meeting.
- Warm ivory surfaces, charcoal text, RHAD-red links, restrained architecture and plants.
- Centred introduction that tilts/fades as the scene moves closer on scroll.
- A four-module process list that reveals the existing descriptions; an independent detailed explorer remains below.
- Light offer, review form and footer with the correct primary logo.

The industrial night footage, staffing claims, supplied fictional brand, neon colours, metrics and loader are not adopted. The imagery is illustrative, not a customer endorsement or a depiction of actual clients.

## Motion implementation

The camera effect is a scroll-linked translation/scale of a high-resolution scene image. It is not generated video, and no animated people or video playback is claimed. Hero introduction and module reveal are functions of scroll position. Reduced motion removes the sticky track/camera transformation and exposes a static scene plus manually selectable module list.

## Assets and code

- public/images/sme-neighbourhood.webp: optimized hero image (~313KB).
- public/images/sme-neighbourhood-source.png: original native ImageGen source.
- src/sme-city.css: light-theme and scene composition.
- src/main.ts: initSMEScene, scroll-linked rendering and existing module tabs.

The exact image-generation brief requested a high-end daylight architectural miniature of four SME vignettes connected by restrained red routes, with visible customer/owner interactions, generous top negative space, no text, no logos, no industrial buildings and no night scene.

## Verification
Production build and TypeScript check pass. Six existing tests pass. Browser review confirms scroll reveal and home navigation. Responsive widths 360, 390, 768, 1024 and 1440 show four modules, no horizontal overflow and no broken images. Mobile composition reviewed at 390 by 800. Screenshot evidence is in verification/light-sme-hero.png and verification/light-sme-scroll.png.
