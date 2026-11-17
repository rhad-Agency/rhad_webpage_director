#!/usr/bin/env node
// Build dist/rhad-web.skill: the skill (it contains the director agents in director-agents/).
// Works for Claude Code (unzip into ~/.claude/skills) and Codex (unzip into ~/.agents/skills).
// Usage: node tools/build-skill.mjs
import { cpSync, mkdirSync, rmSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skills = join(repo, 'plugins', 'rhad-web', 'skills');
const main = 'rhad-web';
const stage = join(tmpdir(), `rhad-web-build-${process.pid}`);
const out = join(repo, 'dist', `${main}.skill`);

rmSync(stage, { recursive: true, force: true });
mkdirSync(join(stage, main), { recursive: true });
cpSync(join(skills, main), join(stage, main), { recursive: true });
mkdirSync(join(repo, 'dist'), { recursive: true });
rmSync(out, { force: true });

const tries = [
  ['python', ['-m', 'zipfile', '-c', out, main]],
  ['python3', ['-m', 'zipfile', '-c', out, main]],
  ['zip', ['-qr', out, main]],
  ['tar', ['-a', '-cf', out, main]],
];
let ok = false;
for (const [cmd, a] of tries) {
  const r = spawnSync(cmd, a, { cwd: stage, encoding: 'utf8' });
  if (r.status === 0 && existsSync(out)) { ok = true; console.log(`Built with ${cmd}`); break; }
}
rmSync(stage, { recursive: true, force: true });
if (!ok) { console.error('No zip tool found (python, zip or tar -a). Install one and retry.'); process.exit(1); }
console.log(`${out}  ${(statSync(out).size / 1048576).toFixed(2)} MB`);
