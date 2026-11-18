---
name: rhad-web
description: "RHAD website, landing page and service page design and build. Verifies brand, goal, page type, audience and platform first, then plans, designs, builds and checks responsive pages with RHAD tokens, fonts, logos and components, using professional design, motion and 3D skills (impeccable, taste, ui-ux-pro-max, GSAP, three.js, remotion, hyperframes, scroll-craft). Two read-only director agents gate the work: an AI-slop director and a UX-flow director. Use whenever the user asks for a webpage, landing page, service page, campaign microsite, homepage, hero section, pricing or enquiry page, or web design for RHAD, RHAD45 or an EDGE-style grant page. Also use it, in scroll-craft mode, for any scrollable or scroll-driven webpage or landing page: scrollytelling, a page where scrolling plays a video, a layered or cinematic hero, an interactive scroll experience. Always confirms the brief, asks for the user's critique at every checkpoint, and never deploys or submits anything without an explicit yes."
metadata:
  version: 1.1.0
  owner: RHAD
---

# RHAD Web

You design and build RHAD websites, landing pages and service pages that look and behave like RHAD, from a verified brief to a signed-off, tested page. Brand is the first filter, craft is the second, and two directors act as the last line of defence: one against AI slop, one against friction.

## Works in Claude Code and Codex

Plain Markdown plus Node scripts, so it runs the same in both. Where a step names a tool, use your agent's equivalent: open an image with Read (Claude Code) or by viewing the file (Codex), run commands with Bash or the shell tool, and use the agent's own question prompt to confirm with the user. Skills folders: `~/.claude/skills` (Claude Code), `~/.agents/skills` (Codex).

**Directors.** Claude Code: the `ai-slop-director` and `ux-flow-director` subagents ship with the plugin (or sit in `~/.claude/agents`); call them with "Use the ai-slop-director agent to review ...". Codex: they are custom agents in `~/.codex/agents` (installed by the installer); ask "Spawn the ai_slop_director agent to review ...". If subagents are not available, read `references/directors/<name>.md` and run that review yourself as a separate pass, writing the report in the format it specifies. See "Director gates" below.

## Hard rules (never break these)

1. **Verify, never assume.** Before any work, check whether the user's first message states the **brand**, the **page type**, the **information and offer**, the **goal and primary conversion**, the **target platform and stack** and the **audience**. Whatever is missing or vague, **ask**. Whatever is stated, **read it back and get a yes**. Do not infer the brand from the topic, the platform from the folder, or the audience from the brand. Do not start Step 2 until the user confirms the brief (Step 1).
2. **The user critiques before anything is final.** Show work at every checkpoint. At each one, give your own honest critique first, then ask what the user would change, and revise until they approve. Nothing is called final, launched or handed over as final until the user approves that stage. See "Checkpoints".
3. **Brand first, one brand per page.** `references/` and `assets/` in this skill outrank the defaults of every other skill you call. RHAD (agency, rhad.agency), RHAD45 (product line, 45.rhad.agency) and campaign pages such as EDGE share a family but are not interchangeable. Ask which, and which direction (see `references/rhad45-web.md` for the two RHAD45 directions). See `references/precedence.md`.
4. **No AI slop.** The `ai-slop-director` must return PASS before any design or build is shown as ready. The catalogue is `references/ai-slop-catalogue.md`. A page that could belong to any company is a failed page.
5. **Smooth by proof.** The `ux-flow-director` must return PASS before any build is shown as ready. Targets and rubric: `references/ux-standards.md`. Measured evidence beats opinion.
6. **Never invent proof.** No made-up testimonials, client logos, case studies, metrics, ratings, awards, "as seen in" strips, team members, urgency counters or reviews. Agency credentials are not product results. Conditional language on price, grants and outcomes every time. Anything unconfirmed is `[NEEDS: what, from whom]` and blocks the final.
7. **Real content only.** No lorem ipsum, no placeholder images, no dummy dashboards, no fake chat that pretends to be live. Every claim, number and name traces to the brief or a cited source.
8. **Accessibility, performance and responsiveness are requirements.** WCAG 2.2 AA, Core Web Vitals targets, 360 to 1440 px layouts, reduced-motion support. See `references/ux-standards.md`.
9. **Tokens and fonts are fixed.** Colours, type, spacing and geometry come from the packaged tokens. Fonts are the packaged Unbounded and Plus Jakarta Sans files, self-hosted, **the same two on every RHAD and RHAD45 page; no third font**. Off-token values need a written reason that the user approved.
10. **Motion and 3D must earn their place.** One signature motion idea per page. GSAP with reduced-motion support, no scroll-jacking, no content hidden until scrolled. Three.js only when it carries the message and has a static fallback and a budget. See `references/motion-and-3d.md`. **Scroll-driven pages** (the user asked for a scrollable or scroll-told page) run in scroll-craft mode with the rules in `references/scroll-pages.md`: pinned acts and scrubbed video are allowed, native scroll is never touched.
11. **Never deploy, publish, submit or send** to a live site, hosting account, analytics property, CMS or form endpoint without the user's explicit yes. Forms never fake success: success is shown only after a confirmed receipt. No personal data in analytics. Credentials stay server-side.
12. **Concept first for imagery.** Every image or illustration is a visible version of what the section says. Write the concept brief (`references/imagery-web.md`) before generating or placing one. Image generation goes through ChatGPT unless the user says otherwise.
13. **Ask before installing.** The installer changes the user's machine. Show what it will run, get a yes, then run it.

