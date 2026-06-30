# Architecture contract template

`@architect-agent` writes one per M+ feature to `docs/architecture/<slug>.md`. Coders implement against this; the doc wins on conflict.

```markdown
# Architecture: <feature name>

**Decided:** YYYY-MM-DD by @architect-agent
**Related:** TASKS.md T###, GitHub issue #N
**Risk tier:** low | medium | high | critical

## Summary (plain English)
<One paragraph any non-engineer can read.>

## The 7-question scaffold

### 1. Existing system check
<What's already in the codebase that this builds on or conflicts with.>

### 2. Intent
<What this feature accomplishes — in the user's terms.>

### 3. Expected effects
<What changes in the system (data, traffic, surface, contracts) once this ships.>

### 4. Codebase terrain
<Which files / services / modules this touches. List explicitly for the file-ownership scan.>

### 5. Available agents
<Which agents will implement this and what each one owns.>

### 6. Coordination plan
<Linear vs parallel dispatch. Where work merges. Who owns integration.>

### 7. Control points
<Checkpoints where progress is verified. What "done" looks like at each.>

## Decisions

For each architectural choice — at least two options considered, one chosen with rationale.

### <Decision name>
**Options considered:**
1. <Option A> — pros / cons.
2. <Option B> — pros / cons.

**Chosen:** <Option X>
**Why:** <Two to four sentences.>

## Contract (what coders implement against)

- **API:** endpoints / methods / request + response shapes.
- **Data:** tables, columns, indexes, constraints.
- **Auth:** who calls this, what claim is required.
- **Errors:** codes, retry semantics.
- **Telemetry:** logs, metrics, alerts.

## Failure modes
- What could fail in production?
- How would we detect it?
- Fastest safe rollback?
- Least-certain assumption?

## Out of scope
<What this contract explicitly does NOT decide.>

## Open questions / Blocked
<Anything unresolved. If blocked, escalate to @pm-agent — do not dispatch coders.>
```
