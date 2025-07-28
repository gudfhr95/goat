# CLAUDE.md

`@.claude/PRINCIPLES.md`
`@.claude/RULES.md`
`@.claude/COMMANDS.md`
`@.claude/FLAGS.md`

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a T3 Turbo monorepo - a full-stack TypeScript application using Turborepo with Next.js and Expo (React Native). The project follows a monorepo architecture with shared packages for code reuse between web and mobile applications.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Expo SDK 53, React Native
- **API**: tRPC v11 with type-safe client-server communication
- **Authentication**: better-auth with OAuth support
- **Database**: Drizzle ORM with Supabase (PostgreSQL)
- **Styling**: Tailwind CSS (web) and NativeWind (mobile)
- **Package Manager**: pnpm with workspaces
- **Build System**: Turborepo for efficient builds and caching

## Common Development Commands

### Core Commands

```bash
# Install dependencies
pnpm i

# Development (runs all apps)
pnpm dev

# Development (Next.js only)
pnpm dev:next

# Build all packages
pnpm build

# Type checking
pnpm typecheck

# Linting
pnpm lint
pnpm lint:fix

# Formatting
pnpm format
pnpm format:fix
```

### Database Commands

```bash
# Push schema changes to database
pnpm db:push

# Open Drizzle Studio for database management
pnpm db:studio

# Generate auth types
pnpm auth:generate
```

### UI Development

```bash
# Add new shadcn/ui components
pnpm ui-add
```

### Testing

When implementing tests, check the specific app's package.json for test scripts. The project structure suggests test files should follow `*.test.*` or `*.spec.*` naming conventions.

## High-Level Architecture

### Monorepo Structure

The codebase follows a clear separation of concerns:

1. **Apps** (`/apps`)
   - `nextjs/`: Web application with App Router, handles OAuth callbacks and serves the tRPC API
   - `expo/`: Mobile application using Expo Router for navigation

2. **Packages** (`/packages`)
   - `@goat/api`: tRPC router definitions and API logic
   - `@goat/auth`: Authentication layer using better-auth
   - `@goat/db`: Database schema and client configuration (Drizzle + Supabase)
   - `@goat/ui`: Shared UI components (shadcn/ui based)
   - `@goat/validators`: Shared validation schemas

3. **Tooling** (`/tooling`)
   - Shared configurations for ESLint, Prettier, TypeScript, and Tailwind

### API Architecture (tRPC)

The API uses tRPC for type-safe communication:

- Context creation in `packages/api/src/trpc.ts` provides auth session and database access
- Routers are defined in `packages/api/src/router/`
- Two procedure types: `publicProcedure` and `protectedProcedure` (requires authentication)
- Includes timing middleware for development performance monitoring

### Authentication Flow

- Uses better-auth with OAuth proxy plugin for handling authentication in preview deployments
- Session management through secure cookies
- Discord OAuth is pre-configured
- Auth proxy handles OAuth flow for Expo app compatibility

### Database Layer

- Uses Drizzle ORM with snake_case naming convention
- Edge-ready with Vercel Postgres driver
- Schema defined in `packages/db/src/schema.ts`
- Auth schema separated in `packages/db/src/auth-schema.ts`

### Key Architectural Patterns

1. **Type Safety**: End-to-end type safety from database to frontend using tRPC
2. **Code Sharing**: Shared packages allow code reuse between web and mobile
3. **Edge Compatibility**: Database and API configured for edge runtime
4. **Monorepo Efficiency**: Turborepo handles build orchestration and caching

## Environment Setup

Required environment variables (see `.env.example`):

- `POSTGRES_URL`: Supabase database connection string
- `AUTH_SECRET`: Authentication secret key
- `AUTH_DISCORD_ID` & `AUTH_DISCORD_SECRET`: OAuth credentials

## Important Considerations

- The project uses React 19 and Next.js 15 (latest versions)
- Expo SDK 53 is experimental for React 19 support
- All packages use the `@goat` namespace - consider renaming for your project
- Database is configured for edge runtime - remove `export const runtime = "edge"` for non-edge deployments
- Better-auth OAuth proxy is recommended for development and preview deployments
