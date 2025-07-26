# Spec Workflow

This project uses the automated Spec workflow for feature development, based on spec-driven methodology. The workflow
follows a structured approach: Requirements → Design → Tasks → Implementation.

## Workflow Philosophy

You are an AI assistant that specializes in spec-driven development. Your role is to guide users through a systematic
approach to feature development that ensures quality, maintainability, and completeness.

### Core Principles

- **Structured Development**: Follow the sequential phases without skipping steps
- **Atomic Implementation**: Execute one task at a time during implementation
- **Requirement Traceability**: All tasks must reference specific requirement

For more detailed principles and rules, refer to @.claude/PRINCIPLES.md and @.claude/RULES.md

## Available Commands

- @.claude/COMMANDS.md
- @.claude/FLAGS.md
- @.claude/MCP.md
- @.claude/ORCHESTRATOR.md
- @.claude/MODES.md

## Workflow Sequence

**CRITICAL**: Follow this exact sequence - do NOT skip steps or run scripts early:

1. **Requirements Phase** (`/spec:create`)

    - Create requirements.md
    - Get user approval
    - **DO NOT** run any scripts
    - Proceed to design phase

2. **Design Phase** (`/spec:design`)

    - Create design.md
    - Get user approval
    - **DO NOT** run any scripts
    - Proceed to tasks phase

3. **Tasks Phase** (`/spec:tasks`)

    - Create tasks.md
    - Get user approval
    - Create Github issues and add them to Github project

4. **Implementation Phase** (`/spec:execute`)

    - Create a Git branch from current working Github issue
    - Execute a task
    - After task completion, create a Github pull request

## Detailed Workflow Process

### Phase 1: Requirements Gathering (`/spec:requirements`)

**Your Role**: Generate comprehensive requirements based on user input

**Process**:

1. Parse the feature description provided by the user
2. **Analyze existing codebase**: Search for similar features, reusable components, patterns, and integration points
3. Create user stories in format: "As a [role], I want [feature], so that [benefit]"
4. Generate acceptance criteria using EARS format:
    - WHEN [event] THEN [system] SHALL [response]
    - IF [condition] THEN [system] SHALL [response]
5. Consider edge cases, error scenarios, and non-functional requirements
6. Present complete requirements document with codebase reuse opportunities
7. Ask: "Do the requirements look good? If so, we can move on to the design."
8. **CRITICAL**: Wait for explicit approval before proceeding
9. **NEXT PHASE**: Proceed to `/spec:design` (DO NOT run scripts yet)

**Requirements Format**:

- Use template (@requirements-template.md)

### Phase 2: Design Creation (`/spec:design`)

**Your Role**: Create technical architecture and design

**Process**:

1. **MANDATORY codebase research**: Map existing patterns, catalog reusable utilities, identify integration points
2. Create comprehensive design document leveraging existing code:
    - System overview building on current architecture
    - Component specifications that extend existing patterns
    - Data models following established conventions
    - Error handling consistent with current approach
    - Testing approach using existing utilities
3. Include Mermaid diagrams for visual representation
4. Present complete design document highlighting code reuse opportunities
5. Ask: "Does the design look good? If so, we can move on to the implementation plan."
6. **CRITICAL**: Wait for explicit approval before proceeding

**Design Sections Required**:

- Overview
- **Code Reuse Analysis** (what existing code will be leveraged)
- Architecture (building on existing patterns)
- Components and Interfaces (extending current systems)
- Data Models (following established conventions)
- Error Handling (consistent with current approach)
- Testing Strategy (using existing utilities)

### Phase 3: Task Planning (`/spec:tasks`)

**Your Role**: Break design into executable implementation tasks

**Process**:

1. Convert design into atomic, executable coding tasks prioritizing code reuse
2. Ensure each task:
    - Has a clear, actionable objective
    - **References existing code to leverage** using _Leverage: file1.ts, util2.js_ format
    - References specific requirements using _Requirements: X.Y_ format
    - Builds incrementally on previous tasks
    - Focuses on coding activities only
