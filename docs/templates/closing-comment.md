# Closing comment template

`@pm-agent` posts this as the closing comment on every GitHub issue before closing it. No issue closes without this comment posted first. Enforced by `.claude/hooks/enforce-issue-close.sh`.

```markdown
## Done — YYYY-MM-DD

**What shipped (plain English):**
<One paragraph any non-engineer can read. What the user can now do.>

**Changes:**
- `path/to/file` — <one-line summary>
- `path/to/file` — <one-line summary>

**PR:** #N (merged YYYY-MM-DD)

**Verification:**
- QA: <pass/fail, coverage %, test files>
- Reviewer: <approved / N notes resolved>
- Optimizer: <before → after, or "skipped — out of scope">
- Security: <cleared / N findings resolved>

**Decisions made:** <link to docs/decisions.md entries, or "none">
**Architecture doc:** <link to docs/architecture/<slug>.md, or "n/a">
**Follow-ups filed:** <#N, #N — or "none">
```

Hard rules:
- No close on partial completion. If any pipeline gate is blocked, the issue stays open.
- No close before the PR is merged.
- Closing comment must be posted **before** the close action — the hook checks this.
