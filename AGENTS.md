# Repository guide for coding agents (Codex, Claude Code, others)

This repo packages the **rhad-web** skill (RHAD websites, landing pages and service pages) and its two director subagents as one plugin that works in both Claude Code and Codex.

## Layout

```
.claude-plugin/marketplace.json     Claude Code marketplace (source ./plugins/rhad-web)
.agents/plugins/marketplace.json    Codex marketplace (local source ./plugins/rhad-web)
plugins/rhad-web/
  .claude-plugin/plugin.json        Claude plugin manifest
  .codex-plugin/plugin.json         Codex plugin manifest (skills: ./skills/)
  agents/                           Claude Code subagents (BUILT, do not edit by hand)
  codex-agents/                     Codex custom agents (BUILT, do not edit by hand)
  assets/icon.png, logo.png         Plugin icons (square, 512 px)
  skills/rhad-web/                  The skill, shared by both agents
    SKILL.md  references/  assets/  scripts/  agents/openai.yaml  director-agents/ (BUILT)
    references/directors/*.md       SOURCE of the two director agents
install.ps1, install.sh             Copy the skill to ~/.claude/skills and/or ~/.agents/skills, install directors and dependencies
tools/                              validate.mjs, build-agents.mjs, build-skill.mjs, fixtures/
```

## Rules for changes

1. Run `node tools/build-agents.mjs` after editing a director brief in `references/directors/`, then `node tools/validate.mjs`. Validate must pass before every commit (CI runs it, and `--with-browser` locally).
2. Never edit `agents/`, `codex-agents/` or `director-agents/` by hand. They are generated and checked for drift.
3. Keep the skill agent-neutral: plain Markdown and Node scripts, no Claude-only or Codex-only tool names without naming the equivalent.
4. Bump the version in **all** of: `plugins/rhad-web/.claude-plugin/plugin.json`, `plugins/rhad-web/.codex-plugin/plugin.json`, `.claude-plugin/marketplace.json`, `plugins/rhad-web/skills/rhad-web/SKILL.md` (`metadata.version`) and `CHANGELOG.md`.
5. Codex limits: `interface.displayName` and `shortDescription` at most 30 characters, up to 3 default prompts of at most 128 characters. Validate enforces them.
6. Keep the intake verification gate, the six critique checkpoints, the director gates (3 rounds, user-only overrule) and the no-deploy rule in `SKILL.md`. Do not weaken them.
7. The directors are read-only by design. Do not give them edit tools. Do not let the main agent overrule them.
8. Brand rules live in `references/brand-rhad-web.md` and `references/rhad45-web.md`. Do not mix RHAD, RHAD45 and campaign looks. Never add credentials, personal contact details or client results. Keep the repo private.
9. New dependencies go in `scripts/skills-manifest.json` with a command for both agents and a `fix` hint, in `references/skills-registry.md` and in `THIRD_PARTY_NOTICES.md`.
10. When `web-lint.mjs` gains a rule, add it to `tools/fixtures/slop.html` and to the `want` list in `tools/validate.mjs`.

## Test an install without touching your machine

```bash
SKILLS_DIR=/tmp/skills-test bash install.sh --agent codex --skip-deps --yes
node plugins/rhad-web/skills/rhad-web/scripts/install-directors.mjs --agent claude --dir /tmp/agents-test --check
```
