#!/usr/bin/env bash
set -euo pipefail

# Installs the agent team into the GLOBAL ~/.claude/ so every
# project on this machine shares one copy of the agents, skills, and hooks.
# The agents live only in this hub clone; symlinks keep every session current,
# so a `git pull` here updates the team everywhere with no per-project import.
#
# Usage (from anywhere inside an agent-team clone):
#   bash .claude/scripts/global-install.sh            # symlink (recommended)
#   bash .claude/scripts/global-install.sh --copy     # copy instead of symlink
#   bash .claude/scripts/global-install.sh --force    # replace real dirs (backed up to .bak)
#
# Symlink mode means `git pull` in this clone instantly updates ~/.claude.
# Copy mode is a snapshot you must re-run to update.
#
# This NEVER overwrites an existing ~/.claude/settings.json — it only reports
# what to wire up.

mode="symlink"
force=0
for arg in "$@"; do
  case "$arg" in
    --copy) mode="copy" ;;
    --force) force=1 ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "error: unknown argument '$arg' (see --help)" >&2; exit 1 ;;
  esac
done

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
hub_root="$(cd "$script_dir/../.." && pwd)"

if [ ! -d "$hub_root/.claude/agents" ]; then
  echo "error: can't find .claude/agents next to this script — run me from an agent-team clone." >&2
  exit 1
fi

dest="$HOME/.claude"
mkdir -p "$dest"

link_one() {
  src="$hub_root/.claude/$1"
  target="$dest/$1"
  [ -e "$src" ] || return 0

  if [ -L "$target" ]; then
    rm -f "$target"
  elif [ -e "$target" ]; then
    if [ "$force" -eq 1 ]; then
      mv "$target" "$target.bak.$(date +%s)"
      echo "  backed up existing $target → $target.bak.*"
    else
      echo "  skip $1 — $target already exists (re-run with --force to replace, backing it up first)"
      return 0
    fi
  fi

  if [ "$mode" = "copy" ]; then
    cp -R "$src" "$target"
    echo "  copied $1 → $target"
  else
    ln -s "$src" "$target"
    echo "  linked $1 → $target"
  fi
}

echo "Installing the agent team into $dest ($mode mode) ..."
link_one agents
link_one skills
link_one hooks
link_one agent-models.json

echo ""
if [ -f "$dest/settings.json" ]; then
  echo "NOTE: $dest/settings.json already exists — left untouched."
  echo "  Make sure it wires the hooks from $dest/hooks (compare against $hub_root/.claude/settings.json)."
else
  cp "$hub_root/.claude/settings.json" "$dest/settings.json"
  echo "Copied settings.json (hook wiring) → $dest/settings.json"
fi

echo ""
echo "Done. The team is now global. Per project, add a ProjectAgents.md"
echo "(template: $hub_root/docs/templates/ProjectAgents.md) for that"
echo "project's models and customizations. Update the team later with:"
echo "  git -C \"$hub_root\" pull"
