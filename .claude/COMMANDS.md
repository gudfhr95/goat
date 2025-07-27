# COMMANDS.md

Command execution framework.

## Command System Architecture

### Core Command Structure

```yaml
---
command: "/{command-name}"
category: "Primary classification"
purpose: "Operational objective"
wave-enabled: true|false
performance-profile: "optimization|standard|complex"
---
```

### Command Processing Pipeline

1. **Input Parsing**: `$ARGUMENTS` with `@<path>`, `!<command>`, `--<flags>`
2. **Context Resolution**: Auto sub agents activation and MCP server selection
3. **Cross Agent Collaboration**: Multi-agent decision-making and expertise sharing
4. **Wave Eligibility**: Complexity assessment and wave mode determination
5. **Execution Strategy**: Tool orchestration and resource allocation
6. **Quality Gates**: Validation checkpoints and error handling

### Integration Layers

- **Claude Code**: Native slash command compatibility
- **Sub agent System**: Auto activate sub agents based on command context
- **MCP Servers**: Context7, Sequential, Magic, Playwright integration
- **Wave System**: Multi-stage orchestration for complex operations

## Wave System Integration

**Wave Orchestration Engine**: Multi-stage command execution with compound intelligence. Auto-activates on complexity
≥0.7 + files >20 + operation_types >2.

**Wave-Enabled Commands**:

- **Tier 1**: `/spec:execute`
- **Tier 2**: `/spec:create`, `/spec:requirements`, `/spec:design`, `/spec:tasks`

### Plan Commands

**`/spec:create $ARGUMENTS`**

```yaml
---
command: "/spec:create"
category: "Development & Planning"
purpose: "Create a new feature spec"
wave-enabled: true
performance-profile: "standard"
---
```

- **Auto Sub agent**: system-architect, technical-writer
- **MCP Integration**: Context7 (patterns), Sequential (logic)
- **Tool Orchestration**: [Read, Write, Edit, MultiEdit, Bash, Glob, TodoWrite, Task]
- **Arguments**: `<feature-name>`, `[description]`, `--<flags>`

**`/spec:requirements $ARGUMENTS`**

```yaml
---
command: "/spec:requirements"
category: "Development & Planning"
purpose: "Generate requirements document"
wave-enabled: true
performance-profile: "standard"
---
```

- **Auto Sub agent**: system-architect, technical-writer
- **MCP Integration**: Context7 (patterns), Sequential (logic)
- **Tool Orchestration**: [Read, Write, Edit, MultiEdit, Bash, Glob, TodoWrite, Task]
- **Arguments**: `<feature-name>`, `[description]`, `--<flags>`

### Development Commands

**`/spec:design $ARGUMENTS`**

```yaml
---
command: "/spec:design"
category: "Development & Planning"
purpose: "Generate design document"
wave-enabled: true
performance-profile: "standard"
---
```

- **Auto Sub agent**: frontend-engineer, mobile-engineer, backend-engineer, devops-engineer, system-architect,
  technical-writer
- **MCP Integration**: Context7 (patterns), Sequential (logic)
- **Tool Orchestration**: [Read, Write, Edit, MultiEdit, Bash, Glob, TodoWrite, Task]
- **Arguments**: `<feature-name>`, `[description]`, `--<flags>`

**`/spec:tasks $ARGUMENTS`**

```yaml
---
command: "/spec:tasks"
category: "Development & Planning"
purpose: "Generate implementation tasks"
wave-enabled: true
performance-profile: "standard"
---
```

- **Auto Sub agent**: frontend-engineer, mobile-engineer, backend-engineer, devops-engineer, system-architect,
  technical-writer
- **MCP Integration**: Context7 (patterns), Sequential (logic)
- **Tool Orchestration**: [Read, Write, Edit, MultiEdit, Bash, Glob, TodoWrite, Task]
- **Arguments**: `<feature-name>`, `[description]`, `--<flags>`

**`/spec:execute $ARGUMENTS`**

```yaml
---
command: "/spec:execute"
category: "Development"
purpose: "Execute specific task"
wave-enabled: true
performance-profile: "complex"
---
```

- **Auto Sub agent**: frontend-engineer, mobile-engineer, backend-engineer, devops-engineer, security-engineer
- **MCP Integration**: Context7 (patterns), Sequential (logic)
- **Tool Orchestration**: [Read, Write, Edit, MultiEdit, Bash, Glob, TodoWrite, Task]
- **Arguments**: `<feature-name>`, `[description]`, `--<flags>`

### Additional Commands

**`/spec:status <feature-name>`** - Show current spec status

**`/spec:list`** - List all specs

### Meta & Orchestration Commands

**Iterative Operations** - Use `--loop` flag with improvement commands for iterative refinement

## Command Execution Matrix

### Performance Profiles

```yaml
optimization: "High-performance with caching and parallel execution"
standard: "Balanced performance with moderate resource usage"
complex: "Resource-intensive with comprehensive analysis"
```

### Command Categories

- **Development**: spec:design, spec:tasks, spec:execute
- **Planning**: spec-create, spec:requirements
