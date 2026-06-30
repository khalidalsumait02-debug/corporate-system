# Damage control — abort and reset

You activate this procedure when the task is unrecoverable: the contract is wrong, the dependency is broken, the assumption that justified the work has collapsed, or repeated handovers have not made progress.

## Procedure

1. Stop work immediately. Do not push partial state.
2. Discard local uncommitted changes only if they are yours alone: `git stash` (preferred — keeps a backup) or `git checkout -- .` (destructive).
3. Move your `TASKS.md` row to `## Blocked` with reason `abort: <one-line cause>`.
4. Write an abort note in `## Notes`:
   - What was attempted.
   - Why it can't proceed.
   - What needs to change before retry (new contract, removed dependency, re-scoped task, dropped feature).
5. Tag `@pm-agent` in the note.
6. End your turn.

## Recovery (PM-driven)
- PM reads the abort note, decides whether to:
  - Re-scope the task and re-plan.
  - Send it back to architect for a contract revision.
  - Drop the feature and escalate to operator.
- The original task ID is NOT re-used. A new task ID is opened if the work is retried.

## When to abort vs hand over
- Hand over (stuck-agent / context-handover): the work can continue, just not by you in this session.
- Abort: the work as currently defined cannot continue. Definition must change first.
