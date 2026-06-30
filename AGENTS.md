# Agent Team — Agents Hub

This repo is the central hub for everything we build:

- A registry of every project in our umbrella — see `projects.md`.
- Shared documentation, info, and reusable assets.
- A shared agent team installed **once into your global `~/.claude/`** (via `.claude/scripts/global-install.sh`) that serves **every** project — the agents live only in this hub, never vendored into project repos. Each project carries one small `ProjectAgents.md` for its own settings.
- A precise-planning flow (`/runagents`) that interviews you, drafts a plan, and gates dispatch on your approval.

The agents are language- and framework-agnostic. The same toolkit works for React, Vue, Svelte, Next, Astro, plain HTML, React Native, Flutter, Node, Python, Go, Rust, Java/Kotlin, .NET — anywhere code lives.

---

## How to use

One command, all lowercase:

```
/runagents
```

That's it. The `/runagents` skill is handled by the orchestrator (the session you talk to), which picks the mode and gathers what's needed before bringing in `@pm-agent` to plan:

- **Bootstrap** — fires when `PROJECT.md` doesn't exist. The orchestrator runs the discovery interview inline, then hands the answers to PM to scaffold the project.
- **Feature plan** — fires when you typed `/runagents <feature description>`. The orchestrator gathers any missing requirements, then PM drafts the plan and runs the approval gate.
- **Status** — fires when you typed `/runagents status`. The orchestrator answers directly; PM isn't launched.

The cheap steps (asking questions, reading back status) are handled by the orchestrator with no agent launch; `@pm-agent` is launched once, only for the work that needs its planning judgment.

Direct calls still work for when you know exactly which agent you want: `@fe-coder implement T012`, `@security-agent clear PR #44`, etc.

---

## Choosing each agent's model

Every agent runs on **`opus`** by default — the deepest-reasoning model, standard
across the whole team. You control each agent's model **per project**, and can
dial individual agents down when you want the team faster or cheaper.

```
/setmodels
```

This always shows the full agent roster first (each agent's name, what it does,
and its current model), then walks you through quick profiles (**All Opus** /
**Balanced** / **Fast**) or a per-agent custom pick. `@pm-agent` is **locked to
`opus`** and is never offered as a choice.

**Per project, isolated.** Your picks are written to that project's
`ProjectAgents.md` manifest, and the orchestrator launches each agent on the
chosen model at dispatch. The shared agents are **never rewritten** — so every
project keeps its own model setup, and many projects can run at once without
affecting each other. The team-wide default lives in the hub's
`.claude/agent-models.json` (changed only when you mean *all* projects). Full
reference: `docs/agents/models.md`.

Speed note: `opus` is the slowest/priciest and `haiku` the fastest/cheapest, with
`sonnet` in between. If the team feels slow, `/setmodels` → **Balanced** or
**Fast** keeps planning sharp while speeding up the rest.

---

## Talking to you — the operator

You should barely hear from us while work is happening. The whole point of this system is that you say what you want, approve it once, and get working software back — without reading about the machinery.

**We speak to you at only two moments:**

1. **When we need a decision only you can make** — asked as a plain question with concrete choices.
2. **When something is ready** — finished, or ready for you to look at or merge.

**When a job is done, you get a 2-sentence summary, maximum** — what changed, and what (if anything) you need to do next. Nothing more.

**Everything in between is silent.** Starting a task, building, testing, switching branches, running a security check, handing off between specialists — none of that reaches you. It happens quietly in the background.

**Plain English, always.** Any message you can read in chat is written for you, not for the machine. We never show you:

- task codes (`T006`), agent names (`@be-coder`), or risk/size labels (`high`, `M`)
- internal step names ("adversarial reviewer", "security veto", "QA gate")
- git mechanics (branch names, worktrees, rebases) or version tags (`Go v52`, `FE v97`)
- internal jargon ("fail-closed", "no oracle", "PII zone") or code helper names (`devLog`)

We describe things by what they mean for you — "I'm fixing how the app hides sensitive info in its logs", not "T008 anonymize-pii in the PII zone". **If a message ever reads like gibberish to you, that is our bug — tell us and we'll restate it.**

