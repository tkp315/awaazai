# Server Packages Documentation

Ye document batata hai ki server mein konsa package kis kaam ke liye use ho raha hai.

---

## 📦 Package Categories

```
┌─────────────────────────────────────────────────────────────┐
│                    AWAAZAI SERVER                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   CORE      │  │  DATABASE   │  │   CACHE     │         │
│  │  Framework  │  │   & ORM     │  │  & QUEUE    │         │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤         │
│  │ express     │  │ @prisma/    │  │ ioredis     │         │
│  │ cors        │  │   client    │  │ bullmq      │         │
│  │ helmet      │  │ prisma      │  │             │         │
│  │ morgan      │  │             │  │             │         │
│  │ compression │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   AUTH      │  │  SECURITY   │  │    AWS      │         │
│  │             │  │             │  │             │         │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤         │
│  │ jsonwebtoken│  │ express-    │  │ @aws-sdk/   │         │
│  │ bcryptjs    │  │  rate-limit │  │  client-s3  │         │
│  │ passport    │  │ rate-limit- │  │ @aws-sdk/   │         │
│  │ passport-   │  │  redis      │  │  s3-request │         │
│  │  google-    │  │ hpp         │  │  -presigner │         │
│  │  oauth20    │  │ xss-clean   │  │ @aws-sdk/   │         │
│  │             │  │             │  │  lib-storage│         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  AI/VOICE   │  │ VALIDATION  │  │   FILES     │         │
│  │             │  │             │  │             │         │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤         │
│  │ openai      │  │ zod         │  │ multer      │         │
│  │ elevenlabs  │  │             │  │ multer-s3   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  LOGGING    │  │  UTILITIES  │  │    HTTP     │         │
│  │             │  │             │  │             │         │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤         │
│  │ winston     │  │ uuid        │  │ axios       │         │
│  │ winston-    │  │ dayjs       │  │ http-errors │         │
│  │  daily-     │  │ lodash      │  │ cookie-     │         │
│  │  rotate-file│  │ slugify     │  │  parser     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔵 CORE FRAMEWORK

### express

```
Purpose  : Web framework - server banane ke liye
Use Case : Routes, middleware, request/response handling
Location : app.ts, server.ts
```

```typescript
import express from 'express';
const app = express();
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
```

### cors

```
Purpose  : Cross-Origin Resource Sharing
Use Case : Frontend (mobile app) se API calls allow karna
Location : config/cors/
```

```typescript
import cors from 'cors';
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
```

### helmet

```
Purpose  : Security headers set karta hai
Use Case : XSS, clickjacking, etc. se protection
Location : middlewares/
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

### morgan

```
Purpose  : HTTP request logger
Use Case : Request logs dekhne ke liye (dev mein)
Location : middlewares/
```

```typescript
import morgan from 'morgan';
app.use(morgan('dev')); // GET /api/users 200 12ms
```

### compression

```
Purpose  : Response compression (gzip)
Use Case : Response size kam karna, faster API
Location : middlewares/
```

```typescript
import compression from 'compression';
app.use(compression());
```

### dotenv

```
Purpose  : Environment variables load karna
Use Case : .env file se secrets read karna
Location : config/env/
```

```typescript
import dotenv from 'dotenv';
dotenv.config();
const dbUrl = process.env.DATABASE_URL;
```

---

## 🟢 DATABASE & ORM

### @prisma/client

```
Purpose  : Database ORM client
Use Case : Database queries (CRUD operations)
Location : lib/prisma/, modules/*/services/
```

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const users = await prisma.user.findMany();
```

### prisma (dev)

```
Purpose  : Prisma CLI tools
Use Case : Migrations, schema push, studio
Location : prisma/schema.prisma
```

```bash
npx prisma migrate dev    # Migration create
npx prisma db push        # Schema push
npx prisma studio         # GUI for database
npx prisma generate       # Client generate
```

---

## 🔴 CACHE & QUEUE

### ioredis

```
Purpose  : Redis client
Use Case : Caching, session storage, rate limit storage
Location : config/redis/, lib/redis/
```

```typescript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);
await redis.set('user:1', JSON.stringify(user), 'EX', 3600);
const cached = await redis.get('user:1');
```

### bullmq

```
Purpose  : Job queue (Redis-based)
Use Case : Background jobs - voice cloning, TTS, STT
Location : lib/queue/, jobs/
```

```typescript
import { Queue, Worker } from 'bullmq';

// Queue create
const voiceQueue = new Queue('voice-clone', { connection: redis });

// Job add
await voiceQueue.add('clone', { userId: 1, audioUrl: '...' });

