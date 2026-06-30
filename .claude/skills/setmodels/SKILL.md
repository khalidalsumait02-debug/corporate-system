---
name: setmodels
description: Choose which AI model each agent runs on (opus / sonnet / haiku). Standard is opus for every agent; this lets the operator dial individual agents down for speed and cost, or back up for depth. pm-agent is locked to opus. Use when the operator types /setmodels, or asks to change an agent's model, make the agents faster/cheaper, or pick a speed profile.
---

# /setmodels — operator control over each agent's model

The single place the operator tunes the speed/quality of the team. Every agent
ships on **opus** by default. This skill lets the operator drop individual
agents to **sonnet** (balanced) or **haiku** (fastest + cheapest), or push them
back up.

`@pm-agent` is **locked to opus** and is never offered as a choice.

## Two scopes — almost always the project

Models live at two levels. **Default to the project scope** unless the operator
clearly means the shared default for every project.

1. **This project (the normal case).** The choice is written to this project's
   `ProjectAgents.md` → `## Agent models (this project)` table. The
   orchestrator reads that table and launches each agent on the chosen model as
   a per-dispatch override. Nothing in the shared/global agents is touched, so
   the change affects **only this project** and never any other — even with
   several projects running at once. This is the scope that delivers
   "each project has its own settings."
2. **The team-wide default (rare).** Only when the operator explicitly wants to
   change the default for *every* project: edit the hub's
   `.claude/agent-models.json` and run `.claude/scripts/apply-agent-models.sh`.
   Confirm first — this changes the shared toolkit for everyone.

**Never** stamp a per-project choice into a shared agent file. Per-project models
are applied at dispatch from the manifest; the shared agents stay pristine.

## Flow the orchestrator runs

> **ALWAYS show the roster table first — every single time, before any question.**
> This is non-negotiable. Do not skip straight to the profile/Custom prompt. If
> you are about to call `AskUserQuestion` and have not yet printed the table in
> this turn, stop and print it first. The operator must see every agent, what it
> does, and its current model before choosing — on every `/setmodels` run.

