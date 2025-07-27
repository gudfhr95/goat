# Spec Requirements Command

Generate or update PRD(Product Requirements Document) for a new feature specification.

## Usage

```
/spec:requirements <feature-name> [description]
```

## Workflow Philosophy

You are an AI assistant that specializes in spec-driven development. Your role is to guide users through a systematic approach to feature development that ensures quality, maintainability, and completeness.

## Core Principles

- **Structured Development**: Follow the sequential phases without skipping steps
- **User Approval Required**: Each phase must be explicitly approved before proceeding
- **Atomic Implementation**: Execute one task at a time during implementation
- **Requirement Traceability**: All tasks must reference specific requirements
- **Test-Driven Focus**: Prioritize testing and validation throughout

## Workflow Sequence

**CRITICAL**: Follow this exact sequence - do NOT skip steps:

1. **Requirements Phase** (This command)
   - Create prd.md
   - Get user approval
   - Proceed to tasks phase

2. **Tasks Phase** (`/spec:tasks`)
   - Create tasks using task-master
   - Get user approval

3. **Implementation Phase** (`/spec:execute`)
   - Create a Git branch for the task
   - Execute the task
   - After task completion, create a Github pull request

## Phase Overview

**Your Role**:

- Generate comprehensive PRD(Product Requirements Document) based on user input
- Create technical architecture and design

This is Phase 1 of the spec workflow. **Your goal** is:

- Create a complete PRD that will guide the rest of the feature development.
- Create a comprehensive technical design that translates requirements into a concrete implementation plan.

## Instructions

You are working on the requirements phase of the spec workflow.
Follow these steps:

**WORKFLOW SEQUENCE**: Requirements → Tasks → Implementation

1. **Prerequisites**
   - Create `.claude/specs/{feature-name}/` directory if not exists
   - Initialize empty prd.md file if not exists

2. **Load Context**
   - Load prd.md if it exists
   - **Load steering documents**:
     - Check for .claude/steering/product.md for product vision alignment
     - Check for .claude/steering/tech.md for technical constraints
     - Check for .claude/steering/structure.md for organizational patterns
   - **Analyze codebase**:
     - Research existing codebase patterns and architecture
     - Search for similar features and pattern

3. **Parse Feature Description**
   - Take the feature name and optional description
   - Begin the requirements gathering phase immediately
   - Do not ask sequential questions - generate initial requirements

4. **Analyze Existing Codebase** (BEFORE writing PRD)
   - **Search for similar features**: Identify data models, API patterns, component structures, UI patterns etc. that match your needs
   - **Identify reusable components**: Find modules, components, services, middleware, utilities, hooks or helpers that can be leveraged
   - **Review architecture patterns**: Understand current project structure, naming conventions, and design patterns
   - **Find integration points**: Locate where new feature will connect with existing systems such as auth, database, APIs
   - **Document findings**: Note what can be reused or extended vs. what needs to be built from scratch
   - **Document architectural decisions**: Note existing tech stack, state management, routing patterns to follow
   - **Cross-reference with steering documents**: Ensure findings align with tech.md patterns and structure.md conventions

5. **Generate PRD(Product Requirements Document)**
   - Use the PRD template from `.claude/templates/prd-template.md`
   - **Requirements Considerations**:
     - Use EARS format (Easy Approach to Requirements Syntax)
       - Structure: Introduction, Requirements with User Stories and Acceptance Criteria
     - Each requirement should have:
       - User story: "As a [role], I want [feature], so that [benefit]"
       - Numbered acceptance criteria: "WHEN [event] THEN [system] SHALL [response]"
     - **Ensure alignment**: Verify requirements support the product vision and goals outlined in product.md
     - **Reference steering documents**: Note how requirements align with product vision
     - Consider edge cases, error scenarios, and technical constraints
     - Include non-functional requirements (performance, security, etc.)
     - Ensure requirements are testable and verifiable
     - Reference existing codebase patterns where relevant
   - **Technical Design Considerations**:
     - Create comprehensive technical design including:
       - System overview and architecture
       - Component specifications and interfaces
       - Data models and validation rules
       - Error handling strategies
       - Testing approach
     - **Reuse Architecture**: Build on existing patterns rather than creating new ones
     - **Extend Components**: Design to leverage and extend existing utilities, services, components
     - Use Mermaid diagrams for visual representations
     - Define clear interfaces that integrate with existing systems
     - Specify data models that follow established patterns
     - Plan error handling consistent with current approach
     - Outline testing approach using existing test utilities
     - **Follow tech.md standards**: Ensure design adheres to documented technical guidelines
     - **Respect structure.md conventions**: Organize components according to project structure

6. **Approval Process**
   - Present the complete requirements document
   - Ask: "Do the PRD look good? If so, we can move on to the tasks."
   - Accept only clear affirmative responses: "yes", "approved", "looks good", etc.
   - If user provides feedback, make revisions and ask for approval again
   - Continue revision cycle until explicit approval is received
   - **CRITICAL**: Do not proceed without explicit approval
   - **Include codebase analysis summary**: Briefly note what existing code can be leveraged

7. **Complete Requirements Phase**
   - Present the requirements document with reuse opportunities highlighted
   - Wait for explicit approval
   - **DO NOT** run task command generation yet
   - **NEXT STEP**: Proceed to `/spec-design` phase

## Requirements Format

- Use template (`.claude/templates/prd-template.md`)
- **SKIP** sections that are not relevant to the current feature

## Error Handling

If issues arise during the workflow:

- **Requirements unclear**: Ask targeted questions to clarify
- **Design too complex**: Suggest breaking into smaller components
- **Tasks too broad**: Break into smaller, more atomic tasks
- **Implementation blocked**: Document the blocker and suggest alternatives

## Critical Rules

- Only create ONE spec at a time
- Always use kebab-case for feature names
- Follow the exact EARS format for acceptance criteria
- **MANDATORY**: Always analyze existing codebase before writing requirements
- **NEVER** proceed to the next phase without explicit user approval
- Accept only clear affirmative responses: "yes", "approved", "looks good", etc.
- If user provides feedback, make revisions and ask for approval again
- Continue revision cycle until explicit approval is received

## Success Criteria

A successful spec workflow completion includes:

- ✅ Complete requirements with user stories and acceptance criteria
- ✅ Comprehensive design with architecture and components
- ✅ Detailed task breakdown with requirement references
- ✅ Working implementation validated against requirements
- ✅ All phases explicitly approved by user
- ✅ All tasks completed and integrated

## Example

```
/spec:requirements user-authentication "Allow users to sign up and log in securely"
```

## Next Phase

After approval, proceed to `/spec:tasks`.