// Worker process
const worker = new Worker('voice-clone', async job => {
  const { userId, audioUrl } = job.data;
  // Voice cloning logic
});
```

---

## 🟡 AUTHENTICATION

### jsonwebtoken

```
Purpose  : JWT tokens create/verify
Use Case : User authentication, API authorization
Location : modules/auth/helpers/, middlewares/
```

```typescript
import jwt from 'jsonwebtoken';

// Token create
const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Token verify
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### bcryptjs

```
Purpose  : Password hashing
Use Case : Password store/compare karna
Location : modules/auth/helpers/
```

```typescript
import bcrypt from 'bcryptjs';

// Hash password
const hashed = await bcrypt.hash('password123', 10);

// Compare password
const isMatch = await bcrypt.compare('password123', hashed);
```

### passport

```
Purpose  : Authentication middleware
Use Case : Multiple auth strategies support
Location : config/passport/, middlewares/
```

```typescript
import passport from 'passport';
app.use(passport.initialize());
```

### passport-google-oauth20

```
Purpose  : Google OAuth strategy
Use Case : "Login with Google" feature
Location : config/passport/
```

```typescript
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      // Find or create user
    }
  )
);
```

---

## 🟠 SECURITY & RATE LIMITING

### express-rate-limit

```
Purpose  : API rate limiting
Use Case : DDoS protection, API abuse prevention
Location : middlewares/, config/ratelimit/
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests',
});

app.use('/api/', limiter);
```

### rate-limit-redis

```
Purpose  : Redis store for rate limiter
Use Case : Distributed rate limiting (multiple servers)
Location : config/ratelimit/
```

```typescript
import RedisStore from 'rate-limit-redis';

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
});
```

### hpp

```
Purpose  : HTTP Parameter Pollution protection
Use Case : Prevent array parameter attacks
Location : middlewares/
```

```typescript
import hpp from 'hpp';
app.use(hpp());
// Prevents: ?sort=name&sort=email attack
```

### xss-clean

```
Purpose  : XSS attack prevention
Use Case : User input sanitization
Location : middlewares/
```

```typescript
import xss from 'xss-clean';
app.use(xss());
// Removes <script> tags from input
```

---

## 🟣 AWS SDK

### @aws-sdk/client-s3

```
Purpose  : S3 bucket operations
Use Case : Audio files upload/download/delete
Location : config/aws/, lib/s3/
```

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Upload
await s3.send(
  new PutObjectCommand({
    Bucket: 'awaazai-audio',
    Key: 'voices/user-1/sample.mp3',
    Body: audioBuffer,
  })
);
```

### @aws-sdk/s3-request-presigner

```
Purpose  : Pre-signed URLs generate karna
Use Case : Temporary secure URLs for audio files
Location : lib/s3/
```

```typescript
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const url = await getSignedUrl(
  s3,
  new GetObjectCommand({
    Bucket: 'awaazai-audio',
    Key: 'voices/user-1/sample.mp3',
  }),
  { expiresIn: 3600 }
); // 1 hour valid
```

### @aws-sdk/lib-storage

```
Purpose  : Multipart upload for large files
Use Case : Large audio files upload (>5MB)
Location : lib/s3/
```

```typescript
import { Upload } from '@aws-sdk/lib-storage';

const upload = new Upload({
  client: s3,
  params: {
    Bucket: 'awaazai-audio',
    Key: 'voices/large-file.mp3',
    Body: largeFileStream,
  },
});

await upload.done();
```

---

## 🤖 AI & VOICE APIs

### openai

```
Purpose  : OpenAI API client
Use Case : GPT-4 (chat responses), Whisper (STT)
Location : modules/ai/services/, jobs/stt/
```

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Chat completion
const response = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [{ role: 'user', content: 'Hello!' }],
});

// Speech to text (Whisper)
const transcription = await openai.audio.transcriptions.create({
  model: 'whisper-1',
  file: audioFile,
});
```

### elevenlabs

```
Purpose  : ElevenLabs API client
Use Case : Voice cloning, Text-to-Speech
Location : modules/voice/services/, jobs/clone/, jobs/tts/
```

```typescript
import { ElevenLabsClient } from 'elevenlabs';

const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

// Voice clone
const voice = await elevenlabs.voices.add({
  name: 'User Voice',
  files: [audioFile],
});

// Text to speech
const audio = await elevenlabs.textToSpeech.convert(voiceId, {
  text: 'Hello, how are you?',
  model_id: 'eleven_multilingual_v2',
});
```

---

## ✅ VALIDATION

### zod

```
Purpose  : Schema validation
Use Case : Request body, params, query validation
Location : modules/*/validators/
```

