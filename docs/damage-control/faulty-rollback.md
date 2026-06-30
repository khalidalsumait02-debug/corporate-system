# Damage control — faulty rollback

You activate this procedure when your own change broke something (a test, a build, a benchmark) and the fix is not obvious within one short retry.

## Procedure

1. Stop. Do not pile fixes on a broken state.
2. `git status` to see what changed since the last green state.
3. `git checkout -- <files>` to revert the offending files. If multiple commits are involved, `git reset --hard <last-green-commit>` ONLY if the work since the green state is yours alone and uncommitted.
4. Re-run the relevant verification (test, build, benchmark). Confirm you are back to green.
5. Write a `## Notes` entry: `YYYY-MM-DD @<self>: reverted <files> — broke <what>. Cause: <one line>. Will retry with <new approach>.`
6. Decide:
   - **Retry with a different approach** — fine, proceed.
   - **Cannot find a working approach** — escalate via `stuck-agent.md`.

## Hard rules
- Optimizer auto-reverts on any regression or test breakage — no exception.
- Coders revert only their own changes; never revert another agent's commits without PM approval.
- Never use `git push --force` to "undo" a remote commit. Push a revert commit instead.
