# Named anti-patterns

Each anti-pattern has a name. Agents check against this list before declaring a task done. Some are hook-enforced; others are prompt-enforced.

## Code & process

### `no-design-spec`
A coder started UI work without a `docs/design/<slug>.spec.md` in place. → Block and ask `@design-agent` for the spec.

### `no-architecture-contract`
A coder started cross-layer work (FE+BE, BE+data, auth) without `docs/architecture/<slug>.md` in place. → Block and ask `@architect-agent`.

### `signature-drift`
Optimizer changed an exported function signature, HTTP route path, or response shape. → Auto-revert. Optimizer is forbidden from touching contracts.

### `coder-fixed-test`
A coder modified test files to make a failing test pass. → Reject the PR. Tests are QA's territory.

### `qa-fixed-code`
QA modified non-test source to make a test pass. → Reject. QA writes bug reports, not fixes.

### `unowned-file-edit`
An agent edited a file that wasn't in its declared task ownership. → Hook blocks the edit. Add the file to ownership first or reassign the task.

### `stale-branch-reuse`
An agent started a new task on another task's merged (or in-progress) branch instead of creating a fresh branch off `main`. → `enforce-fresh-branch.sh` hook blocks the code edit. Reset to `main` and start a fresh branch matching the `branch:` field on the task row.

### `branch-name-drift`
A branch doesn't match the canonical convention `<initials>/<agent>/<type>/T###-<slug>` (e.g. `fix-stuff`, `fa/fe-coder/feat/settings-page` with no task ID, or an unknown agent/type slot). → `enforce-fresh-branch.sh` hook blocks the code edit. The orchestrator creates branches off a clean `main`; agents do not invent names. Reset to `main` and re-cut with the correct name. See `AGENTS.md` → "Branch naming".

### `missing-upstream-artifact`
An agent started work without reading the previous step's `artifact:` (architecture contract, design spec, etc.). → Write `## Blocked`, name the upstream agent who owes the artifact, and stop. Never improvise around a missing contract.

### `narration-drift`
An agent emitted a long status update without a blocker or completion keyword. → `block-narration.sh` hook warns. Output rule is "silence is success."

### `pm-jargon-leak`
PM (or any agent talking directly to the operator) used team vocabulary — agent handles, task IDs, risk tiers, gate names, references to `AGENTS.md` — without a plain-English gloss. → The operator cannot act on the message. Restate in plain English: roles + outcomes, no IDs without deliverables, no handles without role descriptions. See `pm-agent.md` → "Plain-language rule" for the translation table and a worked example.

### `notes-capture-skipped`
An agent finished a task that taught it something project-specific and reusable (a tool that worked, a pattern that backfired, a fragile zone, a non-obvious gotcha) but returned control without recording it in its own `docs/agent-notes/<handle>.md`. → `capture-learnings.sh` (SubagentStop) reminds. Run the capture ritual in `_base.md`. Note: the inverse is also an anti-pattern — padding the notes file with task restatements, obvious facts, or generic advice. An empty capture is valid; only reusable lessons belong there.

### `missing-closing-comment`
PM attempted to close a GitHub issue without posting the closing-comment template first. → `enforce-issue-close.sh` hook blocks.

### `pipeline-skip`
Optimizer or security ran before QA reported green. → Auto-revert and re-queue.

### `silent-divergence-from-contract`
Coder implemented something that contradicts `docs/architecture/<slug>.md`. → Reviewer rejects. Coder either revises code or asks architect to revise the contract.

## Planning

### `vague-deliverable`
Task title starts with a verb ("Build...", "Implement...", "Improve..."). → PM rejects own draft. Tasks are deliverables ("Settings page renders user email"), not actions.

### `unmeasurable-success`
Task uses words like "fast", "secure", "robust", "scalable", "intuitive", "polish" without a number. → PM rejects own draft.

### `dual-ownership`
Task assigned to two agents jointly. → Split into two tasks with a dependency edge.

### `missing-failure-checklist`
Medium+ risk task missing the 5-question failure-mode checklist. → Task cannot be dispatched.

### `unverified-feasibility`
M+ size task dispatched without an architect feasibility ping. → PM rejects own draft.

### `scope-creep`
PM accepted operator-mid-implementation changes without logging them in `docs/decisions.md` and re-running the approval gate. → Pause work, re-draft plan delta, re-approve.
