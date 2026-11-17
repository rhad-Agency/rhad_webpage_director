#!/usr/bin/env node
// Build the director agents for Claude Code (.md) and Codex (.toml) from ONE source:
//   plugins/rhad-web/skills/rhad-web/references/directors/<name>.md   (frontmatter: name, description; body = the brief)
// Outputs (committed, kept in sync by `--check` in validate and CI):
//   plugins/rhad-web/agents/<name>.md                        Claude Code plugin agents (auto-discovered, namespaced rhad-web:<name>)
//   plugins/rhad-web/codex-agents/<snake_name>.toml          Codex custom agents (copied to ~/.codex/agents by the installer)
//   plugins/rhad-web/skills/rhad-web/director-agents/*       the same files inside the skill, for the .skill zip and install-directors.mjs
// Usage: node tools/build-agents.mjs [--check]
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const plug = join(repo, 'plugins', 'rhad-web');
const skill = join(plug, 'skills', 'rhad-web');
const srcDir = join(skill, 'references', 'directors');
const check = process.argv.includes('--check');

const LOCATE = `## Where the rhad-web skill is

The rubrics, scripts and brand files you need are in the **rhad-web skill folder**. Find it, in this order: \`~/.claude/skills/rhad-web\`, \`~/.agents/skills/rhad-web\`, \`.claude/skills/rhad-web\` or \`.agents/skills/rhad-web\` in the project, a \`plugins/rhad-web/skills/rhad-web\` folder in the repository, or search for a folder containing \`references/ai-slop-catalogue.md\`. Paths such as \`references/...\` and \`scripts/...\` in this brief are relative to that folder. If you cannot find it, say so and stop.

`;

function parse(file) {
  const t = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = t.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error(`${file}: no frontmatter`);
  const get = (k) => (m[1].match(new RegExp(`^${k}:\\s*(.+)$`, 'm')) || [])[1]?.trim();
  return { name: get('name'), description: get('description'), body: m[2].trim() };
}

const outputs = new Map();
for (const f of readdirSync(srcDir).filter((x) => x.endsWith('.md')).sort()) {
  const { name, description, body } = parse(join(srcDir, f));
  if (!name || !description) throw new Error(`${f}: name and description required`);
  const snake = name.replace(/-/g, '_');
  const prompt = `${body}\n\n${LOCATE}`.trimEnd() + '\n';

  // Claude Code: read-only by allowlist and denylist. Plugin agents ignore permissionMode, hooks and mcpServers.
  const claude = `---\nname: ${name}\ndescription: ${JSON.stringify(description)}\ntools: Read, Glob, Grep, Bash\ndisallowedTools: Write, Edit, NotebookEdit\n---\n\n${prompt}`;
  // Codex: custom agent TOML. sandbox_mode cannot be set in an agent file, so the read-only rule lives in the instructions.
  if (prompt.includes("'''")) throw new Error(`${f}: contains ''' which breaks TOML literal strings`);
  const codex = `name = "${snake}"\ndescription = "${description.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"\nmodel_reasoning_effort = "high"\ndeveloper_instructions = '''\n${prompt}\nCodex note: this agent cannot set its own sandbox. Treat the session as read-only for this task: do not edit, create or delete any file, and do not run commands that change state. Report findings only.\n'''\n`;

  outputs.set(join(plug, 'agents', `${name}.md`), claude);
  outputs.set(join(plug, 'codex-agents', `${snake}.toml`), codex);
  outputs.set(join(skill, 'director-agents', `${name}.md`), claude);
  outputs.set(join(skill, 'director-agents', `${snake}.toml`), codex);
}

let drift = 0;
for (const [p, content] of outputs) {
  if (check) { const cur = existsSync(p) ? readFileSync(p, 'utf8').replace(/\r\n/g, '\n') : null; if (cur !== content) { console.log(`OUT OF SYNC  ${p.slice(repo.length + 1)}`); drift++; } }
  else { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, content, { encoding: 'utf8' }); console.log(`wrote  ${p.slice(repo.length + 1)}`); }
}
if (check) { console.log(drift ? `\n${drift} file(s) out of sync. Run: node tools/build-agents.mjs` : `Director agents in sync (${outputs.size} files).`); process.exit(drift ? 1 : 0); }
