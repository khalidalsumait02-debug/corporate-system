#!/usr/bin/env bash
# PreToolUse hook for Write/Edit. Refuses to let an agent edit code on:
#   1. `main` or `master` (you must work on a task branch).
#   2. A branch whose upstream is gone (the remote branch was deleted —
#      almost always because its PR was merged). This is the safety net
#      for the "second request lands on first request's merged branch"
#      bug.
#   3. A branch whose name does not match the canonical convention
#      `<initials>/<agent>/<type>/T###-<slug>`.
#
# Docs, .claude/, .github/, root markdown files, and PROJECT.md/TASKS.md
# are exempt — they're tracking docs, not code shipped behind a PR.
#
# Exit codes:
#   0  = allow
#   2  = block (stderr surfaced to the agent)

set -euo pipefail

input="$(cat || true)"
file_path="$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)"

if [ -z "$file_path" ]; then
  exit 0
fi

case "$file_path" in
  */TASKS.md|TASKS.md|*/PROJECT.md|PROJECT.md) exit 0 ;;
  */docs/*|docs/*) exit 0 ;;
  */.claude/*|.claude/*) exit 0 ;;
  */.github/*|.github/*) exit 0 ;;
  */README.md|README.md|*/AGENTS.md|AGENTS.md|*/CLAUDE.md|CLAUDE.md) exit 0 ;;
  */projects.md|projects.md) exit 0 ;;
esac

repo_dir="$(dirname "$file_path" 2>/dev/null || echo .)"
if [ ! -d "$repo_dir" ]; then
  repo_dir="$PWD"
fi
repo_root="$(git -C "$repo_dir" rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$repo_root" ]; then
  exit 0
fi

current_branch="$(git -C "$repo_root" rev-parse --abbrev-ref HEAD 2>/dev/null || echo)"

case "$current_branch" in
  main|master|HEAD)
    echo "BLOCKED: refusing to edit code on '$current_branch'." >&2
    echo "Start a fresh task branch first:" >&2
    echo "  git checkout main && git pull origin main && git checkout -b <initials>/<agent>/<type>/T###-<slug>" >&2
    echo "(Hook: enforce-fresh-branch.sh — every task starts on a fresh branch.)" >&2
    exit 2
    ;;
esac

agents='pm-agent|architect-agent|design-agent|fe-coder|be-coder|devops-agent|reviewer-agent|qa-agent|optimizer-agent|security-agent|docs-agent|incident-agent'
types='feat|fix|docs|chore|refactor|test'
valid_branch_re="^[a-z]+/(${agents})/(${types})/T[0-9]+-[a-z0-9][a-z0-9-]*$"

if ! printf '%s' "$current_branch" | grep -Eq "$valid_branch_re"; then
  echo "BLOCKED: branch '$current_branch' does not match the naming convention." >&2
  echo "Required: <initials>/<agent>/<type>/T###-<slug>" >&2
  echo "  example: fa/fe-coder/feat/T012-settings-page" >&2
  echo "  <agent>: ${agents}" >&2
  echo "  <type> : ${types}" >&2
  echo "Fix it — reset to main and cut a correctly-named branch:" >&2
  echo "  git checkout main && git pull origin main && git checkout -b <initials>/<agent>/<type>/T###-<slug>" >&2
  echo "(Hook: enforce-fresh-branch.sh)" >&2
  exit 2
fi

git -C "$repo_root" fetch --prune --quiet 2>/dev/null || true

upstream_track="$(git -C "$repo_root" for-each-ref --format='%(upstream:track)' "refs/heads/$current_branch" 2>/dev/null || echo)"

if printf '%s' "$upstream_track" | grep -q '\[gone\]'; then
  echo "BLOCKED: branch '$current_branch' has no remote upstream (the remote branch was deleted — almost certainly because its PR was merged)." >&2
  echo "Do not pile new work onto a merged branch. Start fresh:" >&2
  echo "  git checkout main && git pull origin main && git checkout -b <initials>/<agent>/<type>/T###-<slug>" >&2
  echo "(Hook: enforce-fresh-branch.sh)" >&2
  exit 2
fi

exit 0
