# RHAD_Web_Skill

Design and build RHAD websites, landing pages and service pages in **Claude Code and Codex**, from a verified brief to a tested page. Brand tokens, fonts, logos and components are built in. Professional design, motion and 3D skills are installed alongside (impeccable, taste-skill, ui-ux-pro-max, GSAP, three.js, Remotion, HyperFrames, scroll-craft). Ask for a scrollable or scroll-driven page and it runs in scroll-craft mode. **Two read-only director agents gate the work: an AI-slop director and a UX-flow director.**

Covers RHAD (agency), RHAD45 (product line, with its two documented directions) and EDGE-style campaign pages.

> **Keep this repository private.** It ships internal brand guidance, RHAD45 source documents, client names and reference creative. See [Privacy](#privacy).

## How it works

1. **Verify, never assume.** The skill checks your first message for brand, page type, information, goal, target platform and audience. It asks about every gap, reads the brief back and waits for your yes.
2. **Discover, plan, design, build.** Page job, section map, conversion path and a signature idea first. Then compositions, copy, motion plan, then the build from the starter and tokens.
3. **Verify with evidence.** `web-lint.mjs` (accessibility, brand tokens, slop patterns, honesty), `shoot.mjs` (five widths, rendered at the exact viewport width, with a measured probe), then the directors.
4. **Directors gate the work.** Both must return PASS before anything is shown as ready. Up to 3 rounds each. Only you can overrule a finding, in writing.
5. **You critique at six checkpoints** (brief, page plan, design and copy, built page, final pack, launch). Nothing is final or deployed without your explicit yes.

### The directors

| Agent | Only job | Reads | Returns |
|---|---|---|---|
| `ai-slop-director` | Keep AI slop, generic design and fake proof out | The page, lint, screenshots at 360 and 1440, `impeccable detect` | PASS or FAIL, taste questions, findings with evidence and the minimum fix |
| `ux-flow-director` | Make the experience as smooth as possible | The journey at 390 px, probe metrics, Lighthouse, forms, motion, accessibility | PASS or FAIL, friction log (Blocker, Major, Minor), measured budgets |

Both are **read-only**: in Claude Code by a tool allowlist (`Read, Glob, Grep, Bash`) and a denylist of edit tools; in Codex by instruction, because Codex agent files cannot set their own sandbox (they inherit the session's). Rubrics: `references/ai-slop-catalogue.md` and `references/ux-standards.md`. If subagents are not available, the main agent runs the same brief inline (`references/directors/*.md`).

## One skill, two agents

Both agents read the same `SKILL.md` folder. Only the packaging differs.

| | Claude Code | Codex |
|---|---|---|
| Skills folder | `~/.claude/skills` | `~/.agents/skills` |
| Plugin manifest | `plugins/rhad-web/.claude-plugin/plugin.json` | `plugins/rhad-web/.codex-plugin/plugin.json` |
| Marketplace | `.claude-plugin/marketplace.json` | `.agents/plugins/marketplace.json` |
| Directors | `plugins/rhad-web/agents/*.md` (plugin) or `~/.claude/agents` | `plugins/rhad-web/codex-agents/*.toml`, installed to `~/.codex/agents` |
| Skill metadata | not used | `skills/rhad-web/agents/openai.yaml` |
| Call a director | "Use the ai-slop-director agent to review ./site" | "Spawn the ai_slop_director agent to review ./site" |

## Install

### 1. Installer script (recommended): skill, directors and dependencies

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File install.ps1 -DryRun            # preview, changes nothing
powershell -ExecutionPolicy Bypass -File install.ps1                    # auto-detect Claude Code and Codex
powershell -ExecutionPolicy Bypass -File install.ps1 -Agent codex       # claude | codex | both | auto
```

macOS and Linux:

```bash
bash install.sh --dry-run
bash install.sh                    # auto-detect
bash install.sh --agent codex      # claude | codex | both | auto
```

The installer copies the skill, installs the directors (`~/.claude/agents`, `~/.codex/agents`), then the third-party dependencies. **Every install is verified.** A failure gets its reason, a specific next step and an exact retry command; in an interactive terminal it offers to retry (up to 5 rounds). It exits with code 3 if anything failed. Options: `-Force` overwrites installed copies, `-SkillsDir <path>`, `-SkipDeps`, `-Only a,b`, `-Skip a,b` (PowerShell); `--force`, `--skip-deps`, `SKILLS_DIR=<path>` (bash).

### 2. Plugin marketplace

Claude Code (the plugin ships the directors):

```bash
claude plugin marketplace add <your-org>/RHAD_Web_Skill
claude plugin install rhad-web@rhad-web-skill
```

Codex:

```bash
codex plugin marketplace add <your-org>/RHAD_Web_Skill
```

Then enable `rhad-web` in the Codex plugin list. **Codex plugins are not documented as shipping agent files**, so also run the installer (or `node plugins/rhad-web/skills/rhad-web/scripts/install-directors.mjs --agent codex`) to put the director agents in `~/.codex/agents`. Private repo: sign in first.

### 3. Single `.skill` file

```bash
node tools/build-skill.mjs        # writes dist/rhad-web.skill
```

Unzip into `~/.claude/skills/` or `~/.agents/skills/`, then run `node <skill>/scripts/install-directors.mjs --agent claude|codex|both` and the installer inside it for dependencies.

After any install, restart the agent and check:

```bash
node <skills folder>/rhad-web/scripts/preflight.mjs
```

## Use

Ask Claude Code or Codex:

- "Design a RHAD service page for our SEO service."
- "Build a RHAD45 landing page for the review offer."
- "Redesign this page: https://..."
- "Review ./site with the AI-slop and UX directors."

Scaffold a project by hand:

```bash
node <skill>/scripts/new-page.mjs ./my-page --type service --brand rhad     # or --type lp, --brand rhad45
node <skill>/scripts/web-lint.mjs ./my-page --brand rhad
node <skill>/scripts/shoot.mjs ./my-page --probe
```

## Third-party dependencies

Commands for each agent live in `plugins/rhad-web/skills/rhad-web/scripts/skills-manifest.json`; reasons in `references/skills-registry.md`.

| Dependency | Source | Used for |
|---|---|---|
| impeccable | github.com/pbakaus/impeccable | Critique, `detect`, `PRODUCT.md` and `DESIGN.md` |
| taste-skill | github.com/Leonxlnx/taste-skill | Art-direction method, look-and-fix loop |
| ui-ux-pro-max | github.com/nextlevelbuilder/ui-ux-pro-max-skill | UX and accessibility data |
| gsap-skills | github.com/greensock/gsap-skills | GSAP animation |
| three-agent-skills | github.com/emalorenzo/three-agent-skills | three.js and React Three Fiber (no licence declared: check) |
| remotion, hyperframes | remotion-dev/skills, heygen-com/hyperframes | Video assets |
| scroll-craft | github.com/nateherkai/scroll-craft (MIT) | Scroll-driven pages: grammars, scroll engine, hero depth, scroll-position checks |
| playwright-cli, ffmpeg | microsoft/playwright-cli, ffmpeg.org | Optional: browser checks, exact screenshot crop, media |
| Node 22+, Chrome or Edge | | Scripts and screenshots |

## Troubleshooting

- **A third-party install failed.** Read the reason and next step it prints, then retry only the failures: `install.ps1 -Agent <a> -Only id1,id2 -Yes` (or `ONLY="id1 id2" bash install.sh --agent <a> --yes`). Everything except the directors and a browser is optional for the main skill.
- **Preflight says ffmpeg or playwright-cli are missing but they work in your terminal.** Agent shells can have a shorter PATH. Set `FFMPEG_PATH`, `FFPROBE_PATH`, `PLAYWRIGHT_CLI_PATH` to the full file paths.
- **Screenshots look cropped or the page seems 500 px wide on a phone.** `shoot.mjs` renders local pages inside an iframe of the exact width (headless Chrome will not make a window narrower than about 500 px) and crops with ffmpeg. Without ffmpeg the shot keeps a white margin.
- **Fonts fall back in screenshots.** Fonts do not load over `file://`; use `shoot.mjs`, which serves the folder on a temporary localhost server.
- **Directors not found in Codex.** Restart Codex. Check `~/.codex/agents/ai_slop_director.toml` exists. Ask: "Spawn the ai_slop_director agent to review ./site".

## Develop

```bash
node tools/build-agents.mjs      # after editing references/directors/*.md
node tools/validate.mjs          # repo checks, same as CI (add --with-browser locally)
node tools/build-skill.mjs       # build dist/rhad-web.skill
```

Read `AGENTS.md` first. The agent files are generated; never edit them by hand.

## Privacy

This repo contains RHAD45 handoff and strategy documents, RHAD EDGE design documents, client names, logos and fonts, and reference creative and screenshots from RHAD sites. No credentials, API keys or personal contact details are included, and `validate.mjs` fails the build on key-like strings. Keep it a **private** repository. Before ever making it public, remove `references/sources/`, the screenshots in `assets/references/` and the imagery in `assets/imagery/`.

## Licence

See `LICENSE` (all rights reserved by default) and `THIRD_PARTY_NOTICES.md`.
