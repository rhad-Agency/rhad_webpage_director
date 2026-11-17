# One-step install for rhad-web (Windows), for Claude Code and/or Codex.
#   powershell -ExecutionPolicy Bypass -File install.ps1 -DryRun            # preview, changes nothing
#   powershell -ExecutionPolicy Bypass -File install.ps1                    # auto-detect Claude Code and Codex
#   powershell -ExecutionPolicy Bypass -File install.ps1 -Agent codex       # claude | codex | both | auto (default)
# Options: -Force (overwrite skills already installed), -SkillsDir <path> (single agent), -Yes (no prompt),
#          -Only a,b / -Skip a,b (limit third-party installs), -SkipDeps (copy skills only)
# Skills go to ~\.claude\skills (Claude Code) and ~\.agents\skills (Codex).
param(
  [ValidateSet('auto','claude','codex','both')][string]$Agent = 'auto',
  [switch]$DryRun,
  [switch]$Force,
  [switch]$Yes,
  [switch]$SkipDeps,
  [string]$SkillsDir = '',
  [string[]]$Only = @(),
  [string[]]$Skip = @()
)
$ErrorActionPreference = 'Stop'
$repo = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $repo 'plugins\rhad-web\skills'
function Have-Cmd($c) { return [bool](Get-Command $c -ErrorAction SilentlyContinue) }

if ($Agent -eq 'auto') {
  $hasClaude = (Have-Cmd 'claude') -or (Test-Path (Join-Path $HOME '.claude'))
  $hasCodex = (Have-Cmd 'codex') -or (Test-Path (Join-Path $HOME '.codex'))
  $Agent = if ($hasClaude -and $hasCodex) { 'both' } elseif ($hasCodex) { 'codex' } else { 'claude' }
  Write-Host "Detected agent: $Agent"
}
$agents = if ($Agent -eq 'both') { @('claude','codex') } else { @($Agent) }
if ($SkillsDir -and $agents.Count -gt 1) { Write-Host '-SkillsDir needs a single -Agent.' -ForegroundColor Red; exit 2 }

if (-not $DryRun -and -not $Yes) { $a = Read-Host "Copy skills for $Agent and install dependencies? (y/N)"; if ($a -notmatch '^(y|yes)$') { Write-Host 'Cancelled.'; exit 1 } }

foreach ($ag in $agents) {
  $dst = if ($SkillsDir) { $SkillsDir } elseif ($ag -eq 'codex') { Join-Path $HOME '.agents\skills' } else { Join-Path $HOME '.claude\skills' }
  Write-Host "`n[$ag]  ->  $dst  $(if($DryRun){'(DRY RUN)'})" -ForegroundColor Yellow
  if (-not $DryRun) { New-Item -ItemType Directory -Force $dst | Out-Null }
  foreach ($d in Get-ChildItem $src -Directory) {
    $target = Join-Path $dst $d.Name
    if ((Test-Path $target) -and -not $Force) { Write-Host "SKIP     $($d.Name) (exists, use -Force to overwrite)"; continue }
    Write-Host "COPY     $($d.Name)"
    if (-not $DryRun) { if (Test-Path $target) { Remove-Item $target -Recurse -Force }; Copy-Item $d.FullName $target -Recurse }
  }
}

if ($SkipDeps) { Write-Host 'Dependencies skipped.'; exit 0 }
$inst = Join-Path $src 'rhad-web\scripts\install-skills.ps1'
$args2 = @('-NoProfile','-ExecutionPolicy','Bypass','-File',$inst,'-Agent',$Agent,'-Yes')
if ($SkillsDir) { $args2 += @('-SkillsDir', $SkillsDir) }
if ($DryRun) { $args2 += '-DryRun' }
if ($Only.Count) { $args2 += @('-Only', ($Only -join ',')) }
if ($Skip.Count) { $args2 += @('-Skip', ($Skip -join ',')) }
powershell @args2
exit $LASTEXITCODE
