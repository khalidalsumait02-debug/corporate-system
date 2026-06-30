# Damage control — context handover

You activate this procedure when your context window is running low and finishing the task in one go is no longer safe.

## Threshold
- Green: 75-100% remaining. Continue.
- Amber: 60-74% remaining. Wrap up the current step. Don't start new work.
- Red: 40-59% remaining. Begin handover NOW.
- Critical: below 40% remaining. Stop, write brief, end turn.

## Procedure

1. Stop the work in progress at the next safe checkpoint (don't leave the build broken).
2. Run the test suite once. Record the result.
3. Write a turnover brief to `docs/turnovers/T###-<timestamp>.md` using `docs/templates/turnover-brief.md`. Include:
   - Exactly which step is next.
   - Branch name + uncommitted-files list.
   - Last test result.
4. Commit any safe-to-commit work. Don't push if mid-task; the incoming instance decides.
5. Move your `TASKS.md` row state to reflect partial progress and add `## Notes`: `YYYY-MM-DD @<self>: handed over — see docs/turnovers/T###-<timestamp>.md`.
6. End your turn.

## Recovery
- Operator dispatches a fresh instance of the same agent handle.
- Fresh instance reads only the turnover brief plus the original task brief — nothing else from the prior session.
- Fresh instance appends itself to the relief chain in the turnover doc before starting work.
