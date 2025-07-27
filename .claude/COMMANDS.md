# COMMANDS.md

Command execution framework.

## Command System Architecture

### Core Command Structure

```yaml
---
command: "/{command-name}"
category: "Primary classification"
purpose: "Operational objective"
performance-profile: "optimization|standard|complex"
---
```

### Command Processing Pipeline

1. **Input Parsing**: `$ARGUMENTS` with `@<path>`, `!<command>`, `--<flags>`
2. **Context Resolution**: Auto sub agent activation and MCP server selection
3. **Execution Strategy**: Tool orchestration and resource allocation
4. **Quality Gates**: Validation checkpoints and error handling

### Integration Layers

- **Claude Code**: Native slash command compatibility
- **Sub Agent System**: Auto activate sub agents based on command context
- **MCP Servers**: Context7, Sequential-Thinking, Supabase, Playwright integration

### Performance Profiles

```yaml
optimization: "High-performance with caching and parallel execution"
standard: "Balanced performance with moderate resource usage"
complex: "Resource-intensive with comprehensive analysis"
```

## Plan Commands

**`/spec:create $ARGUMENTS`**

```yaml
---
command: "/spec:create"
category: "Development & Planning"
purpose: "Create a new feature spec"
performance-profile: "standard"
---
```

- **Auto Sub Agent**: system-architect, technical-writer
- **MCP Integration**: Context7, Sequential-Thinking
- **Tool Orchestration**: [Read, Write, Edit, MultiEdit, Bash, Glob, TodoWrite, Task]
- **Arguments**: `<feature-name>`, `--<flags>`, `[description]`

**`/spec:requirements $ARGUMENTS`**

```yaml
---
command: "/spec:requirements"
category: "Development & Planning"
purpose: "Generate requirements document"
performance-profile: "standard"
---
```

- **Auto Sub Agent**: system-architect, technical-writer
- **MCP Integration**: Context7, Sequential-Thinking
- **Tool Orchestration**: [Read, Write, Edit, MultiEdit, Bash, Glob, TodoWrite, Task]
- **Arguments**: `<feature-name>`, `--<flags>`, `[description]`

## Development Commands

**`/spec:design $ARGUMENTS`**

```yaml
---
command: "/spec:design"
category: "Development & Planning"
purpose: "Generate design document"
performance-profile: "standard"
---
```

- **Auto Sub Agent**: frontend-engineer, mobile-engineer, backend-engineer, devops-engineer, system-architect,
  technical-writer
- **MCP Integration**: Context7, Sequential-Thinking, Supabase
- **Tool Orchestration**: [Read, Write, Edit, MultiEdit, Bash, Glob, TodoWrite, Task]
- **Arguments**: `<feature-name>`, `--<flags>`, `[description]`

**`/spec:tasks $ARGUMENTS`**

```yaml
---
command: "/spec:tasks"
category: "Development & Planning"
purpose: "Generate implementation tasks"
performance-profile: "standard"
---
```

- **Auto Sub Agent**: frontend-engineer, mobile-engineer, backend-engineer, devops-engineer, system-architect,
  technical-writer
- **MCP Integration**: Context7, Sequential-Thinking, Supabase
- **Tool Orchestration**: [Read, Write, Edit, MultiEdit, Bash, Glob, TodoWrite, Task]
- **Arguments**: `<feature-name>`, `--<flags>`, `[description]`

**`/spec:execute $ARGUMENTS`**

```yaml
---
command: "/spec:execute"
category: "Development"
purpose: "Execute specific task"
performance-profile: "complex"
---
```

- **Auto Sub Agent**: frontend-engineer, mobile-engineer, backend-engineer, devops-engineer, security-engineer
- **MCP Integration**: Context7, Sequential-Thinking, Supabase, Playwright
- **Tool Orchestration**: [Read, Write, Edit, MultiEdit, Bash, Glob, TodoWrite, Task]
- **Arguments**: `<feature-name>`, `[description]`, `--<flags>`

## Additional Commands

**`/spec:status <feature-name>`** - Show current spec status

**`/spec:list`** - List all specs