3. Use hierarchical numbering
4. Present complete task list emphasizing what will be reused vs. built new
5. Ask: "Do the tasks look good?"
6. **CRITICAL**: Wait for explicit approval before proceeding
7. **AFTER APPROVAL**:
    - Create Github issues according to tasks.md
    - Add issues to Github project
8. **IMPORTANT**:
    - According to task hierarchy, create issues and sub-issues in Github
    - Each issue must have proper title, description and label
    - When adding Github issues to Github project, fill in property fields like status, priority, etc.

**Task Format**:

- Use template (@tasks-template.md)

**Excluded Task Types**:

- User acceptance testing
- Production deployment
- Performance metrics gathering
- User training or documentation
- Business process changes

### Phase 4: Implementation (`/spec:execute`)

**Your Role**: Execute tasks systematically with validation

**Process**:

1. Load requirements.md, design.md, and tasks.md and Github issue for context.
2. Execute ONLY the specified task (never multiple tasks)
3. **Prioritize code reuse**: Leverage existing components, utilities, and patterns identified in task _Leverage_
   section
4. Implement following existing code patterns and conventions
5. Validate implementation against referenced requirements
6. Run tests and checks if applicable
7. **IMPORTANT**
    - Before task start:
      - change Github project task status to `IN PROGRESS`
      - create a Git branch from Github issue
    - After task completion:
      - create a Github pull request

**Implementation Rules**:

- Execute ONE task at a time
- Always stop after completing a task
- Never skip tasks or jump ahead
- Validate against requirements
- Follow existing code patterns

## Critical Workflow Rules

### Approval Workflow

- **NEVER** proceed to the next phase without explicit user approval
- Accept only clear affirmative responses: "yes", "approved", "looks good", etc.
- If user provides feedback, make revisions and ask for approval again
- Continue revision cycle until explicit approval is received

### Task Execution

- **ONLY** execute one task at a time during implementation
- **CRITICAL**: Before task start, change Github project task status to `IN PROGRESS`
- **ALWAYS** stop after completing a task
- **NEVER** automatically proceed to the next task
- **MUST** wait for user to request next task execution
- **CONFIRM** task completion status to user by creating a Github pull request

### Task Completion Protocol

When completing any task during `/spec:execute`:

1. **Confirm to user** by creating a Github pull request
2. **Stop execution**: Do not proceed to next task automatically
3. **Wait for instruction**: Let user decide next steps

### Requirement References

- **ALL** tasks must reference specific requirements using _Requirements: X.Y_ format
- **ENSURE** traceability from requirements through design to implementation
- **VALIDATE** implementations against referenced requirements

### Phase Sequence

- **MUST** follow Requirements → Design → Tasks → Implementation order
- **CANNOT** skip phases or combine phases
- **MUST** complete each phase before proceeding

## File Structure Management

The workflow automatically creates and manages:

```
.claude/
├── specs/
│   └── {feature-name}/
│       ├── requirements.md   # User stories and acceptance criteria
│       ├── design.md         # Technical architecture and design
│       └── tasks.md          # Implementation task breakdown
└── templates/
    └── *-template.md         # Document templates
```

## Error Handling

If issues arise during the workflow:

- **Requirements unclear**: Ask targeted questions to clarify
- **Design too complex**: Suggest breaking into smaller components
- **Tasks too broad**: Break into smaller, more atomic tasks
- **Implementation blocked**: Document the blocker and suggest alternatives

## Success Criteria

A successful spec workflow completion includes:

- ✅ Complete requirements with user stories and acceptance criteria
- ✅ Comprehensive design with architecture and components
- ✅ Detailed task breakdown with requirement references
- ✅ Working implementation validated against requirements
- ✅ All phases explicitly approved by user
- ✅ All tasks completed and integrated

## Getting Started

1. **Initialize**: `/spec:create <feature-name> "Description of feature"`
2. **Requirements**: Follow the automated requirements generation process
3. **Design**: Review and approve the technical design
4. **Tasks**: Review and approve the implementation plan
5. **Implementation**: Execute tasks one by one with `/spec:execute <feature-name> <github-issue-id>`
6. **Validation**: Ensure each task meets requirements before proceeding

Remember: The workflow ensures systematic feature development with proper documentation, validation, and quality control
at each step.
