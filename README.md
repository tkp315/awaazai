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




# project structure 

```
awaazai
├─ .claude
│  ├─ CLAUDE.md
│  └─ settings.local.json
├─ .husky
│  ├─ commit-msg
│  ├─ pre-commit
│  └─ _
│     ├─ applypatch-msg
│     ├─ commit-msg
│     ├─ h
│     ├─ husky.sh
│     ├─ post-applypatch
│     ├─ post-checkout
│     ├─ post-commit
│     ├─ post-merge
│     ├─ post-rewrite
│     ├─ pre-applypatch
│     ├─ pre-auto-gc
│     ├─ pre-commit
│     ├─ pre-merge-commit
│     ├─ pre-push
│     ├─ pre-rebase
│     └─ prepare-commit-msg
├─ .npmrc
├─ .prettierignore
├─ .prettierrc
├─ app.json.G0_D_uYSe3TA4gn0HcBvM_Gua2CaEggy0TNEmh2qHxE
├─ apps
│  ├─ client
│  │  ├─ .claude
│  │  │  └─ settings.local.json
│  │  ├─ .expo
│  │  │  ├─ devices.json
│  │  │  ├─ README.md
│  │  │  ├─ types
│  │  │  │  └─ router.d.ts
│  │  │  └─ web
│  │  │     └─ cache
│  │  │        └─ production
│  │  │           └─ images
│  │  │              ├─ android-adaptive-background
│  │  │              │  └─ android-adaptive-background-fb139c2dee362ebf2070e23b96da6fc0d43f8492de38b8af1fd7223e19b5861d-cover-transparent
│  │  │              │     ├─ icon_108.png
│  │  │              │     ├─ icon_162.png
│  │  │              │     ├─ icon_216.png
│  │  │              │     ├─ icon_324.png
│  │  │              │     └─ icon_432.png
│  │  │              ├─ android-adaptive-foreground
│  │  │              │  └─ android-adaptive-foreground-9e3d0315a33c6799de601dd34cd8bf8cc3a8d16f3bf75592baec2ceb7240b391-cover-transparent
│  │  │              │     ├─ icon_108.png
│  │  │              │     ├─ icon_162.png
│  │  │              │     ├─ icon_216.png
│  │  │              │     ├─ icon_324.png
│  │  │              │     └─ icon_432.png
│  │  │              ├─ android-adaptive-monochrome
│  │  │              │  └─ android-adaptive-monochrome-6371fc2c12e33ad2215a86c281db3d682a81bebe7c957a842c13b8bf00cceb83-cover-transparent
│  │  │              │     ├─ icon_108.png
│  │  │              │     ├─ icon_162.png
│  │  │              │     ├─ icon_216.png
│  │  │              │     ├─ icon_324.png
│  │  │              │     └─ icon_432.png
│  │  │              ├─ android-notification
│  │  │              │  └─ android-notification-119462bb78eb240a65c869fc067ee599639b3cb5a41953f25c07b17d2a8c7e0f-cover-transparent
│  │  │              │     ├─ icon_24.png
│  │  │              │     ├─ icon_36.png
│  │  │              │     ├─ icon_48.png
│  │  │              │     ├─ icon_72.png
│  │  │              │     └─ icon_96.png
│  │  │              ├─ android-standard-circle
│  │  │              │  └─ android-standard-circle-9e3d0315a33c6799de601dd34cd8bf8cc3a8d16f3bf75592baec2ceb7240b391-cover-transparent
│  │  │              │     ├─ icon_144.png
│  │  │              │     ├─ icon_192.png
│  │  │              │     ├─ icon_48.png
│  │  │              │     ├─ icon_72.png
│  │  │              │     └─ icon_96.png
│  │  │              ├─ android-standard-round-background
│  │  │              │  └─ android-standard-round-background-fb139c2dee362ebf2070e23b96da6fc0d43f8492de38b8af1fd7223e19b5861d-cover-transparent
│  │  │              │     ├─ icon_144.png
│  │  │              │     ├─ icon_192.png
│  │  │              │     ├─ icon_48.png
│  │  │              │     ├─ icon_72.png
│  │  │              │     └─ icon_96.png
│  │  │              ├─ android-standard-square
│  │  │              │  └─ android-standard-square-9e3d0315a33c6799de601dd34cd8bf8cc3a8d16f3bf75592baec2ceb7240b391-cover-transparent
│  │  │              │     ├─ icon_144.png
│  │  │              │     ├─ icon_192.png
│  │  │              │     ├─ icon_48.png
│  │  │              │     ├─ icon_72.png
│  │  │              │     └─ icon_96.png
│  │  │              ├─ android-standard-square-background
│  │  │              │  └─ android-standard-square-background-fb139c2dee362ebf2070e23b96da6fc0d43f8492de38b8af1fd7223e19b5861d-cover-transparent
│  │  │              │     ├─ icon_144.png
│  │  │              │     ├─ icon_192.png
│  │  │              │     ├─ icon_48.png
│  │  │              │     ├─ icon_72.png
│  │  │              │     └─ icon_96.png
│  │  │              └─ splash-android
│  │  │                 └─ splash-android-5f4c0a732b6325bf4071d9124d2ae67e037cb24fcc9c482ef82bea742109a3b8-contain
│  │  │                    ├─ icon_200.png
│  │  │                    ├─ icon_300.png
│  │  │                    ├─ icon_400.png
│  │  │                    ├─ icon_600.png
│  │  │                    └─ icon_800.png
│  │  ├─ android
│  │  │  ├─ .gradle
│  │  │  │  ├─ 8.14.3
│  │  │  │  │  ├─ checksums
│  │  │  │  │  │  ├─ checksums.lock
│  │  │  │  │  │  ├─ md5-checksums.bin
│  │  │  │  │  │  └─ sha1-checksums.bin
│  │  │  │  │  ├─ executionHistory
│  │  │  │  │  │  ├─ executionHistory.bin
│  │  │  │  │  │  └─ executionHistory.lock
│  │  │  │  │  ├─ expanded
│  │  │  │  │  ├─ fileChanges
│  │  │  │  │  ├─ fileHashes
│  │  │  │  │  │  ├─ fileHashes.bin
│  │  │  │  │  │  ├─ fileHashes.lock
│  │  │  │  │  │  └─ resourceHashesCache.bin
│  │  │  │  │  ├─ gc.properties
│  │  │  │  │  └─ vcsMetadata
│  │  │  │  ├─ file-system.probe
│  │  │  │  ├─ noVersion
│  │  │  │  └─ vcs-1
│  │  │  │     └─ gc.properties
│  │  │  ├─ .kotlin
│  │  │  │  └─ sessions
│  │  │  ├─ app
│  │  │  │  ├─ .cxx
│  │  │  │  │  ├─ Debug
│  │  │  │  │  │  └─ 2h5r4a44
│  │  │  │  │  │     ├─ arm64-v8a
│  │  │  │  │  │     │  ├─ .cmake
│  │  │  │  │  │     │  │  └─ api
│  │  │  │  │  │     │  │     └─ v1
│  │  │  │  │  │     │  │        ├─ query
│  │  │  │  │  │     │  │        │  └─ client-agp
│  │  │  │  │  │     │  │        │     ├─ cache-v2
│  │  │  │  │  │     │  │        │     ├─ cmakeFiles-v1
│  │  │  │  │  │     │  │        │     └─ codemodel-v2
│  │  │  │  │  │     │  │        └─ reply
│  │  │  │  │  │     │  │           ├─ cache-v2-0cf08547e617a1b8bd36.json
│  │  │  │  │  │     │  │           ├─ cmakeFiles-v1-77e4b249533c249e486c.json
│  │  │  │  │  │     │  │           ├─ codemodel-v2-aecb07233f1b2bf0e84a.json
│  │  │  │  │  │     │  │           ├─ directory-.-Debug-d0094a50bb2071803777.json
│  │  │  │  │  │     │  │           ├─ index-2026-03-20T04-02-45-0808.json
│  │  │  │  │  │     │  │           ├─ target-appmodules-Debug-7914c31376dc5f42e66d.json
│  │  │  │  │  │     │  │           ├─ target-react_codegen_rngesturehandler_codegen-Debug-0ce4c4fc0d3a0960fef3.json
│  │  │  │  │  │     │  │           ├─ target-react_codegen_RNGoogleSignInCGen-Debug-730a5e9a22a486238f82.json
│  │  │  │  │  │     │  │           ├─ target-react_codegen_rnreanimated-Debug-3d2c13aa59a9e69b87a6.json
│  │  │  │  │  │     │  │           ├─ target-react_codegen_rnscreens-Debug-77f63c65f24e373a672b.json
│  │  │  │  │  │     │  │           ├─ target-react_codegen_rnworklets-Debug-1e67b22430fbc24b02a8.json
│  │  │  │  │  │     │  │           └─ target-react_codegen_safeareacontext-Debug-cec43bb4e7e38111a0de.json
│  │  │  │  │  │     │  ├─ .ninja_deps
│  │  │  │  │  │     │  ├─ .ninja_log
│  │  │  │  │  │     │  ├─ additional_project_files.txt
│  │  │  │  │  │     │  ├─ CMakeCache.txt
│  │  │  │  │  │     │  ├─ CMakeFiles
│  │  │  │  │  │     │  │  ├─ 3.22.1-g37088a8-dirty
│  │  │  │  │  │     │  │  │  ├─ CMakeCCompiler.cmake
│  │  │  │  │  │     │  │  │  ├─ CMakeCXXCompiler.cmake
│  │  │  │  │  │     │  │  │  ├─ CMakeDetermineCompilerABI_C.bin
│  │  │  │  │  │     │  │  │  ├─ CMakeDetermineCompilerABI_CXX.bin
│  │  │  │  │  │     │  │  │  ├─ CMakeSystem.cmake
│  │  │  │  │  │     │  │  │  ├─ CompilerIdC
│  │  │  │  │  │     │  │  │  │  ├─ CMakeCCompilerId.c
│  │  │  │  │  │     │  │  │  │  ├─ CMakeCCompilerId.o
│  │  │  │  │  │     │  │  │  │  └─ tmp
│  │  │  │  │  │     │  │  │  └─ CompilerIdCXX
│  │  │  │  │  │     │  │  │     ├─ CMakeCXXCompilerId.cpp
│  │  │  │  │  │     │  │  │     ├─ CMakeCXXCompilerId.o
│  │  │  │  │  │     │  │  │     └─ tmp
│  │  │  │  │  │     │  │  ├─ appmodules.dir
│  │  │  │  │  │     │  │  │  ├─ D_
│  │  │  │  │  │     │  │  │  │  └─ ideas
│  │  │  │  │  │     │  │  │  │     └─ awaazai
│  │  │  │  │  │     │  │  │  │        └─ apps
│  │  │  │  │  │     │  │  │  │           └─ client
│  │  │  │  │  │     │  │  │  │              └─ android
│  │  │  │  │  │     │  │  │  │                 └─ app
│  │  │  │  │  │     │  │  │  └─ OnLoad.cpp.o
│  │  │  │  │  │     │  │  ├─ cmake.check_cache
│  │  │  │  │  │     │  │  ├─ cmake.verify_globs
│  │  │  │  │  │     │  │  ├─ CMakeError.log
│  │  │  │  │  │     │  │  ├─ CMakeOutput.log
│  │  │  │  │  │     │  │  ├─ CMakeTmp
│  │  │  │  │  │     │  │  ├─ rules.ninja
│  │  │  │  │  │     │  │  ├─ TargetDirectories.txt
│  │  │  │  │  │     │  │  ├─ VerifyGlobs.cmake
│  │  │  │  │  │     │  │  └─ _CMakeLTOTest-CXX
│  │  │  │  │  │     │  │     ├─ bin
│  │  │  │  │  │     │  │     │  ├─ .ninja_deps
│  │  │  │  │  │     │  │     │  ├─ .ninja_log
│  │  │  │  │  │     │  │     │  ├─ CMakeCache.txt
│  │  │  │  │  │     │  │     │  ├─ CMakeFiles
│  │  │  │  │  │     │  │     │  │  ├─ boo.dir
│  │  │  │  │  │     │  │     │  │  │  └─ main.cpp.o
│  │  │  │  │  │     │  │     │  │  ├─ cmake.check_cache
│  │  │  │  │  │     │  │     │  │  ├─ foo.dir
│  │  │  │  │  │     │  │     │  │  │  └─ foo.cpp.o
│  │  │  │  │  │     │  │     │  │  ├─ rules.ninja
│  │  │  │  │  │     │  │     │  │  └─ TargetDirectories.txt
│  │  │  │  │  │     │  │     │  ├─ cmake_install.cmake
│  │  │  │  │  │     │  │     │  └─ libfoo.a
│  │  │  │  │  │     │  │     └─ src
│  │  │  │  │  │     │  │        ├─ CMakeLists.txt
│  │  │  │  │  │     │  │        ├─ foo.cpp
│  │  │  │  │  │     │  │        └─ main.cpp
│  │  │  │  │  │     │  ├─ cmake_install.cmake
│  │  │  │  │  │     │  ├─ compile_commands.json
│  │  │  │  │  │     │  ├─ compile_commands.json.bin
│  │  │  │  │  │     │  ├─ configure_fingerprint.bin
│  │  │  │  │  │     │  ├─ metadata_generation_command.txt
│  │  │  │  │  │     │  ├─ prefab_config.json
│  │  │  │  │  │     │  └─ symbol_folder_index.txt
│  │  │  │  │  │     ├─ hash_key.txt
│  │  │  │  │  │     └─ prefab
│  │  │  │  │  │        └─ arm64-v8a
│  │  │  │  │  │           └─ prefab
│  │  │  │  │  │              └─ lib
│  │  │  │  │  │                 └─ aarch64-linux-android
│  │  │  │  │  │                    └─ cmake
│  │  │  │  │  │                       ├─ fbjni
│  │  │  │  │  │                       │  ├─ fbjniConfig.cmake
│  │  │  │  │  │                       │  └─ fbjniConfigVersion.cmake
│  │  │  │  │  │                       ├─ hermes-engine
│  │  │  │  │  │                       │  ├─ hermes-engineConfig.cmake
│  │  │  │  │  │                       │  └─ hermes-engineConfigVersion.cmake
│  │  │  │  │  │                       ├─ react-native-reanimated
│  │  │  │  │  │                       │  ├─ react-native-reanimatedConfig.cmake
│  │  │  │  │  │                       │  └─ react-native-reanimatedConfigVersion.cmake
│  │  │  │  │  │                       ├─ react-native-worklets
│  │  │  │  │  │                       │  ├─ react-native-workletsConfig.cmake
│  │  │  │  │  │                       │  └─ react-native-workletsConfigVersion.cmake
│  │  │  │  │  │                       └─ ReactAndroid
│  │  │  │  │  │                          ├─ ReactAndroidConfig.cmake
│  │  │  │  │  │                          └─ ReactAndroidConfigVersion.cmake
│  │  │  │  │  └─ tools
│  │  │  │  │     └─ debug
│  │  │  │  │        └─ arm64-v8a
│  │  │  │  │           └─ compile_commands.json
│  │  │  │  ├─ debug.keystore
│  │  │  │  ├─ proguard-rules.pro
│  │  │  │  └─ src
│  │  │  │     ├─ debug
│  │  │  │     │  └─ AndroidManifest.xml
│  │  │  │     ├─ debugOptimized
│  │  │  │     │  └─ AndroidManifest.xml
│  │  │  │     └─ main
│  │  │  │        ├─ AndroidManifest.xml
│  │  │  │        ├─ java
│  │  │  │        │  └─ com
│  │  │  │        │     └─ kalyani2015
│  │  │  │        │        └─ client
│  │  │  │        │           ├─ MainActivity.kt
│  │  │  │        │           └─ MainApplication.kt
│  │  │  │        └─ res
│  │  │  │           ├─ drawable
│  │  │  │           │  ├─ ic_launcher_background.xml
│  │  │  │           │  └─ rn_edit_text_material.xml
│  │  │  │           ├─ drawable-hdpi
│  │  │  │           │  ├─ notification_icon.png
│  │  │  │           │  └─ splashscreen_logo.png
│  │  │  │           ├─ drawable-mdpi
│  │  │  │           │  ├─ notification_icon.png
│  │  │  │           │  └─ splashscreen_logo.png
│  │  │  │           ├─ drawable-xhdpi
│  │  │  │           │  ├─ notification_icon.png
│  │  │  │           │  └─ splashscreen_logo.png
│  │  │  │           ├─ drawable-xxhdpi
│  │  │  │           │  ├─ notification_icon.png
│  │  │  │           │  └─ splashscreen_logo.png
│  │  │  │           ├─ drawable-xxxhdpi
│  │  │  │           │  ├─ notification_icon.png
│  │  │  │           │  └─ splashscreen_logo.png
│  │  │  │           ├─ mipmap-anydpi-v26
│  │  │  │           │  ├─ ic_launcher.xml
│  │  │  │           │  └─ ic_launcher_round.xml
│  │  │  │           ├─ mipmap-hdpi
│  │  │  │           │  ├─ ic_launcher.webp
│  │  │  │           │  ├─ ic_launcher_background.webp
│  │  │  │           │  ├─ ic_launcher_foreground.webp
│  │  │  │           │  ├─ ic_launcher_monochrome.webp
│  │  │  │           │  └─ ic_launcher_round.webp
│  │  │  │           ├─ mipmap-mdpi
│  │  │  │           │  ├─ ic_launcher.webp
│  │  │  │           │  ├─ ic_launcher_background.webp
│  │  │  │           │  ├─ ic_launcher_foreground.webp
│  │  │  │           │  ├─ ic_launcher_monochrome.webp
│  │  │  │           │  └─ ic_launcher_round.webp
│  │  │  │           ├─ mipmap-xhdpi
│  │  │  │           │  ├─ ic_launcher.webp
│  │  │  │           │  ├─ ic_launcher_background.webp
│  │  │  │           │  ├─ ic_launcher_foreground.webp
│  │  │  │           │  ├─ ic_launcher_monochrome.webp
│  │  │  │           │  └─ ic_launcher_round.webp
│  │  │  │           ├─ mipmap-xxhdpi
│  │  │  │           │  ├─ ic_launcher.webp
│  │  │  │           │  ├─ ic_launcher_background.webp
│  │  │  │           │  ├─ ic_launcher_foreground.webp
│  │  │  │           │  ├─ ic_launcher_monochrome.webp
│  │  │  │           │  └─ ic_launcher_round.webp
│  │  │  │           ├─ mipmap-xxxhdpi
│  │  │  │           │  ├─ ic_launcher.webp
│  │  │  │           │  ├─ ic_launcher_background.webp
│  │  │  │           │  ├─ ic_launcher_foreground.webp
│  │  │  │           │  ├─ ic_launcher_monochrome.webp
│  │  │  │           │  └─ ic_launcher_round.webp
│  │  │  │           ├─ values
│  │  │  │           │  ├─ colors.xml
│  │  │  │           │  ├─ strings.xml
│  │  │  │           │  └─ styles.xml
│  │  │  │           └─ values-night
│  │  │  │              └─ colors.xml
│  │  │  ├─ gradle
│  │  │  │  └─ wrapper
│  │  │  │     ├─ gradle-wrapper.jar
│  │  │  │     └─ gradle-wrapper.properties
│  │  │  ├─ gradle.properties
│  │  │  ├─ gradlew
│  │  │  ├─ gradlew.bat
│  │  │  └─ settings.gradle
│  │  ├─ app
│  │  │  ├─ (auth)
│  │  │  │  ├─ login
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ reset-password
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ send-otp
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ signup
│  │  │  │  │  └─ index.tsx
│  │  │  │  ├─ verify-otp
│  │  │  │  │  └─ index.tsx
│  │  │  │  └─ _layout.tsx
│  │  │  ├─ (routes)
│  │  │  │  ├─ bots
│  │  │  │  │  ├─ create.tsx
│  │  │  │  │  ├─ my-bots.tsx
│  │  │  │  │  ├─ [botId]
│  │  │  │  │  │  ├─ index.tsx
│  │  │  │  │  │  ├─ settings.tsx
│  │  │  │  │  │  ├─ train.tsx
│  │  │  │  │  │  └─ use.tsx
│  │  │  │  │  └─ _layout.tsx
│  │  │  │  ├─ chats
│  │  │  │  │  └─ [chatId]
│  │  │  │  │     ├─ index.tsx
│  │  │  │  │     └─ session.tsx
│  │  │  │  ├─ profile
│  │  │  │  │  ├─ reminders
│  │  │  │  │  │  └─ index.tsx
│  │  │  │  │  ├─ topics
│  │  │  │  │  │  └─ index.tsx
│  │  │  │  │  ├─ update
│  │  │  │  │  │  └─ index.tsx
│  │  │  │  │  ├─ voice-preferences
│  │  │  │  │  │  └─ index.tsx
│  │  │  │  │  └─ _layout.tsx
│  │  │  │  ├─ subscription
│  │  │  │  │  ├─ payments.tsx
│  │  │  │  │  ├─ plans.tsx
│  │  │  │  │  ├─ usage.tsx
│  │  │  │  │  └─ _layout.tsx
│  │  │  │  ├─ voices
│  │  │  │  │  ├─ [botId]
│  │  │  │  │  │  ├─ create.tsx
│  │  │  │  │  │  └─ [voiceId].tsx
│  │  │  │  │  └─ _layout.tsx
│  │  │  │  └─ _layout.tsx
│  │  │  ├─ (tabs)
│  │  │  │  ├─ bots.tsx
│  │  │  │  ├─ chats.tsx
│  │  │  │  ├─ index.tsx
│  │  │  │  ├─ profile.tsx
│  │  │  │  ├─ voices.tsx
│  │  │  │  └─ _layout.tsx
│  │  │  ├─ index.tsx
│  │  │  └─ _layout.tsx
│  │  ├─ app.config.ts
│  │  ├─ app.json
│  │  ├─ assets
│  │  │  ├─ fonts
│  │  │  └─ images
│  │  │     ├─ android-icon-background.png
│  │  │     ├─ android-icon-foreground.png
│  │  │     ├─ android-icon-monochrome.png
│  │  │     ├─ favicon.png
│  │  │     ├─ icon.png
│  │  │     ├─ partial-react-logo.png
│  │  │     ├─ react-logo.png
│  │  │     ├─ react-logo@2x.png
│  │  │     ├─ react-logo@3x.png
│  │  │     └─ splash-icon.png
│  │  ├─ babel.config.js
│  │  ├─ client_secret_58884905855-bf5nj9uu8fdbe8ou02vgb6lrdi4adkkk.apps.googleusercontent.com.json
│  │  ├─ eas.json
│  │  ├─ eslint.config.js
│  │  ├─ expo-env.d.ts
│  │  ├─ global.css
│  │  ├─ metro.config.js
│  │  ├─ nativewind-env.d.ts
│  │  ├─ package.json
│  │  ├─ README.md
│  │  ├─ src
│  │  │  ├─ api
│  │  │  │  ├─ fetch
│  │  │  │  │  ├─ client.ts
│  │  │  │  │  └─ config.ts
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ query
│  │  │  │  │  └─ index.ts
│  │  │  │  └─ query.ts
│  │  │  ├─ components
│  │  │  │  └─ ui
│  │  │  │     ├─ paywall
│  │  │  │     │  ├─ index.ts
│  │  │  │     │  └─ PaywallModal.tsx
│  │  │  │     └─ toast
│  │  │  │        ├─ index.ts
│  │  │  │        ├─ toast-config.tsx
│  │  │  │        └─ toast.ts
│  │  │  ├─ context
│  │  │  ├─ hooks
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ useGoogleAuth.ts
│  │  │  │  ├─ usePushNotifications.ts
│  │  │  │  └─ useTheme.ts
│  │  │  ├─ lib
│  │  │  │  └─ socket.ts
│  │  │  ├─ modules
│  │  │  │  ├─ auth
│  │  │  │  │  ├─ auth.constants.ts
│  │  │  │  │  ├─ auth.helpers.ts
│  │  │  │  │  ├─ auth.service.ts
│  │  │  │  │  ├─ auth.store.ts
│  │  │  │  │  ├─ auth.types.ts
│  │  │  │  │  └─ index.ts
│  │  │  │  ├─ bot
│  │  │  │  ├─ bots
│  │  │  │  │  ├─ bots.constants.ts
│  │  │  │  │  ├─ bots.service.ts
│  │  │  │  │  ├─ bots.store.ts
│  │  │  │  │  ├─ bots.types.ts
│  │  │  │  │  └─ index.ts
│  │  │  │  ├─ message
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  ├─ message.service.ts
│  │  │  │  │  ├─ message.store.ts
│  │  │  │  │  └─ message.types.ts
│  │  │  │  ├─ profile
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  ├─ profile.service.ts
│  │  │  │  │  ├─ profile.store.ts
│  │  │  │  │  └─ profile.types.ts
│  │  │  │  ├─ subscription
│  │  │  │  │  ├─ index.ts
│  │  │  │  │  ├─ subscription.service.ts
│  │  │  │  │  ├─ subscription.store.ts
│  │  │  │  │  └─ subscription.types.ts
│  │  │  │  └─ voice
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ voice.constants.ts
│  │  │  │     ├─ voice.service.ts
│  │  │  │     ├─ voice.store.ts
│  │  │  │     └─ voice.types.ts
│  │  │  ├─ shared
│  │  │  │  ├─ constants.ts
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ types
│  │  │  │  │  ├─ api.types.ts
│  │  │  │  │  └─ index.ts
│  │  │  │  └─ utils
│  │  │  │     ├─ constants.ts
│  │  │  │     ├─ helpers.ts
│  │  │  │     ├─ index.ts
│  │  │  │     ├─ storage.ts
│  │  │  │     └─ validation.ts
│  │  │  ├─ stores
│  │  │  │  ├─ auth.ts
│  │  │  │  ├─ index.ts
│  │  │  │  └─ theme.ts
│  │  │  ├─ theme
│  │  │  │  ├─ colors.ts
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ responsive.ts
│  │  │  │  ├─ shadows.ts
│  │  │  │  ├─ spacing.ts
│  │  │  │  └─ typography.ts
│  │  │  └─ utils
│  │  ├─ tailwind.config.js
│  │  └─ tsconfig.json
│  ├─ dashboard(nextjs)
│  └─ server
│     ├─ nodemon.json
│     ├─ package.json
│     ├─ prisma
│     │  ├─ migrations
│     │  │  ├─ 20260303030238_added_b2c_tables
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260303070110_refresh_token_update
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260313143515_just_small_change
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260313151558_just_small_change
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260315053030_add_user_role_type
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260315053129
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260315053809_add_admin_bot_tables
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260315062411_admin_bot
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260315065044_bot_id_added
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260315142857_update_knowledge_type
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260316050504_added_sample_upload_status
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260316052641_session_id_add
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260317104607_add_bot_chat_knowledge_mode
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260317122746_add_subscription_limit_keys
│     │  │  │  └─ migration.sql
│     │  │  ├─ 20260318110644_bot_flag
│     │  │  │  └─ migration.sql
│     │  │  └─ migration_lock.toml
│     │  ├─ schema
│     │  │  ├─ auth.prisma
│     │  │  ├─ base.prisma
│     │  │  ├─ bot.prisma
│     │  │  ├─ chat.prisma
│     │  │  ├─ enums.prisma
│     │  │  ├─ logs.prisma
│     │  │  ├─ notification.prisma
│     │  │  ├─ org.prisma
│     │  │  ├─ subscription.prisma
│     │  │  └─ support.prisma
│     │  ├─ schema.prisma
│     │  ├─ schema.prisma.backup
│     │  └─ seed.ts
│     ├─ prisma.config.ts
│     ├─ render.yaml
│     ├─ src
│     │  ├─ app.ts
│     │  ├─ config
│     │  │  ├─ app
│     │  │  │  ├─ clients
│     │  │  │  │  └─ index.ts
│     │  │  │  ├─ env
│     │  │  │  │  └─ index.ts
│     │  │  │  ├─ index.ts
│     │  │  │  └─ middlewares
│     │  │  │     ├─ compression
│     │  │  │     │  └─ index.ts
│     │  │  │     ├─ cookie
│     │  │  │     │  └─ index.ts
│     │  │  │     ├─ cors
│     │  │  │     │  └─ index.ts
│     │  │  │     ├─ helmet
│     │  │  │     │  └─ index.ts
│     │  │  │     ├─ index.ts
│     │  │  │     ├─ morgan
│     │  │  │     │  └─ index.ts
│     │  │  │     └─ ratelimit
│     │  │  │        └─ index.ts
│     │  │  ├─ helper
│     │  │  │  ├─ file
│     │  │  │  │  └─ index.tsx
│     │  │  │  ├─ index.ts
│     │  │  │  ├─ logger
│     │  │  │  │  └─ index.ts
│     │  │  │  ├─ multer
│     │  │  │  │  └─ index.ts
│     │  │  │  └─ passport
│     │  │  │     └─ index.ts
│     │  │  ├─ index.ts
│     │  │  ├─ jobs
│     │  │  │  ├─ clone
│     │  │  │  │  └─ index.ts
│     │  │  │  ├─ index.ts
│     │  │  │  ├─ meeting
│     │  │  │  ├─ stt
│     │  │  │  │  └─ index.ts
│     │  │  │  └─ tts
│     │  │  │     └─ index.ts
│     │  │  └─ services
│     │  │     ├─ ai
│     │  │     │  ├─ elevenlabs
│     │  │     │  │  └─ index.ts
│     │  │     │  ├─ index.ts
│     │  │     │  ├─ openai
│     │  │     │  │  └─ index.ts
│     │  │     │  └─ qdrant
│     │  │     │     └─ index.ts
│     │  │     ├─ aws
│     │  │     │  ├─ index.ts
│     │  │     │  ├─ s3
│     │  │     │  │  └─ index.ts
│     │  │     │  ├─ ses
│     │  │     │  │  └─ index.ts
│     │  │     │  └─ sns
│     │  │     │     └─ index.ts
│     │  │     ├─ cloudinary
│     │  │     │  └─ index.ts
│     │  │     ├─ database
│     │  │     │  ├─ index.ts
│     │  │     │  ├─ mongo
│     │  │     │  │  └─ index.ts
│     │  │     │  ├─ pg
│     │  │     │  │  └─ index.ts
│     │  │     │  └─ prisma
│     │  │     │     └─ index.ts
│     │  │     ├─ index.ts
│     │  │     ├─ mail
│     │  │     │  └─ index.ts
│     │  │     ├─ meeting
│     │  │     │  └─ index.ts
│     │  │     ├─ queue
│     │  │     │  └─ index.ts
│     │  │     ├─ razorpay
│     │  │     │  └─ index.ts
│     │  │     └─ redis
│     │  │        └─ index.ts
│     │  ├─ generated
│     │  │  └─ prisma
│     │  │     ├─ browser.ts
│     │  │     ├─ client.ts
│     │  │     ├─ commonInputTypes.ts
│     │  │     ├─ enums.ts
│     │  │     ├─ internal
│     │  │     │  ├─ class.ts
│     │  │     │  ├─ prismaNamespace.ts
│     │  │     │  └─ prismaNamespaceBrowser.ts
│     │  │     ├─ models
│     │  │     │  ├─ ActivityLog.ts
│     │  │     │  ├─ ApiLog.ts
│     │  │     │  ├─ AvailableBot.ts
│     │  │     │  ├─ Bot.ts
│     │  │     │  ├─ BotCapability.ts
│     │  │     │  ├─ BotChat.ts
│     │  │     │  ├─ BotConfig.ts
│     │  │     │  ├─ BotKnowledge.ts
│     │  │     │  ├─ BotMessage.ts
│     │  │     │  ├─ BotRemainder.ts
│     │  │     │  ├─ BotRules.ts
│     │  │     │  ├─ BotSession.ts
│     │  │     │  ├─ BotTraining.ts
│     │  │     │  ├─ BotVoice.ts
│     │  │     │  ├─ Capability.ts
│     │  │     │  ├─ CapabilityFunction.ts
│     │  │     │  ├─ Chat.ts
│     │  │     │  ├─ DeviceToken.ts
│     │  │     │  ├─ Feedback.ts
│     │  │     │  ├─ File.ts
│     │  │     │  ├─ GuestUser.ts
│     │  │     │  ├─ Invitation.ts
│     │  │     │  ├─ Invoice.ts
│     │  │     │  ├─ LoginHistory.ts
│     │  │     │  ├─ Notification.ts
│     │  │     │  ├─ Org.ts
│     │  │     │  ├─ OrgMember.ts
│     │  │     │  ├─ OrgVerification.ts
│     │  │     │  ├─ OTP.ts
│     │  │     │  ├─ Payment.ts
│     │  │     │  ├─ Plan.ts
│     │  │     │  ├─ PlanFeature.ts
│     │  │     │  ├─ Preferences.ts
│     │  │     │  ├─ Profile.ts
│     │  │     │  ├─ RefreshToken.ts
│     │  │     │  ├─ SampleVoice.ts
│     │  │     │  ├─ Scheduler.ts
│     │  │     │  ├─ Session.ts
│     │  │     │  ├─ Subscription.ts
│     │  │     │  ├─ SupportTicket.ts
│     │  │     │  ├─ Team.ts
│     │  │     │  ├─ TeamMember.ts
│     │  │     │  ├─ UsageTrack.ts
│     │  │     │  └─ User.ts
│     │  │     └─ models.ts
│     │  ├─ globals
│     │  │  ├─ constants.ts
│     │  │  ├─ index.ts
│     │  │  └─ types.ts
│     │  ├─ lib
│     │  │  ├─ app
│     │  │  │  ├─ index.ts
│     │  │  │  └─ middlewares
│     │  │  │     ├─ compression
│     │  │  │     │  └─ index.ts
│     │  │  │     ├─ cookie
│     │  │  │     │  └─ index.ts
│     │  │  │     ├─ cors
│     │  │  │     │  └─ index.ts
│     │  │  │     ├─ errorHandler
│     │  │  │     │  └─ index.ts
│     │  │  │     ├─ helmet
│     │  │  │     │  └─ index.ts
│     │  │  │     ├─ index.ts
│     │  │  │     ├─ morgan
│     │  │  │     │  └─ index.ts
│     │  │  │     └─ ratelimit
│     │  │  │        └─ index.ts
│     │  │  ├─ helper
│     │  │  │  ├─ index.ts
│     │  │  │  └─ logger
│     │  │  │     └─ index.ts
│     │  │  ├─ index.ts
│     │  │  └─ services
│     │  │     ├─ ai
│     │  │     │  ├─ elevenlabs
│     │  │     │  │  ├─ client.ts
│     │  │     │  │  ├─ index.ts
│     │  │     │  │  └─ service.ts
│     │  │     │  ├─ embeddings
│     │  │     │  │  ├─ client.ts
│     │  │     │  │  └─ index.ts
│     │  │     │  ├─ index.ts
│     │  │     │  ├─ openai
│     │  │     │  │  ├─ client.ts
│     │  │     │  │  ├─ index.ts
│     │  │     │  │  └─ service.ts
│     │  │     │  └─ qdrant
│     │  │     │     ├─ client.ts
│     │  │     │     └─ index.ts
│     │  │     ├─ cloudinary
│     │  │     │  └─ index.ts
│     │  │     ├─ database
│     │  │     │  ├─ index.ts
│     │  │     │  ├─ mongo
│     │  │     │  │  └─ index.ts
│     │  │     │  └─ prisma
│     │  │     │     └─ index.ts
│     │  │     ├─ index.ts
│     │  │     ├─ mail
│     │  │     │  ├─ client.ts
│     │  │     │  ├─ index.ts
│     │  │     │  ├─ service.ts
│     │  │     │  └─ templates
│     │  │     │     ├─ index.ts
│     │  │     │     └─ otp.template.ts
│     │  │     ├─ meeting
│     │  │     │  └─ index.ts
│     │  │     ├─ queue
│     │  │     │  ├─ client.ts
│     │  │     │  ├─ index.ts
│     │  │     │  └─ service.ts
│     │  │     ├─ razorpay
│     │  │     │  ├─ client.ts
│     │  │     │  ├─ index.ts
│     │  │     │  └─ service.ts
│     │  │     ├─ redis
│     │  │     │  ├─ client.ts
│     │  │     │  ├─ index.ts
│     │  │     │  └─ service.ts
│     │  │     ├─ s3
│     │  │     │  ├─ client.ts
│     │  │     │  ├─ index.ts
│     │  │     │  └─ service.ts
│     │  │     └─ socket
│     │  │        ├─ index.ts
│     │  │        └─ middleware.ts
│     │  ├─ loaders
│     │  │  ├─ config.loader.ts
│     │  │  ├─ helper.loader.ts
│     │  │  ├─ index.ts
│     │  │  ├─ jobs.loader.ts
│     │  │  ├─ lib.loader.ts
│     │  │  └─ middleware.loader.ts
│     │  ├─ middlewares
│     │  │  ├─ auth.middleware.ts
│     │  │  ├─ index.ts
│     │  │  ├─ org.middleware.ts
│     │  │  ├─ role.middleware.ts
│     │  │  └─ subscription.middleware.ts
│     │  ├─ modules
│     │  │  ├─ agents
│     │  │  ├─ analytics
│     │  │  ├─ auth
│     │  │  │  ├─ controllers
│     │  │  │  │  ├─ auth.controller.ts
│     │  │  │  │  └─ profile.controller.ts
│     │  │  │  ├─ helpers
│     │  │  │  │  └─ auth.helper.ts
│     │  │  │  ├─ routes
│     │  │  │  │  ├─ auth.routes.ts
│     │  │  │  │  └─ profile.routes.ts
│     │  │  │  ├─ services
│     │  │  │  │  ├─ auth.service.ts
│     │  │  │  │  └─ profile.service.ts
│     │  │  │  ├─ types
│     │  │  │  └─ validators
│     │  │  │     ├─ auth.validation.ts
│     │  │  │     └─ profile.validation.ts
│     │  │  ├─ bot
│     │  │  │  ├─ controllers
│     │  │  │  │  ├─ adminBot.controller.ts
│     │  │  │  │  ├─ bot.controller.ts
│     │  │  │  │  └─ botChat.controller.ts
│     │  │  │  ├─ helpers
│     │  │  │  │  └─ bot.helper.ts
│     │  │  │  ├─ routes
│     │  │  │  │  ├─ adminBot.routes.ts
│     │  │  │  │  └─ bot.routes.ts
│     │  │  │  ├─ services
│     │  │  │  │  ├─ adminBot.service.ts
│     │  │  │  │  └─ bot.service.ts
│     │  │  │  ├─ types
│     │  │  │  │  └─ botChat.service.ts
│     │  │  │  ├─ validators
│     │  │  │  │  └─ bot.validation.ts
│     │  │  │  └─ workers
│     │  │  │     ├─ training.processor.ts
│     │  │  │     └─ training.worker.ts
│     │  │  ├─ chat
│     │  │  │  ├─ controllers
│     │  │  │  │  └─ chat.controller.ts
│     │  │  │  ├─ helpers
│     │  │  │  ├─ routes
│     │  │  │  │  └─ chat.route.ts
│     │  │  │  ├─ services
│     │  │  │  │  └─ chat.service.ts
│     │  │  │  ├─ types
│     │  │  │  └─ validators
│     │  │  │     └─ chat.validation.ts
│     │  │  ├─ meeting
│     │  │  ├─ message
│     │  │  │  ├─ controllers
│     │  │  │  ├─ handlers
│     │  │  │  │  ├─ session.handler.ts
│     │  │  │  │  ├─ session.hanldler.ts
│     │  │  │  │  └─ voice.hanlder.ts
│     │  │  │  ├─ helpers
│     │  │  │  ├─ index.ts
│     │  │  │  ├─ models
│     │  │  │  │  └─ message.model.ts
│     │  │  │  ├─ routes
│     │  │  │  ├─ services
│     │  │  │  │  ├─ messages.service.ts
│     │  │  │  │  ├─ pipeline.service.ts
│     │  │  │  │  └─ prompt.service.ts
│     │  │  │  ├─ types
│     │  │  │  └─ validators
│     │  │  ├─ notification
│     │  │  │  ├─ controllers
│     │  │  │  │  └─ notification.controller.ts
│     │  │  │  └─ routes
│     │  │  │     └─ notification.routes.ts
│     │  │  ├─ org
│     │  │  ├─ plan
│     │  │  ├─ subscription
│     │  │  │  ├─ controllers
│     │  │  │  │  ├─ admin.controller.ts
│     │  │  │  │  └─ subscription.controller.ts
│     │  │  │  ├─ helpers
│     │  │  │  ├─ routes
│     │  │  │  │  ├─ admin.routes.ts
│     │  │  │  │  └─ subscription.routes.ts
│     │  │  │  ├─ services
│     │  │  │  │  └─ subscription.service.ts
│     │  │  │  ├─ types
│     │  │  │  └─ validators
│     │  │  ├─ team
│     │  │  ├─ user
│     │  │  │  ├─ controllers
│     │  │  │  ├─ helpers
│     │  │  │  ├─ routes
│     │  │  │  ├─ services
│     │  │  │  ├─ types
│     │  │  │  └─ validators
│     │  │  └─ voice
│     │  │     ├─ controllers
│     │  │     │  └─ voice.controller.ts
│     │  │     ├─ helpers
│     │  │     │  └─ voice.helper.ts
│     │  │     ├─ routes
│     │  │     │  └─ voice.route.ts
│     │  │     ├─ services
│     │  │     │  └─ voice.service.ts
│     │  │     ├─ types
│     │  │     ├─ validators
│     │  │     │  └─ voice.validation.ts
│     │  │     └─ workers
│     │  │        ├─ cloning.processor.ts
│     │  │        └─ cloning.worker.ts
│     │  ├─ prisma
│     │  ├─ routes
│     │  │  └─ index.ts
│     │  ├─ server.ts
│     │  ├─ templates
│     │  ├─ tests
│     │  ├─ types
│     │  │  └─ express.d.ts
│     │  └─ utils
│     │     ├─ apiError.ts
│     │     ├─ apiResponse.ts
│     │     ├─ asyncHandler.ts
│     │     └─ index.ts
│     └─ tsconfig.json
├─ commitlint.config.cjs
├─ docker
├─ docs
│  ├─ ACTOR-LIFECYCLES.md
│  ├─ ACTORS.md
│  ├─ business-model.doc.md
│  ├─ code-quality.doc.md
│  ├─ code-writting.doc.md
│  ├─ DATABASE-SCHEMA-B2B.md
│  ├─ DATABASE-SCHEMA.md
│  ├─ DEVELOPMENT-PLAN.md
│  ├─ github.doc.md
│  ├─ packages.doc.md
│  ├─ PRODUCT-VISION.md
│  ├─ WORKFLOW-DESIGN-GUIDE.md
│  └─ WORKFLOWS.md
├─ eslint.config.mjs
├─ my-client-services.json
├─ package-lock.json
├─ package.json
├─ packages
│  ├─ eslint-config
│  │  ├─ base.js
│  │  ├─ next.js
│  │  ├─ package.json
│  │  ├─ react-internal.js
│  │  └─ README.md
│  ├─ types
│  │  └─ src
│  ├─ typescript-config
│  │  ├─ base.json
│  │  ├─ nextjs.json
│  │  ├─ package.json
│  │  └─ react-library.json
│  ├─ ui
│  │  ├─ eslint.config.mjs
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ button.tsx
│  │  │  ├─ card.tsx
│  │  │  └─ code.tsx
│  │  └─ tsconfig.json
│  ├─ utils
│  │  └─ src
│  └─ validators
│     └─ src
├─ README.md
├─ scripts
└─ turbo.json

```