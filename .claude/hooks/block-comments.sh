#!/usr/bin/env bash
# PostToolUse hook for Write/Edit. Enforces the Zero-Annotation Law:
# warns the agent (non-zero exit) when a code edit adds new comment lines
# in a source file. Skips markdown, JSON, YAML, and config files where
# comments are normal.
#
# Input (stdin): JSON with tool_input.file_path. We diff the file vs HEAD
# and look for added comment-style lines.

set -euo pipefail

input="$(cat || true)"
file_path="$(printf '%s' "$input" | jq -r '.tool_input.file_path // empty' 2>/dev/null || true)"

if [ -z "$file_path" ] || [ ! -f "$file_path" ]; then
  exit 0
fi

# Skip non-code files where comments are expected.
case "$file_path" in
  *.md|*.mdx|*.md.template|*.mdx.template|*.json|*.jsonc|*.yaml|*.yml|*.toml|*.lock|*.lockb|*.txt|*.log|*.svg|*.csv|*.html|*.template)
    exit 0
    ;;
  *Dockerfile*|*.dockerfile)
    exit 0
    ;;
  *.env*|.gitignore|.dockerignore|.editorconfig|.prettier*|.eslint*|.babelrc*|tsconfig*.json)
    exit 0
    ;;
  */hooks/*.sh|.claude/hooks/*.sh)
    exit 0
    ;;
esac

# Skip if we're not inside a git repo.
if ! git -C "$(dirname "$file_path")" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  exit 0
fi

# Diff vs HEAD; if file is new (no HEAD version), diff against /dev/null.
added_lines="$(git -C "$(git -C "$(dirname "$file_path")" rev-parse --show-toplevel)" \
  diff --no-color --unified=0 -- "$file_path" 2>/dev/null \
  | grep -E '^\+' \
  | grep -vE '^\+\+\+' || true)"

if [ -z "$added_lines" ]; then
  exit 0
fi

# Match common comment patterns: //  #  /* */  """  '''
# Be conservative: only flag whole-line comments, not trailing.
comment_lines="$(printf '%s\n' "$added_lines" \
  | grep -E '^\+\s*(//|#|/\*|\*|"""|'\'\'\'')' \
  | grep -vE '^\+\s*#!' || true)"

if [ -n "$comment_lines" ]; then
  echo "ZERO-ANNOTATION LAW: $file_path added new comment lines:" >&2
  printf '%s\n' "$comment_lines" >&2
  echo "" >&2
  echo "Remove them unless a hidden constraint or non-obvious workaround demands the comment." >&2
  echo "If you must keep one, justify in the PR description, not the code." >&2
  exit 2
fi

exit 0