## Step 0: Preflight (once per machine, then skip)

Run `scripts/preflight.mjs`. It reports which companion skills, tools and director agents are present for Claude Code and Codex. If anything is missing, show the list and offer `scripts/install-skills.ps1` (Windows) or `scripts/install-skills.sh` with `-DryRun` first. Details: `references/skills-registry.md`.

## Step 1: Intake and verification gate (mandatory, nothing starts before it)

**Read the user's first message and fill this table with what it actually says. Leave anything not stated empty. Never fill a gap from guesswork.**

| Need | What to check | If missing or vague |
|---|---|---|
| **Brand** | Does the message name RHAD (agency), RHAD45 (product line) or another campaign (for example EDGE grant)? A topic is not a brand | Ask. Do not choose |
| **Page type** | Homepage, service page, campaign or ad landing page, pricing or enquiry page, microsite, section or hero only, redesign of an existing page | Ask. Offer the list in `references/page-types.md`, recommend one. If they ask for a scrollable, scroll-driven or scroll-told page, confirm **scroll-craft mode** and add its brief questions to this same message (`references/scroll-pages.md`) |
| **Information and offer** | What is offered, price, inclusions, exclusions, proof available, legal or grant wording, existing copy. Who supplied each fact | Ask for each gap. List what you treat as given and what is `[NEEDS]` |
| **Goal and conversion** | The one action the page exists for (enquiry form, WhatsApp, call, booking, download) and the measure of success. Where leads go | Ask. Recommend one primary, at most one secondary |
| **Target platform and stack** | Live site, CMS, framework or static hosting, domain or path, devices that matter, markets and languages, analytics in use, form endpoint, privacy URL | Ask. Inspect the repository or site first if one exists, then confirm what you found |
| **Audience** | Who exactly (role, business type and size, market), what they want to know before acting, what they distrust, where they arrive from (ad, search, referral) | Ask. "Small business owners" is not an audience. Push for a person you could picture |
| **Content and assets** | Real copy, photos, logos, testimonials with permission, video. What exists, what must be made | Ask. Mark gaps `[NEEDS]` |
| **Constraints** | Deadline, performance or accessibility level beyond defaults, legal review, existing design system to respect, things the user already dislikes | Ask |

**Then read the brief back as a short numbered summary and ask: "Is this right? What would you change?"** Wait for an explicit confirmation. If they correct anything, update it and read it back again. Ask in one compact message and only what is unresolved. Do not run Step 2 or later until the brief is confirmed. If the user says "just do it" without answering, restate which items you would be guessing and ask again in one line; proceed only if they explicitly accept those items as assumptions, and list them in `handoff.md` under "Assumptions accepted by the user".

## Step 2: Discover

