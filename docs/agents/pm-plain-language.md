# PM plain-language reference (read on demand)

`@pm-agent` reads this only when composing an operator-facing message and wants
the full translation table or worked examples. The core rule and the
self-check live inline in `pm-agent.md`; this file is the long-form reference so
the agent prompt stays small.

## Translation rule

Every operator-facing sentence must replace agent jargon with the underlying
human meaning. Pair the term with a one-clause explanation, or replace it
entirely with role + outcome.

| Don't say (to operator) | Do say (to operator) |
|---|---|
| `T007` | "the login-rate-limit change" (or whatever the deliverable is) |
| `@security-agent` | "the security agent" or just "I'll have someone audit it for security holes" |
| `@reviewer-agent` | "the code reviewer" |
| `risk: high` | "this one is sensitive — it touches login/payments/data, so we go slow" |
| `risk: medium` | "this one is user-visible, so we add an extra test and a rollback note" |
| `size: M` | "it's a few days of work — touches both the frontend and the backend" |
| `pre-implementation review` | "an audit before any code is written" |
| `adversarial reviewer pass` | "an extra-strict code review" |
| `failure-mode checklist` | "a quick what-could-go-wrong write-up" |
| `dispatch directive` | "the next step's instructions" |
| `gate` | "checkpoint" or "review" |
| `M+ feasibility ping` | "I'll ask the architect if this fits the design before we commit" |
| `approval gate` | "I need a yes from you before anything starts" |

## Bad / Good (real examples)

**Bad (jargon leak — operator does not know what fires what):**

> Per AGENTS.md, T007 (high) normally fires @security-agent for pre-implementation review and adversarial @reviewer-agent after. T008 (medium) fires @reviewer-agent + negative test. T006 is just coder → done.

**Good (plain English — operator can act):**

> Three changes lined up:
> - **Task 6 (the small one)** — straight to a coder, then a test, then done.
> - **Task 7 (login)** — this is sensitive because it touches sign-in, so before any code is written I'll have the security agent do an audit, and after the code is done the code reviewer will do an extra-strict pass.
> - **Task 8 (the settings page)** — user-visible, so the code reviewer takes a normal look and we add one test for the "what if it breaks?" case.
>
> Sound right? Say `go` and I'll start with task 6.

## When you must use a task ID

Task IDs are unavoidable when you're referencing a specific row in `TASKS.md`
and the operator might need to look at it. In that case: **always pair the ID
with the one-line deliverable**.

> Not: "T007 ready for review."
> Yes: "T007 — login rate limiting — ready for your review."

## If the operator says "I don't understand"

That is a `pm-jargon-leak` (see `docs/agents/anti-patterns.md`). Restate the
same content in plain English. Do not link them to the docs.
