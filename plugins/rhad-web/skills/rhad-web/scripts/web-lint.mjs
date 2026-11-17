#!/usr/bin/env node
// RHAD web lint: markup, accessibility, brand tokens and AI-slop patterns for HTML, CSS, JS and SVG.
// Usage: node web-lint.mjs <file-or-folder...> [--brand rhad|rhad45] [--final] [--json]
// FAIL = must fix. WARN = review. Exit 1 on any FAIL.
// Escape hatch (slop-ok, or the existing taste-skill-ignore / impeccable-ignore markers) for a deliberate, brand-allowed use: put  /* slop-ok: <reason citing the brand file> */  or
// <!-- slop-ok: reason -->  on the same or the previous line. Every slop-ok is listed in the summary.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative, resolve } from 'node:path';

const args = process.argv.slice(2);
let brand = 'rhad', final = false, asJson = false; const inputs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--brand') brand = args[++i];
  else if (args[i] === '--final') final = true;
  else if (args[i] === '--json') asJson = true;
  else inputs.push(args[i]);
}
if (!inputs.length || !['rhad', 'rhad45'].includes(brand)) { console.error('Usage: web-lint.mjs <file-or-folder...> [--brand rhad|rhad45] [--final] [--json]'); process.exit(2); }

const PALETTE = {
  rhad: ['#D90A2C', '#B00822', '#FFFFFF', '#1F2124', '#5B6169', '#F3F2EF', '#F5F5F3', '#2C2F33', '#D6D7D9', '#000000', '#A21D24', '#176348', '#C9C6BF', '#E8E6E1'],
  rhad45: ['#F03131', '#B62424', '#951D1D', '#D21131', '#191919', '#12161C', '#1F2124', '#FFFFFF', '#F5F3EF', '#F3F2EF', '#E8E6E1', '#FBE7EA', '#5B5B5B', '#D8D3CC', '#76716B', '#176348', '#A21D24', '#343434', '#F4F1EC', '#000000', '#E4E6E9', '#D9DCE0', '#C9CDD3', '#9EA4AC', '#EFEDE8', '#C9C6BF'],
}[brand];
const ALLOWED_FONTS = ['unbounded', 'plus jakarta sans', 'arial', 'arial black', 'sans-serif', 'system-ui', 'inherit', 'monospace-ui-never'];
const SLOP_HUES = ['#6366f1', '#8b5cf6', '#7c3aed', '#a855f7', '#9333ea', '#4f46e5', '#818cf8', '#c084fc', '#ec4899', '#06b6d4'];
const HYPE = ['revolutionary', 'seamless', 'cutting-edge', 'cutting edge', 'next-gen', 'next generation', 'game-changer', 'game changer', 'unlock', 'supercharge', 'world-class', 'state-of-the-art', 'leverage', 'empower', 'elevate your', 'synergy', 'robust solution', 'holistic', "in today's fast-paced", "let me be honest", 'take your business to the next level'];
const BANNED45 = ['never miss a lead', 'guaranteed revenue', 'unlimited', 'fully autonomous', 'instant booking', 'five-star', '5-star', 'no hidden fees', 'free setup', 'cancel anytime', '24/7'];
const BANNED_GRANT = ['approved vendor', 'apply now', 'secure funding', 'claim grant', 'guaranteed'];
const FAKE_PROOF = [/trusted by\s+\d/i, /as seen (in|on)/i, /\b\d{1,3}(,\d{3})+\+?\s+(customers|clients|businesses|users)/i, /★{3,}/, /\b(award[- ]winning|#1 rated|best[- ]in[- ]class)\b/i, /\d+\s+people (are )?(viewing|looking)/i, /only \d+ (spots|slots) left/i];

const files = [];
function walk(p) {
  const st = statSync(p);
  if (st.isDirectory()) { for (const e of readdirSync(p)) { if (['node_modules', '.git', 'dist', 'verification', '.chrome-profile', 'sources'].includes(e)) continue; walk(join(p, e)); } }
  else if (['.html', '.htm', '.css', '.js', '.mjs', '.ts', '.tsx', '.jsx', '.svg'].includes(extname(p).toLowerCase())) files.push(p);
}
for (const i of inputs) { if (!existsSync(i)) { console.error(`Not found: ${i}`); process.exit(2); } walk(i); }

const out = []; const overrides = [];
const lineOf = (t, idx) => t.slice(0, idx).split('\n').length;
function add(level, file, line, rule, msg, text) {
  if (text) { const lines = text.split('\n'); const cur = lines[line - 1] || '', prev = lines[line - 2] || ''; const OK = /(slop-ok|taste-skill-ignore|impeccable-ignore)/i; if (OK.test(cur) || OK.test(prev)) { overrides.push({ file, line, rule, note: (cur.match(/slop-ok:\s*([^*>]*)/i) || prev.match(/slop-ok:\s*([^*>]*)/i) || [])[1]?.trim() || (cur.match(OK) || prev.match(OK))[1] }); return; } }
  out.push({ level, file, line, rule, msg });
}
const hexes = (s) => [...s.matchAll(/#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3})\b/gi)];
const norm = (h) => { let x = h.toUpperCase(); if (x.length === 4) x = '#' + [...x.slice(1)].map((c) => c + c).join(''); return x.slice(0, 7); };

function lintCss(file, t, isInline = false) {
  const rel = file;
  for (const m of t.matchAll(/(linear|radial|conic|repeating-linear|repeating-radial)-gradient\s*\(/gi)) {
    const before = t.slice(Math.max(0, m.index - 140), m.index); const prop = (before.match(/([a-z-]+)\s*:[^;{}]*$/i) || [])[1] || '';
    if (/mask/i.test(prop)) continue; // functional: used as a mask, not as a visible fill
    const body = t.slice(m.index, m.index + 220).split(')')[0];
    const pattern = /\d+(\.\d+)?px/.test(body) && /transparent|#0000|rgba?\([^)]*,\s*0\s*$/i.test(t.slice(m.index, m.index + 260));
    add(pattern ? 'WARN' : 'FAIL', rel, lineOf(t, m.index), pattern ? 'slop/gradient-pattern' : 'slop/gradient', pattern ? 'Hard-stop gradient used as a pattern (dots, hatch). Confirm it is functional, not decoration.' : 'Gradient. RHAD pages are flat. Only a brand-file exception (RHAD45 hero glow) may use one, with /* slop-ok: reason */.', t);
  }
  for (const m of t.matchAll(/backdrop-filter\s*:/gi)) add('FAIL', rel, lineOf(t, m.index), 'slop/glass', 'backdrop-filter (glassmorphism).', t);
  for (const m of t.matchAll(/filter\s*:\s*[^;]*blur\(\s*(\d{2,})px/gi)) add('FAIL', rel, lineOf(t, m.index), 'slop/orb', `blur(${m[1]}px): glow orb or blurred blob. Allowed only as a brand-file exception.`, t);
  for (const m of t.matchAll(/(?:^|[;{\s])(box-shadow|text-shadow|drop-shadow)\s*:\s*(?!none)([^;}]+)/gi)) {
    const v = m[2].trim(); const nums = [...v.replace(/rgba?\([^)]*\)/g, '').matchAll(/(-?\d*\.?\d+)(px)?/g)].map((x) => parseFloat(x[1]));
    const flat = v.split(/,(?![^(]*\))/).every((part) => { const n = [...part.replace(/rgba?\([^)]*\)/g, '').matchAll(/(-?\d*\.?\d+)(px)?(?=\s|$)/g)].map((x) => parseFloat(x[1])); return n.length >= 2 && (n[2] === undefined || n[2] === 0); });
    void nums;
    add(flat ? 'WARN' : 'FAIL', rel, lineOf(t, m.index), flat ? 'brand/flat-shadow' : 'slop/shadow', flat ? `${m[1]}: ${v.slice(0, 40)} is a flat offset (no blur). Fine as a rule or underline; check it is not faking depth.` : `${m[1]}: ${v.slice(0, 40)}. No soft shadows or glows at rest.`, t);
  }
  for (const m of t.matchAll(/border-radius\s*:\s*([^;}]+)/gi)) { const v = m[1].trim(); if (/^var\(--radius/.test(v) || v === 'inherit') continue; const px = parseFloat(v); const zero = /^0(px)?(\s+0(px)?)*$/.test(v); const maxOk = brand === 'rhad45' ? 8 : 0; if (!zero && !(brand === 'rhad45' && px <= maxOk)) add('WARN', rel, lineOf(t, m.index), 'brand/radius', `border-radius: ${v}. RHAD web is square. Allowed only on a depicted device${brand === 'rhad45' ? ' or up to 8px on RHAD45 components' : ''}.`, t); }
  for (const m of t.matchAll(/font-style\s*:\s*italic/gi)) add('WARN', rel, lineOf(t, m.index), 'brand/italic', 'Italics are not used in RHAD design.', t);
  for (const m of t.matchAll(/font-family\s*:\s*([^;}]+)/gi)) for (const raw of m[1].split(',')) { const f = raw.replace(/["']/g, '').trim().toLowerCase(); if (f && !f.startsWith('var(') && !ALLOWED_FONTS.includes(f)) add('FAIL', rel, lineOf(t, m.index), 'brand/font', `Font "${f}" is not a RHAD font. Use Unbounded and Plus Jakarta Sans on every RHAD and RHAD45 page, nothing else.`, t); }
  const seen = new Set();
  for (const m of hexes(t)) { const h = norm(m[0]); if (SLOP_HUES.includes(h.toLowerCase())) add('FAIL', rel, lineOf(t, m.index), 'slop/hue', `${h} is a stock AI-palette purple, violet, pink or cyan.`, t); else if (!PALETTE.includes(h) && !seen.has(h)) { seen.add(h); add('WARN', rel, lineOf(t, m.index), 'brand/colour', `${h} is not in the ${brand} token set.`, t); } }
  for (const m of t.matchAll(/(?:^|[;{\s])outline\s*:\s*(none|0)\b/gi)) { const block = t.slice(Math.max(0, m.index - 200), m.index + 300); if (!/focus-visible[^{]*\{[^}]*(outline|box-shadow|border)/i.test(t) ) add('FAIL', rel, lineOf(t, m.index), 'a11y/focus', 'outline removed with no :focus-visible replacement.', t); }
  for (const m of t.matchAll(/font-size\s*:\s*(\d+(?:\.\d+)?)px/gi)) if (+m[1] < 12 && !/phone|mock|device/i.test(t.slice(Math.max(0, m.index - 300), m.index))) add('WARN', rel, lineOf(t, m.index), 'ux/small-text', `font-size ${m[1]}px is below 12px. Body copy must be 16px or more on phones.`, t);
  for (const m of t.matchAll(/text-transform\s*:\s*uppercase[^}]*?letter-spacing\s*:\s*(0?\.\d+)em/gi)) if (+m[1] >= 0.08) add('WARN', rel, lineOf(t, m.index), 'slop/eyebrow', 'Uppercase with wide tracking: an eyebrow or micro-cap. RHAD pages have no eyebrows (except the one allowed RHAD45 hero eyebrow).', t);
  for (const m of t.matchAll(/\.(eyebrow|kicker|overline|pill|badge|chip|glow|shimmer|blob|orb|aurora|glass)\b/gi)) add('WARN', rel, lineOf(t, m.index), 'slop/class', `Class .${m[1]}: a common slop pattern. Remove or justify.`, t);
  for (const m of t.matchAll(/animation[^;{]*\binfinite\b/gi)) add('WARN', rel, lineOf(t, m.index), 'motion/infinite', 'Infinite animation. Decorative loops are slop; functional ones need a pause path and reduced-motion handling.', t);
  for (const m of t.matchAll(/(?:^|[;{\s])(?:top|left|width|height)\s*:[^;]*;[^}]*transition[^;]*\b(?:top|left|width|height)\b/gi)) add('WARN', rel, lineOf(t, m.index), 'motion/layout', 'Transitioning a layout property. Animate transform and opacity.', t);
  for (const m of t.matchAll(/scroll-snap-type|overscroll-behavior\s*:\s*none|scrollbar-width\s*:\s*none/gi)) add('WARN', rel, lineOf(t, m.index), 'ux/scroll', `${m[0]}: check this does not hijack or hide scrolling.`, t);
  for (const m of t.matchAll(/(?:^|[;{\s])(?:opacity\s*:\s*0|visibility\s*:\s*hidden)\s*;/gi)) { const b = t.slice(Math.max(0, m.index - 160), m.index); if (/\.(reveal|fade|anim|hidden-until|will-animate|js-)[^{]*\{[^}]*$/i.test(b) && !/html\.js|\.js\s|no-js/.test(b)) add('WARN', rel, lineOf(t, m.index), 'ux/hidden-until-scrolled', 'opacity 0 or hidden in CSS on a reveal class. Content must be visible without scripts: start visible, or scope under html.js.', t); }
  const animates = /@keyframes|animation\s*:|transition\s*:/i.test(t);
  return { animates };
}

let inlineMotion = false;
function lintHtml(file, t) {
  const rel = file;
  const body = t.replace(/<!--[\s\S]*?-->/g, '').replace(/<script[\s\S]*?<\/script>/gi, '');
  if (!/<html[^>]*\blang=/i.test(t)) add('FAIL', rel, 1, 'a11y/lang', '<html> has no lang attribute.', t);
  if (!/<title>[^<]{4,}<\/title>/i.test(t)) add('FAIL', rel, 1, 'seo/title', 'Missing or empty <title>.', t);
  if (!/<meta[^>]+name=["']viewport["']/i.test(t)) add('FAIL', rel, 1, 'ux/viewport', 'Missing viewport meta.', t);
  if (/user-scalable\s*=\s*(no|0)/i.test(t) || /maximum-scale\s*=\s*1(\.0)?\b/i.test(t)) add('FAIL', rel, 1, 'a11y/zoom', 'Zoom is disabled in the viewport meta.', t);
  if (!/<meta[^>]+name=["']description["']/i.test(t)) add('WARN', rel, 1, 'seo/description', 'Missing meta description.', t);
  const h1 = (body.match(/<h1\b/gi) || []).length;
  if (h1 === 0) add('FAIL', rel, 1, 'a11y/h1', 'No <h1>.', t); else if (h1 > 1) add('FAIL', rel, 1, 'a11y/h1', `${h1} <h1> elements. Use one.`, t);
  const heads = [...body.matchAll(/<h([1-6])\b/gi)].map((m) => +m[1]); for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i - 1] > 1) { add('WARN', rel, 1, 'a11y/heading-order', `Heading level jumps from h${heads[i - 1]} to h${heads[i]}.`, t); break; }
  if (!/<main\b/i.test(body)) add('WARN', rel, 1, 'a11y/landmark', 'No <main> landmark.', t);
  if (!/class=["'][^"']*skip/i.test(body) && !/href=["']#(main|content)["']/i.test(body)) add('WARN', rel, 1, 'a11y/skip-link', 'No skip link found.', t);
  for (const m of body.matchAll(/<img\b[^>]*>/gi)) { const tag = m[0]; const ln = lineOf(t, t.indexOf(tag)); if (!/\balt=/i.test(tag)) add('FAIL', rel, ln, 'a11y/alt', 'Image without alt.', t); else if (/\balt=["'](image|picture|photo|img|logo)?["']/i.test(tag) && !/alt=["']["']/.test(tag)) add('WARN', rel, ln, 'a11y/alt', 'Generic alt text.', t); if (!/\bwidth=/i.test(tag) || !/\bheight=/i.test(tag)) add('WARN', rel, ln, 'perf/dimensions', 'img without width and height (layout shift).', t); if (!/\.(webp|avif|svg)(\?|["'\s])/i.test(tag) && /\.(png|jpe?g)(\?|["'\s])/i.test(tag) && !/logo|icon/i.test(tag)) add('WARN', rel, ln, 'perf/format', 'PNG or JPEG. Prefer WebP or AVIF.', t); }
  for (const m of body.matchAll(/<a\b[^>]*href=["']#["'][^>]*>/gi)) { const jsFilled = /\bdata-[a-z-]+/i.test(m[0]); add(jsFilled ? 'WARN' : 'FAIL', rel, lineOf(t, t.indexOf(m[0])), 'ux/dead-link', jsFilled ? 'href="#" filled by script (data- attribute). Confirm the real URL is set, or the link is hidden, when scripts fail.' : 'href="#" is a dead link.', t); }
  for (const m of body.matchAll(/<(div|span)\b[^>]*\bonclick=/gi)) add('WARN', rel, lineOf(t, t.indexOf(m[0])), 'a11y/button', 'Clickable <div> or <span>. Use <button> or <a>.', t);
  for (const m of body.matchAll(/<input\b[^>]*>/gi)) { const tag = m[0]; if (/type=["'](hidden|submit|button|checkbox|radio)["']/i.test(tag) && /type=["'](hidden|submit|button)["']/i.test(tag)) continue; const id = (tag.match(/\bid=["']([^"']+)["']/i) || [])[1]; const pos = body.indexOf(tag); const wrapped = (() => { const before = body.slice(0, pos); const open = before.lastIndexOf('<label'); const close = before.lastIndexOf('</label'); return open > close; })(); const labelled = (id && new RegExp(`<label[^>]*for=["']${id}["']`, 'i').test(body)) || /aria-label(ledby)?=|\btitle=/i.test(tag) || wrapped; if (!labelled) add('FAIL', rel, lineOf(t, t.indexOf(tag)), 'a11y/label', 'Input without a visible label (label[for] or aria-label).', t); if (/\bplaceholder=/i.test(tag) && !id) add('WARN', rel, lineOf(t, t.indexOf(tag)), 'a11y/placeholder', 'Placeholder without an id/label.', t); if (/type=["'](email|tel)["']/i.test(tag) && !/autocomplete=/i.test(tag)) add('WARN', rel, lineOf(t, t.indexOf(tag)), 'ux/autocomplete', 'Add autocomplete to email and phone inputs.', t); }
  for (const m of body.matchAll(/<video\b[^>]*>/gi)) { const tag = m[0]; if (/\bautoplay\b/i.test(tag) && (!/\bmuted\b/i.test(tag) || !/\bplaysinline\b/i.test(tag))) add('FAIL', rel, lineOf(t, t.indexOf(tag)), 'ux/video', 'Autoplay video must be muted and playsinline.', t); if (!/\bposter=/i.test(tag)) add('WARN', rel, lineOf(t, t.indexOf(tag)), 'perf/poster', 'Video without poster.', t); }
  for (const m of body.matchAll(/<form\b[^>]*>/gi)) { if (!/\bmethod=["']?post/i.test(m[0])) add('WARN', rel, lineOf(t, t.indexOf(m[0])), 'ux/form-nojs', 'Form without method="post": if scripts fail, a GET submit puts the visitor\'s name, email and phone in the URL. Add method="post" and a real action, or a no-script contact line.', t); if (!/\baction=/i.test(m[0]) && !/data-endpoint/i.test(m[0]) && !/\bid=/i.test(m[0])) add('WARN', rel, lineOf(t, t.indexOf(m[0])), 'ux/form', 'Form with no action, data-endpoint or id. How does it submit?', t); }
  for (const m of body.matchAll(/class=["'][^"']*\b(eyebrow|kicker|overline)\b/gi)) add('WARN', rel, lineOf(t, t.indexOf(m[0])), 'slop/eyebrow', 'Eyebrow or kicker element. RHAD pages have none (RHAD45: only the hero eyebrow).', t);
  if (/<script[^>]+src=["'][^"']*(cdn|unpkg|jsdelivr|cdnjs)[^"']*["']/i.test(t)) add('WARN', rel, 1, 'perf/cdn', 'Third-party CDN script. Prefer a pinned, self-hosted build.', t);
  const text = body.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ');
  const lower = text.toLowerCase();
  textRules(rel, t, lower, text);
  for (const m of t.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) lintCss(rel, m[1]);
  for (const m of t.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi)) { if (lintJs(rel, m[1])) inlineMotion = true; }
  for (const m of t.matchAll(/\sstyle=["']([^"']+)["']/gi)) { if (/gradient|backdrop-filter/i.test(m[1])) add('FAIL', rel, lineOf(t, m.index), 'slop/inline', 'Gradient or backdrop-filter in an inline style.', t); }
  if (/\bclass=["'][^"']*\b(bg-gradient-to-|from-(purple|indigo|violet|pink)|to-(purple|indigo|violet|pink)|backdrop-blur)/i.test(t)) add('FAIL', rel, 1, 'slop/tailwind', 'Tailwind gradient, purple or backdrop-blur utilities.', t);
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(text)) add('WARN', rel, 1, 'slop/emoji', 'Emoji in page text. Decorative emoji are slop.', t);
  return text;
}

const NEG = /(\bnot|\bno|\bnever|isn['\u2019]t|aren['\u2019]t|doesn['\u2019]t|don['\u2019]t|cannot|can['\u2019]t|without|rather than|instead of|avoid)\W+(?:\w+\W+){0,4}$/i;
function hit(lower, w) { let i = -1; const res = []; while ((i = lower.indexOf(w, i + 1)) !== -1) { if (NEG.test(lower.slice(Math.max(0, i - 48), i))) continue; res.push(i); } return res; }
function textRules(rel, raw, lower, text) {
  for (const w of HYPE) if (hit(lower, w).length) add('FAIL', rel, 1, 'copy/hype', `Hype phrase: "${w}".`, raw);
  if (brand === 'rhad45') for (const w of BANNED45) if (hit(lower, w).length) add('FAIL', rel, 1, 'copy/rhad45-banned', `RHAD45 banned claim: "${w}". (A negated mention, such as "does not guarantee", is allowed.)`, raw);
  if (/edge|grant|psg/i.test(raw.slice(0, 4000))) for (const w of BANNED_GRANT) if (hit(lower, w).length) add('FAIL', rel, 1, 'copy/grant', `Grant language to confirm with the owner: "${w}". Present support conditionally (negated mentions are allowed; factual programme names need /* slop-ok: source */).`, raw);
  for (const re of FAKE_PROOF) { const m = text.match(re); if (m) add('FAIL', rel, 1, 'honesty/proof', `Unsourced proof pattern: "${m[0].trim()}". Real, sourced and permitted only (add /* slop-ok: source */ with the source).`, raw); }
  if (/lorem ipsum|dolor sit amet/i.test(raw)) add('FAIL', rel, 1, 'honesty/lorem', 'Lorem ipsum.', raw);
  if (/—/.test(text)) add('WARN', rel, 1, 'copy/em-dash', 'Em dash in page copy.', raw);
  if (/\b(learn more|click here|get started|submit)\b\s*(<|$)/i.test(raw.replace(/<[^>]+>/g, '<'))) add('WARN', rel, 1, 'copy/cta', 'Vague CTA ("Learn more", "Get started", "Submit"). Name the outcome.', raw);
  const needs = raw.match(/\[NEEDS[^\]]*\]|TODO|FIXME|placeholder text|insert (text|image)/gi);
  if (needs) add(final ? 'FAIL' : 'WARN', rel, 1, 'honesty/placeholder', `${needs.length} placeholder(s) left: ${[...new Set(needs)].slice(0, 4).join(', ')}.`, raw);
}

function lintJs(file, t) {
  const rel = file;
  const usesMotion = /gsap|ScrollTrigger|requestAnimationFrame|\.animate\(|IntersectionObserver/i.test(t);
  if (/gsap|ScrollTrigger/i.test(t) && !/prefers-reduced-motion|matchMedia/i.test(t)) add('FAIL', rel, 1, 'motion/reduced', 'GSAP used with no prefers-reduced-motion or matchMedia handling.', t);
  if (/ScrollTrigger[\s\S]{0,400}pin\s*:\s*true/i.test(t)) add('WARN', rel, 1, 'motion/pin', 'ScrollTrigger pin. Confirm it does not trap scrolling or hold longer than one viewport.', t);
  if (/(ScrollSmoother|Lenis|locomotive|smooth-scrollbar)/i.test(t)) add('WARN', rel, 1, 'motion/scroll-jack', 'Smooth-scroll library. RHAD pages do not hijack scrolling.', t);
  for (const m of t.matchAll(/setTimeout\([^)]*\)[\s\S]{0,300}?(success|thank|sent|submitted)/gi)) add('FAIL', rel, lineOf(t, m.index), 'honesty/fake-success', 'Success state set from a timer. Success only after a confirmed server receipt.', t);
  if (/localStorage\.setItem\([^)]*(lead|submitted|success)/i.test(t)) add('FAIL', rel, 1, 'honesty/fake-success', 'Success or lead stored in localStorage.', t);
  if (/(gtag|dataLayer\.push|fbq|analytics|track)\s*\([^)]*\{[^}]*\b(email|phone|name|context|message)\b\s*:/i.test(t)) add('WARN', rel, 1, 'privacy/analytics', 'Personal field inside an analytics call. Events must carry no names, emails, phone numbers or free text.', t);
  if (/\bconsole\.log\(/.test(t)) add('WARN', rel, 1, 'craft/console', 'console.log left in code.', t);
  return usesMotion;
}

const summary = { files: 0, animates: false };
const htmlTexts = new Map();
let cssAnimates = false, jsMotion = false, hasReduced = false;
for (const f of files) {
  const t = readFileSync(f, 'utf8'); const rel = relative(process.cwd(), resolve(f)) || f; summary.files++;
  const ext = extname(f).toLowerCase();
  if (ext === '.css') { const r = lintCss(rel, t); cssAnimates ||= r.animates; if (/prefers-reduced-motion/i.test(t)) hasReduced = true; }
  else if (['.html', '.htm'].includes(ext)) { htmlTexts.set(rel, lintHtml(rel, t)); if (/prefers-reduced-motion/i.test(t)) hasReduced = true; if (/@keyframes|transition\s*:/i.test(t)) cssAnimates = true; }
  else if (ext === '.svg') { for (const m of t.matchAll(/(linear|radial)Gradient/gi)) add('WARN', rel, lineOf(t, m.index), 'slop/gradient', 'SVG gradient. Flat fills only unless the brand file allows it.', t); }
  else { const m = lintJs(rel, t); jsMotion ||= m; if (/prefers-reduced-motion/i.test(t)) hasReduced = true; }
}
if ((cssAnimates || jsMotion || inlineMotion) && !hasReduced && !out.some((o) => o.rule === 'motion/reduced')) out.push({ level: 'FAIL', file: inputs[0], line: 1, rule: 'motion/reduced', msg: 'Animation or transitions found but no prefers-reduced-motion handling anywhere.' });

// Group repeated hits of the same rule in the same file into one finding (with the lines); drop exact duplicates.
{
  const seen = new Set(), grouped = new Map();
  for (const f of out) {
    const k = `${f.level}|${f.file}|${f.rule}`; const dup = `${k}|${f.line}|${f.msg}`; if (seen.has(dup)) continue; seen.add(dup);
    if (!grouped.has(k)) grouped.set(k, { ...f, lines: [f.line], msgs: [f.msg] }); else { const g = grouped.get(k); g.lines.push(f.line); if (!g.msgs.includes(f.msg)) g.msgs.push(f.msg); }
  }
  out.length = 0;
  for (const g of grouped.values()) { const n = g.lines.length; const detail = g.msgs.length > 1 ? g.msgs.slice(0, 4).join(' | ') + (g.msgs.length > 4 ? ` | +${g.msgs.length - 4} more` : '') : g.msgs[0]; out.push({ level: g.level, file: g.file, line: g.lines[0], rule: g.rule, msg: n > 1 ? `${detail} (${n} hits, lines ${[...new Set(g.lines)].slice(0, 8).join(', ')}${n > 8 ? '...' : ''})` : detail }); }
}
const fails = out.filter((o) => o.level === 'FAIL').length, warns = out.length - fails;
if (asJson) console.log(JSON.stringify({ brand, final, fails, warns, overrides, findings: out }, null, 2));
else {
  for (const o of out) console.log(`${o.level}  ${o.file}:${o.line}  [${o.rule}]  ${o.msg}`);
  if (overrides.length) { console.log('\nslop-ok overrides (the AI Slop Director must confirm each):'); for (const o of overrides) console.log(`  ${o.file}:${o.line} [${o.rule}] ${o.note || '(no reason given)'}`); }
  console.log(`\n${summary.files} file(s), ${fails} fail, ${warns} warn  (brand: ${brand}${final ? ', final' : ''})`);
}
process.exit(fails ? 1 : 0);
