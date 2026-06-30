#!/usr/bin/env bash
set -euo pipefail

input="$(cat || true)"
response="$(printf '%s' "$input" | jq -r '.assistant_response // empty' 2>/dev/null || true)"

if [ -z "$response" ]; then
  exit 0
fi

line_count="$(printf '%s' "$response" | wc -l | tr -d ' ')"

if [ "$line_count" -le 8 ]; then
  exit 0
fi

# Operator-facing jargon check — machine vocabulary that should never reach the
# operator (see AGENTS.md → "Talking to you"). Applied to long responses only,
# so short normal replies are never flagged.
jargon="$(printf '%s' "$response" | grep -oiE '\b(T[0-9]{2,4}|@[a-z]+-(agent|coder)|adversarial reviewer|security veto|fail-closed|no oracle|PII zone|dispatch directive|worktree|risk:[a-z]+|size:[A-Z]+)\b' | sort -u | head -6 || true)"
if [ -n "$jargon" ]; then
  echo "JARGON CHECK: this operator-facing message contains machine vocabulary:" >&2
  printf '%s\n' "$jargon" | sed 's/^/  - /' >&2
  echo "Operator messages must be plain English — no task codes, agent handles, gate names, or git mechanics." >&2
  echo "Restate by outcome. See AGENTS.md → 'Talking to you — the operator'." >&2
  exit 0
fi

if printf '%s' "$response" | grep -qiE '(blocked|blocker|question|approve|approval needed|done|complete|need (input|decision)|##\s*blocked|##\s*done)'; then
  exit 0
fi

echo "NARRATION CHECK: response is ${line_count} lines without a blocker/completion/question keyword." >&2
echo "Output rule: silence is success. Speak only on blocker, question, or completion." >&2
echo "Trim to one or two sentences unless one of those keywords applies." >&2
exit 0
