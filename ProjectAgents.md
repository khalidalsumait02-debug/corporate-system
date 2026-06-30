# ProjectAgents.md — per-project agent settings

This is the **per-project manifest** for the agent team. It holds everything that is specific to *this* project: which model each agent runs on, and any per-agent customizations.

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

Profile: **Balanced**.

| Agent | Model for this project |
|---|---|
| pm-agent | opus (locked) |
| architect-agent | opus |
| design-agent | sonnet |
| fe-coder | sonnet |
| be-coder | sonnet |
| devops-agent | sonnet |
| reviewer-agent | haiku |
| qa-agent | sonnet |
| optimizer-agent | sonnet |
| security-agent | sonnet |
| docs-agent | haiku |
| incident-agent | sonnet |

## Per-agent customizations (this project)

Project-specific instructions for individual agents. Anything written under an agent here **adds to or overrides that agent's generic behavior for this project only** — the agent reads it on activation. The shared agent definition is never modified.

Leave a section empty if the agent needs no project-specific tweak.

### architect-agent

### design-agent

### fe-coder

### be-coder

### devops-agent

### reviewer-agent

### qa-agent

### optimizer-agent

### security-agent

### docs-agent

### incident-agent

## Accumulated lessons

Longer-lived guidance that agents learn over time lives in `docs/agent-notes/<agent>.md` in this repo (auto-captured as agents work). This manifest is for settings you set deliberately; `docs/agent-notes/` is for lessons that accumulate. Both live in this project repo — never in the shared agents.