1. **Read current state and show the roster (mandatory, every time).** Read this
   project's `ProjectAgents.md` → `## Agent models (this project)` table for
   the current per-project choices (a row at `default`/absent means "team
   default", which lives in the hub's `.claude/agent-models.json`). Then **print
   this table** so the operator sees every agent, what it does, and its current
   effective model *before* choosing. Take the "What it does" text from the
   **Agent roster** section below. Never make the operator pick blind, and never
   omit this table.

   | Agent | What it does | Current model |
   |---|---|---|
   | Planner | Turns your request into a plan and runs the rest of the team | opus (locked) |
   | Architect | Decides how the pieces fit together before code is written | _from JSON_ |
   | Designer | Designs the screens and how users move between them | _from JSON_ |
   | Frontend builder | Builds the screens and buttons people click | _from JSON_ |
   | Backend builder | Builds the engine — data, accounts, logins, payments | _from JSON_ |
   | DevOps | Packages the app to ship/run anywhere; handles rollbacks | _from JSON_ |
   | Reviewer | Reads new code and flags problems before testing | _from JSON_ |
   | Tester | Writes tests that prove a feature works | _from JSON_ |
   | Optimizer | Finds and speeds up the slow parts | _from JSON_ |
   | Security | Hunts for ways an attacker could break in; can block shipping | _from JSON_ |
   | Docs writer | Writes the README and user guides | _from JSON_ |
   | Incident responder | First responder when the live app breaks | _from JSON_ |

2. **Offer a quick profile OR per-agent custom.** Use `AskUserQuestion`. First
   question, header "Profile":
   - **All Opus (standard)** — deepest reasoning everywhere; slowest, priciest.
   - **Balanced** — opus for PM + architect; sonnet for the builders/reviewers;
     haiku for the mechanical ones (reviewer, docs). Good speed/quality mix.
   - **Fast** — sonnet for the builders; haiku for everything light. Quickest
     and cheapest while keeping PM (and architect) sharp.
   - **Custom** — pick per agent (next step).

3. **If Custom:** ask per-agent in batches (AskUserQuestion allows ≤4 questions
   per call, so group the eleven non-PM agents across calls). Each agent's
   options are Opus / Sonnet / Haiku. Skip `pm-agent`. **Make every pop-up
   self-describing** — the operator may not have the table in view. Use a plain
   role word for the `header` and put the agent's one-line function in the
   `question`, so they always know what they're setting. For example:
   - header "Frontend" → question "Frontend builder — builds the screens and
     buttons people click. Which model?"
   - header "Security" → question "Security — hunts for ways an attacker could
     break in and can block shipping. Which model?"
   Add a short hint on each option (Opus = deepest/slowest, Sonnet = balanced,
   Haiku = fastest/cheapest) so the trade-off is visible at the point of choice.

4. **Write the project manifest.** Update the `## Agent models (this project)`
   table in this project's `ProjectAgents.md` with the resulting values
   (keep `pm-agent` = opus). If the file doesn't exist yet, create it from
   `docs/templates/ProjectAgents.md`. Do **not** edit any shared agent file
   and do **not** run the apply script — per-project models take effect via the
   orchestrator's dispatch-time override, not by stamping frontmatter.
   *(Team-wide-default scope only: instead edit `.claude/agent-models.json` and
   run `.claude/scripts/apply-agent-models.sh`, and only after confirming the
   operator means every project.)*

5. **(Project scope: nothing to apply.)** The change is live the next time each
   agent is dispatched on this project — the orchestrator reads the manifest and
   launches each agent on its chosen model. There is no frontmatter to stamp.

6. **Confirm** to the operator in one or two plain sentences: which agents moved
   and what that means for speed (e.g. "The builders and the doc writer now use
   faster models, so most work will come back quicker; the planner stays on the
   top model"). Use plain English — no agent codenames, no `model:` jargon.

## Agent roster — config key ↔ plain name ↔ function

The step-1 table and the per-agent pop-ups draw from this. The **config key** is
the JSON key in `.claude/agent-models.json`; the **plain name** is what the
operator sees (never show the raw key or the `@handle` in operator-facing text).

| Config key | Plain name | What it does |
|---|---|---|
| `pm-agent` | Planner | Turns your request into a plan and runs the rest of the team. **Locked to opus.** |
| `architect-agent` | Architect | Decides how the pieces fit together before code is written. |
| `design-agent` | Designer | Designs the screens and how users move between them. |
| `fe-coder` | Frontend builder | Builds the screens and buttons people click. |
| `be-coder` | Backend builder | Builds the engine — data, accounts, logins, payments. |
| `devops-agent` | DevOps | Packages the app to ship/run anywhere; handles rollbacks. |
| `reviewer-agent` | Reviewer | Reads new code and flags problems before testing. |
| `qa-agent` | Tester | Writes tests that prove a feature works. |
| `optimizer-agent` | Optimizer | Finds and speeds up the slow parts. |
| `security-agent` | Security | Hunts for ways an attacker could break in; can block shipping. |
| `docs-agent` | Docs writer | Writes the README and user guides. |
| `incident-agent` | Incident responder | First responder when the live app breaks. |

## Profile reference (PM is always opus)

| Agent | All Opus | Balanced | Fast |
|---|---|---|---|
| architect-agent | opus | opus | opus |
| design-agent | opus | sonnet | sonnet |
| fe-coder | opus | sonnet | sonnet |
| be-coder | opus | sonnet | sonnet |
| devops-agent | opus | sonnet | haiku |
| reviewer-agent | opus | haiku | haiku |
| qa-agent | opus | sonnet | sonnet |
| optimizer-agent | opus | sonnet | sonnet |
| security-agent | opus | sonnet | sonnet |
| docs-agent | opus | haiku | haiku |
| incident-agent | opus | sonnet | sonnet |

## Hard rules

- **Show the roster table on every run, before any question.** No exceptions —
  see the banner at the top of the flow.
- `pm-agent` stays opus. Never offer it as a choice; never write any other value
  for it.
- Valid models are `opus`, `sonnet`, `haiku` (and `inherit` for power users);
  `default` (or an absent row) means "use the team-wide default".
- **Project scope is the default.** Write the project's `ProjectAgents.md`;
  never stamp a shared agent file for a single project. Only the explicit
  team-wide-default scope touches `.claude/agent-models.json` + the apply script.
- A new model takes effect the next time that agent is dispatched on this project.
