#!/usr/bin/env bash
# PreToolUse hook for Write/Edit. Blocks any attempt to write or edit a .env
# file. Allows .env.example.
#
# Input (stdin): JSON from the Claude Code harness containing the tool name
# and parameters. We look for a file_path parameter.
#
# Exit codes:
#   0  = allow
#   non-zero = block (stderr is surfaced to the agent so it knows why)

set -euo pipefail

input="$(cat || true)"

file_path="$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)"

if [ -z "$file_path" ]; then
  exit 0
fi

base="$(basename "$file_path")"

case "$base" in
  .env.example)
    exit 0
    ;;
  .env|.env.local|.env.production)
    echo "BLOCKED: $file_path is a real environment file. Only .env.example may be written. Real secrets belong in the hosting platform's secret store, not in the repo." >&2
    exit 2
    ;;
  .env.*.local)
    echo "BLOCKED: $file_path is a real environment file. Only .env.example may be written." >&2
    exit 2
    ;;
esac

case "$base" in
  .env*)
    echo "BLOCKED: $file_path looks like an environment file. Only .env.example may be written." >&2
    exit 2
    ;;
esac

exit 0
