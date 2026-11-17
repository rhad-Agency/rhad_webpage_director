#!/usr/bin/env node
// Install the two director agents (ai-slop-director, ux-flow-director) for Claude Code and/or Codex.
// Claude Code: copies *.md to ~/.claude/agents.  Codex: copies *.toml to ~/.codex/agents.
// (When rhad-web is installed as a Claude Code plugin, the agents ship with the plugin and this is not needed.)
// Usage: node install-directors.mjs [--agent claude|codex|both] [--dry-run] [--force] [--check] [--dir <path>]
// Exit 0 when every agent is present and identical to the packaged copy, 3 otherwise.
import { readdirSync, readFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const src = resolve(here, '..', 'director-agents');
const args = process.argv.slice(2);
let agent = 'both', dry = false, force = false, check = false, dirOverride = '';
for (let i = 0; i < args.length; i++) { const a = args[i]; if (a === '--agent') agent = args[++i]; else if (a === '--dry-run') dry = true; else if (a === '--force') force = true; else if (a === '--check') check = true; else if (a === '--dir') dirOverride = args[++i]; }
if (!['claude', 'codex', 'both'].includes(agent)) { console.error('--agent must be claude, codex or both'); process.exit(2); }
if (!existsSync(src)) { console.error(`director-agents folder not found at ${src}`); process.exit(2); }

const targets = { claude: { dir: join(homedir(), '.claude', 'agents'), ext: '.md' }, codex: { dir: join(homedir(), '.codex', 'agents'), ext: '.toml' } };
const list = agent === 'both' ? ['claude', 'codex'] : [agent];
if (dirOverride && list.length > 1) { console.error('--dir needs a single --agent'); process.exit(2); }
const same = (a, b) => readFileSync(a, 'utf8').replace(/\r\n/g, '\n') === readFileSync(b, 'utf8').replace(/\r\n/g, '\n');
let problems = 0;

for (const ag of list) {
  const { dir, ext } = targets[ag]; const dest = dirOverride || dir;
  console.log(`\n[${ag}] ${dest}`);
  for (const f of readdirSync(src).filter((x) => x.endsWith(ext)).sort()) {
    const from = join(src, f), to = join(dest, f);
    if (check || dry) { console.log(`${existsSync(to) ? (same(from, to) ? 'OK     ' : 'DIFFERS') : 'MISSING'}  ${f}`); if (!existsSync(to) || !same(from, to)) problems++; continue; }
    if (existsSync(to) && same(from, to)) { console.log(`OK       ${f} (already installed)`); continue; }
    if (existsSync(to) && !force) { console.log(`SKIP     ${f} (exists and differs, use --force to overwrite)`); problems++; continue; }
    try { mkdirSync(dest, { recursive: true }); copyFileSync(from, to); console.log(`INSTALL  ${f}`); } catch (e) { console.log(`FAILED   ${f}: ${e.message}`); problems++; continue; }
    if (!existsSync(to) || !same(from, to)) { console.log(`FAILED   ${f}: verification after copy failed`); problems++; }
  }
}
if (!check && !dry && list.includes('codex')) console.log('\nCodex: restart Codex, then ask it to "spawn the ai_slop_director agent to review <path>". Subagent workflows are enabled by default in current releases.');
if (!check && !dry && list.includes('claude')) console.log('\nClaude Code: restart or open a new session, then say "Use the ai-slop-director agent to review <path>".');
process.exit(problems ? 3 : 0);
