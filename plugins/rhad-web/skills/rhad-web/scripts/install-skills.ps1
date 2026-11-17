# Installs the companion tools, skills and director agents for rhad-web (Windows), for Claude Code, Codex, or both.
# Usage:  powershell -ExecutionPolicy Bypass -File install-skills.ps1 [-Agent claude|codex|both] [-DryRun] [-Only a,b] [-Skip c] [-Yes] [-SkillsDir <path>] [-NoRetry]
# Always run with -DryRun first. Every third-party command is printed before it runs.
# After installing, every item is verified. Failures get a plain explanation, next steps, and (in an interactive
# console) an offer to retry. Exit code: 0 all good, 3 something failed or could not be verified.
param(
  [ValidateSet('claude','codex','both')][string]$Agent = 'claude',
  [switch]$DryRun,
  [string[]]$Only = @(),
  [string[]]$Skip = @(),
  [switch]$Yes,
  [string]$SkillsDir = '',
  [string]$Manifest = '',
  [switch]$NoRetry
)
$ErrorActionPreference = 'Continue'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$root = Split-Path -Parent $here
$manPath = if ($Manifest) { $Manifest } else { Join-Path $here 'skills-manifest.json' }
$man = Get-Content $manPath -Raw | ConvertFrom-Json
$agents = if ($Agent -eq 'both') { @('claude','codex') } else { @($Agent) }
if ($SkillsDir -and $agents.Count -gt 1) { Write-Host '-SkillsDir needs a single -Agent.' -ForegroundColor Red; exit 2 }
$canPrompt = (-not $DryRun) -and (-not $NoRetry) -and [Environment]::UserInteractive -and (-not [Console]::IsInputRedirected)

