# Agent model assignment

**Standard: every agent runs on `opus`.** This is the shipped default — deepest
reasoning across the whole team. The operator controls each agent's model
**per project** and can dial individual agents down for speed and cost.

`@pm-agent` is **locked to `opus`** and cannot be changed.

## How the operator changes models

Models are chosen **per project**. The choice lives in that project's
`ProjectAgents.md` manifest (at its repo root), and the orchestrator
launches each agent on the chosen model at dispatch — it never rewrites the
shared agents, so projects stay isolated and many can run at once.

- **Conversational (per project):** type `/setmodels` (or ask: "make the agents
  faster", "set the doc writer to haiku"). It shows the full roster first, then
  writes your picks into this project's `ProjectAgents.md`.
- **By hand (per project):** edit the *Agent models (this project)* table in the
  project's `ProjectAgents.md`. No apply step — the orchestrator reads it at
  dispatch.

A row left at `default` falls back to the **team-wide default** in the hub's
`.claude/agent-models.json`. To change that default for *every* project (rare),
edit the JSON and run `bash .claude/scripts/apply-agent-models.sh` — that stamps
the shared agent files and is a deliberate change to the toolkit everyone uses.
`pm-agent` is forced back to `opus` either way. A new model takes effect the next
time that agent is dispatched.

**Never** stamp a per-project choice into a shared agent file — per-project
models are applied at dispatch from the manifest.

## The three models

| Model | Speed / cost | Use it for |
|---|---|---|
| `opus` | Slowest, priciest | Deepest reasoning. The standard. |
| `sonnet` | Balanced | Implementation against a clear spec or contract. |
| `haiku` | Fastest, cheapest | Mechanical, templated work (docs, quality scan). |

`inherit` is also valid for power users — the agent then runs on whatever model
the main session is using.

## Profiles `/setmodels` offers (PM is always opus)

| Agent | All Opus (standard) | Balanced | Fast |
|---|---|---|---|
| `@pm-agent` | opus | opus | opus |
| `@architect-agent` | opus | opus | opus |
| `@design-agent` | opus | sonnet | sonnet |
| `@fe-coder` | opus | sonnet | sonnet |
| `@be-coder` | opus | sonnet | sonnet |
| `@devops-agent` | opus | sonnet | haiku |
| `@reviewer-agent` | opus | haiku | haiku |
| `@qa-agent` | opus | sonnet | sonnet |
| `@optimizer-agent` | opus | sonnet | sonnet |
| `@security-agent` | opus | sonnet | sonnet |
| `@docs-agent` | opus | haiku | haiku |
| `@incident-agent` | opus | sonnet | sonnet |

**Balanced** and **Fast** are the recommended starting points if the team feels
slow — they keep planning and architecture sharp while speeding up the rest.

## Per-task override (separate mechanism)

Per-agent defaults above set the model an agent *usually* runs on. PM can still
override a single task at plan time by stamping `model: opus` next to the
assignee handle on that task's row in `TASKS.md`. The operator can override PM
by editing the row before approving the plan. This is task-scoped and does not
change the agent's default.
