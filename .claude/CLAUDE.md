# AWAAZAI - Production Voice AI Application

## Project Overview

AwaazAI is a production-grade voice cloning application that allows users to chat with AI-generated voices of their loved ones. Users can clone voices from audio samples and have conversations with AI that responds in the cloned voice.

## Tech Stack

### Infrastructure

- **Cloud**: AWS (RDS, ElastiCache, S3, EC2/ECS)
- **Database**: PostgreSQL (AWS RDS)
- **Cache/Queue**: Redis (AWS ElastiCache)
- **Storage**: AWS S3 (audio files)
- **CI/CD**: GitHub Actions

### Backend

- **Runtime**: Node.js 20+
- **Framework**: Express.js 5.x
- **ORM**: Prisma
- **Validation**: Zod
- **Queue**: BullMQ
- **Language**: TypeScript (strict mode)

### Mobile App

- **Framework**: React Native (Expo SDK 52+)
- **Navigation**: Expo Router
- **State**: Zustand
- **API Client**: Axios + React Query

### External Services

- **Voice Cloning**: ElevenLabs API
- **Speech-to-Text**: OpenAI Whisper
- **LLM**: OpenAI GPT-4
- **Text-to-Speech**: ElevenLabs TTS

## Project Structure

```
awaazai/
├── .claude/                 # Claude AI instructions
├── .github/workflows/       # CI/CD pipelines
├── apps/
│   ├── mobile/              # React Native Expo app
│   └── server/              # Express.js backend
├── packages/
│   ├── types/               # Shared TypeScript types
│   ├── utils/               # Shared utility functions
│   ├── validators/          # Zod validation schemas
│   ├── eslint-config/       # Shared ESLint config
│   └── typescript-config/   # Shared TS config
├── scripts/                 # Deployment & utility scripts
├── docker/                  # Docker configurations
├── turbo.json               # Turborepo config
├── pnpm-workspace.yaml      # pnpm workspace config
└── package.json             # Root package.json
```

## Coding Standards

### TypeScript

- Always use strict mode
- No `any` types - use `unknown` if needed
- Always define return types for functions
- Use interfaces for objects, types for unions/primitives

### Naming Conventions

- **Files**: kebab-case (e.g., `user-service.ts`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Functions/Variables**: camelCase (e.g., `getUserById`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase with prefix (e.g., `IUser`, `TResponse`)

### API Design

- RESTful endpoints
- Versioned API (`/api/v1/...`)
- Consistent error responses
- Request validation with Zod

### Error Handling

- Use custom error classes
- Always log errors with context
- Return user-friendly error messages
- Never expose internal errors to client

### Security

- Validate all inputs
- Sanitize all outputs
- Use parameterized queries (Prisma handles this)
- JWT with short expiry + refresh tokens
- Rate limiting on all endpoints
- CORS properly configured

## Database Schema Overview

### PostgreSQL Tables

- `users` - User accounts
- `refresh_tokens` - JWT refresh tokens
- `subscriptions` - User subscription plans
- `usage_logs` - API usage tracking
- `preferences` - User preferences

### MongoDB Collections (if needed)

- `voices` - Cloned voice data
- `chats` - Chat conversations
- `messages` - Chat messages
- `voice_profiles` - Voice personality settings

## Environment Variables

### Required

```
# Server
NODE_ENV=development|staging|production
PORT=3000

# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://...

# AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=

# Auth
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI Services
OPENAI_API_KEY=
ELEVENLABS_API_KEY=
```

## Commands

### Development

```bash
pnpm install          # Install dependencies
pnpm dev              # Start all apps in dev mode
pnpm dev:server       # Start only server
pnpm dev:mobile       # Start only mobile app
```

### Build & Test

```bash
pnpm build            # Build all apps
pnpm test             # Run all tests
pnpm lint             # Lint all code
pnpm typecheck        # TypeScript check
```

### Database

```bash
pnpm db:generate      # Generate Prisma client
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema changes
pnpm db:studio        # Open Prisma Studio
```

### Deployment

```bash
pnpm deploy:staging   # Deploy to staging
pnpm deploy:prod      # Deploy to production
```

## Git Workflow

- `main` - Production branch
- `staging` - Staging/QA branch
- `develop` - Development branch
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-description`
- Hotfixes: `hotfix/issue-description`

## Commit Message Format

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Example: feat(auth): add Google OAuth login
```

## Important Notes

1. Never commit secrets or .env files
2. Always write tests for new features
3. Update CLAUDE.md when architecture changes
4. Follow the error handling patterns
5. Use the shared packages for common code
