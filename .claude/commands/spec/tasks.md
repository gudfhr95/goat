# Spec Tasks Command

Generate implementation task list based on approved PRD(Product Requirements Document).

## Usage

```
/spec:tasks <feature-name> [description]
```

## Phase Overview

**Your Role**: Break design into executable implementation tasks

This is Phase 2 of the spec workflow. Your goal is to create a detailed task breakdown that will guide the implementation of the feature.

## Instructions

You are working on the tasks phase of the spec workflow.

1. **Prerequisites**
   - Ensure prd.md exists and is approved
   - Load prd.md for context
   - **Load steering documents**:
     - Check for .claude/steering/structure.md for project conventions
     - Check for .claude/steering/tech.md for technical patterns
   - Understand the complete feature scope

2. **Process**
   1. Use task-master to create tasks based on prd.md
      - **CRITICAL**: Do not initialize new task master project
      - Break down the PRD into atomic, executable tasks
      - Break down and expand complex tasks into smaller, manageable subtasks
      - Analyze complexity of each task
   2. Ensure each task:
      - Is atomic and executable
      - Has a clear, actionable objective
      - References specific requirements
      - Builds incrementally on previous tasks
   3. Reference existing code and components to leverage reuse
   4. Present complete task list
   5. Ask: "Do the tasks look good?"
   6. **CRITICAL**: Wait for explicit approval before proceeding

3. **Generate Task List** (prioritize code reuse and follow conventions)
   - Break PRD into atomic, executable coding tasks
   - **Follow structure.md**: Ensure tasks respect project file organization
   - **Prioritize extending/adapting existing code** over building from scratch
   - Each task should reference specific requirements AND existing code to leverage

4. **Task Guidelines**
   - Tasks should be concrete and actionable
   - **Reference existing code to reuse**: Include specific files/components to extend or adapt
   - Include specific file names and components
   - Build incrementally (each task builds on previous)
   - Reference requirements
   - Use test-driven development approach leveraging existing test patterns

5. **Approval Process**
   - Present the complete task list
   - Ask: "Do the tasks look good?"
   - Make revisions based on feedback
   - Continue until explicit approval
   - **CRITICAL**: Do not proceed without explicit approval

## Critical Rules

- **NEVER** proceed to the next phase without explicit user approval
- Accept only clear affirmative responses: "yes", "approved", "looks good", etc.
- If user provides feedback, make revisions and ask for approval again
- Continue revision cycle until explicit approval is received

## Next Phase

After approval, then you can:

- Use `/spec:execute` to implement tasks
- Check progress with `task-master list`