```typescript
import { z } from 'zod';

// Schema define
const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  age: z.number().min(18).optional(),
});

// Validate
const validated = createUserSchema.parse(req.body);
// Throws error if invalid
```

---

## 📁 FILE HANDLING

### multer

```
Purpose  : File upload handling
Use Case : Audio files receive karna from mobile app
Location : middlewares/, config/multer/
```

```typescript
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files allowed'));
    }
  },
});

app.post('/api/voice/upload', upload.single('audio'), handler);
```

### multer-s3

```
Purpose  : Direct S3 upload with multer
Use Case : Stream upload directly to S3
Location : config/multer/
```

```typescript
import multerS3 from 'multer-s3';

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'awaazai-audio',
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}-${file.originalname}`);
    },
  }),
});
```

---

## 📝 LOGGING

### winston

```
Purpose  : Advanced logging
Use Case : Structured logs, multiple transports
Location : lib/logger/
```

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

logger.info('Server started', { port: 3000 });
logger.error('Database error', { error: err.message });
```

### winston-daily-rotate-file

```
Purpose  : Daily log rotation
Use Case : Log files daily rotate + cleanup
Location : lib/logger/
```

```typescript
import DailyRotateFile from 'winston-daily-rotate-file';

const transport = new DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d', // 14 days keep
});

logger.add(transport);
```

---

## 🛠️ UTILITIES

### uuid

```
Purpose  : Unique ID generation
Use Case : File names, temp IDs, etc.
Location : utils/
```

```typescript
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4(); // '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
```

### dayjs

```
Purpose  : Date/time manipulation
Use Case : Timestamps, date formatting
Location : utils/, helpers/
```

```typescript
import dayjs from 'dayjs';
const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
const expired = dayjs().add(7, 'day').toDate();
```

### lodash

```
Purpose  : Utility functions
Use Case : Object manipulation, array operations
Location : utils/, helpers/
```

```typescript
import _ from 'lodash';
const unique = _.uniqBy(users, 'email');
const picked = _.pick(user, ['id', 'name', 'email']);
```

### slugify

```
Purpose  : URL-friendly strings
Use Case : Voice names, file names
Location : utils/
```

```typescript
import slugify from 'slugify';
const slug = slugify('My Voice Name', { lower: true }); // 'my-voice-name'
```

---

## 🌐 HTTP & ERRORS

### axios

```
Purpose  : HTTP client
Use Case : External API calls
Location : modules/*/services/
```

```typescript
import axios from 'axios';
const response = await axios.get('https://api.example.com/data');
const data = response.data;
```

### http-errors

```
Purpose  : HTTP error creation
Use Case : Consistent error responses
Location : utils/, middlewares/
```

```typescript
import createError from 'http-errors';

// 404 error
throw createError(404, 'User not found');

// 400 error
throw createError(400, 'Invalid input');

// 401 error
throw createError(401, 'Unauthorized');
```

### cookie-parser

```
Purpose  : Cookie parsing
Use Case : Refresh token from cookies
Location : middlewares/
```

```typescript
import cookieParser from 'cookie-parser';
app.use(cookieParser());

// Read cookie
const refreshToken = req.cookies.refreshToken;

// Set cookie
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

---

## 🔧 DEV DEPENDENCIES

| Package          | Purpose                         |
| ---------------- | ------------------------------- |
| `typescript`     | TypeScript compiler             |
| `@types/node`    | Node.js type definitions        |
| `@types/express` | Express type definitions        |
| `@types/*`       | Other type definitions          |
| `ts-node`        | TypeScript execution            |
| `tsx`            | Fast TypeScript execution (dev) |
| `nodemon`        | Auto-restart on file changes    |
| `rimraf`         | Cross-platform rm -rf           |
| `prisma`         | Prisma CLI tools                |

---

## 📊 Package Summary

| Category    | Packages | Purpose             |
| ----------- | -------- | ------------------- |
| Core        | 6        | Server framework    |
| Database    | 2        | PostgreSQL + ORM    |
| Cache/Queue | 2        | Redis + Jobs        |
| Auth        | 4        | JWT + OAuth         |
| Security    | 4        | Rate limit + XSS    |
| AWS         | 3        | S3 storage          |
| AI/Voice    | 2        | OpenAI + ElevenLabs |
| Validation  | 1        | Zod schemas         |
| Files       | 2        | Upload handling     |
| Logging     | 2        | Winston logger      |
| Utilities   | 4        | Helpers             |
| HTTP        | 3        | Axios + errors      |
| **Total**   | **35**   | Production deps     |
| Dev         | 15+      | TypeScript + tools  |
