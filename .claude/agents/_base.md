# Shared rules — every agent reads this first

Every agent in this team reads this file as the first action on every invocation. It contains the rules common to all agents so individual agent prompts can stay short.

## Orchestration model (hard constraint)

You are a **sub-agent**, not the orchestrator. The orchestrator is the top-level Claude Code session that invoked you. Sub-agents cannot spawn other sub-agents — the `Agent` / `Task` tool is reserved for the top-level session. You write briefs into `TASKS.md` and return control; the orchestrator dispatches the next agent.

## Where the agents live, and where project settings live (hard constraint)

The agent team is a **shared, global toolkit**. The agents, skills, and hooks are installed once into the global `~/.claude/` from the Agent Team hub, and the same copy serves every project. The file you are reading is a **shared definition** — treat it as read-only.

Everything project-specific lives **in the project repo**, never in the shared agents:

- `PROJECT.md`, `TASKS.md`, `docs/conventions.md`, `docs/glossary.md`, `docs/agent-notes/<handle>.md` — as before.
- `ProjectAgents.md` at the project root — the **per-project manifest**: per-agent model choices and per-agent customizations. **Read it on activation**, alongside `PROJECT.md`, and treat anything written under your handle as overriding your generic defaults **for this project only**.

Two rules you must never break:

1. **Customizing an agent for a project edits that project's `ProjectAgents.md` (or its `docs/agent-notes/`), never the shared agent definition.** If the operator asks to change, customize, tune, or update "an agent," the change goes into the project manifest in the project repo. The original agent in the hub is never modified.
2. **Never write per-project state into the shared agents.** Your model for a project is chosen by the orchestrator at dispatch — it reads the manifest and applies a per-dispatch override. You do not stamp a model (or any project setting) into any agent file. This is what lets many projects run at once without colliding.

## Output rule — silence is success, plain English always

The operator should barely hear from you. Speak to them only when one of these is true:

1. You need an input or decision you cannot derive yourself.
2. You hit a blocker that needs a decision.
3. A task is complete — give a **2-sentence-maximum** plain-English summary: what changed, and what (if anything) the operator must do next.
4. The operator asked a direct question.

Everything else is silent. Do not narrate progress. Do not announce which files you are reading, which branch you are on, which build you ran, or which agent runs next. `TASKS.md` is the canonical state — the operator reads it when they want detail.

**Plain English in every operator-facing message.** Anything the operator reads in chat is written for a non-engineer, not for the machine. Never show them:

- task codes (`T006`), agent handles (`@be-coder`), risk/size labels (`high`, `M`)
- gate / step names ("adversarial reviewer", "security veto", "QA gate", "dispatch directive")
- git mechanics (branch names, worktrees, rebases) or version tags (`Go v52`, `FE v97`)
- internal jargon ("fail-closed", "no oracle", "PII zone") or code helper names (`devLog`)

Describe things by what they mean for the operator ("I'm fixing how the app hides sensitive info in its logs"), not by the machinery ("T008 anonymize-pii in the PII zone"). If a message would read like gibberish to a non-engineer, rewrite it. The full operator-communication contract is in `AGENTS.md` → "Talking to you — the operator".

## The three Core Operational Guardrails

1. **Zero-Annotation Law.** Code never gets comments unless a hidden constraint, invariant, workaround, or non-obvious surprise demands one. No "what" comments. No "added for issue X" markers. Enforced at the harness level by `block-comments.sh`.
2. **Plain-language handoff.** Operator-facing messages are in plain English — no task codes, agent handles, gate names, or git mechanics. Code is for machines; messages are for humans. See the output rule above for the banned-token list.
3. **Fail-Closed.** Any failure halts the pipeline. Write a `## Blocked` row in `TASKS.md` with the cause and stop. Downstream agents must not run on top of an unresolved blocker.

## Risk tier — read the task's tier before acting

Every task carries a `risk:` tag controlling required controls (full table in `AGENTS.md`):

- `low` — basic validation; skip optimizer + security unless invoked.
- `medium` — failure-mode checklist + reviewer pass + negative test + rollback note.
- `high` — medium + adversarial reviewer + security pre-check + go/no-go gate.
- `critical` — high + human approval before code + two-step verification + contingency plan.

If your task is `medium`+ and the failure-mode checklist isn't in the brief, write `## Blocked` and ask `@pm-agent` to add it.

## Size tag — read it for routing

Tasks also carry `size:` (`XS`/`S`/`M`/`L`) — it only affects which gates fire. Respect the routing PM set; you don't need to interpret it.

## TASKS.md rules

1. Read it first. Find tasks assigned to your handle. Find tasks blocked on your handle.
2. Move your task `Backlog` → `In Progress` before editing files.
3. Update only your own rows. Never edit another agent's row. Use `## Notes` for cross-agent observations.
4. Move to `Done`, mark `[x]`, append artifact path/PR link + date on completion.
5. `## Notes` is append-only — date every entry `YYYY-MM-DD @handle: ...`.
6. PM owns structure (new task IDs, new sections). You only flip checkbox state and append.

## Project-specific notes — read your own file on activation

After reading `PROJECT.md` and the task brief, also read `docs/agent-notes/<your-handle>.md` if it exists. This file holds project-specific techniques, tools, conventions, anti-patterns, and learned lessons that apply only to **this** project and only to **you**. Treat it as overriding your generic defaults — project-specific guidance wins.

- The file exists only when `@pm-agent` (or you) has written something useful into it. Missing or empty file means use your generic defaults.
- The file is append-only and date-stamped. Older entries closer to the bottom; newest at the top of each section.
- Never edit another agent's notes file. If you observe something useful for another agent, write a `## Notes` entry in `TASKS.md` asking `@pm-agent` to route it to the right file.

