#!/usr/bin/env node
// Screenshots at five widths plus a measured probe, using headless Chrome or Edge.
// Usage: node shoot.mjs <folder | file.html | url> [--out dir] [--widths 360,390,768,1024,1440] [--page index.html] [--serve]
//                       [--root dir] [--reduced-motion] [--no-js] [--probe] [--max-height 14000] [--serve-seconds 300]
// --out must be OUTSIDE this skill folder. Reviewers (the directors) must pass --out to a temp folder so nothing is written into the repo.
// --serve starts the temporary server, prints a URL for Lighthouse (npx lighthouse <url>) and keeps it up for --serve-seconds, no screenshots.
// Local pages are served from a temporary 127.0.0.1 server (fonts do not load over file://) and a small
// script is injected into HTML responses to measure the page. The page on disk is never changed.
// Phone widths: headless Chrome will not make a window narrower than about 500 px, so local pages are rendered inside an
// iframe of the exact width (media queries then see 360, 390, ...) and the screenshot is cropped to that width with ffmpeg
// (if ffmpeg is missing the shot keeps a white margin and the report says so).
// A URL gets screenshots only (no probe, direct window, widths under 500 px are approximate). Exit 1 on a blocking problem.
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync, createReadStream, writeFileSync } from 'node:fs';
import { resolve, join, extname, dirname, relative, sep, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const args = process.argv.slice(2);
const o = { out: 'verification', outGiven: false, widths: [360, 390, 768, 1024, 1440], page: '', root: '', reduced: false, noJs: false, probe: false, maxH: 14000, serve: false, serveSeconds: 300 }; let target;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--out') { o.out = args[++i]; o.outGiven = true; } else if (a === '--serve') o.serve = true; else if (a === '--serve-seconds') o.serveSeconds = +args[++i]; else if (a === '--widths') o.widths = args[++i].split(',').map(Number);
  else if (a === '--page') o.page = args[++i]; else if (a === '--root') o.root = args[++i];
  else if (a === '--reduced-motion') o.reduced = true; else if (a === '--no-js') o.noJs = true;
  else if (a === '--probe') o.probe = true; else if (a === '--max-height') o.maxH = +args[++i]; else target = a;
}
if (!target) { console.error('Usage: shoot.mjs <folder | file.html | url> [--out dir] [--widths ...] [--reduced-motion] [--no-js] [--probe]'); process.exit(2); }

const candidates = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge'].filter(Boolean);
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) { console.error('No Chrome, Edge or Chromium found. Set CHROME_PATH.'); process.exit(3); }

