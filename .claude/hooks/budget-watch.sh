#!/usr/bin/env bash
set -euo pipefail

input="$(cat || true)"
tokens_used="$(printf '%s' "$input" | jq -r '.session.tokens_used // empty' 2>/dev/null || true)"
tokens_limit="$(printf '%s' "$input" | jq -r '.session.tokens_limit // empty' 2>/dev/null || true)"

if [ -z "$tokens_used" ] || [ -z "$tokens_limit" ]; then
  exit 0
fi

if ! [[ "$tokens_used" =~ ^[0-9]+$ ]] || ! [[ "$tokens_limit" =~ ^[0-9]+$ ]] || [ "$tokens_limit" -eq 0 ]; then
  exit 0
fi

remaining_pct=$(( (tokens_limit - tokens_used) * 100 / tokens_limit ))

if [ "$remaining_pct" -lt 40 ]; then
  echo "BUDGET CRITICAL: ${remaining_pct}% context remaining. Stop, write a turnover brief (docs/templates/turnover-brief.md), end your turn." >&2
elif [ "$remaining_pct" -lt 60 ]; then
  echo "BUDGET RED: ${remaining_pct}% context remaining. Begin handover now per docs/damage-control/context-handover.md." >&2
elif [ "$remaining_pct" -lt 75 ]; then
  echo "BUDGET AMBER: ${remaining_pct}% context remaining. Wrap up current step; don't start new work." >&2
fi

exit 0
