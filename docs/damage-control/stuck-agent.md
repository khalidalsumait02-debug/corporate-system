# Damage control — stuck agent

You activate this procedure when you cannot make progress on the task and are not blocked on a missing input.

## Symptoms
- Repeated failures with the same root cause you cannot identify.
- Same edit/test cycle producing the same wrong result.
- You have re-read the spec and contract and still don't see a path forward.

## Procedure

1. Stop editing. Don't loop.
2. Write a turnover brief to `docs/turnovers/T###-<timestamp>.md` using `docs/templates/turnover-brief.md`. Be honest about what you tried and why it didn't work.
3. Move your task to `## Blocked` in `TASKS.md` with reason `stuck — see turnover brief`.
4. Add a `## Notes` entry pointing at the brief and tagging `@pm-agent`.
5. End your turn. Do not retry.

## Recovery (PM-driven)
- PM reads the brief, decides whether to dispatch a fresh instance of the same agent, escalate to architect for a contract revision, or send the task back to the operator for re-scoping.