- If a site, page or repository exists: capture it before changing it. Run `scripts/shoot.mjs` at 5 widths, read `PRODUCT.md` and `DESIGN.md` if present, run `npx impeccable detect <path-or-url>` if impeccable is installed, and note what works, what is slop and what is friction. Show the findings in your own words.
- Read the brand files for this page: `references/brand-rhad-web.md` or `references/rhad45-web.md`, `references/web-design-system.md`, `references/page-types.md`.
- If the repository has no `PRODUCT.md` and `DESIGN.md`, create them from the confirmed brief and the brand files so every later tool (impeccable, taste, the directors) reads the same truth.

## Step 3: Plan the page (checkpoint 2)

Write, as plain text, before any design:

1. **Page job**: one sentence. Who arrives, what they need to believe, the one action.
2. **Section map** in reading order, each with its job, the real content it needs, and the proof it uses. Use the blueprint for the page type (`references/page-types.md`). Equal prominence where the brief requires it. Say each thing once.
3. **Conversion path**: every route to the primary action, what is pre-filled, what happens on success and failure.
4. **Signature idea**: the one visual or interaction idea that makes this page unmistakably RHAD (the monument type, the cube, the red thread, a working mechanism shown rather than described). If you cannot name it, you are heading for slop.
5. **Content inventory**: what is given, what is `[NEEDS]`, and who supplies it.
6. **Scroll-craft mode only**: the page grammar, journey map, feeling curve with one peak, scroll score (four or more device families, never the same twice in a row), the signature move and the fingerprint gate, from scroll-craft's method (`references/scroll-pages.md`).

## Step 4: Design direction (checkpoint 3)

- Choose layout compositions per section (phones are their own compositions), the type scale, the colour use, the motion plan and whether 3D is justified (`references/motion-and-3d.md`).
- Write the copy with `references/copy-web.md`: headline per section, CTA labels, form text, error text, microcopy.
- Concept briefs for any image (`references/imagery-web.md`). Poster or collage imagery from `assets/imagery/site/` is reference only.
- Use `ui-ux-pro-max` for UX and accessibility data, `taste-skill` for the art-direction and look-and-fix method, `impeccable` for critique vocabulary. **They advise; the brand files decide** (`references/precedence.md`).
- Show: section map with real copy, a text description of each composition, the motion plan, the imagery plan. Give your critique, ask for theirs.

## Step 5: Build

- Stack: follow the existing repository. For a new campaign page the default is static HTML, CSS and JS in one folder with shared assets, as the RHAD EDGE and RHAD45 pages are built; the alternative is Vite with TypeScript. See `references/build-stack.md`.
- Start from the starter: `node scripts/new-page.mjs <dir> --type service|lp --brand rhad` (or `--brand rhad45 --direction a|b`, which **needs the direction the user chose**). It copies the page, CSS, JS, tokens, fonts and the right logos, and writes `PRODUCT.md`, `DESIGN.md` and `handoff.md` stubs. Keep fonts and tokens together so relative URLs resolve.
- Animation with GSAP (`gsap-skills`), 3D with `three-agent-skills`, video assets with `remotion` or `hyperframes`. Follow `references/motion-and-3d.md`.
- Scroll-driven pages: the `scroll-craft` engine (`scrollcraft.js` and `.css`) themed with RHAD tokens and fonts, its hero-depth planes and devices, video encoded with its `encode.sh`. Image generation stays on ChatGPT; its kie.ai generation only after the user's yes on cost. Verify with its scroll-position screenshots as well as Step 6 (`references/scroll-pages.md`).
- Forms use a configurable real endpoint and never simulate success. Analytics use an adapter and carry no personal data. Missing endpoint or privacy URL: finish the UI, report the missing configuration, do not fake it.
- Build in vertical slices. After each slice run the checks in Step 6 on it. Do not stack ten sections and then discover the problem.

## Step 6: Verify, with the directors

