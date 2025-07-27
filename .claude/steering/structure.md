# Structure Steering Document

## Project Organization

### Monorepo Structure

```
goat/
├── apps/                      # Applications
│   ├── web/                  # Next.js web application
│   ├── mobile/               # Expo mobile application  
│   ├── desktop/              # Tauri desktop application
│   └── browser-extension/    # Chrome/Firefox extension
│
├── packages/                  # Shared packages
│   ├── api/                  # tRPC API definitions
│   ├── auth/                 # Authentication logic
│   ├── db/                   # Database schema and client
│   ├── ui/                   # Shared UI components
│   ├── core/                 # Core business logic
│   ├── integrations/         # External service integrations
│   └── validators/           # Shared validation schemas
│
├── services/                  # Microservices
│   ├── sync-engine/          # Real-time sync service
│   ├── scheduler/            # Background job processor
│   └── ai-assistant/         # AI features service
│
├── tooling/                   # Development tools
│   ├── eslint/               # ESLint configurations
│   ├── prettier/             # Prettier configuration
│   ├── tailwind/             # Tailwind configurations
│   └── typescript/           # TypeScript configurations
│
├── plugins/                   # Plugin ecosystem
│   ├── official/             # Official plugins
│   └── community/            # Community plugins
│
└── docs/                      # Documentation
    ├── api/                  # API documentation
    ├── guides/               # User guides
    └── contributing/         # Contribution guidelines
```

### Naming Conventions

#### Files and Directories
- **Components**: PascalCase (e.g., `TaskCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Hooks**: camelCase with `use` prefix (e.g., `useTaskSync.ts`)
- **Types**: PascalCase with `.types.ts` suffix
- **Tests**: Same name with `.test.ts` or `.spec.ts` suffix
- **Stories**: Same name with `.stories.tsx` suffix

#### Code Conventions
```typescript
// Feature-based exports
export { TaskList } from './task-list';
export { useTaskSync } from './use-task-sync';
export type { Task, TaskStatus } from './task.types';

// Consistent import ordering
import { useEffect, useState } from 'react';        // 1. React
import { useRouter } from 'next/navigation';        // 2. Framework
import { Button } from '@goat/ui';                  // 3. Internal packages
import { formatDate } from '~/utils/format-date';   // 4. Relative imports
import type { Task } from './task.types';           // 5. Type imports
```

### Feature Organization

Each feature should be self-contained:

```
packages/core/src/features/tasks/
├── index.ts                   # Public exports
├── task.types.ts             # Type definitions
├── task.schema.ts            # Validation schemas
├── task.service.ts           # Business logic
├── task.repository.ts        # Data access
├── use-tasks.ts              # React hooks
├── task-list.tsx             # UI components
├── task-list.test.tsx        # Tests
└── __fixtures__/             # Test fixtures
```

### Component Structure

```typescript
// Standard component template
import { type FC } from 'react';
import { cn } from '@goat/ui/utils';

interface TaskCardProps {
  task: Task;
  className?: string;
  onComplete?: (id: string) => void;
}

export const TaskCard: FC<TaskCardProps> = ({ 
  task, 
  className,
  onComplete 
}) => {
  // 1. Hooks
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Computed values
  const isOverdue = task.dueDate < new Date();
  
  // 3. Event handlers
  const handleComplete = async () => {
    setIsLoading(true);
    await onComplete?.(task.id);
    setIsLoading(false);
  };
  
  // 4. Render
  return (
    <div className={cn('task-card', className)}>
      {/* Component JSX */}
    </div>
  );
};
```

### API Route Structure

```typescript
// tRPC router pattern
import { createTRPCRouter, protectedProcedure } from '@goat/api';
import { taskSchema } from '@goat/validators';

export const taskRouter = createTRPCRouter({
  list: protectedProcedure
    .input(listTasksSchema)
    .query(async ({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: { userId: ctx.session.user.id },
        ...input,
      });
    }),
    
  create: protectedProcedure
    .input(taskSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: { ...input, userId: ctx.session.user.id },
      });
    }),
});
```

### Database Patterns

```typescript
// Schema definition with Drizzle
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', { 
    enum: ['pending', 'in_progress', 'completed'] 
  }).default('pending'),
  userId: uuid('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

### Testing Strategy

#### Unit Tests
```typescript
// Component testing
import { render, screen } from '@testing-library/react';
import { TaskCard } from './task-card';

describe('TaskCard', () => {
  it('renders task title', () => {
    const task = createMockTask({ title: 'Test Task' });
    render(<TaskCard task={task} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

#### Integration Tests
```typescript
// API testing
import { createCaller } from '@goat/api';

describe('taskRouter', () => {
  it('creates a task', async () => {
    const caller = createCaller({ user: mockUser });
    const task = await caller.task.create({
      title: 'New Task',
    });
    expect(task.title).toBe('New Task');
  });
});
```

### Code Quality Rules

1. **No Magic Numbers**: Use constants or enums
2. **Early Returns**: Reduce nesting with guard clauses
3. **Pure Functions**: Prefer pure functions when possible
4. **Error Boundaries**: Wrap features in error boundaries
5. **Loading States**: Always handle loading states
6. **Empty States**: Design for empty data scenarios
7. **Accessibility**: ARIA labels and keyboard navigation

### Git Workflow

#### Branch Naming
- `feat/task-recurring-support`
- `fix/calendar-sync-issue`
- `refactor/auth-flow`
- `docs/api-integration-guide`

#### Commit Messages
```
feat(tasks): add recurring task support

- Add recurrence rule schema
- Implement recurrence calculator
- Update UI with recurrence options

Closes #123
```

### Documentation Standards

#### Code Comments
```typescript
/**
 * Calculates the next occurrence of a recurring task
 * @param task - The task with recurrence rules
 * @param after - Calculate next occurrence after this date
 * @returns Next occurrence date or null if no more occurrences
 */
export function getNextOccurrence(
  task: TaskWithRecurrence,
  after: Date = new Date()
): Date | null {
  // Implementation
}
```

#### README Structure
Each package should have:
1. Overview
2. Installation
3. Usage examples
4. API reference
5. Contributing guidelines