This rule binds the orchestrator (the session you talk to) and every agent. It is the operator-facing half of the "silence is success" guardrail below, and `block-narration.sh` warns when a long message leaks machine vocabulary.

---

## Teams and agents

**9 teams, 12 agents.** Each agent's `description` carries the team tag.

| Team | Claude Handle | Purpose | Why we need it |
|---|---|---|---|
| **PM** | `@pm-agent` | Listens to what you want and turns it into a clear plan. Handles all the other agents on your behalf. | So you only have to talk to one agent. PM does the thinking about who does what. |
| **Architecture** | `@architect-agent` | Decides how the pieces of the system fit together before any code is written. | Stops costly mistakes that only show up later, after lots of work has already been done. |
| **Frontend** | `@design-agent` | Designs the screens and buttons users see, plus how they flow from one to the next. | Coders need a clear picture before they can build anything. This agent draws that picture in words. |
| **Frontend** | `@fe-coder` | Builds the screens and buttons users click on. | Someone has to turn the design into real working pages. |
| **Backend** | `@be-coder` | Builds the invisible engine — data, accounts, logins, payments, anything not on screen. | Apps only work when there's something behind the screens making them go. |
| **DevOps** | `@devops-agent` | Packages the app so it can ship and run anywhere — and rolls it back if something goes wrong. | An app on a laptop isn't useful until it can run for real users in a real place. |
| **Review** | `@reviewer-agent` | Reads new code and flags problems before testing starts. | Catches sloppy or risky work early — cheap to fix now, expensive later. |
| **QA** | `@qa-agent` | Writes tests that prove a feature actually works the way it should. | Without tests, every change risks breaking something. This agent keeps the app honest. |
| **Optimization** | `@optimizer-agent` | Finds the slow parts of the app and makes them faster. | Slow apps lose users — but only the slow parts need fixing, so this agent only runs when speed matters. |
| **Security** | `@security-agent` | Looks for ways an attacker could break in or steal data, and blocks shipping until issues are fixed. | One security mistake can cost the whole project. This agent is the final check before anything ships. |
| **Docs** | `@docs-agent` | Writes the README, guides, and instructions so other people know how to use what was built. | Code nobody knows how to use is half-finished. |
| **Incident** | `@incident-agent` | Helps figure out what went wrong when the live app breaks for real users. | When something breaks in production, you need a calm first responder who knows what to check and what to roll back. |

### Pipeline (with trigger gates)

```
@pm-agent (intake → echo-back → plan draft → approval gate)
    ↓
@architect-agent (M+ tasks only — contract to docs/architecture/**)
    ↓
@design-agent (UI tasks only — spec to docs/design/**)
    ↓ assigns ↓
@fe-coder   @be-coder   @devops-agent   (parallel)
    ↓           ↓           ↓
@reviewer-agent (medium+ risk — code quality + adversarial)
    ↓
@qa-agent (real assertions, ≥80% coverage)
    ↓ (only if 100% pass)
@optimizer-agent (only if perf target or hot path)
    ↓
@security-agent (only if risk medium+ or sensitive zone)
    ↓ (only if clean)
@docs-agent (only if externally observable change)
    ↓
@pm-agent (closeout — recommends closing the issue; closes only on your confirmation)
```

**Fail-Closed.** Any failing gate halts the pipeline. No silent pass-through.

---

## Orchestration model — PM drives, orchestrator executes (Option B)

The orchestrator is the top-level Claude Code session the operator talks to. Sub-agents cannot spawn other sub-agents — so the orchestrator is the **only** thing that can launch an agent or create a branch. It is also the operator's intake layer: it gathers requirements (the discovery interview, missing-field questions) and answers status directly, with no agent launch. PM is brought in only to plan and to drive the pipeline.