const isUrl = /^https?:\/\//i.test(target);
const skillDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
let out = resolve(o.out);
if (out === skillDir || out.startsWith(skillDir + sep)) {
  const alt = join(tmpdir(), `rhad-web-shoot-${Date.now()}`);
  console.log(`note: --out ${out} is inside the skill folder. Writing to ${alt} instead. Pass --out <folder outside the skill> to choose.`);
  out = alt;
} else if (!o.outGiven && process.cwd().startsWith(skillDir)) {
  out = join(tmpdir(), `rhad-web-shoot-${Date.now()}`); console.log(`note: running inside the skill folder with no --out. Writing to ${out}.`);
}
mkdirSync(out, { recursive: true });
let server, base, pageName = 'page';
const PROBE = `(function(){var r={errors:[],cls:0,lcp:0};
window.addEventListener('error',function(e){r.errors.push(String(e.message||e))});
window.addEventListener('unhandledrejection',function(e){r.errors.push('unhandledrejection: '+String(e.reason))});
try{new PerformanceObserver(function(l){l.getEntries().forEach(function(e){if(!e.hadRecentInput)r.cls+=e.value})}).observe({type:'layout-shift',buffered:true})}catch(e){}
try{new PerformanceObserver(function(l){var es=l.getEntries();r.lcp=es[es.length-1].startTime}).observe({type:'largest-contentful-paint',buffered:true})}catch(e){}
function sel(el){var s=el.tagName.toLowerCase();if(el.id)s+='#'+el.id;else if(el.className&&typeof el.className==='string')s+='.'+el.className.trim().split(/\\s+/)[0];return s}
function done(){try{var de=document.documentElement,W=window.innerWidth;r.width=W;r.docHeight=Math.max(de.scrollHeight,document.body?document.body.scrollHeight:0);r.overflowX=de.scrollWidth>W+1;r.overflowers=[];
var all=document.body?document.body.querySelectorAll('*'):[];var small=0,tiny=0,hidden=0,minFont=99,hiddenList=[],smallList=[];
for(var i=0;i<all.length;i++){var el=all[i];var b=el.getBoundingClientRect();var cs=getComputedStyle(el);if(cs.display==='none')continue;
if(b.right>W+2&&b.width>0&&r.overflowers.length<6)r.overflowers.push(sel(el)+' right='+Math.round(b.right));
var tag=el.tagName;if(/^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(tag)&&b.width>0&&b.height>0&&cs.visibility!=='hidden'&&!(tag==='A'&&el.closest('p,li')&&cs.display==='inline')){if(b.width<24||b.height<24){tiny++;if(smallList.length<8)smallList.push(sel(el)+' '+Math.round(b.width)+'x'+Math.round(b.height)+' "'+(el.textContent||'').trim().slice(0,24)+'"')}else if(b.width<44||b.height<44){small++;if(smallList.length<8)smallList.push(sel(el)+' '+Math.round(b.width)+'x'+Math.round(b.height)+' "'+(el.textContent||'').trim().slice(0,24)+'"')}}
var own=''; for(var n=el.firstChild;n;n=n.nextSibling){if(n.nodeType===3)own+=n.nodeValue}own=own.trim();
if(own.length>0){var fs=parseFloat(cs.fontSize);if(fs<minFont&&cs.visibility!=='hidden')minFont=fs;if((cs.opacity==='0'||cs.visibility==='hidden')&&own.length>20){hidden++;if(hiddenList.length<5)hiddenList.push(sel(el))}}}
r.tapTargetsTiny=tiny;r.tapTargetsUnder44=small;r.smallTargets=smallList;r.minFontPx=minFont===99?null:minFont;r.hiddenTextBlocks=hidden;r.hiddenList=hiddenList;
r.brokenImages=[].slice.call(document.images).filter(function(i){return i.complete&&i.naturalWidth===0&&i.src}).map(function(i){return i.getAttribute('src')});
r.imagesNoDims=[].slice.call(document.images).filter(function(i){return !i.getAttribute('width')||!i.getAttribute('height')}).length;
r.fonts=[];try{document.fonts.forEach(function(f){r.fonts.push(f.family.replace(/"/g,'')+':'+f.status)})}catch(e){}
r.h1=document.querySelectorAll('h1').length;r.lang=de.getAttribute('lang');r.title=document.title;
var res=performance.getEntriesByType('resource');r.requests=res.length;r.bytes={js:0,css:0,img:0,font:0,other:0};
res.forEach(function(x){var s=x.encodedBodySize||0;var u=x.name.split('?')[0];if(/\\.m?js$/.test(u))r.bytes.js+=s;else if(/\\.css$/.test(u))r.bytes.css+=s;else if(/\\.(png|jpe?g|webp|avif|gif|svg)$/i.test(u))r.bytes.img+=s;else if(/\\.(ttf|otf|woff2?)$/i.test(u))r.bytes.font+=s;else r.bytes.other+=s});
r.reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
}catch(e){r.probeError=String(e)}
if(window.parent&&window.parent!==window){parent.postMessage({__rhad_probe:r},'*')}else{var pre=document.createElement('pre');pre.id='__rhad_probe';pre.style.display='none';pre.textContent=JSON.stringify(r);document.body.appendChild(pre)}}
window.addEventListener('load',function(){setTimeout(done,2200)})})();`;

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm', '.glb': 'model/gltf-binary', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml' };

