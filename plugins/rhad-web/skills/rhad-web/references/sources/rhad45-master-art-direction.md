# RHAD master art direction — 26 October 2026

The owner identified that the miniature neighbourhood illustration did not match the master RHAD website. This revision supersedes that illustration direction while retaining the light theme, scroll reveal, services, four modules and commercial offer.

Observed at https://www.rhad.agency/: white foundation, bold Unbounded headings, black-and-white photographic people, cutout silhouettes with horizontal scanline displacement, red accents and restrained rectangular CTAs. Master hero reference: `/wp-content/uploads/2026/08/rhad-banner-image-scaled-e1785921230251-1536x1118.png`.

The new original artwork applies that treatment to a café owner serving a customer, a wellness business consultation, and business partners reviewing a laptop. It is illustrative imagery; the people are not claimed to be actual RHAD45 clients. Active asset: `public/images/sme-rhad-editorial.webp`. Source PNG is preserved beside it. The old miniature asset is retained for history and is no longer referenced by the page.

`src/rhad-editorial.css` overrides the earlier warm miniature direction with white and neutral grey, a monochrome photo composition, uppercase hero typography, rectangular CTAs and sharper panel edges. Existing approved logo and flat red module SVGs are unchanged. The scroll motion remains an image transform, not video.

Verification: production build/TypeScript, visual desktop and mobile review, responsive geometry checks and scroll interaction. Existing lead handling is unchanged; actual lead destination and privacy URL remain deployment configuration items.
