# Spec Requirements Command

Generate or update requirements document for an existing spec.

## Usage

```
/spec:requirements <feature-name> [description]
```

## Phase Overview

**Your Role**: Generate comprehensive requirements based on user input

This is Phase 1 of the spec workflow. Your goal is to create a complete requirements document that will guide the rest of the feature development.

## Instructions

You are working on the requirements phase of the spec workflow.

1. **Identify Current Spec**
   - Load existing prd.md

2. **Load Context**
   - **Load steering documents**:
     - Check for .claude/steering/product.md for product vision alignment
     - Check for .claude/steering/tech.md for technical constraints
     - Check for .claude/steering/structure.md for organizational patterns
   - **Analyze codebase**: Search for similar features and patterns

3. **Generate PRD(Product Requirements Document)**
   - Use EARS format (Easy Approach to Requirements Syntax)
   - Structure: Introduction, Requirements with User Stories and Acceptance Criteria
   - Each requirement should have:
     - User story: "As a [role], I want [feature], so that [benefit]"
     - Numbered acceptance criteria: "WHEN [event] THEN [system] SHALL [response]"
   - **Ensure alignment**: Verify requirements support goals outlined in product.md

4. **Content Guidelines**
   - Consider edge cases and error handling
   - Include non-functional requirements (performance, security, etc.)
   - Reference existing codebase patterns where relevant
   - **Align with product vision**: Ensure all requirements support product.md goals
   - Ensure requirements are testable and verifiable

5. **Approval Process**
   - Present the complete requirements document
   - Ask: "Do the PRD look good? If so, we can move on to the tasks."
   - Make revisions based on feedback
   - Continue until explicit approval is received
   - **CRITICAL**: Do not proceed without explicit approval

### Process

1. Parse the feature description provided by the user
2. Create user stories in format: "As a [role], I want [feature], so that [benefit]"
3. Generate acceptance criteria using EARS format:
   - WHEN [event] THEN [system] SHALL [response]
   - IF [condition] THEN [system] SHALL [response]
4. Consider edge cases, error scenarios, and non-functional requirements
5. Present complete PRD
6. Ask: "Do the PRD look good? If so, we can move on to the tasks."
7. **CRITICAL**: Wait for explicit approval before proceeding
8. **NEXT PHASE**: Proceed to `/spec:tasks` (DO NOT run scripts yet)

## Requirements Format

- Use template (`.claude/templates/prd-template.md`)

## Critical Rules

- **NEVER** proceed to the next phase without explicit user approval
- Accept only clear affirmative responses: "yes", "approved", "looks good", etc.
- If user provides feedback, make revisions and ask for approval again
- Continue revision cycle until explicit approval is received

## Next Phase

After approval, proceed to `/spec:tasks`.
