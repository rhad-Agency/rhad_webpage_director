# AI slop catalogue (the AI Slop Director's rubric)

Slop is work that looks plausible, says nothing specific and could belong to anyone. It comes from defaults: the first layout, palette, phrase or image a model reaches for. This file lists what to reject in RHAD web work and why. It is also the checklist for the main agent while building: do not make these in the first place.

Severity: **Critical** fails the page alone. **Major** counts toward the threshold (3 Majors fail). **Minor** is listed, never blocks.

Where the RHAD brand files explicitly allow something (for example the RHAD45 live page's ink hero with a red glow, or the depicted phone with rounded corners), cite the file and treat it as allowed. Anything not allowed in writing is slop.

## 1. Honesty (the worst slop is fake)

| Pattern | Sev |
|---|---|
| Invented testimonials, quotes, reviews, star ratings, case studies, client logos, "trusted by", "as seen in", awards, certifications, team members | Critical |
| Invented numbers: "10,000+ customers", "3x growth", "save 20 hours", uptime or response-time claims | Critical |
| Agency credentials presented as product results (RHAD45 pages) | Critical |
| Fake live elements: a "chat" or dashboard that pretends to be real data, fake counters, fake "3 people viewing" urgency, fake availability | Critical |
| Guarantees and absolutes on price, grants or outcomes ("guaranteed", "never miss a lead", "approved vendor", "secure funding") | Critical |
| Stock people shown as clients, staff or users | Major |
| Lorem ipsum, placeholder names, "Your Company", `[NEEDS]` left in a page claimed final | Critical |

## 2. Visual

| Pattern | Sev |
|---|---|
| Purple, indigo, violet or blue-to-purple gradients; "AI" gradient text | Critical |
| Glassmorphism: frosted blur cards, translucent panels, `backdrop-filter` | Major |
| Gradient meshes, blurred glow orbs, aurora backgrounds, floating blobs | Major |
| Drop shadows and soft glows at rest, neumorphic or "elevated" cards everywhere | Major |
| Rounded-everything: pill buttons, pill badges and tags, large-radius cards (RHAD web is square unless a brand file allows a depicted device) | Major |
| Neon, cyber, circuit-board, glowing brain, robot, orb, particle field, "AI sparkle" iconography | Critical |
| Decorative emoji as icons or bullets | Major |
| Generic icon set in tinted circles heading identical cards | Major |
| A colour or effect used because it is trendy, not because the brand uses it | Minor |

## 3. Layout

| Pattern | Sev |
|---|---|
| The template page: centred hero with a gradient, three icon cards, logo strip, alternating image-text rows, pricing trio, FAQ, CTA band | Major |
| Bento grid with no reason for different cell sizes | Major |
| Every section the same composition, same padding, same card | Major |
| Symmetry as default: everything centred, nothing leading the eye | Minor |
| Content stuffed into boxes to look designed (cards inside cards) | Minor |
| Desktop layout merely stacked on mobile instead of composed for the phone | Major |
| A second large headline competing with the main one | Major |

## 4. Typography

| Pattern | Sev |
|---|---|
| Fonts outside the RHAD pair (Inter, Roboto, system default as the voice, Poppins, DM Sans, Space Grotesk) | Major |
| Unbounded or any display face used for paragraphs | Major |
| Eyebrows, kickers, tracked micro-caps above headings; section index numbers ("01"); monospace flourishes | Major |
| Gradient or outlined text used decoratively (the RHAD45 outlined kinetic band is an allowed exception where its brand file says so) | Major |
| Timid hierarchy: everything the same size, or display type never used at architectural scale where the brand does | Major |
| Headlines that wrap into orphans or exceed two lines at any width where the brand sets a limit | Minor |

## 5. Copy

| Pattern | Sev |
|---|---|
| Hype words: revolutionary, seamless, cutting-edge, next-gen, game-changer, unlock, supercharge, world-class, state-of-the-art, leverage, empower, elevate, synergy, "AI-powered" as a headline | Major |
| Em dash rhythms, "Not X, but Y" repeated, stacked triads of nouns, "In today's fast-paced world" | Major |
| Vague benefit headlines that fit any company ("Grow your business", "Smarter solutions") | Major |
| Features listed instead of the customer's situation and next step | Major |
| Every section opens with a question, or a teaser ("what nobody tells you") | Minor |
| Buttons labelled "Learn more", "Get started", "Submit" with no object | Minor |
| Says the same thing in hero, section and FAQ | Major |

## 6. Imagery

| Pattern | Sev |
|---|---|
| Generic stock photography: handshake, laptop-and-coffee, smiling team at a glass table | Major |
| AI-generated people or scenes presented as real, or with warped hands, melted text, fake logos | Critical |
| Fake UI: dashboards with unreadable charts, screenshots that do not exist | Critical |
| Isometric "tech" illustrations, gradient blobs, abstract 3D shapes with no meaning | Major |
| Images with no concept: removing them loses nothing | Major |
| Text baked into generated images | Major |
| Broken or missing images (broken-image icon, 404 hero, `alt` only). Critical when the image is meant as proof or is the signature visual | Major |

## 7. Motion

| Pattern | Sev |
|---|---|
| Everything fades up 24 px on scroll with the same easing and an even stagger | Major |
| Parallax, tilt, magnetic and cursor effects added to every element | Major |
| Shimmer text, pulsing glows, endlessly looping decorative animation | Major |
| Typewriter and count-up numbers used on made-up figures | Critical |
| Scroll-jacking and pinned sections that fight the user | Major (UX director may raise to Blocker) |
| 3D that does not carry the message, or that costs more than it gives | Major |

## 8. Code and craft tells

| Pattern | Sev |
|---|---|
| Tailwind default palette and `bg-gradient-to-*` utilities, shadcn defaults left as-is | Major |
| Off-token colours, spacing and radius values scattered through CSS | Major |
| Inline styles and `!important` stacks to force the look | Minor |
| Dead links (`href="#"`), buttons that do nothing, forms that fake success | Critical |
| Boilerplate comments, "TODO", placeholder alt text ("image") | Minor |

## The five taste questions (the director answers all five)

1. If the logo were removed, could this be any company's page?
2. Does every element earn its place, or is something there because pages usually have it?
3. Is there one signature idea, unmistakably RHAD, visible above the fold?
4. Is every claim, number, name, face and logo real, sourced and permitted?
5. Would a Singapore SME owner believe a person who knows their business made this?

A "No" to 1, 4 or 5 is an automatic FAIL.

## What good looks like in RHAD work

- One loud moment (the monument type, the cube, the red thread) and a calm editorial page around it
- Specific headlines that name a situation ("Great businesses shouldn't run on 'I'll remember.'")
- A real mechanism shown working (a labelled example conversation with its illustrative note), not a fake dashboard
- Square geometry, flat surfaces separated by tone, one red used as a field or on the action
- Restraint: fewer sections, each with a composition of its own, each saying one thing once
