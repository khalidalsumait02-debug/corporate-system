# Blocker report template

Any agent writes this when it can't proceed. Goes into `TASKS.md` as a `## Blocked` row plus a `## Notes` entry pointing at the report file if it's long.

```markdown
# Blocker — T### (@<reporter-handle>)

**Reported:** YYYY-MM-DD
**Severity:** stop-the-line | needs-input | nice-to-resolve

## What happened (plain English)
<One paragraph. What you were doing, what went wrong, what the user-visible impact would be if shipped.>

## Steps to reproduce
1. ...
2. ...

## Expected vs actual
- **Expected:** ...
- **Actual:** ...

## Suggested owner
@<agent-handle>  (who is best placed to resolve)

## What I tried
- ...
- ...

## What I need
- Decision / file / dependency / clarification — be specific.
```