PM is the pipeline driver: after every completion (and every PR merge) PM writes a **dispatch directive** into `TASKS.md` (under `## Next dispatch`). The orchestrator reads that directive, runs its pre-dispatch checks, creates the fresh branch, and invokes the named agent. The dispatched agent returns; the orchestrator goes back to PM for the next directive. Loop until the feature is shipped or PM writes `## Blocked`. **The planner thinks, the orchestrator acts** — PM decides what runs next; the orchestrator presses the button.

The dispatch directive (see `docs/templates/dispatch-directive.md`) is the contract that carries:
- The previous-step artifact path the next agent must read first.
- The previous PR number that must be `merged` before we start.
- The fresh branch name to create off a clean `main`.
- The brief to hand to the named agent.

Every task starts on its own fresh branch off `main` — no two tasks share a branch, ever. The `enforce-fresh-branch.sh` PreToolUse hook blocks code edits made on `main`, on a branch whose remote was deleted (i.e. a merged branch you accidentally landed on), or on a branch whose name doesn't match the canonical convention (see "Branch naming" below).

### Parallel fan-out at the build stage

Most hops are serial because each step needs the previous one's output. The exception is the **build stage**: when one feature splits into independent pieces — typically a frontend half and a backend half, both downstream of the same merged architecture contract — those coders can run **at the same time**. PM emits a parallel-batch directive (see the dispatch-directive template) and the orchestrator launches the members **concurrently in a single turn**, each in its own git worktree on its own fresh branch, then waits for all of them before returning to PM.

This is only ever done when it's provably safe: the tasks have no dependency on each other, and their file-ownership zones are disjoint (FE and BE zones already are, and the `file-ownership.sh` hook enforces it). The dependent pipeline chain — architect → design → build → reviewer → QA → security → docs — stays strictly sequential; parallelism happens *within* the build stage only, never across gates. When in doubt, PM keeps it serial.

Typical session:

```
You:        /runagents add a settings page
orchestrator: [gathers any missing requirements inline — asks 1 question about a
             missing field — no agent launched yet]
You:        [answers]
orchestrator: [launches @pm-agent once with the gathered requirements]
@pm-agent:  [echo-back, asks confirm]
You:        confirm
@pm-agent:  [drafts plan with risk tiers, sizes, deps, branch names per task]
You:        approve
@pm-agent:  [writes TASKS.md, writes the first dispatch directive into
             TASKS.md → ## Next dispatch, returns "First dispatch ready."
             (issues are NOT auto-filed — PM offers to open them, you decide)]
You (orch): [reads ## Next dispatch, runs pre-dispatch checks, creates the
             fresh branch off main, invokes @architect-agent on T012]
@architect-agent: [writes contract, returns "T012 done. Artifact: docs/architecture/settings.md"]
You (orch): [back to @pm-agent for next directive]
@pm-agent:  [verifies artifact exists, writes next ## Next dispatch line]
... [orchestrator loops one hop at a time until done] ...
@pm-agent:  [closeout — recommends closing the issue, shows the closing
             comment; posts it and closes only after you confirm]
```

PM never holds the bus. Each hand-off is one directive, written once, then PM yields. State lives in `TASKS.md` and the per-task artifact files, so context compaction never erases the pipeline.

---

## Three Core Operational Guardrails

Non-negotiable, embedded via `.claude/agents/_base.md` which every agent reads first.

1. **Silence is success.** Agents speak only on blocker, question, or completion — and always in plain English (see "Talking to you — the operator" above). `TASKS.md` is the canonical state.
2. **Zero-Annotation Law.** Code never gets "what" comments. Enforced by `block-comments.sh`.
3. **Fail-Closed.** Any failure halts the pipeline and writes a `## Blocked` row.

Plus a fourth that's structural rather than behavioural:

4. **Risk tier + size tag drive routing.** Every task carries `risk:` and `size:`. They decide which gates fire. See `_base.md`.

And a fifth that governs GitHub:

5. **Issues are recommend-only.** No agent ever creates, updates, or closes a GitHub issue on its own. They recommend it in plain English; you must ask for it and confirm before any issue write happens — at plan time and at closeout alike. See `_base.md`.

---

## Precise-planning flow

