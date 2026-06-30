---
name: runagents
description: Single entry point for the agent team. Bootstraps a new project (runs the discovery interview, writes PROJECT.md, files initial tasks) OR plans a new feature (intake form, echo-back, plan draft, approval gate). Always routes through @pm-agent. Use this when the user types /runagents, /RunAgents, /RUNAGENTS, or any case variant.
---

# /runagents — the operator's single entry point

The one command the operator needs to remember. The orchestrator picks a mode
and either handles the cheap steps **itself** or launches `@pm-agent` for the
work that needs PM's judgment.

## Why some steps skip the agent (read this first)

Launching `@pm-agent` is expensive: it's a separate AI on the slowest model
(opus, locked) that loads a large instruction set before doing anything. The
throwaway entry steps — asking the discovery questions, reading back status —
don't need that. **The orchestrator (this top-level session) handles those
inline, with no agent launch.** `@pm-agent` is launched **once**, only when
there's real planning or file-writing to do — never re-launched on every
question round.

Net effect: the operator gets the first question instantly, and PM boots a
single time with everything it needs, instead of booting and re-booting to ask
questions one round at a time.

## Mode selection

Inspect repo state and the operator's free-text after `/runagents`, then pick:

### A. Status — orchestrator handles inline, NO agent launch
Fires when the text is "status", "what's blocked", "where are we", or similar.
The orchestrator reads `TASKS.md` and `PROJECT.md` and fills
`docs/templates/status-checkpoint.md` directly. Two-sentence plain-English
summary + the filled template. Do **not** launch `@pm-agent`.

### B. Bootstrap — orchestrator runs the interview inline, then ONE PM launch
Fires when `PROJECT.md` does not exist, or the text is empty / "new project" /
"start a project".

1. **Orchestrator runs the discovery interview** (no agent launch). Ask the
   tiered questions below as plain chat text, batched. Pick the tier from the
   operator's first answer.
   - **Tier 1 (3 Qs)** — single-purpose tool ("a CLI that counts lines"):
     1. What is this? (one sentence)  2. Who uses it? (me / team / public)
     3. Language or framework preference?
   - **Tier 2 (5 Qs)** — small app: 1–3 above, plus 4. Hosting target?
     5. v1 must-have features (3–5 bullets)?
   - **Tier 3 (9 Qs)** — anything non-trivial: 1–5 above, plus 6. Scale at
     launch and 12 months?  7. Compliance (HIPAA/GDPR/SOC2/PCI/none)?
     8. Hard constraints?  9. Out of scope for v1?
   - Then one open question for agent-notes: "Any project-specific tools,
     conventions, or rules to preserve? I'll route each to the right place."
2. **Launch `@pm-agent` once** with all collected answers, in bootstrap mode:
   "Bootstrap the project from these discovery answers: <verbatim answers>.
   Scaffold PROJECT.md, TASKS.md, docs/* from the templates, route the
   agent-notes inputs, and return the routing for operator confirmation. Read
   `.claude/agents/_base.md` first." PM does the file-writing it owns; the
   orchestrator does not write those files itself.

### C. Feature plan — orchestrator gathers obvious intake inline, PM plans
Fires when `PROJECT.md` exists AND the operator gave a feature request.

1. **Orchestrator** reads the request and, if a required intake field is
   plainly missing, asks the operator directly (batched, ≤3 questions) — no
   agent launch for these clarifications. Reject the banned vague words
   (*etc., make it better, modernize, clean up, robust, scalable,
   user-friendly, fast, secure, intuitive, polish*) and ask for a measurable
   replacement.
2. **Launch `@pm-agent`** with the request + any gathered answers: "Plan this
   feature: run echo-back, plan draft (risk tiers, sizes, deps, Given/When/Then),
   the M+ feasibility ping if needed, and the approval gate, then commit to
   TASKS.md on approval. Operator request: <verbatim>. Already-gathered intake:
   <answers>." PM owns the echo-back, plan, and commit.

## What PM produces (modes B and C)

PM ends its turn by handing control back with EITHER:
- A single targeted follow-up question (a derived intake field is still blank), OR
- (bootstrap) the agent-notes routing for confirmation, then "Bootstrapped.", OR
- (feature) a plan draft for operator approval (`go` / `approve`), then on
  approval "Plan committed. First dispatch ready in TASKS.md → ## Next dispatch."

## After approval — pipeline-driver loop

Once PM returns "Plan committed. First dispatch ready…", the orchestrator loops:

1. Read `TASKS.md`'s `## Next dispatch` line — PM's dispatch directive.
2. Run the pre-dispatch checks (see `docs/templates/dispatch-directive.md`):
   verify previous artifact exists, verify previous PR merged, reset to clean
   `main`, create the named fresh branch.
3. Read this project's `ProjectAgents.md` model table. Invoke the named
   agent with the directive's brief, launching it on the model the manifest
   assigns (`default`/absent → the team default in `.claude/agent-models.json`;
   `pm-agent` → always `opus`). Apply the model as a launch-time override only;
   never rewrite the shared agent file.
4. When that agent returns `done`, launch `@pm-agent` in **pipeline-driver
   mode** to write the next directive.
5. Repeat until no further dispatch (feature shipped) or PM writes `## Blocked`.

This is Option B: PM drives, orchestrator executes. Inter-agent state lives in
`TASKS.md` and the per-task artifact files, never in chat.

## Hard rules

- Status mode and the interview/intake question rounds are the **only** steps
  the orchestrator handles without launching PM. Everything that writes
  `PROJECT.md`/`TASKS.md`/`docs/*`, drafts a plan, or drives the pipeline goes
  through `@pm-agent`.
- Never dispatch a downstream agent before `@pm-agent` returns an approved plan.
- `@pm-agent` writes nothing to `TASKS.md` or GitHub until the operator approves.
- The orchestrator does not invent tasks. It only relays what `@pm-agent` produced.
- Every task starts on a fresh branch off `main`. Never branch off another
  task's in-progress branch. The `enforce-fresh-branch.sh` hook is the safety net.
- Per-project agent settings come from `ProjectAgents.md`, applied at
  dispatch. Never edit a shared agent definition to customize it for one project.
- Never create, update, or close a GitHub issue automatically. Recommend it in
  plain English and wait for the operator's explicit confirmation.
