# Spec Execute Command

Execute specific tasks from the task list.

## Usage

```
/spec:execute <feature-name> [task-id] [description]
```

## Phase Overview

**Your Role**: Execute tasks systematically with validation

This is Phase 3 of the spec workflow. Your goal is to implement individual tasks from the approved task-master task list, one at a time.

## Instructions

You are executing implementation tasks from the spec workflow.

1. **Prerequisites**
   - Ensure task-master tag `<feature-name>` exists
   - Ensure use of the tag `<feature-name>` to track tasks related to this feature
   - Load the spec documents from `.claude/specs/{feature-name}/prd.md` for context
   - **Load all steering documents** (if available):
     - Load .claude/steering/product.md for product context
     - Load .claude/steering/tech.md for technical patterns
     - Load .claude/steering/structure.md for project conventions
   - Identify the specific task to execute
   - **CRITICAL**: Set task-master task status to `IN PROGRESS` before starting
   - **CRITICAL**: Create a Git branch named `<feature-name>/task-<task-id>` for the task

2. **Process**
   1. Load PRD from `.claude/specs/{feature-name}/prd.md`:
   2. Load task detail from task-master
   3. Execute ONLY the specified task (never multiple tasks)
   4. Implement following existing code patterns and conventions
   5. Validate implementation against referenced requirements
   6. Run tests and checks if applicable
   7. **CRITICAL**: Mark task as complete by changing status to `DONE` in task-master
   8. **CRITICAL**: Create a pull request for the task branch
   9. Confirm task completion status to user
   10. **CRITICAL**: Stop and wait for user review before proceeding

3. **Task Execution**
   - Focus on ONE task at a time
   - If task has sub-tasks, start with those
   - Follow the implementation details from PRD
   - Verify against requirements specified in the task

4. **Implementation Guidelines**
   - Write clean, maintainable code
   - **Follow steering documents**: Adhere to patterns in tech.md and conventions in structure.md
   - Follow existing code patterns and conventions
   - Include appropriate error handling
   - Add unit tests where specified
   - Document complex logic

5. **Validation**
   - Verify implementation meets acceptance criteria
   - Run tests if they exist
   - Check for lint/type errors
   - Ensure integration with existing code

6. **Task Completion Protocol**
   When completing any task during `/spec:execute`:
   1. **Update task status**: Change task status from `IN PROGRESS` to `DONE` in task-master
   2. **Create pull request**:
      - Commit and push changes to the branch `<feature-name>/task-<task-id>`
      - Create a pull request for review
   3. **Confirm to user**: State clearly "Task X has been marked as done"
   4. **Stop execution**: Do not proceed to next task automatically
   5. **Wait for instruction**: Let user decide next steps

## Critical Workflow Rules

### Task Execution

- **ONLY** execute one task at a time during implementation
- **CRITICAL**: Mark completed tasks as `DONE` in task-master before stopping
- **CRITICAL**: Create a pull request for the task branch after marking as `DONE`
- **ALWAYS** stop after completing a task
- **NEVER** automatically proceed to the next task
- **MUST** wait for user to request next task execution
- **CONFIRM** task completion status to user

### Requirement References

- **ALL** tasks must reference specific requirements
- **ENSURE** traceability from requirements through design to implementation
- **VALIDATE** implementations against referenced requirements

## Task Selection

If no task-id specified:

- Look at task-master task list for the tag `<feature-name>`
- Recommend the next pending task
- Ask user to confirm before proceeding

If no feature-name specified:

- Check `.claude/specs/` directory for available specs
- If only one spec exists, use it
- If multiple specs exist, ask user which one to use
- Display error if no specs are found

## Examples

```
/spec:execute user-authentication 1
/spec:execute user-authentication 2.1
```

## Important Rules

- Only execute ONE task at a time
- **ALWAYS** mark completed tasks as `DONE` in task-master
- **CRITICAL**: Create a pull request for the task branch after marking as `DONE`
- Always stop after completing a task
- Wait for user approval before continuing
- Never skip tasks or jump ahead
- Confirm task completion status to user

## Next Steps

After task completion, you can:

- Review the implementation
- Run tests if applicable
- Execute the next task using `/spec:execute <feature-name> [task-id]`
- Check overall progress with `task-master list`