No free-text feature request goes straight to work. Every feature goes through:

1. **Intake** — the orchestrator gathers the requirement, asking one question per missing field (batched up to 3 per round) before any agent launch. Ambiguous words are rejected here: *etc., and stuff, make it better, modernize, clean up, robust, scalable, user-friendly, fast, secure, intuitive, polish* — each must be replaced with a measurable criterion.
2. **Echo-back** — PM restates the request in plain English; you confirm.
3. **Plan draft** — PM writes the task list with risk tiers, sizes, deps, Given/When/Then acceptance criteria.
4. **Architect feasibility ping** — for M+ tasks, architect answers yes / no / with-caveat before approval.
5. **Approval gate** — you reply `go` or `approve` before any task is committed to `TASKS.md`.
6. **Commit** — only after approval. Writes the task list; **does not auto-file GitHub issues** — PM recommends issues and opens them only if you ask and confirm.

Steps 2–6 are PM's; step 1 is the orchestrator's, so PM is launched once with a clean brief rather than re-launched per question.

---

## Risk tier reference

| Tier | When PM picks it | Required controls |
|---|---|---|
| `low` | Cosmetic, single-file, easy rollback. | Basic validation. Skip optimizer + security unless explicitly invoked. |
| `medium` | User-visible, multi-file. | Failure-mode checklist. Reviewer pass. Negative test. Rollback note. |
| `high` | Security / compliance / data integrity impact. | All of medium + adversarial reviewer + security pre-check. |
| `critical` | Irreversible, auth, payment, PII, schema migration. | All of high + human approval gate + two-step verification + contingency plan. |

## Size reference

| Size | When PM picks it | Pipeline path |
|---|---|---|
| `XS` | Single-file edit, no design or architecture needed. | Coder → QA → done. |
| `S` | One layer, no contract change. ~½ day. | Design (if UI) → Coder → QA → done. |
| `M` | Cross-layer or new auth scope. ~1-3 days. | Architect → Design (if UI) → FE+BE parallel → Reviewer → QA → Security → done. |
| `L` | Multi-feature, schema, integration. Week+. | Full pipeline + approval gate before code starts. |

---

## Shared docs and templates

| Path | Owner | Purpose |
|---|---|---|
| `.claude/agents/_base.md` | shared | Rules every agent reads first. |
| `.claude/scripts/global-install.sh` | shared | Installs the team into global `~/.claude/` (desktop). |
| `docs/templates/ProjectAgents.md` | shared | Template for each project's `ProjectAgents.md` manifest (per-project models + customizations). |
| `ProjectAgents.md` | project (project repo root) | A project's own models + per-agent customizations. Read at runtime; the only place per-project agent customization is written. |
| `docs/templates/` | shared | Fixed schemas — task brief, plan draft, status, blocker, turnover, closing comment, architecture contract. |
| `docs/damage-control/` | shared | Recovery procedures — stuck-agent, context-handover, faulty-rollback, abort-reset. |
| `docs/agents/models.md` | shared | Per-agent model assignment + override rules. |
| `docs/agents/anti-patterns.md` | shared | Named anti-patterns; hook-enforced where possible. |
| `docs/conventions.md` | PM (project-specific) | Naming, structure, error shape, etc. |
| `docs/glossary.md` | PM (project-specific) | Domain terms. |
| `docs/decisions.md` | PM + architect | Append-only decision log. |
| `docs/agent-notes/<agent>.md` | PM routes, agent reads | Per-agent, per-project guidance (tools, patterns to prefer/avoid, lessons). Each agent reads only its own file on activation. |
| `docs/architecture/<slug>.md` | architect | One per M+ feature contract. |
| `docs/design/<slug>.spec.md` | design-agent | One per UI spec. |
| `docs/releases/<date>.md` | devops | Release notes + rollback procedure. |

---

## Hooks (tool-level enforcement)