if (!isUrl) {
  const abs = resolve(target); if (!existsSync(abs)) { console.error(`Not found: ${target}`); process.exit(2); }
  const st = statSync(abs);
  let root = o.root ? resolve(o.root) : (st.isDirectory() ? abs : dirname(abs));
  pageName = o.page || (st.isDirectory() ? 'index.html' : basename(abs));
  if (!existsSync(join(root, pageName))) { console.error(`Page not found: ${join(root, pageName)}`); process.exit(2); }
  server = createServer((req, res) => {
    const u = new URL(req.url, 'http://x');
    if (u.pathname === '/__wrap') {
      const w = +u.searchParams.get('w') || 390, h = +u.searchParams.get('h') || 900, src = u.searchParams.get('src') || '/';
      res.writeHead(200, { 'Content-Type': MIME['.html'] });
      res.end(`<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#fff;overflow:hidden}iframe{border:0;display:block;width:${w}px;height:${h}px}</style><iframe id="f" src="${src.replace(/"/g, '&quot;')}"></iframe><script>addEventListener('message',function(e){if(e.data&&e.data.__rhad_probe){var p=document.createElement('pre');p.id='__rhad_probe';p.textContent=JSON.stringify(e.data.__rhad_probe);document.body.appendChild(p)}})</script>`);
      return;
    }
    let p = resolve(root, '.' + decodeURIComponent(u.pathname));
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
    if (!p.startsWith(root) || !existsSync(p) || !statSync(p).isFile()) { res.writeHead(404); res.end('not found'); return; }
    const ext = extname(p).toLowerCase();
    if (ext === '.html' && !u.searchParams.has('__noprobe')) { let html = readFileSync(p, 'utf8'); const tag = `<script>${PROBE}</script>`; html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, tag + '</body>') : html + tag; res.writeHead(200, { 'Content-Type': MIME['.html'] }); res.end(html); return; }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' }); createReadStream(p).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}/${pageName.split(sep).map(encodeURIComponent).join('/')}`;
} else base = target;

if (o.serve) {
  if (isUrl) { console.error('--serve needs a local folder or file'); process.exit(2); }
  console.log(`Serving ${target}\nURL for Lighthouse or manual checks:\n${base}?__noprobe=1\n(stays up for ${o.serveSeconds}s, Ctrl-C to stop)`);
  setTimeout(() => { server.close(); process.exit(0); }, o.serveSeconds * 1000);
  await new Promise(() => {});
}
const flags = (w, h, extra = []) => ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--virtual-time-budget=9000', '--no-first-run', `--user-data-dir=${join(out, '.chrome-profile')}`, `--window-size=${w},${h}`, ...(o.reduced ? ['--force-prefers-reduced-motion'] : []), ...extra];
const run = (a, timeout = 90000) => new Promise((res) => { const p = spawn(chrome, a, { stdio: ['ignore', 'pipe', 'pipe'] }); let so = '', se = ''; p.stdout.on('data', (d) => (so += d)); p.stderr.on('data', (d) => (se += d)); const t = setTimeout(() => p.kill(), timeout); p.on('close', (code) => { clearTimeout(t); res({ code, so, se }); }); });
const tag = `${o.reduced ? 'reduced-' : ''}${o.noJs ? 'nojs-' : ''}`;
const results = []; const shots = [];
const origin = isUrl ? '' : new URL(base).origin;
const pagePath = isUrl ? '' : new URL(base).pathname;
const wrap = (w, h, probe) => `${origin}/__wrap?w=${w}&h=${h}&src=${encodeURIComponent(pagePath + (probe ? '' : '?__noprobe=1'))}`;
const ff = findFfmpeg();
let cropWarned = false;

function findFfmpeg() {
  const cand = process.platform === 'win32' ? ['ffmpeg', join(process.env.LOCALAPPDATA || '', 'Microsoft/WinGet/Links/ffmpeg.exe')] : ['ffmpeg', '/opt/homebrew/bin/ffmpeg', '/usr/local/bin/ffmpeg'];
  return process.env.FFMPEG_PATH && existsSync(process.env.FFMPEG_PATH) ? process.env.FFMPEG_PATH : cand;
}
async function crop(file, w, h) {
  const list = Array.isArray(ff) ? ff : [ff];
  for (const f of list) {
    const tmp = file + '.crop.png';
    const r = await run2(f, ['-y', '-v', 'error', '-i', file, '-vf', `crop=${w}:${h}:0:0`, tmp]);
    if (r === 0 && existsSync(tmp)) { const { renameSync } = await import('node:fs'); renameSync(tmp, file); return true; }
  }
  if (!cropWarned) { console.log('note: ffmpeg not found, screenshots keep a white margin to the right of the page'); cropWarned = true; }
  return false;
}
const run2 = (cmd, a) => new Promise((res) => { try { const p = spawn(cmd, a, { stdio: 'ignore' }); p.on('error', () => res(1)); p.on('close', (c) => res(c)); } catch { res(1); } });

for (const w of o.widths) {
  const winW = Math.max(w + 40, 540);
  let probe = null, docH = 3200;
  if (!isUrl) {
    const r = await run(flags(winW, 900, ['--dump-dom']).concat([wrap(w, 900, true)]), 60000);
    const m = r.so.match(/<pre id="__rhad_probe"[^>]*>([\s\S]*?)<\/pre>/);
    if (m) { try { probe = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')); docH = Math.min(o.maxH, Math.max(900, (probe.docHeight || 3200) + 4)); } catch { /* keep defaults */ } }
  }
  const foldH = w < 700 ? 844 : 900;
  const full = join(out, `${tag}${w}-full.png`), fold = join(out, `${tag}${w}-fold.png`);
  const extra = o.noJs ? ['--blink-settings=scriptEnabled=false'] : [];
  if (isUrl) {
    await run(flags(w, docH, extra).concat([`--screenshot=${full}`, base]), 90000);
    await run(flags(w, foldH, extra).concat([`--screenshot=${fold}`, base]), 90000);
  } else {
    await run(flags(winW, docH, extra).concat([`--screenshot=${full}`, wrap(w, docH, false)]), 90000);
    await run(flags(winW, foldH, extra).concat([`--screenshot=${fold}`, wrap(w, foldH, false)]), 90000);
    if (existsSync(full)) await crop(full, w, docH);
    if (existsSync(fold)) await crop(fold, w, foldH);
  }
  shots.push(full, fold);
  console.log(`${w}px  full ${existsSync(full) ? 'ok' : 'FAILED'}  fold ${existsSync(fold) ? 'ok' : 'FAILED'}${probe ? `  height ${probe.docHeight}  viewport ${probe.width}` : ''}`);
  if (probe && Math.abs(probe.width - w) > 20) console.log(`  WARNING: measured viewport ${probe.width}px, requested ${w}px`);
  results.push({ width: w, probe });
}
if (server) server.close();

// Evaluate the probe
const problems = [], warnings = [];
const fmtKB = (n) => `${Math.round((n || 0) / 1024)} kB`;
for (const { width, probe } of results) {
  if (!probe) continue;
  if (probe.probeError) warnings.push(`${width}px: probe error ${probe.probeError}`);
  if (probe.overflowX) problems.push(`${width}px: horizontal overflow. Offenders: ${probe.overflowers.join('; ') || 'unknown'}`);
  if (probe.errors.length) problems.push(`${width}px: ${probe.errors.length} JS error(s): ${probe.errors.slice(0, 2).join(' | ')}`);
  if (probe.brokenImages.length) problems.push(`${width}px: broken image(s): ${probe.brokenImages.slice(0, 3).join(', ')}`);
  if (probe.hiddenTextBlocks > 0 && !o.noJs) problems.push(`${width}px: ${probe.hiddenTextBlocks} text block(s) invisible at load (opacity 0 or hidden): ${probe.hiddenList.join(', ')}. Content must not wait for scroll. Confirm with the no-JS shot.`);
  if (probe.fonts.some((f) => /error/.test(f))) problems.push(`${width}px: font failed to load: ${probe.fonts.filter((f) => /error/.test(f)).join(', ')}`);
  if (probe.tapTargetsTiny > 0) problems.push(`${width}px: ${probe.tapTargetsTiny} interactive element(s) under 24x24 px (WCAG 2.2 minimum): ${(probe.smallTargets || []).join('; ')}`);
  if (probe.tapTargetsUnder44 > 0 && width <= 768) warnings.push(`${width}px: ${probe.tapTargetsUnder44} interactive element(s) under 44 px (touch preference): ${(probe.smallTargets || []).join('; ')}`);
  if (probe.minFontPx && probe.minFontPx < 12) warnings.push(`${width}px: smallest text ${probe.minFontPx}px`);
  if (probe.cls > 0.1) warnings.push(`${width}px: layout shift ${probe.cls.toFixed(3)} (target 0.1 or less)`);
  if (probe.lcp > 2500) warnings.push(`${width}px: LCP ${Math.round(probe.lcp)} ms on localhost (target 2500 ms on a real phone; this is optimistic)`);
  if (probe.h1 !== 1) problems.push(`${width}px: ${probe.h1} h1 elements`);
  if (probe.imagesNoDims > 0) warnings.push(`${width}px: ${probe.imagesNoDims} image(s) without width and height`);
}
const p0 = results.find((r) => r.probe)?.probe;
const md = [`# Shoot report`, '', `Target: ${target}`, `Mode: ${o.reduced ? 'reduced motion ' : ''}${o.noJs ? 'no JS ' : ''}${isUrl ? 'URL (screenshots only)' : 'local probe'}`, `Widths: ${o.widths.join(', ')}`, '', '## Screenshots', ...shots.map((s) => `- ${basename(s)}`), '', `Folder: ${out}`, ''];
if (p0) md.push('## Weight (uncompressed, local)', `- JS ${fmtKB(p0.bytes.js)}  CSS ${fmtKB(p0.bytes.css)}  images ${fmtKB(p0.bytes.img)}  fonts ${fmtKB(p0.bytes.font)}  requests ${p0.requests}`, `- Fonts: ${p0.fonts.join(', ') || 'none declared'}`, '');
md.push('## Blocking problems', ...(problems.length ? problems.map((x) => `- ${x}`) : ['- none']), '', '## Warnings', ...(warnings.length ? warnings.map((x) => `- ${x}`) : ['- none']), '', 'Open the screenshots and read them. Numbers do not replace looking.');
writeFileSync(join(out, `${tag}shoot-report.md`), md.join('\n')); writeFileSync(join(out, `${tag}shoot-report.json`), JSON.stringify({ target, problems, warnings, results }, null, 2));
if (o.probe || !isUrl) { console.log('\n' + md.slice(md.indexOf('## Blocking problems')).join('\n')); }
console.log(`\nReport: ${join(out, `${tag}shoot-report.md`)}`);
console.log(`Screenshots folder: ${out}`);
process.exit(problems.length ? 1 : 0);
