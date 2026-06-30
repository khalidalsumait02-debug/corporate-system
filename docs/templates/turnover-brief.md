# Turnover brief template

Written when an agent runs out of context, gets stuck, or needs to hand off to a fresh instance. The replacement reads only this brief to continue.

```markdown
# Turnover — T### (@<outgoing-handle> → @<incoming-handle>)

**Date:** YYYY-MM-DD
**Reason:** context-low | stuck | role-handoff | abort
**Risk tier:** low | medium | high | critical
**Size:** XS | S | M | L

## Mission
<One paragraph: what this task delivers and why.>

## Progress so far
- [x] <Step 1 done — file/PR/artifact link>
- [x] <Step 2 done — file/PR/artifact link>
- [ ] <Next step — what specifically to do>
- [ ] <Following step>

## Current state of the world
- Branch: <name>
- Files modified but not committed: <list or "none">
- Tests run: <last result>
- Build state: <green/red/unknown>

## Decisions already made
- <Decision + reasoning, link to docs/decisions.md if logged>

## Open questions
- <Anything the incoming agent must NOT silently decide. Ask operator if blocked.>

## Don't do
- <Specific anti-actions: "don't edit src/auth/* — owned by another task">

## Relief chain
- Originator: @<handle> on YYYY-MM-DD
- (Add yourself when you hand off: @<handle> on YYYY-MM-DD)
```
