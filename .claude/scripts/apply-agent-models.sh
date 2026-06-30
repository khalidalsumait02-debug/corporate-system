#!/usr/bin/env bash
set -euo pipefail

# Reads .claude/agent-models.json and stamps each agent file's `model:`
# frontmatter to match. pm-agent is always forced to opus.

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
claude_dir="$(cd "$script_dir/.." && pwd)"
agents_dir="$claude_dir/agents"
config="$claude_dir/agent-models.json"

if ! command -v jq >/dev/null 2>&1; then
  echo "error: jq is required but was not found on PATH" >&2
  exit 1
fi
if [ ! -f "$config" ]; then
  echo "error: config not found: $config" >&2
  exit 1
fi
if [ ! -d "$agents_dir" ]; then
  echo "error: agents dir not found: $agents_dir" >&2
  exit 1
fi

valid_model() {
  case "$1" in
    opus|sonnet|haiku|inherit) return 0 ;;
    *) return 1 ;;
  esac
}

errors=0
changed=0
unchanged=0

echo "Applying agent models from ${config#"$claude_dir"/} ..."

while IFS=$'\t' read -r agent model; do
  [ -z "$agent" ] && continue

  if [ "$agent" = "pm-agent" ] && [ "$model" != "opus" ]; then
    echo "  note: pm-agent is locked to opus (ignoring '$model')"
    model="opus"
  fi

  if ! valid_model "$model"; then
    echo "  error: invalid model '$model' for '$agent' (use opus|sonnet|haiku|inherit)" >&2
    errors=1
    continue
  fi

  file="$agents_dir/$agent.md"
  if [ ! -f "$file" ]; then
    echo "  warn: no agent file for '$agent' (expected $file) — skipping" >&2
    continue
  fi

  current="$(awk -F': *' '/^model:[[:space:]]/{print $2; exit}' "$file")"
  if [ "$current" = "$model" ]; then
    unchanged=$((unchanged + 1))
    printf '  %-18s %s (unchanged)\n' "$agent" "$model"
    continue
  fi

  tmp="$(mktemp)"
  if grep -qE '^model:[[:space:]]' "$file"; then
    awk -v M="$model" '!seen && /^model:[[:space:]]/ {print "model: " M; seen=1; next} {print}' "$file" >"$tmp"
  else
    awk -v M="$model" '!seen && /^name:[[:space:]]/ {print; print "model: " M; seen=1; next} {print}' "$file" >"$tmp"
  fi
  mv "$tmp" "$file"
  changed=$((changed + 1))
  printf '  %-18s %s -> %s\n' "$agent" "${current:-none}" "$model"
done < <(jq -r 'to_entries[] | select(.key | startswith("_") | not) | "\(.key)\t\(.value)"' "$config")

echo ""
echo "Done: $changed changed, $unchanged unchanged."
if [ "$errors" -ne 0 ]; then
  echo "Completed with errors — see messages above." >&2
  exit 1
fi
