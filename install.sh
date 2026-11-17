#!/usr/bin/env bash
# One-step install for rhad-web (macOS and Linux), for Claude Code and/or Codex.
#   bash install.sh --dry-run                 preview, changes nothing
#   bash install.sh                           auto-detect Claude Code and Codex
#   bash install.sh --agent codex             claude | codex | both | auto (default)
# Options: --force (overwrite installed skills), --yes (no prompt), --skip-deps (copy skills only)
#          SKILLS_DIR=/path overrides the skills folder (single agent only)
# Skills go to ~/.claude/skills (Claude Code) and ~/.agents/skills (Codex).
set -eu
DRY=0; FORCE=0; YES=0; DEPS=1; AGENT=auto
while [ $# -gt 0 ]; do case "$1" in --dry-run) DRY=1;; --force) FORCE=1;; --yes) YES=1;; --skip-deps) DEPS=0;; --agent) shift; AGENT="${1:-auto}";; esac; shift; done
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$REPO/plugins/rhad-web/skills"
have() { command -v "$1" >/dev/null 2>&1; }

if [ "$AGENT" = auto ]; then
  HC=0; HX=0
  { have claude || [ -d "$HOME/.claude" ]; } && HC=1
  { have codex || [ -d "$HOME/.codex" ]; } && HX=1
  if [ $HC = 1 ] && [ $HX = 1 ]; then AGENT=both; elif [ $HX = 1 ]; then AGENT=codex; else AGENT=claude; fi
  echo "Detected agent: $AGENT"
fi
case "$AGENT" in claude|codex|both) ;; *) echo "--agent must be auto, claude, codex or both"; exit 2;; esac
AGENTS="$AGENT"; [ "$AGENT" = both ] && AGENTS="claude codex"
if [ -n "${SKILLS_DIR:-}" ] && [ "$AGENT" = both ]; then echo "SKILLS_DIR needs a single --agent."; exit 2; fi

if [ "$DRY" = 0 ] && [ "$YES" = 0 ]; then read -r -p "Copy skills for $AGENT and install dependencies? (y/N) " a; [[ "$a" =~ ^[Yy] ]] || { echo Cancelled.; exit 1; }; fi
for AG in $AGENTS; do
  if [ -n "${SKILLS_DIR:-}" ]; then DST="$SKILLS_DIR"; elif [ "$AG" = codex ]; then DST="$HOME/.agents/skills"; else DST="$HOME/.claude/skills"; fi
  echo; echo "[$AG] -> $DST $([ "$DRY" = 1 ] && echo '(DRY RUN)')"
  [ "$DRY" = 1 ] || mkdir -p "$DST"
  for d in "$SRC"/*/; do
    n="$(basename "$d")"
    if [ -d "$DST/$n" ] && [ "$FORCE" = 0 ]; then echo "SKIP     $n (exists, use --force to overwrite)"; continue; fi
    echo "COPY     $n"
    [ "$DRY" = 1 ] || { rm -rf "$DST/$n"; cp -r "$d" "$DST/$n"; }
  done
done
[ "$DEPS" = 1 ] || { echo "Dependencies skipped."; exit 0; }
FLAGS="--yes"; [ "$DRY" = 1 ] && FLAGS="--dry-run"
bash "$SRC/rhad-web/scripts/install-skills.sh" --agent "$AGENT" $FLAGS
