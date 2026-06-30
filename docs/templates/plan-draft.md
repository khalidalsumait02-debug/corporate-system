# Plan draft template

`@pm-agent` produces this before writing tasks to `TASKS.md`. Operator must approve before commit.

```markdown
# Plan draft — <feature name>

**Drafted:** YYYY-MM-DD by @pm-agent
**Awaiting approval from:** operator

## Echo-back
<One paragraph restating the operator's request in plain English. "Here is what I heard.">

## Proposed tasks

| ID | Owner | Risk | Size | Title | Branch | Depends on |
|---|---|---|---|---|---|---|
| T### | @<handle> | low/med/high/crit | XS/S/M/L | <deliverable> | `<initials>/<agent>/<type>/T###-<slug>` | [T###] or none |

Every task carries its own branch. No two tasks share a branch. The orchestrator will create the branch from a clean `main` before invoking the owner.

## Dispatch order
<Linear or parallel groups. e.g. "T001 → (T002, T003 parallel) → T004">

For each linear hand-off, PM will issue a dispatch directive (`docs/templates/dispatch-directive.md`) that includes the branch name, the previous-step artifact to verify, and the previous PR to confirm merged.

## Architect feasibility (for any M+ task)
- **Status:** yes / no / with-caveat
- **Caveat (if any):** <one line>

## Human approval gate
- **Required for:** <list any L-size or critical-risk tasks here, or "none">

## Operator touchpoints during execution

After this plan is approved, you'll hear from PM only when:
1. A PR is opened and needs your merge (reply `merged` after merging).
2. A blocker needs your decision.
3. The feature is fully shipped.

Everything else — branch creation, branch hygiene, PR-state verification, gate dispatch — is automated by PM via dispatch directives.

## Approval

Reply `go` or `approve` to commit this plan to TASKS.md and file GitHub issues.
Reply with edits to revise.
```
