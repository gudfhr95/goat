# FLAGS.md

Flag system with auto-activation and conflict resolution.

## Flag System Architecture

**Priority Order**:

1. Explicit user flags override auto-detection
2. Safety flags override optimization flags
3. Performance flags activate under resource pressure
4. Persona flags based on task patterns
5. MCP server flags with context-sensitive activation

## Planning & Analysis Flags

**`--plan`**

- Display execution plan before operations
- Shows tools, outputs, and step sequence

**`--think`**

- Multi-file analysis (~4K tokens)
- Enables Sequential MCP for structured problem-solving
- Auto-activates: Import chains >5 files, cross-module calls >10 references
- Auto-enables `--seq`

**`--think-hard`**

- Deep architectural analysis (~10K tokens)
- System-wide analysis with cross-module dependencies
- Auto-activates: System refactoring, bottlenecks >3 modules, security vulnerabilities
- Auto-enables `--seq --c7`

**`--ultrathink`**

- Critical system redesign analysis (~32K tokens)
- Maximum depth analysis for complex problems
- Auto-activates: Legacy modernization, critical vulnerabilities, performance degradation >50%
- Auto-enables `--all-mcp` for comprehensive analysis

## Compression & Efficiency Flags

**`--uc` / `--ultracompressed`**

- 30-50% token reduction using symbols and structured output
- Auto-activates: Context usage >75% or large-scale operations
- Auto-generated symbol legend, maintains technical accuracy

**`--answer-only`**

- Direct response without task creation or workflow automation
- Explicit use only, no auto-activation

**`--validate`**

- Pre-operation validation and risk assessment
- Auto-activates: Risk score >0.7 or resource usage >75%
- Risk algorithm: complexity*0.3 + vulnerabilities*0.25 + resources*0.2 + failure_prob*0.15 + time\*0.1

**`--safe-mode`**

- Maximum validation with conservative execution
- Auto-activates: Resource usage >85% or production environment
- Enables validation checks, forces --uc mode, blocks risky operations

**`--verbose`**

- Maximum detail and explanation
- High token usage for comprehensive output

## MCP Server Control Flags

**`--c7` / `--context7`**

- Enable Context7 for library documentation lookup
- Auto-activates: External library imports, framework questions
- Detection: import/require/from/use statements, framework keywords
- Workflow: resolve-library-id → get-library-docs → implement

**`--seq` / `--sequential`**

- Enable Sequential for complex multi-step analysis
- Auto-activates: Complex debugging, system design
- Detection: debug/trace/analyze keywords, nested conditionals, async chains

**`--tm` / `--task-master`**

- Enable Task Master AI for task management and workflow automation
- Auto-activates: Task creation, workflow automation, project management
- Detection: task management keywords, workflow patterns, project planning

**`--play` / `--playwright`**

- Enable Playwright for cross-browser automation and E2E testing
- Detection: test/e2e keywords, performance monitoring, visual testing, cross-browser requirements

**`--sb` / `--supabase`**

- Enable Supabase for backend system architecture design, API design, database schema and code implementation
- Auto-activates: System design, database schema, API design, backend architecture
- Detection: architecture/system design/backend/API/database keywords, backend related

**`--all-mcp`**

- Enable all MCP servers simultaneously
- Auto-activates: Problem complexity >0.8, multi-domain indicators
- Higher token usage, use judiciously

**`--no-mcp`**

- Disable all MCP servers, use native tools only
- 40-60% faster execution, WebSearch fallback

## Sub-Agent Delegation Flags

**`--delegate [files|folders|auto]`**

- Enable Task tool sub-agent delegation for parallel processing
- **files**: Delegate individual file analysis to sub-agents
- **folders**: Delegate directory-level analysis to sub-agents
- **auto**: Auto-detect delegation strategy based on scope and complexity
- Auto-activates: >7 directories or >50 files
- 40-70% time savings for suitable operations

**`--concurrency [n]`**

- Control max concurrent sub-agents and tasks (default: 7, range: 1-15)
- Dynamic allocation based on resources and complexity
- Prevents resource exhaustion in complex scenarios

## Scope & Focus Flags

**`--scope [level]`**

- file: Single file analysis
- module: Module/directory level
- project: Entire project scope
- system: System-wide analysis

**`--focus [domain]`**

- performance: Performance optimization
- security: Security analysis and hardening
- quality: Code quality and maintainability
- architecture: System design and structure
- accessibility: UI/UX accessibility compliance
- testing: Test coverage and quality

## Iterative Improvement Flags

**`--loop`**

- Enable iterative improvement mode for commands
- Auto-activates: Quality improvement requests, refinement operations, polish tasks
- Default: 3 iterations with automatic validation

**`--iterations [n]`**

- Control number of improvement cycles (default: 3, range: 1-10)
- Overrides intelligent default based on operation complexity

**`--interactive`**

- Enable user confirmation between iterations
- Pauses for review and approval before each cycle
- Allows manual guidance and course correction

## Introspection & Transparency Flags

**`--introspect` / `--introspection`**

- Deep transparency mode exposing thinking process
- Auto-activates: Complex debugging
- Transparency markers: 🤔 Thinking, 🎯 Decision, ⚡ Action, 📊 Check, 💡 Learning
- Conversational reflection with shared uncertainties

## Flag Integration Patterns

### MCP Server Auto-Activation

**Auto-Activation Logic**:

- **Context7**: External library imports, framework questions, documentation requests
- **Sequential**: Complex debugging, system design, any --think flags
- **Supabase**: Backend architecture, API design, database schema, system design
- **Playwright**: Testing workflows, performance monitoring, QA persona

### Flag Precedence

1. Safety flags (--safe-mode) > optimization flags
2. Explicit flags > auto-activation
3. Thinking depth: --ultrathink > --think-hard > --think
4. --no-mcp overrides all individual MCP flags
5. Scope: system > project > module > file
6. Last specified persona takes precedence
7. Sub-Agent delegation: explicit --delegate > auto-detection
8. Loop mode: explicit --loop > auto-detection based on refinement keywords
9. --uc auto-activation overrides verbose flags

### Context-Based Auto-Activation

**Loop Auto-Activation**: polish, refine, enhance, improve keywords detected
