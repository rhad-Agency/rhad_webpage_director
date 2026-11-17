#!/usr/bin/env bash
# Installs the companion tools, skills and director agents for rhad-web (macOS/Linux), for Claude Code, Codex, or both.
# Usage: bash install-skills.sh [--agent claude|codex|both] [--dry-run] [--yes] [--no-retry]
#        SKILLS_DIR=/path overrides the skills folder (single agent only); MANIFEST=/path overrides skills-manifest.json
# Always run with --dry-run first. Every third-party command is printed before it runs.
# After installing, every item is verified. Failures get a plain explanation, next steps and (in an interactive
# terminal) an offer to retry. Exit code: 0 all good, 3 something failed or could not be verified.
set -u
DRY=0; YES=0; AGENT=claude; NORETRY=0
while [ $# -gt 0 ]; do case "$1" in --dry-run) DRY=1;; --yes) YES=1;; --no-retry) NORETRY=1;; --agent) shift; AGENT="${1:-claude}";; esac; shift; done
case "$AGENT" in claude|codex|both) ;; *) echo "--agent must be claude, codex or both"; exit 2;; esac
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; ROOT="$(dirname "$HERE")"
MANIFEST="${MANIFEST:-$HERE/skills-manifest.json}"
AGENTS="$AGENT"; [ "$AGENT" = both ] && AGENTS="claude codex"
if [ -n "${SKILLS_DIR:-}" ] && [ "$AGENT" = both ]; then echo "SKILLS_DIR needs a single --agent."; exit 2; fi
TMP="${TMPDIR:-/tmp}"
CAN_PROMPT=0; [ "$DRY" = 0 ] && [ "$NORETRY" = 0 ] && [ -t 0 ] && [ -t 1 ] && CAN_PROMPT=1
FAILS=()      # entries: id|agent|reason|command|fix
ONLY="${ONLY:-}"   # space-separated ids to process; empty means all
DEFAULT_FIX="Run the command shown in a normal terminal to see the full error. Common causes: no network or a proxy, npm global install without permission, Node older than 22, or a CLI (claude, codex) that is not on PATH."

have() { command -v "$1" >/dev/null 2>&1; }
run() { echo "  > $1"; [ "$DRY" = 1 ] && return 0; bash -c "$1"; }
want() { [ -z "$ONLY" ] || case " $ONLY " in *" $1 "*) return 0;; *) return 1;; esac; }
note_fail() { # id agent reason cmd fix
  local k="$1|$2|"; local n=(); for f in "${FAILS[@]+"${FAILS[@]}"}"; do case "$f" in "$k"*) ;; *) n+=("$f");; esac; done
  FAILS=("${n[@]+"${n[@]}"}" "$1|$2|$3|$4|${5:-$DEFAULT_FIX}")
}
clear_fail() { local k="$1|$2|"; local n=(); for f in "${FAILS[@]+"${FAILS[@]}"}"; do case "$f" in "$k"*) ;; *) n+=("$f");; esac; done; FAILS=("${n[@]+"${n[@]}"}"); }

for c in node npm git; do have "$c" || { echo "MISSING prerequisite: $c"; [ "$DRY" = 1 ] || exit 2; }; done
echo "rhad-web installer  agent: $AGENT $([ "$DRY" = 1 ] && echo '(DRY RUN)')"
if [ "$DRY" = 0 ] && [ "$YES" = 0 ]; then read -r -p "Install third-party tools and skills? (y/N) " a; [[ "$a" =~ ^[Yy] ]] || exit 1; fi