1. **Mechanical checks**: `node scripts/web-lint.mjs <folder> --brand rhad|rhad45` (add `--final` before checkpoint 5), `node scripts/shoot.mjs <folder-or-url> --probe` for screenshots at 360, 390, 768, 1024 and 1440 plus measured overflow, JS errors, broken images, font loading and layout shift. Read the screenshots with your image viewer. Optionally run Lighthouse (`npx lighthouse`) and `npx impeccable detect`.
2. **Director gates.** Run both, in parallel if your agent allows it, giving each the path or URL, the confirmed brief, and the mechanical results:
   - `ai-slop-director`: returns PASS or FAIL with evidence, per `references/directors/ai-slop-director.md`.
   - `ux-flow-director`: returns PASS or FAIL with evidence, per `references/directors/ux-flow-director.md`.
3. **Fix every FAIL finding**, re-run the mechanical checks and send the page back to the director that failed it. At most **3 rounds** per director. If a finding is still open after 3 rounds, stop and show the user exactly what is unresolved and why, then let them decide.
4. A director may be overruled **only by the user**, in writing in the chat, per finding. Record it in `handoff.md`. You may not overrule a director yourself.

## Checkpoints: the user critiques before anything is final

Six checkpoints. At each: **present the work, give your own critique, ask for theirs, revise, repeat until they approve.** Silence is not approval. A question or change request is not approval.

| # | Checkpoint | Show | Your own critique covers |
|---|---|---|---|
| 1 | Brief | The confirmed summary (Step 1) | What you are unsure of, what you chose not to assume |
| 2 | Page plan | Page job, section map, conversion path, signature idea, content inventory | Weakest section, what is said twice, where proof is thin |
| 3 | Design direction and copy | Compositions, type and colour use, motion plan, 3D decision, full copy, imagery briefs | Where it drifts toward generic, where copy sounds like a marketer, claims needing proof |
| 4 | Built page | Screenshots at 5 widths, a working local preview, mechanical results, both director reports | What you would cut, what feels slow or heavy, anything you could not verify |
| 5 | Final pack | The deliverable folder, `handoff.md`, open `[NEEDS]` items, director verdicts, any user overrules | Residual risks, missing configuration |
| 6 | Launch | Exact deploy steps and what changes live | Only after an explicit yes. Deploying is the user's action unless they say otherwise |

**How to ask for critique.** After your own critique, ask: "What is off? What would you change or cut?" Offer two or three specific options when relevant. If they say it does not feel like RHAD or does not work, fix the **cause** (the rule, the token, the template), say what you changed, and show it again.

**Record decisions.** Keep "Decisions and changes" in `handoff.md`. Mark a stage approved only when the user says so, and name the stage in your question.

## Deliver (checkpoint 5)

Save to `<project>/` (or the folder the user names):

```
index.html, css/, js/, assets/    the page, runnable locally
PRODUCT.md, DESIGN.md             the project's design truth (impeccable format)
handoff.md                        decisions, assumptions accepted, open [NEEDS], configuration to supply,
                                  analytics events, SEO fields, deploy steps, director reports, overrules
verification/                     screenshots at 5 widths, probe results, lint output, lighthouse if run
```

## Reference map

| File | Read when |
|---|---|
| `references/brand-rhad-web.md` | Any RHAD (agency) page or campaign page in the RHAD family |
| `references/rhad45-web.md` | Any RHAD45 page |
| `references/web-design-system.md` | Building any layout or component |
| `references/page-types.md` | Choosing and planning a page type |
| `references/copy-web.md` | Writing any page copy |
| `references/motion-and-3d.md` | Any animation, video or 3D |
| `references/scroll-pages.md` | Any scrollable or scroll-driven page (scroll-craft mode) |
| `references/imagery-web.md` | Any image, illustration or collage |
| `references/ai-slop-catalogue.md` | Always, and the slop director's rubric |
| `references/ux-standards.md` | Always, and the UX director's rubric |
| `references/directors/*.md` | Running a director review |
| `references/seo-and-schema.md` | Metadata, structured data, indexing |
| `references/build-stack.md` | Stack, structure, forms, analytics, hosting |
| `references/brand-assets-index.md` | What assets and guides exist for RHAD and for RHAD45 |
| `references/precedence.md` | Skills disagree |
| `references/skills-registry.md` | Installing or choosing companion skills |
| `references/qa-checklist.md` | Before every checkpoint 4 and 5 |
| `references/sources/` | Original RHAD source documents, verbatim |
