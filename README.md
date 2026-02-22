# AwaazAI

Production-grade voice AI application that allows users to chat with AI-generated voices of their loved ones.

## Tech Stack

| Layer             | Technology              |
| ----------------- | ----------------------- |
| **Mobile App**    | React Native (Expo)     |
| **Backend**       | Node.js + Express.js    |
| **Database**      | PostgreSQL (AWS RDS)    |
| **Cache/Queue**   | Redis (AWS ElastiCache) |
| **Storage**       | AWS S3                  |
| **Voice Cloning** | ElevenLabs API          |
| **AI/LLM**        | OpenAI (GPT-4, Whisper) |
| **CI/CD**         | GitHub Actions          |

## Project Structure

```
awaazai/
├── apps/
│   ├── mobile/              # React Native Expo app
│   └── server/              # Express.js backend
├── packages/
│   ├── types/               # Shared TypeScript types
│   ├── utils/               # Shared utility functions
│   ├── validators/          # Zod validation schemas
│   ├── eslint-config/       # Shared ESLint configuration
│   └── typescript-config/   # Shared TypeScript configuration
├── scripts/                 # Deployment & utility scripts
├── docker/                  # Docker configurations
└── .github/workflows/       # CI/CD pipelines
```

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Docker & Docker Compose
- AWS CLI configured
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/awaazai.git
cd awaazai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment variables

```bash
cp .env.example .env
# Edit .env with your values
```

### 4. Start development

```bash
# Start all apps
npm run dev

# Or start specific app
npm run dev:server
npm run dev:mobile
```

---

## NPM Scripts Reference

### Development Scripts

| Script       | Command              | Description                        |
| ------------ | -------------------- | ---------------------------------- |
| `dev`        | `npm run dev`        | Start all apps in development mode |
| `dev:server` | `npm run dev:server` | Start only the backend server      |
| `dev:mobile` | `npm run dev:mobile` | Start only the mobile app (Expo)   |

### Build Scripts

| Script         | Command                | Description                   |
| -------------- | ---------------------- | ----------------------------- |
| `build`        | `npm run build`        | Build all apps for production |
| `build:server` | `npm run build:server` | Build only the backend server |

### Code Quality Scripts

| Script         | Command                | Description                    |
| -------------- | ---------------------- | ------------------------------ |
| `lint`         | `npm run lint`         | Run ESLint on all packages     |
| `lint:fix`     | `npm run lint:fix`     | Run ESLint and auto-fix issues |
| `format`       | `npm run format`       | Format code with Prettier      |
| `format:check` | `npm run format:check` | Check code formatting          |
| `typecheck`    | `npm run typecheck`    | Run TypeScript type checking   |

### Testing Scripts

| Script          | Command                 | Description                    |
| --------------- | ----------------------- | ------------------------------ |
| `test`          | `npm run test`          | Run all tests                  |
| `test:coverage` | `npm run test:coverage` | Run tests with coverage report |

### Database Scripts

| Script        | Command               | Description                     |
| ------------- | --------------------- | ------------------------------- |
| `db:generate` | `npm run db:generate` | Generate Prisma client          |
| `db:migrate`  | `npm run db:migrate`  | Run database migrations         |
| `db:push`     | `npm run db:push`     | Push schema changes to database |
| `db:studio`   | `npm run db:studio`   | Open Prisma Studio GUI          |
| `db:seed`     | `npm run db:seed`     | Seed database with initial data |

### Utility Scripts

| Script    | Command           | Description                                |
| --------- | ----------------- | ------------------------------------------ |
| `clean`   | `npm run clean`   | Clean all build outputs and node_modules   |
| `prepare` | `npm run prepare` | Setup Husky git hooks (runs automatically) |

---

## Environment Variables

### Server Environment Variables

```env
# App
NODE_ENV=development
PORT=3000

# Database (PostgreSQL - AWS RDS)
DATABASE_URL=postgresql://user:password@host:5432/awaazai

# Redis (AWS ElastiCache)
REDIS_URL=redis://host:6379

# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=awaazai-media

# Authentication
JWT_ACCESS_SECRET=your_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_min_32_chars
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# AI Services
OPENAI_API_KEY=sk-your_openai_key
ELEVENLABS_API_KEY=your_elevenlabs_key

# Logging
LOG_LEVEL=debug
```

### Mobile Environment Variables

```env
# API
API_URL=http://localhost:3000/api/v1

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Docker Commands

### Development

```bash
# Start all services (PostgreSQL, Redis)
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Reset database
docker-compose down -v && docker-compose up -d
```

### Production

```bash
# Build production image
docker build -t awaazai-server -f docker/Dockerfile.server .

# Run production container
docker run -p 3000:3000 --env-file .env awaazai-server
```

---

## Deployment

### Deploy to Staging

```bash
npm run deploy:staging
# or
./scripts/deploy-staging.sh
```

### Deploy to Production

```bash
npm run deploy:prod
# or
./scripts/deploy-prod.sh
```

---

## Git Workflow

### Branch Naming

| Type    | Pattern                | Example                 |
| ------- | ---------------------- | ----------------------- |
| Feature | `feature/feature-name` | `feature/voice-cloning` |
| Bug Fix | `fix/bug-description`  | `fix/auth-token-expiry` |
| Hotfix  | `hotfix/issue`         | `hotfix/critical-crash` |
| Release | `release/version`      | `release/1.0.0`         |

### Commit Message Format

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore

Examples:
- feat(auth): add Google OAuth login
- fix(voice): handle empty audio file
- docs(readme): update installation steps
- refactor(api): restructure error handling
```

---

## API Documentation

Base URL: `http://localhost:3000/api/v1`

### Authentication Endpoints

| Method | Endpoint        | Description              |
| ------ | --------------- | ------------------------ |
| POST   | `/auth/login`   | Google OAuth login       |
| POST   | `/auth/logout`  | Logout user              |
| POST   | `/auth/refresh` | Refresh access token     |
| GET    | `/auth/profile` | Get current user profile |

### Voice Endpoints

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| POST   | `/voices/upload` | Upload voice samples     |
| POST   | `/voices/clone`  | Clone voice from samples |
| GET    | `/voices`        | Get all user voices      |
| GET    | `/voices/:id`    | Get voice by ID          |
| PUT    | `/voices/:id`    | Update voice details     |
| DELETE | `/voices/:id`    | Delete voice             |

### Chat Endpoints

| Method | Endpoint     | Description        |
| ------ | ------------ | ------------------ |
| POST   | `/chats`     | Create new chat    |
| GET    | `/chats`     | Get all user chats |
| GET    | `/chats/:id` | Get chat by ID     |
| DELETE | `/chats/:id` | Delete chat        |

### Message Endpoints

| Method | Endpoint            | Description        |
| ------ | ------------------- | ------------------ |
| POST   | `/messages/send`    | Send audio message |
| GET    | `/messages/:chatId` | Get chat messages  |

---

## Troubleshooting

### Common Issues

**1. npm install fails**

```bash
rm -rf node_modules package-lock.json
npm install
```

**2. Database connection error**

```bash
# Check if Docker is running
docker-compose ps

# Restart database
docker-compose restart postgres
```

**3. Prisma client not found**

```bash
npm run db:generate
```

**4. Port already in use**

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## License

This project is proprietary and confidential.

---

## Support

For support, contact: support@awaazai.com
