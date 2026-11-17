#!/usr/bin/env node
// Report which tools and companion skills are present, for Claude Code and Codex. Changes nothing.
// Usage: node preflight.mjs [--json]
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findTool, INSTALL_HINT } from './lib/tools.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const man = JSON.parse(readFileSync(join(here, 'skills-manifest.json'), 'utf8'));
const home = homedir();
const roots = [
  join(home, '.claude', 'skills'), join(home, '.agents', 'skills'),
  join(process.cwd(), '.claude', 'skills'), join(process.cwd(), '.agents', 'skills'),
];
const pluginRoots = [join(home, '.claude', 'plugins'), join(home, '.codex', 'plugins')];

function listSkills() {
  const names = new Set();
  for (const r of roots) if (existsSync(r)) for (const d of readdirSync(r)) names.add(d.toLowerCase());
  const walk = (p, depth) => {
    if (depth > 7 || !existsSync(p)) return;
    let ents; try { ents = readdirSync(p, { withFileTypes: true }); } catch { return; }
    if (ents.some((e) => e.isFile() && e.name === 'SKILL.md')) names.add(p.split(/[\\/]/).pop().toLowerCase());
    for (const e of ents) if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.git') walk(join(p, e.name), depth + 1);
  };
  for (const r of pluginRoots) walk(r, 0);
  return names;
}
const has = (cmd) => { const r = process.platform === 'win32' ? spawnSync('where', [cmd], { stdio: 'pipe', windowsHide: true }) : spawnSync('sh', ['-c', `command -v "${cmd}"`], { stdio: 'pipe' }); return r.status === 0; };

const have = listSkills();
const res = { agents: [], tools: [], skills: [], bundled: [] };
res.agents.push({ id: 'claude', ok: has('claude') || existsSync(join(home, '.claude')) });
res.agents.push({ id: 'codex', ok: has('codex') || existsSync(join(home, '.codex')) });
for (const t of man.tools) {
  const f = findTool(t.id) || (t.id === 'ffprobe' ? null : null);
  res.tools.push({ id: t.id, ok: !!f || (!['ffmpeg', 'ffprobe', 'playwright-cli'].includes(t.id) && has(t.check[0])), path: f?.path, via: f?.via });
}
for (const s of man.skills) res.skills.push({ id: s.id, ok: s.dirs.some((d) => have.has(d.toLowerCase())) });
for (const b of man.bundled) res.bundled.push({ id: b, ok: have.has(b.toLowerCase()) });
res.self = { id: 'rhad-web', ok: have.has('rhad-web') };
// Director agents: Claude Code (~/.claude/agents/*.md or the plugin) and Codex (~/.codex/agents/*.toml)
const dirHas = (d, names, ext) => existsSync(d) && names.every((n) => existsSync(join(d, n + ext)));
const claudeDir = dirHas(join(home, '.claude', 'agents'), ['ai-slop-director', 'ux-flow-director'], '.md');
const codexDir = dirHas(join(home, '.codex', 'agents'), ['ai_slop_director', 'ux_flow_director'], '.toml');
const claudePlugin = have.has('ai-slop-director') || (() => { try { return readdirSync(join(home, '.claude', 'plugins'), { recursive: true }).some((f) => String(f).endsWith('ai-slop-director.md')); } catch { return false; } })();
res.directors = [{ id: 'directors for Claude Code (agents folder or plugin)', ok: claudeDir || claudePlugin }, { id: 'directors for Codex (~/.codex/agents)', ok: codexDir }];

if (process.argv.includes('--json')) { console.log(JSON.stringify(res, null, 2)); process.exit(0); }
const row = (g, name) => { console.log(`\n${name}`); for (const x of res[g]) console.log(`  ${x.ok ? 'OK     ' : 'MISSING'}  ${x.id}${x.ok && x.via && x.via !== 'PATH' ? `   (found at ${x.path}, not on PATH in this shell)` : ''}${!x.ok && INSTALL_HINT[x.id] ? `\n             ${INSTALL_HINT[x.id]}` : ''}`); };
row('agents', 'Agents detected (at least one needed)'); row('tools', 'Tools'); row('skills', 'Companion skills'); row('directors', 'Director agents (install the ones for the agent you use)');
console.log(`\nrhad-web skill itself: ${res.self.ok ? 'found' : 'NOT FOUND in a skills folder'}`);
const missing = [...res.tools, ...res.skills, ...res.directors].filter((x) => !x.ok);
console.log(missing.length ? `\n${missing.length} missing. Preview: install.ps1 -DryRun (Windows) or install.sh --dry-run, add -Agent claude|codex|both` : '\nAll present.');
