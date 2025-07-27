# Technology Steering Document

## Technology Stack

### Core Architecture
- **Monorepo Structure** - Turborepo for efficient builds and dependency management
- **TypeScript** - Type safety across entire codebase
- **Package Manager** - pnpm for fast, efficient dependency management

### Frontend Technologies

#### Web Application (Next.js)
- **Framework**: Next.js 15 with App Router
- **Rendering**: Server-side rendering with streaming
- **Styling**: Tailwind CSS + shadcn/ui component library
- **State Management**: 
  - Zustand for client state
  - TanStack Query for server state
  - Local-first with IndexedDB
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion

#### Mobile Application (Expo)
- **Framework**: Expo SDK 53 with React Native
- **Navigation**: Expo Router (file-based)
- **Styling**: NativeWind (Tailwind for React Native)
- **Storage**: Expo SecureStore + AsyncStorage
- **Notifications**: Expo Notifications

#### Desktop Application
- **Framework**: Tauri (Rust-based, lightweight)
- **Shared**: Reuse Next.js web app with native APIs
- **System Integration**: Native OS notifications, global shortcuts

### Backend Technologies

#### API Layer
- **Framework**: tRPC v11 for type-safe APIs
- **Authentication**: better-auth with multiple providers
- **Real-time**: WebSockets for live updates
- **Background Jobs**: BullMQ with Redis
- **File Storage**: S3-compatible (AWS S3, MinIO for self-hosted)

#### Database
- **Primary**: PostgreSQL with Drizzle ORM
- **Caching**: Redis for sessions and temporary data
- **Search**: PostgreSQL full-text search (upgrade to Meilisearch if needed)
- **Time-series**: TimescaleDB extension for analytics

#### External Services
- **Email**: SendGrid/Resend for transactional emails
- **Calendar Sync**: CalDAV protocol support
- **AI Features**: OpenAI API with fallback to local models
- **Monitoring**: OpenTelemetry with Grafana

### Development Tools

#### Code Quality
- **Linting**: ESLint with custom rule sets
- **Formatting**: Prettier with consistent config
- **Type Checking**: TypeScript strict mode
- **Testing**: 
  - Vitest for unit tests
  - Playwright for E2E tests
  - React Native Testing Library

#### CI/CD
- **Pipeline**: GitHub Actions
- **Preview Deployments**: Vercel for web, Expo EAS for mobile
- **Release Management**: Changesets for versioning
- **Security Scanning**: Dependabot + CodeQL

### Infrastructure

#### Deployment Options
1. **Managed Cloud** (Default)
   - Vercel for Next.js web app
   - Supabase for database and auth
   - Vercel KV for Redis
   - Cloudflare R2 for file storage

2. **Self-Hosted**
   - Docker Compose for easy deployment
   - Kubernetes Helm charts for scale
   - Automatic SSL with Caddy
   - Built-in backup strategies

#### Performance Requirements
- **Page Load**: < 1s for initial load
- **API Response**: < 100ms for common operations
- **Sync Latency**: < 500ms for real-time updates
- **Mobile App Size**: < 50MB download

### Security Considerations

#### Data Protection
- **Encryption**: At-rest and in-transit
- **Authentication**: Multi-factor support
- **Authorization**: Row-level security in database
- **API Security**: Rate limiting, CORS, CSP headers

#### Privacy Features
- **Local-First**: Data stays on device by default
- **Sync Encryption**: End-to-end encryption option
- **Data Export**: Full export in standard formats
- **GDPR Compliance**: Right to deletion, data portability

### Technical Constraints

#### Browser Support
- Chrome/Edge 90+
- Firefox 90+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

#### Mobile Support
- iOS 13+
- Android 8+ (API level 26)

#### Database Limits
- Designed for up to 100k tasks per user
- 1000 concurrent users per instance
- 1TB storage per instance

### Integration Architecture

#### Plugin System
- **Frontend Plugins**: React-based UI extensions
- **Backend Plugins**: Node.js API extensions
- **Webhooks**: For external integrations
- **OAuth Providers**: Extensible auth system

#### API Design
- **REST**: For third-party integrations
- **GraphQL**: For complex queries (future)
- **WebSocket**: For real-time features
- **Rate Limiting**: Per-user and per-IP

### Future Technology Considerations

#### Potential Migrations
- **Edge Functions**: For global performance
- **WASM Modules**: For compute-heavy operations
- **Local AI**: Ollama integration for privacy
- **P2P Sync**: For team collaboration without server

#### Scaling Strategy
- **Database**: Read replicas and sharding
- **Caching**: Multi-tier with edge caching
- **CDN**: Static assets and API caching
- **Queue**: Distributed job processing