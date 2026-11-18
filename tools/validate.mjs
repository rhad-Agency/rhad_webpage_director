#!/usr/bin/env node
// Repo validation for the rhad-web plugin (Claude Code and Codex). Run locally and in CI. Exit 1 on any failure.
// Usage: node tools/validate.mjs [--with-browser]   (--with-browser also runs shoot.mjs on the starter; needs Chrome or Edge)
import { readFileSync, readdirSync, statSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const plug = join(repo, 'plugins', 'rhad-web');
const base = join(plug, 'skills', 'rhad-web');
const withBrowser = process.argv.includes('--with-browser');
let fails = 0;
const fail = (m) => { fails++; console.log(`FAIL  ${m}`); };
const ok = (m) => console.log(`ok    ${m}`);
const rd = (p) => readFileSync(p, 'utf8');
const walk = (d, acc = []) => { for (const e of readdirSync(d, { withFileTypes: true })) { if (['.git', 'node_modules', 'dist'].includes(e.name)) continue; const p = join(d, e.name); e.isDirectory() ? walk(p, acc) : acc.push(p); } return acc; };
const files = walk(repo);
const J = (p) => { try { return JSON.parse(rd(p)); } catch (e) { fail(`invalid JSON ${relative(repo, p)}: ${e.message}`); return null; } };
const node = (args, o = {}) => spawnSync(process.execPath, args, { encoding: 'utf8', ...o });

// 1. Skill frontmatter
{
  const f = join(base, 'SKILL.md'); const fm = rd(f).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) fail('rhad-web: no frontmatter');
  else {
    const name = (fm[1].match(/^name:\s*(.+)$/m) || [])[1]?.trim();
    const desc = (fm[1].match(/^description:\s*([\s\S]*?)(?:\r?\n[a-z]+:|$)/m) || [])[1]?.trim().replace(/^["']|["']$/g, '');
    if (name !== 'rhad-web') fail(`frontmatter name "${name}" must be rhad-web`);
    else if (!desc || desc.length > 1024) fail(`description missing or over 1024 chars (${desc?.length})`);
    else ok(`skill rhad-web (description ${desc.length} chars)`);
  }
}

// 2. JSON, manifests, marketplaces
for (const f of files.filter((p) => p.endsWith('.json'))) J(f);
const cPlug = J(join(plug, '.claude-plugin/plugin.json')), cMkt = J(join(repo, '.claude-plugin/marketplace.json'));
const xPlug = J(join(plug, '.codex-plugin/plugin.json')), xMkt = J(join(repo, '.agents/plugins/marketplace.json'));
for (const p of cMkt?.plugins || []) {
  const src = p.source;
  if (typeof src !== 'string' || !src.startsWith('./')) fail(`claude marketplace: "${p.name}" source must be a ./ path`);
  else if (!existsSync(join(repo, src, '.claude-plugin/plugin.json'))) fail(`claude marketplace: ${src}/.claude-plugin/plugin.json missing`);
  else ok(`claude marketplace -> ${src}`);
}
if (xPlug) {
  const i = xPlug.interface || {}; const need = (c, m) => { if (!c) fail(`codex plugin.json: ${m}`); };
  need(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(xPlug.name || '') && xPlug.name.length <= 64, 'name must be lowercase letters, digits, single hyphens, max 64');
  need(xPlug.version && xPlug.description?.length <= 4000 && xPlug.author?.name, 'version, description (max 4000) and author.name required');
  need(xPlug.skills === './skills/', 'skills must be "./skills/"');
  need(i.displayName?.length <= 30, `displayName max 30 (is ${i.displayName?.length})`); need(i.shortDescription?.length <= 30, `shortDescription max 30 (is ${i.shortDescription?.length})`);
  need(i.longDescription?.length <= 4000 && i.developerName?.length <= 80 && i.category, 'longDescription, developerName and category required');
  const dp = Array.isArray(i.defaultPrompt) ? i.defaultPrompt : [i.defaultPrompt].filter(Boolean); need(dp.length <= 3 && dp.every((s) => s.length <= 128), 'defaultPrompt: max 3 prompts of 128 chars');
  for (const k of ['composerIcon', 'logo']) { const p = i[k]; if (!p?.startsWith('./assets/') || !existsSync(join(plug, p))) fail(`codex ${k} must be an existing ./assets/ file`); else { const b = readFileSync(join(plug, p)); const w = b.readUInt32BE(16), h = b.readUInt32BE(20); w === h && w >= 48 ? ok(`codex ${k} ${w}x${h}`) : fail(`codex ${k} must be square and at least 48px (is ${w}x${h})`); } }
}
for (const p of xMkt?.plugins || []) {
  const path = p.source?.path;
  if (p.source?.source !== 'local' || !path?.startsWith('./') || path.includes('..')) fail('codex marketplace: needs source {"source":"local","path":"./..."} inside the repo');
  else if (!existsSync(join(repo, path, '.codex-plugin/plugin.json'))) fail(`codex marketplace: ${path}/.codex-plugin/plugin.json missing`);
  else if (!['AVAILABLE', 'INSTALLED_BY_DEFAULT', 'NOT_AVAILABLE'].includes(p.policy?.installation) || !p.category) fail('codex marketplace: policy.installation and category required');
  else ok(`codex marketplace -> ${path}`);
}

// 3. Versions match
try {
  const v = { claudePlugin: cPlug?.version, claudeMarketplace: cMkt?.plugins?.[0]?.version, codexPlugin: xPlug?.version, skill: (rd(join(base, 'SKILL.md')).match(/version:\s*([\d.]+)/) || [])[1], changelog: (rd(join(repo, 'CHANGELOG.md')).match(/^## ([\d.]+)/m) || [])[1] };
  new Set(Object.values(v)).size === 1 ? ok(`versions match (${v.skill})`) : fail(`version mismatch: ${JSON.stringify(v)}`);
  if (cPlug?.name !== xPlug?.name) fail('plugin name differs between Claude and Codex manifests');
} catch (e) { fail(`version check: ${e.message}`); }

// 4. Codex skill metadata
const yml = join(base, 'agents/openai.yaml');
if (existsSync(yml)) { const t = rd(yml); /display_name:/.test(t) && /short_description:/.test(t) && /allow_implicit_invocation:/.test(t) ? ok('agents/openai.yaml present') : fail('agents/openai.yaml incomplete'); for (const m of t.matchAll(/icon_(?:small|large):\s*"(\.\/[^"]+)"/g)) if (!existsSync(join(base, m[1]))) fail(`openai.yaml icon missing: ${m[1]}`); } else fail('agents/openai.yaml missing');

// 5. Required rules stay in SKILL.md
const sk = rd(join(base, 'SKILL.md'));
for (const [re, label] of [[/Verify, never assume/, 'verify never assume rule'], [/Step 1: Intake and verification gate/, 'intake gate'], [/## Checkpoints: the user critiques before anything is final/, 'critique checkpoints'], [/ai-slop-director/, 'slop director'], [/ux-flow-director/, 'UX director'], [/at most \*\*3 rounds\*\*|At most \*\*3 rounds\*\*/, 'director round limit'], [/Never deploy, publish, submit or send/, 'no deploy without yes rule']]) re.test(sk) ? ok(`SKILL.md: ${label}`) : fail(`SKILL.md is missing: ${label}`);
const refs = [...new Set([...sk.matchAll(/`((?:references|assets|scripts)\/[A-Za-z0-9_./*-]+)`/g)].map((m) => m[1]))];
for (const r of refs) { if (r.includes('*') || r.endsWith('/')) continue; if (!existsSync(join(base, r))) fail(`SKILL.md references missing file ${r}`); }
ok(`${refs.length} paths referenced in SKILL.md checked`);

// 6. Director agents: in sync, read-only, valid for both agents
{
  const r = node([join(repo, 'tools/build-agents.mjs'), '--check']); r.status === 0 ? ok('director agents in sync with their source') : fail(`director agents out of sync\n${r.stdout}`);
  for (const n of ['ai-slop-director', 'ux-flow-director']) {
    const c = join(plug, 'agents', `${n}.md`); const x = join(plug, 'codex-agents', `${n.replace(/-/g, '_')}.toml`);
    if (!existsSync(c) || !existsSync(x)) { fail(`missing agent files for ${n}`); continue; }
    const ct = rd(c), xt = rd(x);
    /^---\nname: [a-z-]+\ndescription: "/.test(ct.replace(/\r\n/g, '\n')) && /tools: Read, Glob, Grep, Bash/.test(ct) && /disallowedTools: Write, Edit/.test(ct) ? ok(`${n}: Claude agent is read-only by allowlist`) : fail(`${n}: Claude agent frontmatter invalid or not read-only`);
    /^name = "[a-z_]+"/m.test(xt) && /^description = ".+"/m.test(xt) && /developer_instructions = '''/.test(xt) && /read-only|Do not edit/i.test(xt) && (xt.match(/'''/g) || []).length === 2 ? ok(`${n}: Codex agent valid, read-only instruction present`) : fail(`${n}: Codex TOML invalid`);
    if (!/read-only/i.test(ct) || !/PASS|FAIL/.test(ct)) fail(`${n}: agent brief must state read-only and a PASS or FAIL verdict`);
  }
}

// 7. Manifest covers both agents with fix hints
const man = J(join(base, 'scripts/skills-manifest.json'));
if (man) {
  for (const s of man.skills) { if (!(s.claude || s.all)?.length || !(s.codex || s.all)?.length) fail(`manifest: ${s.id} lacks a command for an agent`); if (!s.fix) fail(`manifest: ${s.id} has no fix hint`); }
  for (const t of man.tools) if (!t.fix) fail(`manifest: tool ${t.id} has no fix hint`);
  for (const ag of ['claude', 'codex']) if (!man.placeholders?.[ag]?.skillsAgent || !man.skillsDir?.[ag]) fail(`manifest: placeholders/skillsDir missing for ${ag}`);
  const need = ['impeccable', 'taste-skill', 'ui-ux-pro-max', 'gsap-skills', 'three-agent-skills', 'remotion', 'hyperframes', 'scroll-craft'];
  const have = new Set(man.skills.map((s) => s.id)); const miss = need.filter((n) => !have.has(n)); miss.length ? fail(`manifest is missing required skills: ${miss.join(', ')}`) : ok('manifest has all required companion skills for both agents');
}
{ const ps = rd(join(base, 'scripts/install-skills.ps1')), sh = rd(join(base, 'scripts/install-skills.sh')); /Show-Failures/.test(ps) && /Retry the failed items/.test(ps) && /Do-Directors/.test(ps) && /show_failures/.test(sh) && /directors\(\)/.test(sh) ? ok('installers verify, explain, offer retry and install directors') : fail('installers lost failure handling or the directors step'); }

// 8. Script syntax
for (const f of files.filter((p) => p.endsWith('.mjs'))) { const r = node(['--check', f]); if (r.status !== 0) fail(`syntax error ${relative(repo, f)}\n${r.stderr}`); }
ok('mjs scripts parse');

// 9. web-lint: starter passes, slop fixture fails on the right rules
{
  const tmp = mkdtempSync(join(tmpdir(), 'rhad-web-'));
  try {
    for (const [type, brand] of [['service', 'rhad'], ['lp', 'rhad']]) {
      const dir = join(tmp, type); const r1 = node([join(base, 'scripts/new-page.mjs'), dir, '--type', type, '--brand', brand]);
      if (r1.status !== 0) { fail(`new-page ${type}: ${r1.stderr}`); continue; }
      const r = node([join(base, 'scripts/web-lint.mjs'), dir, '--brand', brand]); r.status === 0 ? ok(`web-lint starter ${type} (${brand}): no fails`) : fail(`web-lint on the ${type} starter\n${r.stdout}`);
      const rf = node([join(base, 'scripts/web-lint.mjs'), dir, '--brand', brand, '--final']); rf.status === 1 && /honesty\/placeholder/.test(rf.stdout) ? ok(`web-lint --final blocks [NEEDS] placeholders (${type})`) : fail(`web-lint --final should fail on placeholders (${type})`);
    }
    const fx = join(repo, 'tools/fixtures/slop.html');
    if (!existsSync(fx)) fail('tools/fixtures/slop.html missing');
    else {
      const r = node([join(base, 'scripts/web-lint.mjs'), fx, '--brand', 'rhad', '--json']); let j = null; try { j = JSON.parse(r.stdout); } catch { /* */ }
      const rules = new Set((j?.findings || []).map((f) => f.rule)); const want = ['slop/gradient', 'slop/glass', 'slop/hue', 'slop/shadow', 'brand/font', 'copy/hype', 'honesty/proof', 'honesty/lorem', 'a11y/alt', 'ux/dead-link', 'a11y/h1', 'honesty/fake-success', 'motion/reduced'];
      const missing = want.filter((x) => !rules.has(x)); r.status === 1 && !missing.length ? ok(`web-lint catches the slop fixture (${rules.size} rules)`) : fail(`web-lint missed on the slop fixture: ${missing.join(', ')}`);
    }
    if (withBrowser) { const r = node([join(base, 'scripts/shoot.mjs'), join(tmp, 'service'), '--out', join(tmp, 'v'), '--widths', '390,1440'], { timeout: 180000 }); r.status === 0 && /viewport 390/.test(r.stdout) ? ok('shoot.mjs measures the exact phone width') : fail(`shoot.mjs\n${r.stdout}\n${r.stderr}`); }
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}

// 9b. RHAD45 scaffolds (both directions) are real RHAD45 pages
{
  const tmp = mkdtempSync(join(tmpdir(), 'rhad45-'));
  try {
    const r0 = node([join(base, 'scripts/new-page.mjs'), join(tmp, 'none'), '--brand', 'rhad45']); r0.status !== 0 && /--direction/.test(r0.stderr) ? ok('new-page refuses RHAD45 without a direction') : fail('new-page must require --direction for rhad45');
    for (const d of ['a', 'b']) {
      const dir = join(tmp, d); const r = node([join(base, 'scripts/new-page.mjs'), dir, '--type', 'service', '--brand', 'rhad45', '--direction', d]);
      if (r.status !== 0) { fail(`new-page rhad45 ${d}: ${r.stderr}`); continue; }
      const h = rd(join(dir, 'index.html')); const cssOrder = [...h.matchAll(/href="([^"]+\.css)"/g)].map((m) => m[1]);
      /RHAD45-logo-/.test(h) && !/rhad-logo-/.test(h) ? ok(`RHAD45 ${d}: Join logo swapped in, no RHAD logo`) : fail(`RHAD45 ${d}: logo not swapped`);
      cssOrder[cssOrder.length - 1] === `assets/tokens/rhad45-web-${d}.css` ? ok(`RHAD45 ${d}: brand layer loads after site.css`) : fail(`RHAD45 ${d}: brand layer must be the last stylesheet (${cssOrder.join(', ')})`);
      const lr = node([join(base, 'scripts/web-lint.mjs'), dir, '--brand', 'rhad45']); lr.status === 0 ? ok(`web-lint RHAD45 ${d}: no fails`) : fail(`web-lint RHAD45 ${d}
${lr.stdout}`);
      if (withBrowser) { const sr = node([join(base, 'scripts/shoot.mjs'), dir, '--out', join(tmp, 'v' + d), '--widths', '1440'], { timeout: 180000 }); const j = JSON.parse(readFileSync(join(tmp, 'v' + d, 'shoot-report.json'), 'utf8')); const fonts = (j.results[0].probe?.fonts || []).join(','); const need = 'Unbounded:loaded'; if (/Sora/.test(fonts)) fail(`RHAD45 ${d}: a third font is loading (${fonts})`); fonts.includes(need) ? ok(`RHAD45 ${d}: fonts load (${fonts})`) : fail(`RHAD45 ${d}: expected ${need}, got ${fonts}`); }
    }
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}
// 9c. Brand asset index: every backticked path exists
{
  const idx = rd(join(base, 'references/brand-assets-index.md')); let n = 0;
  for (const m of idx.matchAll(/`((?:assets|references)\/[^`]+)`/g)) { for (const p of m[1].split(/,\s*/)) { n++; if (!existsSync(join(base, p.trim()))) fail(`brand-assets-index lists a missing path: ${p}`); } }
  ok(`brand-assets-index: ${n} paths checked`);
  for (const sec of ['## RHAD (agency', '## RHAD45 (product line)', '## Shared by both brands']) if (!idx.includes(sec)) fail(`brand-assets-index missing section ${sec}`);
}

// 9d. One font pair for every brand
{
  const ff = readdirSync(join(base, 'assets/fonts')).filter((f) => /\.(ttf|otf|woff2?)$/i.test(f)); const extra = ff.filter((f) => !/^(Unbounded|PlusJakartaSans)-/.test(f));
  extra.length ? fail(`third font file(s) packaged: ${extra.join(', ')}. RHAD and RHAD45 use only Unbounded and Plus Jakarta Sans`) : ok('fonts: only Unbounded and Plus Jakarta Sans are packaged');
  const stat = readdirSync(join(base, 'assets/fonts/static')).filter((f) => !/^(Unbounded|PlusJakartaSans)-/.test(f)); stat.length ? fail(`third font in static/: ${stat.join(', ')}`) : ok('fonts/static: same two families only');
  const css = files.filter((p) => p.endsWith('.css') && !p.includes('sources')); const bad = css.filter((p) => /font-family\s*:[^;]*\b(Sora|Inter|Roboto|Poppins)\b/i.test(rd(p)) || /@font-face[^}]*(Sora|Inter|Roboto|Poppins)/i.test(rd(p)));
  bad.length ? fail(`brand CSS declares another font: ${bad.map((p) => relative(repo, p)).join(', ')}`) : ok('brand CSS declares no third font');
  const tmp2 = mkdtempSync(join(tmpdir(), 'fontcheck-')); try { const fx = join(tmp2, 'a.css'); writeFileSync(fx, 'h1 { font-family: "Sora", sans-serif; }'); const r = node([join(base, 'scripts/web-lint.mjs'), fx, '--brand', 'rhad45']); r.status === 1 && /brand\/font/.test(r.stdout) ? ok('web-lint rejects Sora even for RHAD45') : fail('web-lint must reject any third font for RHAD45'); } finally { rmSync(tmp2, { recursive: true, force: true }); }
}

// 10. Assets and sources present
for (const a of ['assets/rhad/logos/rhad-logo-red.png', 'assets/rhad45/logos/RHAD45-logo-primary.svg', 'assets/fonts/Unbounded-Variable.ttf', 'assets/fonts/PlusJakartaSans-Variable.ttf', 'assets/tokens/rhad45-web-a.css', 'assets/tokens/rhad45-web-b.css', 'references/brand-assets-index.md', 'assets/tokens/rhad-web.css', 'assets/tokens/rhad45-design-system.css', 'assets/imagery/rhad-master-imagery-reference.png', 'assets/templates/starter/service-page.html', 'assets/templates/starter/landing-page.html', 'references/sources/edge-DESIGN.md', 'references/sources/06-build-brief.md', 'references/ai-slop-catalogue.md', 'references/ux-standards.md', 'references/directors/ai-slop-director.md', 'references/directors/ux-flow-director.md'])
  if (!existsSync(join(base, a))) fail(`missing ${a}`);
ok('core assets, sources and rubrics present');

// 11. Hygiene
const secret = /(sk-[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}|ghp_[A-Za-z0-9]{30,}|xox[baprs]-[A-Za-z0-9-]{10,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;
const textExt = new Set(['.md', '.mjs', '.json', '.html', '.css', '.js', '.ps1', '.sh', '.yml', '.yaml', '.txt', '.svg', '.toml']);
for (const f of files) {
  const rel = relative(repo, f); const s = statSync(f).size;
  if (s > 8 * 1048576) fail(`${rel} is ${(s / 1048576).toFixed(1)} MB (limit 8 MB)`);
  if (/\.(env|pem|key)$/.test(f) || /\.chrome-profile|\.tmp$/.test(f)) fail(`junk or secret file ${rel}`);
  if (textExt.has(extname(f)) && s < 2 * 1048576 && secret.test(rd(f))) fail(`secret-like string in ${rel}`);
}
ok('size and secret scan');

console.log(fails ? `\n${fails} failure(s)` : '\nAll checks passed.');
process.exit(fails ? 1 : 0);
