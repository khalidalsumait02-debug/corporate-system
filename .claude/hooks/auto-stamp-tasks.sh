#!/usr/bin/env bash
set -euo pipefail

input="$(cat || true)"
file_path="$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)"

case "$file_path" in
  */TASKS.md|TASKS.md) ;;
  *) exit 0 ;;
esac

if [ ! -f "$file_path" ]; then
  exit 0
fi

today="$(date -u +%Y-%m-%d)"

if grep -nE '^\- \[ \] T[0-9]+ @[a-z-]+ .* — started$' "$file_path" >/dev/null 2>&1; then
  sed -i.bak -E "s/^(\- \[ \] T[0-9]+ @[a-z-]+ .* — started)$/\1 ${today}/" "$file_path"
  rm -f "$file_path.bak"
fi

if grep -nE '^\- \[x\] T[0-9]+ @[a-z-]+ .* — done$' "$file_path" >/dev/null 2>&1; then
  sed -i.bak -E "s/^(\- \[x\] T[0-9]+ @[a-z-]+ .* — done)$/\1 ${today}/" "$file_path"
  rm -f "$file_path.bak"
fi

exit 0
