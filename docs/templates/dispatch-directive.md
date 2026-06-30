# Dispatch directive template

`@pm-agent` writes one of these every time it hands control back to the orchestrator (the top-level Claude Code session). The orchestrator executes each pre-dispatch check in order, then dispatches the named agent. This is the mechanism that makes PM the pipeline driver under Option B.

PM also appends a one-line summary of the active directive to `TASKS.md` under `## Next dispatch` so the state survives context compaction.

```markdown
# Dispatch directive — T### → @<next-agent>

**Issued:** YYYY-MM-DD HH:MM by @pm-agent
**Pipeline step:** <N> of <M> for T###
**Previous agent:** @<handle> (or "none — first step")

## Pre-dispatch checks (orchestrator MUST run, in this order)

### 1. Verify previous-step artifact exists
- **Expected artifact:** `<repo-relative-path>` (or "none — first step")
- **Verification command:** `test -f <path> && echo ok`
- **If missing:** STOP. Return to @pm-agent with: "Artifact missing: <path>. Re-dispatch needed."

### 2. Verify previous PR is merged (skip if previous step did not open a PR)
- **PR number:** #<N> (or "none")
- **Verification tool:** `mcp__github__pull_request_read` — `state` must equal `merged`.
- **If state is not `merged`:** STOP and tell the operator: "⏸ PR #<N> not merged yet. Merge it, then reply `merged` to continue." Do not proceed until the operator replies `merged` AND the PR state verifies as `merged`.

### 3. Reset local branch state to a clean `main`
- `git checkout main`
- `git pull origin main`
- `git status --porcelain` must be empty.
- If the working tree is dirty: STOP and surface to operator.

### 4. Create the fresh task branch
- **Branch name (from task brief):** `<initials>/<agent>/<type>/T###-<slug>` (e.g. `fa/fe-coder/feat/T012-settings-page`)
- `git checkout -b <branch-name>`
- The `enforce-fresh-branch.sh` PreToolUse hook will refuse code edits if any of steps 1–4 were skipped, and also if the branch name does not match `<initials>/<agent>/<type>/T###-<slug>`.

## Dispatch

Invoke `@<next-agent>` with this brief:

> **Task:** T###
> **Branch:** `<branch-name>`
> **Brief:** <one-line summary>
> **Artifact expected on completion:** `<path>`
> **Read first:** `.claude/agents/_base.md`, `TASKS.md`, `docs/agent-notes/<handle>.md` (if it exists), the task brief in the GitHub issue body.

## On completion

The dispatched agent must return control with:

```
T### @<handle> done.
  Artifact: <path>
  Branch: <branch-name>
  PR: #<N>   (or "none — no PR opened")
  Tests: <pass/fail>   (only if applicable)
```

@pm-agent then runs the next dispatch directive, or pauses for PR merge, or moves to closeout.
```

---

## Parallel-batch directive (same-stage independent tasks)

PM uses this form **only** when the batch passes all three conditions in `pm-agent.md` → "Serial vs parallel batch": same stage, no dependency between the tasks, and disjoint file-ownership zones. Otherwise use the single-agent form above. The classic case: the FE and BE halves of one feature, both downstream of the same (already-merged) architecture contract.

```markdown
# Dispatch directive — PARALLEL BATCH (T### + T### → @<h1> + @<h2>)

**Issued:** YYYY-MM-DD HH:MM by @pm-agent
**Shared upstream:** <architecture contract path> (PR #<N>, must be `merged`)
**Why parallel-safe:** zones disjoint (`<h1>` owns `<zones>`; `<h2>` owns `<zones>`); no T###↔T### dependency.

## Pre-dispatch checks (orchestrator runs ONCE for the shared upstream)
1. Verify the shared upstream artifact exists.
2. Verify the shared upstream PR #<N> is `merged`.
3. `git checkout main && git pull origin main`; working tree clean.

## Fan-out (orchestrator dispatches all members in a SINGLE turn)
For each batch member, invoke its agent **concurrently** (multiple Agent tool calls in one message), each with **`isolation: "worktree"`** so it gets its own branch and working copy — a shared working tree cannot hold two branches at once.

> Member 1 — **Task:** T### · **Agent:** @<h1> · **Branch:** `<branch-1>` · **Brief:** <one line> · **Read first:** _base.md, TASKS.md, docs/agent-notes/<h1>.md, the contract.
> Member 2 — **Task:** T### · **Agent:** @<h2> · **Branch:** `<branch-2>` · **Brief:** <one line> · **Read first:** _base.md, TASKS.md, docs/agent-notes/<h2>.md, the contract.

## Join
Wait for **all** members to return before handing back to @pm-agent. Each returns its own completion block (task, branch, PR, tests). If any member reports `FAIL`, the others still finish; PM then writes `## Blocked` for the failed one and routes the passing ones to their next gate. Each member's branch merges independently; if two members happened to touch a shared file, merge them in order and rebase the second.
```
