#!/usr/bin/env bash
set -euo pipefail

input="$(cat || true)"

tool_name="$(printf '%s' "$input" | jq -r '.tool_name // empty' 2>/dev/null || true)"

case "$tool_name" in
  mcp__github__issue_write) ;;
  *) exit 0 ;;
esac

state="$(printf '%s' "$input" | jq -r '.tool_input.state // empty' 2>/dev/null || true)"
action="$(printf '%s' "$input" | jq -r '.tool_input.action // empty' 2>/dev/null || true)"
body="$(printf '%s' "$input" | jq -r '.tool_input.body // empty' 2>/dev/null || true)"

is_close=0
case "$state" in
  closed|close) is_close=1 ;;
esac
case "$action" in
  close|closed) is_close=1 ;;
esac

if [ "$is_close" -eq 0 ]; then
  exit 0
fi

if [ -z "$body" ]; then
  echo "BLOCKED: closing a GitHub issue requires a closing comment using docs/templates/closing-comment.md." >&2
  echo "Post the completion comment first (via mcp__github__add_issue_comment), then close." >&2
  exit 2
fi

if ! printf '%s' "$body" | grep -qE '##\s*Done'; then
  echo "BLOCKED: closing comment must use the docs/templates/closing-comment.md template (missing '## Done' header)." >&2
  exit 2
fi

if ! printf '%s' "$body" | grep -qiE '\*\*PR:\*\*'; then
  echo "BLOCKED: closing comment must include the **PR:** line with the merged PR number." >&2
  exit 2
fi

if ! printf '%s' "$body" | grep -qiE '\*\*Verification:\*\*'; then
  echo "BLOCKED: closing comment must include the **Verification:** block (QA, Reviewer, Optimizer, Security results)." >&2
  exit 2
fi

exit 0
