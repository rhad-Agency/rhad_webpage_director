# UX standards (the UX Flow Director's rubric)

Smooth means a visitor reaches the page's primary action without friction, confusion or delay, on a mid-range phone on a normal Singapore mobile connection. Every item below has a test. Prefer a measurement to an opinion.

Severity: **Blocker** stops a visitor or breaks the promise of the page. **Major** costs conversions or excludes users. **Minor** is polish. FAIL on any Blocker, or 3 or more Majors, or any budget missed by more than 25 percent.

## 1. Journey

| Standard | Test | Sev if failed |
|---|---|---|
| The primary action is reachable in one tap or one scroll from any point | Count taps and scrolls on a 390 px screenshot sequence | Blocker if not reachable at all, Major if 3+ steps |
| Every call to action goes to the form or action, not a section that makes the visitor search | Follow each CTA in the code and the preview | Major |
| Product or option CTAs pre-fill the form, announce the change, never auto-submit | Read the handler, test it | Major |
| No dead ends: every state (success, error, empty, offline) offers a next step | Walk each state | Major |
| The primary action does not compete with a second primary | Count filled primary buttons per viewport | Minor |

## 2. Hierarchy and scanning

| Standard | Test | Sev |
|---|---|---|
| In 5 seconds a first-time visitor can say what this is, who it is for and what to do | Read the first viewport at 390 px and 1440 px | Major |
| One H1 stating the page's promise. Headings form a logical outline | web-lint heading checks | Major |
| Each section says one thing, once | Read the page top to bottom for repeats | Major |
| Line length 45 to 75 characters for body text; paragraphs 2 to 3 sentences | CSS `max-width`, screenshots | Minor |
| Price, inclusions and exclusions sit together, in plain view, near the action | Read the pricing area | Major |

## 3. Navigation

| Standard | Test | Sev |
|---|---|---|
| Header is compact on phones; sticky elements together use under 20 percent of the viewport height | Measure at 390 x 800 | Major |
| The primary call to action stays visible in the phone header or sticky bar, not only inside a menu, and repeats after the main proof or process section on long pages | Read the 390 screenshot | Minor |
| Mobile menu is a disclosure button with `aria-expanded` and `aria-controls`, closes on Escape and on navigation, returns focus, hidden links leave the tab order | Read JS, keyboard test | Major |
| In-page links land with the target visible, not under a sticky header (`scroll-margin-top`) | Click through | Major |
| A skip link exists and works | Tab once on load | Major |
| The logo links home (or to the top on a one-page site) | Read markup | Minor |

## 4. Forms

| Standard | Test | Sev |
|---|---|---|
| Persistent visible labels. No placeholder-as-label | Read markup | Major |
| Only the fields needed for the next step. Optional fields marked optional | Count fields | Major |
| Correct `type`, `autocomplete`, `inputmode`. International phone input accepted. No country allowlist surprises | Read markup | Major |
| 48 px controls, 44 px minimum tap targets with space between | Measure in the preview | Major |
| Errors written under the field, linked with `aria-describedby`, `aria-invalid` set after validation; focus moves to the first error or an error summary | Trigger errors, keyboard test | Major |
| Entered values survive an error, a failed request and a reload of the same session where feasible | Fail the request on purpose | Blocker |
| Pending state disables repeat sends and labels the button; the rest of the page stays usable | Click twice fast | Major |
| Success appears **only** after a confirmed receipt from the real endpoint; never from a timer, `localStorage` or a mock response | Read the handler | Blocker |
| The page states what happens next and what does not (for example "sending this form does not book a slot") | Read the copy | Major |
| Privacy link is real and configured. No fake policy text | Follow it | Blocker when the page is claimed ready to launch, Major at the preview stage |
| The form fails safe without scripts: `method="post"` and a real `action`, or a no-script contact line. A GET submit that puts name, email or phone in the URL is a defect | Block scripts, submit | Major |
| Failure and recovery messages point to a contact route that exists on the page (WhatsApp, phone or email as the brief states) | Read the messages, find the route | Major |
| A request that never returns cannot hang the form: timeout (about 15 s) and a retry path | Read the handler | Minor |

## 5. States and feedback

| Standard | Test | Sev |
|---|---|---|
| Every interactive element has hover, focus-visible, active and disabled states that are visible and distinct | Tab through, hover, inspect CSS | Major |
| Focus indicator is at least 3:1 against adjoining colours and never removed (`outline: none` without a replacement) | web-lint, keyboard test | Major |
| Loading, empty and error states are designed, not left to browser defaults | Read code | Minor to Major |
| Buttons look like buttons, links look like links. Nothing clickable is a bare `<div>` | web-lint | Major |
| Feedback arrives within 100 ms of an action, with progress shown for anything over 1 s | Test | Major |

## 6. Motion

