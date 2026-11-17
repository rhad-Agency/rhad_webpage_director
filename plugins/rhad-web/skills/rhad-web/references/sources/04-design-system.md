# RHAD45 — LP design system

Version 1.0 | 23 October 2026

## Implementation contract

Use `design-system.css` as the token and component baseline. It includes self-hosted variable fonts and framework-neutral classes. All selectors use the r45 prefix except the deliberate document reset. Copy this stylesheet and its sibling assets folder together to `/public/brand/`; link `/brand/design-system.css` in the page. Relative font URLs then resolve under `/brand/assets/fonts/`.

The HTML catalogue `05-design-system-preview.html` shows the tokens and components using the real assets. It is a component reference, not the finished LP or a connected lead form.

## Layout and responsive system

| Property | Rule |
| --- | --- |
| Container | Maximum 1200px; centred |
| Gutters | 20px minimum, fluid to 48px |
| Section rhythm | 56px mobile, fluid toward 112px desktop |
| Desktop hero/demo | Two columns, approximately 60/40; no fixed section heights |
| Product grid | Two columns from 600px, one below 600px |
| Split sections | Stack below 960px |
| Navigation | Full at 960px and above; disclosure menu below |
| Mobile header | 180–200px full lockup and 48px menu control |
| Spacing scale | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px |
| Radius | 6px components, 4px inputs, 8px chat bubbles |
| Elevation | Default none; use borders and contrast rather than floating glass panels |

Validate at 360, 390, 768, 1024 and 1440 CSS px, and 200% zoom. No horizontal scroll, clipped words, overlapping sticky elements or hidden form labels. Content determines height. At 360px, the H1 can wrap naturally over several lines. Do not reduce body copy below 16px to force a fit.

## Components

| Component | Contract | States |
| --- | --- | --- |
| Header | Logo links to #top; navigation labels from JSON; one review CTA | Desktop, mobile closed/open, keyboard focus |
| Primary action | Action-red background, white 16px bold copy, 48px min height | Default, hover, focus, disabled, pending |
| Secondary action | Ink text and border on light, white on dark | Default, hover, focus |
| Hero flow | Three numbered HTML steps; demonstration clearly labelled | Static, reduced motion |
| Chat demo | Semantic message list with visible speaker labels | Static; no input or fake live-chat state |
| Product card | Number, product name, benefit, description, handoff and prefill link | Default, link focus/hover |
| Price panel | One selected product at S$100/month; inclusion and exclusions adjacent | Static, primary action |
| FAQ | Native details/summary; exactly three supplied questions | Closed/open, keyboard focus |
| Form field | Persistent label, 48px control, instructions/errors associated by IDs | Empty, filled, invalid, disabled |
| Form status | Success only from confirmed backend receipt; failure retains entries | Validation, pending, success, network/server failure |
| Footer | Reverse logo, brand line, parent link and configured privacy link | Links focus/hover |

Do not make an entire product card a fake button. Its CTA should link to #business-review, set the matching interest option and leave submission to the user. The demo CTA does the same for WhatsApp enquiries. A changed selection should be announced appropriately and focus must not be stolen during normal form entry.

## State implementation

- Mobile menu uses a button with aria-expanded and aria-controls. Close on Escape and navigation; return focus when closing via Escape. Hidden links must leave the tab order.
- FAQ uses native details/summary; do not add conflicting button roles. More than one item may be open.
- Use native input types/autocomplete. Do not validate phone numbers with a restrictive Singapore-only pattern; the field is optional.
- Associate help and inline errors with aria-describedby; set aria-invalid after validation. Focus an error summary or first invalid input on failed submission.
- Pending submission disables repeat sends and updates the button label. aria-busy belongs on the form/status region; do not disable unrelated navigation.
- Announce success with role=status and errors with an appropriate live region. Preserve field values after a failed request.

## Accessibility

Use semantic header/nav/main/section/footer, a skip link and one H1. Minimum contrast: 4.5:1 for normal text and 3:1 for large text; use 3:1 for essential field boundaries and focus indicators against adjoining colours. Logo artwork is a branding exception, not permission to use low-contrast UI text. Label links descriptively. Touch targets are 44px minimum, with 48px preferred.

Dark sections use their own light secondary text and white focus indicators. A form on a dark section is a white panel; retain the form's dark text and action-red focus indicator inside that panel. Brand red on white is large-text/decoration only; action red handles smaller functional text.

## Imagery and graphic language

Use CSS/HTML for the illustrative conversation and process so copy remains readable, accessible and editable. The Join can appear as a small decorative section signature. It should not be tiled as background noise or used in place of a workflow diagram. No stock robot, AI orb, dashboard full of fictional metrics or messaging-platform logo imitating official endorsement.

## Build mapping

Hero: r45-section + r45-split. Products: r45-paper + r45-grid + r45-card. FAQ: r45-faq. Conversion: r45-dark + r45-split + r45-form. The classes are baseline building blocks; preserve the section composition rather than putting every paragraph in a bordered card.

## Performance

Use the supplied SVG logos with explicit width/height or aspect ratio. Self-host fonts with font-display:swap. Variable TTFs are supplied for portability; production can subset/convert to WOFF2 while retaining the licence and weights. Avoid loading two duplicate font sources or all historical logo previews. Keep initial rendering independent of scroll animation libraries. Aim for good Core Web Vitals, measure in the actual deployment, and avoid claiming those scores before testing.

## QA checklist

Check all responsive widths, keyboard navigation, menu focus, FAQ toggles, reduced-motion behaviour, product-to-form prefills, valid/invalid submissions, duplicate-click prevention, genuine server errors, success announcements and retained inputs. Confirm no success toast appears without a successful lead receipt. Check metadata, parent/privacy links, real image assets, no fabricated proof and visible price exclusions. Confirm final code uses the owner-edited icon paths.
