# ProjectAgents.md — per-project agent settings

This is the **per-project manifest** for the agent team. Copy it to the **root of your project repo** as `ProjectAgents.md` and fill it in. It holds everything that is specific to *this* project: which model each agent runs on, and any per-agent customizations.

Three hard rules govern this file:

1. **It is project-local.** Agents read it at activation (for behavior); the orchestrator reads it (for model choices). Everything here applies to **this project only** and never touches another project.
2. **The original agents are never edited.** Customizing an agent for this project means editing **this file** — never the shared agent definitions in the hub / global `~/.claude/`. The hub agents stay pristine; this manifest layers project-specific settings on top **at runtime**.
3. **Nothing here is written back to the shared agents.** Because per-project settings live here and are applied at dispatch, many projects can run at the same time without colliding.

A brand-new project can leave everything at its default — that's a clean slate.

## Project

- **Name:** <project name>
- **One-line purpose:** <what this project is>
- **Primary stack:** <languages / frameworks>

(Full project facts live in `PROJECT.md`; this is the quick reference agents read alongside it.)

## Agent models (this project)

Which model each agent runs on **for this project**. Valid values: `opus` · `sonnet` · `haiku` · `inherit`. Leave an agent at `default` (or omit the row) to use the team-wide default from the hub's `.claude/agent-models.json`. `pm-agent` is always `opus` and cannot be changed.

The orchestrator reads this table and launches each agent on the model named here, as a per-dispatch override. It does **not** rewrite any shared agent file — so other projects are unaffected and several projects can run concurrently.

| Agent | Model for this project |
|---|---|
| pm-agent | opus (locked) |
| architect-agent | default |
| design-agent | default |
| fe-coder | default |
| be-coder | default |
| devops-agent | default |
| reviewer-agent | default |
| qa-agent | default |
| optimizer-agent | default |
| security-agent | default |
| docs-agent | default |
| incident-agent | default |

## Per-agent customizations (this project)

Project-specific instructions for individual agents. Anything written under an agent here **adds to or overrides that agent's generic behavior for this project only** — the agent reads it on activation. The shared agent definition is never modified.

Leave a section empty if the agent needs no project-specific tweak. Examples are shown in italics; replace them.

### architect-agent
*Example: all new endpoints follow the `/api/v2` response envelope; cross-service events go through the outbox table.*

### design-agent
*Example: use the existing design tokens; minimum tap target 44px; dark-mode parity required.*

### fe-coder
*Example: use the design-system package — never hand-roll buttons; state via the project's store, not a new one.*

### be-coder
*Example: Postgres only; no new external services without DevOps sign-off; all money values in integer cents.*

### devops-agent
*Example: deploys are serialized; rollback is the documented blue/green swap.*

### reviewer-agent
*Example: enforce the project lint config; flag any direct DB access outside the repository layer.*

### qa-agent
*Example: table-driven tests; coverage floor stays at 80% on changed files.*

### optimizer-agent
*Example: hot path is the search endpoint; budget is p95 < 200ms.*

### security-agent
*Example: this project handles PII — treat the customer table as a sensitive zone.*

### docs-agent
*Example: changelog uses Keep-a-Changelog format; README examples must run as written.*

### incident-agent
*Example: prod runbook lives in `docs/runbook.md`; the deploy log is the first thing to check.*

## Accumulated lessons

Longer-lived guidance that agents learn over time lives in `docs/agent-notes/<agent>.md` in this repo (auto-captured as agents work). This manifest is for settings you set deliberately; `docs/agent-notes/` is for lessons that accumulate. Both live in this project repo — never in the shared agents.