| Hook | Event | What it enforces |
|---|---|---|
| `block-env-writes.sh` | PreToolUse Write/Edit | Blocks writes to `.env`, `.env.local`, `.env.production`. |
| `file-ownership.sh` | PreToolUse Write/Edit | Warns when editing a file not in any active task's ownership block. |
| `enforce-fresh-branch.sh` | PreToolUse Write/Edit | Blocks code edits on `main`/`master`, on a branch whose remote was deleted (merged-branch trap), or on a branch whose name doesn't match the canonical convention. Docs / `.claude` / `.github` / root-markdown paths exempt. |
| `enforce-issue-close.sh` | PreToolUse `mcp__github__issue_write` | Blocks issue closes without the closing-comment template. |
| `block-comments.sh` | PostToolUse Write/Edit | Zero-Annotation Law. |
| `auto-stamp-tasks.sh` | PostToolUse Write/Edit | Auto-stamps `TASKS.md` transitions with today's date. |
| `block-narration.sh` | Stop | Warns when a long agent response lacks a blocker/question/completion keyword, or leaks machine vocabulary (task codes, agent handles, gate names, branch mechanics) into operator-facing text. |
| `budget-watch.sh` | Stop | Surfaces context-window thresholds (Green/Amber/Red/Critical) and triggers handover at Red. |
| `capture-learnings.sh` | SubagentStop | Reminds a specialist to record any reusable lesson in its own `docs/agent-notes/` file when it finishes substantive work without touching it. Advisory; never writes, never blocks. |
| `session-start.sh` | SessionStart | Prints roster and bootstrap hint. |

---

## Branch naming

`<initials>/<agent>/<type>/T###-<slug>` — example: `fa/fe-coder/feat/T012-settings-page`.

- `<initials>` — operator initials, lowercase (e.g. `fa`).
- `<agent>` — the owning agent handle, no `@`: `pm-agent`, `architect-agent`, `design-agent`, `fe-coder`, `be-coder`, `devops-agent`, `reviewer-agent`, `qa-agent`, `optimizer-agent`, `security-agent`, `docs-agent`, `incident-agent`.
- `<type>` — one of `feat` / `fix` / `docs` / `chore` / `refactor` / `test`.
- `T###-<slug>` — the task ID from `TASKS.md` plus a short lowercase-hyphenated slug.

This is the **one** canonical form. It is enforced by the `enforce-fresh-branch.sh` PreToolUse hook — a code edit on a branch that doesn't match this pattern is blocked (docs / `.claude/` / `.github/` / root-markdown paths are exempt). The orchestrator creates the branch off a clean `main` before invoking the owner; agents do not invent their own names.

---

## Using the team in a project (global install + per-project manifest)

The team is a **shared, global toolkit** — install it once into `~/.claude/` and it serves every project. The agents live only in this hub; nothing is vendored into project repos, so there's no per-project copy to maintain and no re-import on updates.

- **Desktop:** clone this hub once, then run `bash .claude/scripts/global-install.sh` (symlinks `~/.claude/{agents,skills,hooks}` to the clone). A `git pull` in the clone updates the team **everywhere** at once.
- **Web:** point the environment's setup script at this hub so it clones into `~/.claude/` at container start; every session is auto-current.

Each project then carries one **`ProjectAgents.md` at its own repo root** — that project's per-agent models and per-agent customizations (template: `docs/templates/ProjectAgents.md`). Same filename in every project; they don't collide because each lives in its own repo. A new project starts from the template — a clean slate.

**Customizing an agent for a project edits that project's `ProjectAgents.md`, never the shared agent.** The hub agents stay pristine for everyone; the manifest layers project tweaks on top at runtime, which is also what lets many projects run at once without colliding.

Open Claude Code on the project and type `/runagents` to bootstrap.

**Legacy per-repo install (fallback only).** A self-contained vendored copy is still available — `scripts/install-agents.sh /path/to/your-project-repo` (add `--force` to overwrite). The global toolkit above is the recommended path.

---

## Out-of-band setup (once per project)

- Enable **branch protection** on `main`.
- Set up **CODEOWNERS** if you want review enforcement.
- Enable the **GitHub MCP server** so PM and security can read PRs and — only when you ask and confirm — file or close issues.