| Standard | Test | Sev |
|---|---|---|
| **Nothing is hidden until scrolled.** Reveal effects start from a visible resting state. Content is readable with scripts blocked and in a full-page screenshot | Take a full-page screenshot with `scripts/shoot.mjs`, compare against what a visitor sees | Blocker |
| `prefers-reduced-motion` is honoured: no autoplay, no parallax, no scroll-linked transforms; end states shown | Read CSS and JS, run with `--reduced-motion` | Blocker |
| No scroll-jacking, no pinned sections that trap scrolling, no custom scrollbars | Scroll test | Major (Blocker if it traps) |
| UI motion 120 to 300 ms with decelerating easing; entrance reveals at most 12 to 24 px of travel; nothing blocks input | Read the tweens | Minor to Major |
| Auto-advancing content (carousels, tabs, marquees) can be stopped by the visitor's action (pause on hover and focus), never traps focus, and has a static fallback | Test | Major |
| Looping animation does not run offscreen or in background tabs | Read code | Minor |

## 7. Performance (targets on a mid-range phone, 4G, cold cache)

| Budget | Target | Fail threshold (25 percent over) |
|---|---|---|
| Largest Contentful Paint | 2.5 s or less | 3.1 s |
| Interaction to Next Paint | 200 ms or less | 250 ms |
| Cumulative Layout Shift | 0.1 or less | 0.125 |
| Total JavaScript | 150 kB compressed or less for a campaign page (3D pages: 350 kB plus a justified model budget) | 190 kB |
| Initial page weight | 1.5 MB or less above the fold, hero image 200 kB or less | 1.9 MB |
| Fonts | 2 families, variable files or 4 static weights, `font-display: swap`, preload the display face used in the hero | n.a. |

| Standard | Test | Sev |
|---|---|---|
| Images are WebP or AVIF, sized to use, `width` and `height` set, `loading="lazy"` below the fold, hero not lazy | web-lint, network panel | Major |
| No layout shift from images, fonts or late-injected content | probe CLS | Major |
| Third-party scripts are justified, deferred, and none block render | Read markup | Major |
| 3D, video and heavy animation load after first paint and are skipped on reduced motion, save-data and small screens where the static version tells the story | Read code | Major |
| The page works with JavaScript slow or failed: content and the primary action are in the HTML | Block scripts, screenshot | Blocker |

## 8. Accessibility (WCAG 2.2 AA)

| Standard | Test | Sev |
|---|---|---|
| Text contrast 4.5:1, large text 3:1, UI components and focus 3:1. Brand red `#D90A2C` on white is about 4.9:1: fine for large text and 17 px+ text, check small text | Compute | Major |
| Keyboard reaches and operates everything in a logical order; no traps | Tab through | Blocker |
| Semantic landmarks (`header`, `nav`, `main`, `footer`), one H1, buttons are `<button>`, links are `<a href>` | web-lint | Major |
| Every image has meaningful `alt` or `alt=""` if decorative; icons that carry meaning have names | web-lint | Major |
| Target size at least 24 x 24 CSS px (WCAG 2.2) and 44 px preferred on touch | Measure | Major |
| Reflow works at 320 px width and 200 percent zoom with no horizontal scroll or clipped text | Probe, zoom | Major |
| No information by colour alone; status text accompanies colour | Read | Minor |
| Live regions announce form status and dynamic changes politely | Read | Minor |
| `lang` set; `title` unique and meaningful; no `user-scalable=no` | web-lint | Major |
| Video has captions or a transcript; no audio autoplay | Read | Major |

## 9. Responsiveness

| Standard | Test | Sev |
|---|---|---|
| Validated at 360, 390, 768, 1024 and 1440 px and at 200 percent zoom | `shoot.mjs` | Major |
| No horizontal overflow at any width | probe overflow | Major |
| Phone layouts are separate compositions, not squashed desktops. Body copy never below 16 px | Screenshots | Major |
| Touch targets spaced so adjacent taps do not collide | Screenshots | Minor |
| Sticky bars and chat buttons never cover content or the form | Screenshots | Major |

## 10. Content and microcopy

| Standard | Test | Sev |
|---|---|---|
| Buttons say what happens ("Arrange my review", not "Submit") | Read | Minor |
| Error text says what happened and what to do next, in plain words | Read | Major |
| No jargon the audience would not use; British or Singapore English consistently | Read | Minor |
| Claims are conditional where they must be (price, grants, outcomes) | Read against the brand file | Blocker where regulated |
| Contact options are real: a working WhatsApp link, phone, email as the brief states | Click | Major |

## 11. Trust and recovery

| Standard | Test | Sev |
|---|---|---|
| Proof is real, labelled and close to the claim it supports. Agency credentials are labelled as such | Read | Blocker if invented |
| A custom 404 and a useful no-JS message exist for multi-page sites | Test | Minor |
| Cookie and consent handling uses the most privacy-preserving default; no consent banner that blocks the page | Read | Major |
| Analytics events carry no names, emails, phone numbers or free text | Read the adapter | Blocker |

## How to test quickly

1. `node scripts/shoot.mjs <folder> --probe` for screenshots at five widths, overflow, errors, fonts, layout shift.
2. `node scripts/shoot.mjs <folder> --probe --reduced-motion` and compare.
3. `node scripts/web-lint.mjs <folder> --brand <brand>` for markup and accessibility.
4. Keyboard pass: Tab from the top; reach the primary action; open and close the menu with Escape; submit the form empty; submit it with a failing endpoint.
5. Lighthouse against a local preview for performance, accessibility, best practices and SEO scores. Treat scores as a guide; the budgets above are the standard.
