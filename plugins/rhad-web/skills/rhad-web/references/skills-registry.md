# Companion skills, agents and tools

`scripts/preflight.mjs` checks all of these for Claude Code and Codex. `scripts/install-skills.ps1` / `.sh` installs what is missing, verifies each item and offers a retry on failure. Ask the user before installing. Commands per agent live in `scripts/skills-manifest.json`. `<agent>` is `claude-code` or `codex` for the `skills` CLI.

## Installed by the script

| Name | Source | Install command | Used for |
|---|---|---|---|
| **impeccable** | github.com/pbakaus/impeccable | `npx impeccable install` (interactive: pick your agent, say yes to the design hook) | Critique, audit, polish, `detect` for slop, `PRODUCT.md` and `DESIGN.md` |
| **taste-skill** | github.com/Leonxlnx/taste-skill | `npx skills add https://github.com/Leonxlnx/taste-skill --skill design-taste-frontend -g -a <agent> -y` | Art-direction method, real-browser look-and-fix loop |
| **ui-ux-pro-max** | github.com/nextlevelbuilder/ui-ux-pro-max-skill | `npm install -g ui-ux-pro-max-cli`, then `uipro init --ai claude -g` or `--ai codex -g` (also adds banner-design, brand, design, design-system, slides, ui-styling) | UX and accessibility data, chart and stack guidance |
| **gsap-skills** | github.com/greensock/gsap-skills | `npx skills add https://github.com/greensock/gsap-skills -g -a <agent> -y` | GSAP core, timelines, ScrollTrigger, plugins, React |
| **three-agent-skills** | github.com/emalorenzo/three-agent-skills (no licence declared in the repository metadata, check before commercial use) | `npx skills add emalorenzo/three-agent-skills -g -a <agent> -y` | three.js and React Three Fiber best practices |
| **remotion** | github.com/remotion-dev/skills | `npx skills add remotion-dev/skills -g -a <agent> -y` | React-built video for hero loops and promos |
| **hyperframes** | github.com/heygen-com/hyperframes | `npx hyperframes skills update` | HTML-built video |
| **playwright-cli** | github.com/microsoft/playwright-cli | `npm install -g @playwright/cli@latest`, then `playwright-cli install --skills` | Browser checks and screenshots (optional: `shoot.mjs` needs only Chrome or Edge) |
| **ffmpeg, ffprobe** | ffmpeg.org | `winget install -e --id Gyan.FFmpeg`, `brew install ffmpeg` | Optimising video and images (optional) |

## Director agents

| Agent | Claude Code | Codex |
|---|---|---|
| `ai-slop-director` | Plugin `agents/` (namespaced `rhad-web:ai-slop-director`) or `~/.claude/agents` | `~/.codex/agents/ai_slop_director.toml` |
| `ux-flow-director` | Plugin `agents/` (namespaced `rhad-web:ux-flow-director`) or `~/.claude/agents` | `~/.codex/agents/ux_flow_director.toml` |

Installed by `scripts/install-directors.mjs` (also run by the root installer). Both are read-only by instruction and, in Claude Code, by a tool allowlist. Codex custom agents cannot set their own sandbox; they inherit the parent session's, so run the review in a session you have not given write access you do not want used, and rely on the "do not edit files" instruction. The directors' full rubrics are `directors/*.md`, which the main agent can also run inline if subagents are unavailable.

## Already common in RHAD setups (use if present)

`frontend-design`, `build-premium-website`, `website-builder`, `awesome-design`, `design-system`, `img2threejs`, `media-use`, `playwright-cli`, `seo-page`, `seo-technical`, `seo-schema`, `seo-audit`, `seo-content`, `meme-monday` (RHAD account only).

## Which tool at which step

| Step | Tools |
|---|---|
| Discover | `shoot.mjs`, `impeccable detect`, playwright-cli |
| Plan | This skill's `page-types.md`; ui-ux-pro-max for UX data |
| Design direction | taste-skill method, impeccable critique vocabulary, ui-ux-pro-max |
| Build | Templates, GSAP skills, three-agent-skills, remotion or hyperframes for video |
| Verify | `web-lint.mjs`, `shoot.mjs --probe`, Lighthouse, `impeccable detect`, the two directors |
| SEO | `seo-and-schema.md`, seo skills if present |

## Safety

Everything the installer pulls is third-party code run on the user's machine. Each command is printed first. Never add a source the user has not named.
