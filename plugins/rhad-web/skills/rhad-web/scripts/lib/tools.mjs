// Locate external tools without relying on PATH.
// Agent sandboxes (Codex, Claude Code) often start with a shorter PATH than your terminal, so a tool that works
// in PowerShell can look "missing". Order: env override, PATH, then well-known install folders.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const win = process.platform === 'win32';
const home = homedir();
const env = process.env;

const OVERRIDE = { ffmpeg: 'FFMPEG_PATH', ffprobe: 'FFPROBE_PATH', 'playwright-cli': 'PLAYWRIGHT_CLI_PATH', node: 'NODE_PATH_BIN' };

function candidateDirs() {
  if (win) {
    const la = env.LOCALAPPDATA || join(home, 'AppData', 'Local');
    const ap = env.APPDATA || join(home, 'AppData', 'Roaming');
    const pf = env.ProgramFiles || 'C:\\Program Files';
    return [
      join(la, 'Microsoft', 'WinGet', 'Links'), join(ap, 'npm'), join(home, 'scoop', 'shims'),
      join(env.ProgramData || 'C:\\ProgramData', 'chocolatey', 'bin'),
      'C:\\ffmpeg\\bin', join(pf, 'ffmpeg', 'bin'), join(pf, 'nodejs'), join(home, '.volta', 'bin'),
    ];
  }
  return ['/opt/homebrew/bin', '/usr/local/bin', '/usr/bin', '/snap/bin', join(home, '.local', 'bin'), join(home, '.npm-global', 'bin'), join(home, '.volta', 'bin'), join(home, '.bun', 'bin')];
}

const exts = win ? ['.exe', '.cmd', '.bat', ''] : [''];

/** Returns { path, via } or null. `via` is 'env', 'PATH' or the folder it was found in. */
export function findTool(name) {
  const o = OVERRIDE[name] && env[OVERRIDE[name]];
  if (o && existsSync(o)) return { path: o, via: 'env' };
  // Resolve through the shell's own lookup without shell:true (avoids Node's DEP0190 warning).
  const look = win ? spawnSync('where', [name], { encoding: 'utf8', stdio: 'pipe', windowsHide: true }) : spawnSync('sh', ['-c', `command -v "${name}"`], { encoding: 'utf8', stdio: 'pipe' });
  const hit = look.status === 0 && look.stdout.split(/\r?\n/).find((l) => l.trim());
  if (hit) return { path: hit.trim(), via: 'PATH' };
  for (const d of candidateDirs()) for (const e of exts) { const p = join(d, name + e); if (existsSync(p)) return { path: p, via: d }; }
  return null;
}

/** Run a located tool. .cmd/.bat shims need a shell on Windows. */
export function runTool(found, args, opts = {}) {
  const shim = win && /\.(cmd|bat)$/i.test(found.path);
  const base = { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, windowsHide: true, ...opts };
  if (shim) return spawnSync(`"${found.path}" ${args.map((a) => `"${String(a).replace(/"/g, '\\"')}"`).join(' ')}`, { ...base, shell: true });
  return spawnSync(found.path, args, base);
}

export const INSTALL_HINT = {
  ffmpeg: 'Windows: winget install -e --id Gyan.FFmpeg | macOS: brew install ffmpeg | Linux: sudo apt-get install ffmpeg. Or set FFMPEG_PATH and FFPROBE_PATH to the full file paths.',
  ffprobe: 'Installed with ffmpeg. Or set FFPROBE_PATH to the full file path.',
  'playwright-cli': 'npm install -g @playwright/cli@latest, then playwright-cli install --skills. Or set PLAYWRIGHT_CLI_PATH.',
};
