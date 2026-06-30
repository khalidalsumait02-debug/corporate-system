# Status checkpoint template

Used when `@pm-agent` is asked "what's the status?" or runs a scheduled checkpoint.

```markdown
# Status — YYYY-MM-DD

## In progress
- T### @<handle> — <one-line state>

## Blocked
- T### @<handle> — <cause>; needs <decision/agent>

## Done since last checkpoint
- T### @<handle> — <artifact link>

## Risk register
- <Any new risks or unknowns surfaced since last checkpoint, or "none">

## Asks
- <Anything that needs operator input, or "none — silent run">
```
