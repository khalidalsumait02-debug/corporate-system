# Task brief template

Used by `@pm-agent` when filing a task. Every field is required. PM cannot dispatch a task with a blank field — it must come back to the operator with one targeted question.

```markdown
# T### — <one-line deliverable, not action>

**Risk:** low | medium | high | critical
**Size:** XS | S | M | L
**Owner:** @<single-agent-handle>
**Branch:** `<initials>/<agent>/<type>/T###-<slug>`
**Depends on:** [T###, T###]  (or "none")
**Issue:** #N
**Artifact expected on completion:** `<repo-relative-path>` (the file the next gate will look for)

## Outcome
<One sentence. Observable end state in the world. No verbs.>

## User & trigger
- **User:** <role>
- **Trigger:** <what they do to start this>

## Success metric
<Measurable. Numeric where possible.>

## Scope
- **In:** <bullets>
- **Out:** <bullets — explicit>

## Acceptance criteria (Given / When / Then)
- Given <context>, when <action>, then <observable result>.
- Given ..., when ..., then ... .

## Constraints
- **Tech:** <must / must-not>
- **Performance:** <budget numbers>
- **Compliance:** <if any>
- **Deadline:** <date or "none">

## Failure-mode checklist  (required for medium+ risk)
- What could fail in production?
- How would we detect it?
- Fastest safe rollback?
- What dependency could invalidate this plan?
- What is the least-certain assumption?

## File ownership (declared up front for parallel work)
- `path/to/file` — owned by this task
- `path/to/file` — owned by this task

## References
- Architecture: <link or "n/a">
- Design: <link or "n/a">
- Glossary terms used: <list>
```