function Want($id) { if ($Only.Count -gt 0 -and ($Only -notcontains $id)) { return $false }; if ($Skip -contains $id) { return $false }; return $true }
function Have-Cmd($c) { return [bool](Get-Command $c -ErrorAction SilentlyContinue) }
function Run($cmd) {
  Write-Host "  > $cmd" -ForegroundColor Cyan
  if ($DryRun) { return 0 }
  cmd /c $cmd
  return $LASTEXITCODE
}
function Fill($cmd, $ph) { foreach ($k in $ph.PSObject.Properties.Name) { $cmd = $cmd.Replace('{' + $k + '}', $ph.$k) }; return $cmd }
function Skills-Home($ag) { if ($SkillsDir) { return $SkillsDir }; return (Join-Path $HOME ($man.skillsDir.$ag -replace '/', '\')) }
function Skill-Roots($ag) { return @((Skills-Home $ag), (Join-Path $HOME '.agents\skills'), (Join-Path $HOME '.claude\skills')) }
function Installed-Skill($dirs, $ag) { foreach ($d in $dirs) { foreach ($r in (Skill-Roots $ag)) { if (Test-Path (Join-Path $r $d)) { return $true } } }; return $false }
function Tool-Ok($t) {
  try { & $t.check[0] $t.check[1..($t.check.Length-1)] 2>$null | Out-Null; if ($LASTEXITCODE -eq 0) { return $true } } catch { }
  # Not on this shell's PATH: ask the skill's own locator (WinGet, npm global, scoop, chocolatey folders).
  if (($t.id -in 'ffmpeg','ffprobe','playwright-cli') -and (Have-Cmd 'node')) {
    $lib = (Join-Path $here 'lib\tools.mjs') -replace '\\', '/'
    node --input-type=module -e "import {findTool} from 'file:///$lib'; process.exit(findTool('$($t.id)') ? 0 : 1)" 2>$null | Out-Null
    return ($LASTEXITCODE -eq 0)
  }
  return $false
}

$script:Fail = [ordered]@{}   # key "id|agent" -> @{ id; agent; reason; cmd; fix }
$script:Fix = @{ default = 'Run the command shown above in a normal terminal to see the full error. Common causes: no network or a proxy, npm global install without permission, Node older than 22, or a CLI (claude, codex) that is not on PATH.' }

function Note-Fail($id, $ag, $reason, $cmd, $fix) { $script:Fail["$id|$ag"] = @{ id = $id; agent = $ag; reason = $reason; cmd = $cmd; fix = $(if ($fix) { $fix } else { $script:Fix.default }) } }
function Clear-Fail($id, $ag) { $script:Fail.Remove("$id|$ag") }

function Do-Tool($t) {
  if (Tool-Ok $t) { Write-Host "OK       $($t.id)"; Clear-Fail $t.id 'all'; return }
  Write-Host "INSTALL  $($t.id)" -ForegroundColor Yellow
  $cmds = @(); if ($t.win) { $cmds += $t.win }; if ($t.all) { $cmds += $t.all }
  if (-not $cmds) { Write-Host "  (no installer: $($t.note))"; if (-not $DryRun) { Note-Fail $t.id 'all' 'no automatic installer for this tool' '' $t.fix }; return }
  foreach ($c in $cmds) { $code = Run $c; if ($code -ne 0) { Note-Fail $t.id 'all' "command failed (exit $code)" $c $t.fix; return } }
  if ($DryRun) { return }
  # ffmpeg and similar may install fine but not be on this shell's PATH yet; the skill scripts also search the usual folders.
  if (Tool-Ok $t) { Clear-Fail $t.id 'all'; Write-Host "  verified: $($t.id)" -ForegroundColor Green }
  else { Note-Fail $t.id 'all' 'installed, but not found on PATH in this shell. Open a new terminal. The skill scripts also search the usual install folders.' ($cmds -join ' ; ') $t.fix }
}

function Do-Skill($s, $ag) {
  $ph = $man.placeholders.$ag
  if (Installed-Skill $s.dirs $ag) { Write-Host "OK       $($s.id)"; Clear-Fail $s.id $ag; return }
  Write-Host "INSTALL  $($s.id)  $(if($s.note){'[' + $s.note + ']'})" -ForegroundColor Yellow
  $cmds = if ($s.$ag) { $s.$ag } else { $s.all }
  foreach ($c in $cmds) { $f = Fill $c $ph; $code = Run $f; if ($code -ne 0) { Note-Fail $s.id $ag "command failed (exit $code)" $f $s.fix; return } }
  if ($DryRun) { return }
  if (Installed-Skill $s.dirs $ag) { Clear-Fail $s.id $ag; Write-Host "  verified: $($s.id)" -ForegroundColor Green }
  else { Note-Fail $s.id $ag "the command finished but no skill folder named $($s.dirs -join ' / ') appeared in $((Skill-Roots $ag) -join ', ')" ($cmds -join ' ; ') $s.fix }
}

function Do-Bundled($b, $ag) {
  $skillsHome = Skills-Home $ag
  $src = Join-Path $root "bundled-skills\$b"
  if (-not (Test-Path $src)) { $src = Join-Path (Split-Path -Parent $root) $b }
  $dst = Join-Path $skillsHome $b
  if (Test-Path $dst) { Write-Host "OK       $b (already in $skillsHome; not overwritten)"; return }
  if (-not (Test-Path $src)) { Note-Fail $b $ag "bundled source folder not found (looked in bundled-skills and the sibling skills folder)" '' 'Re-clone the repository or rebuild the .skill file with node tools/build-skill.mjs.'; return }
  Write-Host "COPY     $b -> $dst" -ForegroundColor Yellow
  if (-not $DryRun) { Copy-Item $src $dst -Recurse; if (-not (Test-Path (Join-Path $dst 'SKILL.md'))) { Note-Fail $b $ag 'copied, but SKILL.md is missing in the destination' '' 'Check disk space and permissions on the skills folder, then retry.' } }
}


function Do-Directors($ag) {
  $node = Join-Path $here 'install-directors.mjs'
  if (-not (Test-Path $node)) { Note-Fail 'directors' $ag 'install-directors.mjs not found' '' 'Re-clone the repository or rebuild the .skill file.'; return }
  Write-Host "DIRECTORS ai-slop-director + ux-flow-director -> $ag" -ForegroundColor Yellow
  $cmd = "node `"$node`" --agent $ag" + $(if ($DryRun) { ' --dry-run' } else { '' })
  $code = Run $cmd
  if ($code -ne 0) { Note-Fail 'directors' $ag "install-directors failed (exit $code)" $cmd 'Run the command in a normal terminal. It copies two files into ~/.claude/agents (Claude Code) or ~/.codex/agents (Codex). Check the folder is writable. In Claude Code, installing rhad-web as a plugin also provides them.'; return }
  if (-not $DryRun) { node $node --agent $ag --check 2>&1 | Out-Null; if ($LASTEXITCODE -ne 0) { Note-Fail 'directors' $ag 'installed, but the files are missing or differ from the packaged copy' $cmd 'Run again with --force, or copy director-agents\* by hand.' } else { Clear-Fail 'directors' $ag; Write-Host '  verified: directors' -ForegroundColor Green } }
}

function Run-Pass($ids) {
  foreach ($t in $man.tools) { if ((Want $t.id) -and ((-not $ids) -or ($ids -contains $t.id))) { Do-Tool $t } }
  foreach ($ag in $agents) {
    Write-Host "`n== $ag ==" -ForegroundColor Yellow
    if ($ag -eq 'claude' -and -not (Have-Cmd 'claude')) { Write-Host 'note: claude CLI not on PATH. Skills are still copied; npx-based installs do not need it.' }
    if ($ag -eq 'codex' -and -not (Have-Cmd 'codex')) { Write-Host 'note: codex CLI not on PATH. Skills are still copied to the Codex skills folder.' }
    if (-not $DryRun) { New-Item -ItemType Directory -Force (Skills-Home $ag) | Out-Null }
    foreach ($s in $man.skills) { if ((Want $s.id) -and ((-not $ids) -or ($ids -contains $s.id))) { Do-Skill $s $ag } }
    foreach ($b in $man.bundled) { if ((Want $b) -and ((-not $ids) -or ($ids -contains $b))) { Do-Bundled $b $ag } }
    if ((Want 'directors') -and ((-not $ids) -or ($ids -contains 'directors'))) { Do-Directors $ag }
  }
}

function Show-Failures {
  Write-Host "`nSome installs failed or could not be verified:" -ForegroundColor Red
  foreach ($f in $script:Fail.Values) {
    Write-Host "  - $($f.id) [$($f.agent)]: $($f.reason)" -ForegroundColor Red
    if ($f.cmd) { Write-Host "      command: $($f.cmd)" }
    Write-Host "      next step: $($f.fix)"
  }
  $ids = ($script:Fail.Values | ForEach-Object { $_.id } | Select-Object -Unique) -join ','
  Write-Host "`nRetry only these:   powershell -ExecutionPolicy Bypass -File `"$($MyInvocation.ScriptName)`" -Agent $Agent -Only $ids -Yes"
  Write-Host "Skip them and go on: add -Skip $ids  (the main skill still works; media analysis needs ffmpeg, renders need Chrome or Edge)"
}

Write-Host "`nrhad-web installer  agent: $Agent  $(if($DryRun){'(DRY RUN, nothing will change)'})" -ForegroundColor Yellow
if (-not $DryRun -and -not $Yes) {
  Write-Host 'This installs third-party tools and skills on this machine. Run with -DryRun to preview.'
  $a = Read-Host 'Continue? (y/N)'; if ($a -notmatch '^(y|yes)$') { Write-Host 'Cancelled.'; exit 1 }
}
foreach ($c in 'node','npm','git') { if (-not (Have-Cmd $c)) { Write-Host "MISSING prerequisite: $c. Install it first (https://nodejs.org, https://git-scm.com)." -ForegroundColor Red; if (-not $DryRun) { exit 2 } } }

Run-Pass $null
$round = 0
while ($script:Fail.Count -gt 0 -and -not $DryRun) {
  Show-Failures
  if (-not $canPrompt) { break }
  $round++
  $ans = Read-Host "`n[R] Retry the failed items   [S] Skip them and finish   (round $round)"
  if ($ans -match '^(s|skip)') { break }
  $ids = @($script:Fail.Values | ForEach-Object { $_.id } | Select-Object -Unique)
  Write-Host "`nRetrying: $($ids -join ', ')" -ForegroundColor Yellow
  Run-Pass $ids
  if ($round -ge 5) { Write-Host 'Stopping after 5 retries.'; break }
}

Write-Host ''
if ($DryRun) { Write-Host 'Dry run finished. Nothing was changed.'; exit 0 }
if ($script:Fail.Count -eq 0) { Write-Host 'All installs verified.' -ForegroundColor Green; Write-Host 'Restart Claude Code or Codex, then run: node scripts/preflight.mjs'; exit 0 }
Write-Host 'Finished with problems (see the list above). The skill is installed; fix or skip the failed items when you are ready.' -ForegroundColor Yellow
exit 3