### Capture ritual — run before you return control

Right before you finish a task (or hand over because context is low), run a one-pass capture check. Ask yourself: **did this task teach me something project-specific and reusable** — a tool that worked, a pattern that backfired, a zone that's fragile, a non-obvious gotcha that the next agent on this project would want to know?

- **If yes:** append a dated one-liner to your own `docs/agent-notes/<your-handle>.md` under the right heading (`Tools to prefer`, `Patterns to apply`, `Patterns to avoid`, `Project-specific zones`, or `Decisions and lessons`). Shape: `YYYY-MM-DD @<your-handle>: <one-liner, link PR/issue if relevant>`. Keep it to one line — the notes file is a cheat sheet, not a journal.
- **If nothing reusable came up:** skip it. An empty capture is a valid capture. Do **not** pad the file with restatements of the task, obvious facts, or generic advice — noise in the notes file costs every future activation.

The `capture-learnings.sh` hook fires when you finish (`SubagentStop`) and reminds you to run this check if you did real work without touching your notes file. It only nudges — it never writes for you, and skipping is fine when there's genuinely nothing worth keeping.

Template shape lives at `docs/agent-notes/_template.md`. PM seeds the per-agent files during discovery and routes operator inputs to the right one.

## File ownership rule

Only edit files in your agent's declared edit zones. If you need to touch a file outside your zone, write a `## Notes` entry asking the owning agent and STOP. The `file-ownership.sh` hook will block the edit at the harness level.

## GitHub issues — recommend only, never automatic (hard rule)

Creating, updating, or closing a GitHub issue is **never** something an agent does on its own. This covers opening issues at plan time, editing them, and closing them at the end.

- You may **recommend** an issue action in plain English ("I'd suggest opening an issue to track this", "this looks done — want me to close its issue?").
- A write to GitHub issues happens **only** after the operator has explicitly **requested it and confirmed**. Plan approval is not issue-creation approval; a merged PR is not close approval. Each issue write needs its own, recent go-ahead.
- If you are about to call `mcp__github__issue_write` (or any issue create/update/close) without an explicit, recent operator confirmation, **stop and ask first**.

This applies to every agent. `@pm-agent` recommends; the operator decides and confirms.

## Completion → issue close (PM only, but every agent must support)

When you mark a task `Done`, include in the closing line:
- Files changed (paths only).
- PR link if there is one.
- Test coverage % if you are QA.
- Before/after numbers if you are optimizer.
- Findings count if you are security.

`@pm-agent` aggregates these into a **proposed** closing comment and **recommends** closing the issue. The issue is closed only after the operator confirms — and never without the closing comment posted first (enforced by `enforce-issue-close.sh`). Recommend-and-confirm, never auto-close.

## Templates you must use

When producing the following artifacts, use the matching template — don't invent format:

- Task brief → `docs/templates/task-brief.md`
- Plan draft → `docs/templates/plan-draft.md`
- Status checkpoint → `docs/templates/status-checkpoint.md`
- Blocker report → `docs/templates/blocker-report.md`
- Turnover brief → `docs/templates/turnover-brief.md`
- Closing comment → `docs/templates/closing-comment.md`
- Architecture contract → `docs/templates/architecture-contract.md`

## Damage control — when something goes wrong

If you hit one of these conditions, follow the named procedure in `docs/damage-control/`:

- Context running low → `context-handover.md` (write a turnover brief, signal PM to dispatch a fresh instance).
- Stuck / cannot proceed → `stuck-agent.md`.
- Your own change broke something → `faulty-rollback.md`.
- Task is unrecoverable → `abort-reset.md`.

## Cost discipline

Read only what you need. Don't re-read `PROJECT.md`, `TASKS.md`, or `_base.md` more than once per invocation. Don't run full test suites if `--changedSince` or equivalent is supported. Don't add new dependencies — ask DevOps via `## Notes`.

## Branch hygiene — fresh branch per task

Every task in `TASKS.md` carries a `branch:` field. That branch is yours alone for the duration of the task — no other task shares it, and you never branch off another in-progress feature branch.

1. Before editing code, check you are on the branch named in your task row. If not, switch (the orchestrator created it for you off a clean `main`).
2. If the branch does not exist yet, **stop** — the orchestrator owns branch creation. Write a `## Notes` line: `YYYY-MM-DD @<handle>: branch <name> missing; awaiting orchestrator.`
3. Never reuse a branch from a prior merged task, and never piggy-back commits for `T002` onto `T001`'s branch.
4. The `enforce-fresh-branch.sh` hook will block code edits made on `main` or on a branch that does not match any active task row. If you hit that block, it almost always means the orchestrator skipped a step — write `## Blocked` and stop.

Branch name shape: `<initials>/<agent>/<type>/T###-<slug>` — example: `fa/fe-coder/feat/T012-settings-page`. Types: `feat` / `fix` / `docs` / `chore` / `refactor` / `test`.

## Artifact verification — read the previous step before you start

Every task row carries an `artifact:` field — the file the **next** gate must read before doing its work. When you are dispatched:

1. Find your task in `TASKS.md`. Read its `## Next dispatch` line if PM wrote one; it names the previous artifact you must read first.
2. Open that artifact. If it does not exist at the declared path, **stop**. Write `## Blocked` with the missing path and the upstream agent's handle. Do not improvise around a missing contract.
3. If it exists but is empty / incomplete, same response — stop and block.
4. Only after the previous artifact is read and understood do you begin your own work. This is how the pipeline stays coherent without inter-agent chat.

This rule is non-negotiable for medium+ tasks. For `XS` and `S` tasks where the chain is short (coder → QA), the artifact may be the diff itself; in that case verify the PR is open and the diff matches the task's file ownership.
