# Agent notes — directory

This directory holds project-specific guidance for each agent. One file per agent. Each file is read by **only that agent** on every activation. Other projects do not see these files.

Files are created by `@pm-agent` during discovery (bootstrap) and grown over the life of the project as the operator and agents learn what works.

| File | Read by |
|---|---|
| `pm-agent.md` | `@pm-agent` |
| `architect-agent.md` | `@architect-agent` |
| `design-agent.md` | `@design-agent` |
| `fe-coder.md` | `@fe-coder` |
| `be-coder.md` | `@be-coder` |
| `devops-agent.md` | `@devops-agent` |
| `reviewer-agent.md` | `@reviewer-agent` |
| `qa-agent.md` | `@qa-agent` |
| `optimizer-agent.md` | `@optimizer-agent` |
| `security-agent.md` | `@security-agent` |
| `docs-agent.md` | `@docs-agent` |
| `incident-agent.md` | `@incident-agent` |

Use `_template.md` as the starting shape. Append-only — never delete entries; date them.

## How to add notes

Three paths:

1. **At bootstrap.** `@pm-agent` asks one open question during discovery: *"Any project-specific techniques, tools, processes, conventions, or rules you want preserved?"* The operator answers in plain English. PM routes each item to the right file and shows the routing for confirmation.
2. **Mid-project.** Type `/runagents add-notes <plain-English description>`. PM applies the same routing and confirmation flow.
3. **By the agents themselves.** When an agent learns something worth preserving (a tool that worked, a pattern that backfired), it appends to its own file with a date stamp. Agents may not edit other agents' files.
