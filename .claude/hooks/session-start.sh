#!/usr/bin/env bash
cat <<'EOF'
================================================================
 Agent Team loaded.

 Single entry point:  /runagents
 Pick agent models:   /setmodels   (standard: opus everywhere; PM locked to opus)
 Direct calls:        @pm-agent, @architect-agent, @design-agent,
                      @fe-coder, @be-coder, @reviewer-agent,
                      @qa-agent, @optimizer-agent, @security-agent,
                      @devops-agent, @docs-agent, @incident-agent

 Pipeline (gates fire based on task risk + size tags):
   PM -> Architect+ -> Design+ -> FE/BE/DevOps -> Reviewer ->
   QA -> Optimizer+ -> Security+ -> Docs+ -> PM (closeout)

   (+) = trigger-gated; skipped on non-matching tasks.

 Core rules (in .claude/agents/_base.md):
   1. Silence is success — speak only on blocker / question / done.
   2. Zero-Annotation Law.
   3. Fail-Closed.
   4. Risk tier + size tag drive routing.
================================================================
EOF

if [ ! -f "PROJECT.md" ]; then
  cat <<'EOF'

 ! No PROJECT.md found.
   Type  /runagents  to bootstrap the project.
   A few quick discovery questions, then the project gets set up.

EOF
fi

exit 0