# Build a per-agent plan with node (no jq dependency). Placeholders are filled here.
plan() {
node - "$MANIFEST" "$(uname -s)" "$1" <<'JS'
const m = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf8')); const os = process.argv[3] === 'Darwin' ? 'mac' : 'linux'; const ag = process.argv[4];
const q = (s) => `'${String(s || '').replace(/'/g, `'\\''`)}'`;
const fill = (c) => Object.entries(m.placeholders[ag]).reduce((a, [k, v]) => a.split(`{${k}}`).join(v), c);
if (ag === 'claude') for (const t of m.tools) { const cmds = [t[os], ...(t.all || [])].filter(Boolean); console.log(`tool ${q(t.id)} ${q(t.check.join(' '))} ${q(cmds.join(' && '))} ${q(t.fix)}`); }
for (const s of m.skills) { const cmds = (s[ag] || s.all).map(fill); console.log(`skill ${q(s.id)} ${q(s.dirs.join(' '))} ${q(cmds.join(' && '))} ${q(s.fix)}`); }
for (const b of m.bundled) console.log(`bundled ${q(b)}`);
JS
}

skills_home() { if [ -n "${SKILLS_DIR:-}" ]; then echo "$SKILLS_DIR"; elif [ "$1" = codex ]; then echo "$HOME/.agents/skills"; else echo "$HOME/.claude/skills"; fi; }

pass() {
  for AG in $AGENTS; do
    echo; echo "== $AG =="
    SK="$(skills_home "$AG")"; CUR_AG="$AG"
    have "$AG" || echo "note: $AG CLI not on PATH. Skills are still copied to $SK; npx-based installs do not need it."
    [ "$DRY" = 1 ] || mkdir -p "$SK"
    tool() { # id check cmds fix
      want "$1" || return 0
      if bash -c "$2" >/dev/null 2>&1; then echo "OK       $1"; clear_fail "$1" all; return; fi
      echo "INSTALL  $1"; run "$3" || { note_fail "$1" all "command failed" "$3" "$4"; return; }
      [ "$DRY" = 1 ] && return
      if bash -c "$2" >/dev/null 2>&1; then clear_fail "$1" all; echo "  verified: $1"; else note_fail "$1" all "installed, but not found on PATH in this shell. Open a new terminal." "$3" "$4"; fi
    }
    skill() { # id dirs cmds fix
      want "$1" || return 0
      for d in $2; do { [ -d "$SK/$d" ] || [ -d "$HOME/.agents/skills/$d" ] || [ -d "$HOME/.claude/skills/$d" ]; } && { echo "OK       $1"; clear_fail "$1" "$CUR_AG"; return; }; done
      echo "INSTALL  $1"; run "$3" || { note_fail "$1" "$CUR_AG" "command failed" "$3" "$4"; return; }
      [ "$DRY" = 1 ] && return
      for d in $2; do { [ -d "$SK/$d" ] || [ -d "$HOME/.agents/skills/$d" ] || [ -d "$HOME/.claude/skills/$d" ]; } && { clear_fail "$1" "$CUR_AG"; echo "  verified: $1"; return; }; done
      note_fail "$1" "$CUR_AG" "the command finished but no skill folder named $2 appeared in $SK" "$3" "$4"
    }
    bundled() {
      want "$1" || return 0
      local src="$ROOT/bundled-skills/$1"; [ -d "$src" ] || src="$(dirname "$ROOT")/$1"
      if [ -d "$SK/$1" ]; then echo "OK       $1 (already present)"; return; fi
      [ -d "$src" ] || { note_fail "$1" "$CUR_AG" "bundled source folder not found" "" "Re-clone the repository or rebuild with node tools/build-skill.mjs."; return; }
      echo "COPY     $1 -> $SK/$1"
      [ "$DRY" = 1 ] || { cp -r "$src" "$SK/$1" && [ -f "$SK/$1/SKILL.md" ] || note_fail "$1" "$CUR_AG" "copy failed or SKILL.md missing" "" "Check disk space and permissions on $SK, then retry."; }
    }
    directors() {
      want "directors" || return 0
      local cmd="node \"$HERE/install-directors.mjs\" --agent $CUR_AG"
      [ "$DRY" = 1 ] && cmd="$cmd --dry-run"
      echo "DIRECTORS ai-slop-director + ux-flow-director -> $CUR_AG"; run "$cmd" || { note_fail directors "$CUR_AG" "install-directors failed" "$cmd" "Run the command in a normal terminal. It copies two files into ~/.claude/agents (Claude Code) or ~/.codex/agents (Codex). Check the folder is writable. In Claude Code, installing rhad-web as a plugin also provides them."; return; }
      [ "$DRY" = 1 ] && return
      if node "$HERE/install-directors.mjs" --agent "$CUR_AG" --check >/dev/null 2>&1; then clear_fail directors "$CUR_AG"; echo "  verified: directors"; else note_fail directors "$CUR_AG" "installed, but files are missing or differ from the packaged copy" "$cmd" "Run again with --force, or copy director-agents/* by hand."; fi
    }
    plan "$AG" > "$TMP/rhad-web-plan.sh"
    # shellcheck disable=SC1090
    source "$TMP/rhad-web-plan.sh"
    directors
  done
}

show_failures() {
  echo; echo "Some installs failed or could not be verified:"
  local ids=""
  for f in "${FAILS[@]}"; do IFS='|' read -r id ag reason cmd fix <<<"$f"; echo "  - $id [$ag]: $reason"; [ -n "$cmd" ] && echo "      command: $cmd"; echo "      next step: $fix"; ids="$ids $id"; done
  ids="$(echo "$ids" | tr ' ' '\n' | sort -u | tr '\n' ',' | sed 's/^,//; s/,$//')"
  echo; echo "Retry only these:   ONLY=\"${ids//,/ }\" bash \"$0\" --agent $AGENT --yes"
  echo "Skip them and go on: the main skill still works; media analysis needs ffmpeg, renders need Chrome or Edge."
}

pass
round=0
while [ ${#FAILS[@]} -gt 0 ] && [ "$DRY" = 0 ]; do
  show_failures
  [ "$CAN_PROMPT" = 1 ] || break
  round=$((round+1))
  read -r -p "[R] Retry the failed items   [S] Skip them and finish (round $round) " ans
  case "$ans" in s|S|skip) break;; esac
  ONLY=""; for f in "${FAILS[@]}"; do ONLY="$ONLY ${f%%|*}"; done
  echo; echo "Retrying:$ONLY"; pass
  [ "$round" -ge 5 ] && { echo "Stopping after 5 retries."; break; }
done
echo
if [ "$DRY" = 1 ]; then echo "Dry run finished. Nothing was changed."; exit 0; fi
if [ ${#FAILS[@]} -eq 0 ]; then echo "All installs verified."; echo "Restart Claude Code or Codex, then run: node scripts/preflight.mjs"; exit 0; fi
echo "Finished with problems (see the list above). The skill is installed; fix or skip the failed items when you are ready."
exit 3
