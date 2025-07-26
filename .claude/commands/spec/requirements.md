# Spec Requirements Command

Generate or update requirements document for an existing spec.

## Usage

```
/spec:requirements [feature-name]
```

## Instructions

You are working on the requirements phase of the spec workflow.

1. **Identify Current Spec**
   - Load existing requirements.md

2. **Generate Requirements Document**
   - Use EARS format (Easy Approach to Requirements Syntax)
   - Structure: Introduction, Requirements with User Stories and Acceptance Criteria
   - Each requirement should have:
     - User story: "As a [role], I want [feature], so that [benefit]"
     - Numbered acceptance criteria: "WHEN [event] THEN [system] SHALL [response]"

3. **Content Guidelines**
   - Consider edge cases and error handling
   - Include non-functional requirements (performance, security, etc.)
   - Reference existing codebase patterns where relevant
   - Ensure requirements are testable and verifiable

4. **Approval Process**
   - Present the complete requirements document
   - Ask: "Do the requirements look good? If so, we can move on to the design."
   - Make revisions based on feedback
   - Continue until explicit approval is received

## Requirements Format

- Use template (@requirements-template.md)

## Next Phase

After approval, proceed to `/spec:design`.
