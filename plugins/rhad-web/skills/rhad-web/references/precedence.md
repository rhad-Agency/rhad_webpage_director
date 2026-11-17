# Precedence: when skills and tools disagree

Order, highest first:

1. The user's explicit instruction in this conversation
2. This skill's brand files (`brand-rhad-web.md`, `rhad45-web.md`, `web-design-system.md`, `copy-web.md`, `imagery-web.md`, `motion-and-3d.md`)
3. This skill's hard rules, `ai-slop-catalogue.md` and `ux-standards.md`
4. The directors' verdicts (only the user can overrule one, per finding, in writing)
5. Companion skills' structure and craft advice
6. Companion skills' defaults

Companion skills supply **method**. This skill supplies **identity and standards**. Take technique, checklists and vocabulary from them. Never take palette, fonts, tone, motion numbers or imagery style.

## Known conflicts

| Companion | Its default | RHAD answer |
|---|---|---|
| impeccable | Proposes a design direction, palette and fonts for the product | The direction is RHAD. Use it for critique, hierarchy, spacing, accessibility, `detect`, and its `PRODUCT.md` and `DESIGN.md` schema. Pass it the tokens |
| taste-skill | Picks an art direction from a library and enforces its own house style | Keep the method (look-and-fix loop, real-browser inspection). Ignore its palette, type and layout directions. Where it forbids something RHAD does, RHAD wins and the reason is written in `DESIGN.md` |
| ui-ux-pro-max | Suggests style, palette, fonts and stack per product type | Ignore palette, font and style suggestions. Keep UX, accessibility and chart guidance |
| awesome-design (DESIGN.md library) | "Design like Stripe/Linear/Apple" | Reference for structure and rigour only. Never copy another brand's look |
| gsap-skills | Teaches the API and common patterns | Keep. Apply `motion-and-3d.md` for timing, reduced motion and no scroll-jacking |
| three-agent-skills | Best practices for three.js and R3F | Keep for performance and correctness. 3D is allowed only by the decision test |
| remotion, hyperframes | Video authoring contracts and defaults (including `power3.out` and fade-up house defaults) | Keep their render contracts. Override timing and curves with `motion-and-3d.md` |
| Any skill | Suggests gradients, glass, glow, shadows, pill badges, icon cards, stock imagery | Not allowed in RHAD pages unless a brand file allows the specific use |
| Any skill | Wants to deploy, push, publish or submit | Not without the user's explicit yes |
| Any skill | Suggests a Tailwind default palette or shadcn defaults | Tokens only |

If a conflict is not listed, choose the brand and the standards, and tell the user in one line what you overrode.
