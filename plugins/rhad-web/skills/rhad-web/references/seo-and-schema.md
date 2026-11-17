# SEO, metadata and structured data for RHAD pages

Search visibility is part of the page, not an afterthought. Keep it honest: no keyword stuffing, no fake schema.

## Metadata every page needs

| Field | Rule |
|---|---|
| `<title>` | Unique, 50 to 60 characters, the page's promise plus the brand ("Digital marketing for SMEs | RHAD") |
| `meta description` | 120 to 155 characters, a plain sentence that earns the click. Not a keyword list |
| `<html lang>` | `en-SG` for Singapore pages, `en-GB` where the brief says so |
| Canonical | One canonical URL, absolute. Only on the final domain. Preview deployments must not set the production canonical and must send `noindex` |
| Open Graph and Twitter | `og:title`, `og:description`, `og:image` (1200 x 630 with a text-free or minimal composition), `og:url`, `og:type` |
| Robots | `index, follow` on production; `noindex` on previews, thank-you pages and ad-only pages when the brief says so |
| Viewport | `width=device-width, initial-scale=1` and never `user-scalable=no` |
| Favicon and theme colour | RHAD icon, `theme-color` `#D90A2C` or the page ground |

## Page structure for search and accessibility

One H1, a logical outline, descriptive link text, meaningful `alt`, a real `<main>`, `<nav>`, `<footer>`. Internal links from the homepage to service pages and between related services with descriptive anchors. Content that answers the visitor's question in the HTML, not injected by script.

## Structured data (JSON-LD, only when true)

- **Organization** (homepage): name, URL, logo, sameAs profiles that exist.
- **LocalBusiness** only if the brief gives a real address, hours and phone.
- **Service** on a service page: name, description, provider, areaServed (Singapore), and `offers` only with a confirmed price.
- **FAQPage**: only for FAQs that are visible on the page. Google limits FAQ rich results, so treat it as markup hygiene, not a ranking tactic.
- **BreadcrumbList** on multi-level sites.
- Do not mark up testimonials as `Review` or `AggregateRating` unless they are real, permitted and visible. Never invent ratings.
- Validate with the Rich Results Test or `npx schema-dts-gen` style tooling; at minimum parse the JSON in a script.

## Markets and languages

If the page serves more than one market (SG, ID, IN, UK, AU), ask whether to use `hreflang` alternates. Do not machine-translate without a human review. Prices show the market's currency.

## Performance is SEO

Core Web Vitals targets in `ux-standards.md` apply. Fonts preloaded, images sized, no layout shift.

## Tracking and consent

Analytics only if configured. Prefer a small adapter with named events (`review_cta_click`, `product_interest_select`, `review_form_start`, `review_form_error`, `review_request_accepted`) carrying only placement, product and coarse error type. No names, emails, phone numbers or free text. Emit acceptance only after the server confirms receipt. Use the most privacy-preserving default for cookie banners and do not block the page behind one.

## If SEO skills are installed

`seo-page`, `seo-technical`, `seo-schema`, `seo-content` and `seo-audit` can audit the built page. Their advice informs this file; it does not override the brand or the UX standards.

## Checklist

- [ ] Title and description written for this page
- [ ] Canonical correct for the environment; previews `noindex`
- [ ] Open Graph image exists and is on-brand
- [ ] One H1; outline valid; descriptive link text
- [ ] JSON-LD present only where true and valid
- [ ] hreflang decided with the user
- [ ] Sitemap and robots.txt updated by the owner of the live site (do not publish them yourself)
