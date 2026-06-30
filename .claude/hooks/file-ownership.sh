#!/usr/bin/env bash
set -euo pipefail

input="$(cat || true)"
file_path="$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)"

if [ -z "$file_path" ] || [ ! -f "$file_path" ]; then
  exit 0
fi

case "$file_path" in
  */TASKS.md|TASKS.md|*/PROJECT.md|PROJECT.md) exit 0 ;;
  */docs/*|docs/*) exit 0 ;;
  */.claude/*|.claude/*) exit 0 ;;
esac

repo_root="$(git -C "$(dirname "$file_path")" rev-parse --show-toplevel 2>/dev/null || true)"
if [ -z "$repo_root" ] || [ ! -f "$repo_root/TASKS.md" ]; then
  exit 0
fi

in_progress="$(awk '/^## In Progress/{flag=1; next} /^## /{flag=0} flag' "$repo_root/TASKS.md" 2>/dev/null || true)"

if [ -z "$in_progress" ]; then
  exit 0
fi

rel_path="${file_path#$repo_root/}"

if ! printf '%s' "$in_progress" | grep -q "$rel_path"; then
  case "$rel_path" in
    src/*|app/*|pages/*|components/*|lib/*|server/*|api/*|tests/*)
      echo "OWNERSHIP CHECK: $rel_path is not listed in any task's file ownership in TASKS.md." >&2
      echo "Either add it to the task's ownership block or open a new task before editing." >&2
      ;;
  esac
fi

exit 0
