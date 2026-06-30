#!/usr/bin/env bash
# SubagentStop hook. Nudges a specialist to run the capture ritual (_base.md)
# before it returns control: if it did substantive work but never touched its
# own docs/agent-notes/<handle>.md, remind it to record any reusable lesson.
#
# Advisory only — never writes, never blocks. Stays silent when:
#   - the agent already updated a notes file this task (capture done), or
#   - no working-tree changes exist outside notes (no substantive work to learn from).
#
# Exit code is always 0; the reminder goes to stderr, surfaced to the agent.

set -euo pipefail

input="$(cat || true)"

# Best-effort agent handle for a friendlier message; falls back to a placeholder.
handle="$(printf '%s' "$input" | jq -r '.subagent_type // .agent_type // .agent // .name // empty' 2>/dev/null || true)"
[ -z "$handle" ] && handle="<your-handle>"

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"
[ -z "$repo_root" ] && exit 0

changed="$(git -C "$repo_root" status --porcelain 2>/dev/null || true)"
[ -z "$changed" ] && exit 0

notes_changed="$(printf '%s' "$changed" | grep 'docs/agent-notes/' || true)"
[ -n "$notes_changed" ] && exit 0

work_changed="$(printf '%s' "$changed" | grep -v 'docs/agent-notes/' | grep -v '^[[:space:]]*$' || true)"
[ -z "$work_changed" ] && exit 0

echo "CAPTURE CHECK: you finished substantive work but didn't touch docs/agent-notes/${handle}.md." >&2
echo "Run the capture ritual (.claude/agents/_base.md): if this task taught you something project-specific and reusable — a tool that worked, a pattern that backfired, a fragile zone, a non-obvious gotcha — append a one-line dated note to your own notes file." >&2
echo "If nothing reusable came up, skip it. An empty capture is valid; don't pad the file." >&2
exit 0
