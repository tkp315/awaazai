# AwaazAI Development Plan

## Overview

This document outlines the development strategy for AwaazAI - a Personalized AI Assistant platform combining voice cloning with intelligent bot training.

**Development Approach:** B2C First, then B2B

---

## Tech Stack

| Layer                   | Technology                     |
| ----------------------- | ------------------------------ |
| **Mobile App**          | React Native / Expo            |
| **Web App**             | React.js / Next.js             |
| **Backend**             | Node.js + Express/Fastify      |
| **Database (Primary)**  | PostgreSQL (Prisma ORM)        |
| **Database (Messages)** | MongoDB                        |
| **Voice Cloning**       | ElevenLabs API                 |
| **AI/LLM**              | OpenAI / Anthropic             |
| **Payments**            | Razorpay                       |
| **Push Notifications**  | Firebase Cloud Messaging (FCM) |
| **File Storage**        | AWS S3 / Cloudflare R2         |
| **Hosting**             | AWS / Vercel / Railway         |

---

## Development Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                 MODULE DEVELOPMENT CYCLE                    │
└─────────────────────────────────────────────────────────────┘

  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │   BACKEND    │───▶│   POSTMAN    │───▶│   FRONTEND   │
  │  Development │    │   Testing    │    │  Development │
  └──────────────┘    └──────────────┘    └──────────────┘
         │                   │                    │
         │                   │                    │
         ▼                   ▼                    ▼
  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
  │  Write APIs  │    │ Test & Save  │    │  Web: Test   │
  │  + Prisma    │    │  Examples    │    │  on Staging  │
  │  Migrations  │    │  + Export    │    │              │
  └──────────────┘    └──────────────┘    │  Mobile: Dev │
                                          │    Build     │
                                          └──────────────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │   END-TO-END │
                                          │    Testing   │
                                          │  + Bug Fix   │
                                          └──────────────┘
                                                 │
                                                 ▼
                                          ┌──────────────┐
                                          │ NEXT MODULE  │
                                          └──────────────┘
```

---

## Environment Setup

| Environment         | Purpose      | API URL                        | Frontend URL               |
| ------------------- | ------------ | ------------------------------ | -------------------------- |
| **Development**     | Local coding | `http://localhost:4000`        | `http://localhost:3000`    |
| **Testing/Staging** | QA testing   | `https://api-test.awaazai.com` | `https://test.awaazai.com` |
| **Production**      | Live users   | `https://api.awaazai.com`      | `https://awaazai.com`      |

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/awaazai
MONGODB_URL=mongodb://localhost:27017/awaazai

# Auth
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
OTP_EXPIRY_MINUTES=10

# External Services
ELEVENLABS_API_KEY=your-elevenlabs-key
OPENAI_API_KEY=your-openai-key
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_SECRET=your-razorpay-secret

# AWS S3
AWS_ACCESS_KEY=your-aws-key
AWS_SECRET_KEY=your-aws-secret
AWS_BUCKET_NAME=awaazai-files

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
```

---

## B2C Development Phases

### Phase 1: Foundation (Auth + Profile)

**Duration:** Week 1-2

| Module          | Backend APIs                                         | Frontend Screens                        |
| --------------- | ---------------------------------------------------- | --------------------------------------- |
| **Auth**        | signup, login, OTP, refresh, logout, forgot-password | Splash, Login, Signup, OTP Verification |
| **Profile**     | create, update, get, delete                          | Onboarding, Profile Setup               |
| **Preferences** | create, update, get                                  | Preferences Setup                       |

**APIs:**

```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/verify-otp
POST   /api/v1/auth/resend-otp
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/logout
POST   /api/v1/auth/forgot-password
POST   /api/v1/auth/reset-password

GET    /api/v1/profile
POST   /api/v1/profile
PUT    /api/v1/profile
DELETE /api/v1/profile

GET    /api/v1/preferences
POST   /api/v1/preferences
PUT    /api/v1/preferences
```

---

### Phase 2: Bot & Voice Module

**Duration:** Week 3-4

| Module       | Backend APIs                              | Frontend Screens              |
| ------------ | ----------------------------------------- | ----------------------------- |
| **Bot**      | create, list, get, update, delete         | Bot List, Create Bot          |
| **Voice**    | upload sample, get samples, delete, train | Voice Upload, Training Status |
| **Training** | start, status, history                    | Training Progress             |

**APIs:**

```
POST   /api/v1/bots
GET    /api/v1/bots
GET    /api/v1/bots/:id
PUT    /api/v1/bots/:id
DELETE /api/v1/bots/:id

POST   /api/v1/bots/:id/voices
GET    /api/v1/bots/:id/voices
DELETE /api/v1/bots/:id/voices/:voiceId

POST   /api/v1/bots/:id/voices/:voiceId/samples
GET    /api/v1/bots/:id/voices/:voiceId/samples
DELETE /api/v1/bots/:id/voices/:voiceId/samples/:sampleId

POST   /api/v1/bots/:id/train
GET    /api/v1/bots/:id/training-status
GET    /api/v1/bots/:id/training-history
```

---

### Phase 3: Chat Module

**Duration:** Week 5-6

| Module      | Backend APIs              | Frontend Screens       |
| ----------- | ------------------------- | ---------------------- |
| **Chat**    | create, list, get, delete | Chat List, Chat Screen |
| **Session** | create, end, list         | Session Management     |
| **Message** | send, receive, history    | Real-time Chat         |

**APIs:**

```
POST   /api/v1/chats
GET    /api/v1/chats
GET    /api/v1/chats/:id
DELETE /api/v1/chats/:id

POST   /api/v1/chats/:id/sessions
GET    /api/v1/chats/:id/sessions
PUT    /api/v1/chats/:id/sessions/:sessionId/end

POST   /api/v1/chats/:id/messages
GET    /api/v1/chats/:id/messages
```

**WebSocket Events:**

```
connect    → Join chat room
message    → Send/receive message
typing     → Typing indicator
disconnect → Leave chat room
```

---

### Phase 4: Subscription & Payments

**Duration:** Week 7-8

| Module           | Backend APIs                  | Frontend Screens        |
| ---------------- | ----------------------------- | ----------------------- |
| **Plans**        | list plans, get plan details  | Plan Selection          |
| **Subscription** | subscribe, cancel, status     | Subscription Management |
| **Payment**      | create order, verify, history | Payment Flow            |
| **Invoice**      | list, download                | Invoice History         |

**APIs:**

```
GET    /api/v1/plans
GET    /api/v1/plans/:id

POST   /api/v1/subscriptions
GET    /api/v1/subscriptions/current
PUT    /api/v1/subscriptions/cancel
GET    /api/v1/subscriptions/history

POST   /api/v1/payments/create-order
POST   /api/v1/payments/verify
GET    /api/v1/payments/history

GET    /api/v1/invoices
GET    /api/v1/invoices/:id/download
```

**Razorpay Webhooks:**

```
POST   /api/v1/webhooks/razorpay
```

---

### Phase 5: Notifications & Support

**Duration:** Week 9-10

| Module            | Backend APIs                     | Frontend Screens    |
| ----------------- | -------------------------------- | ------------------- |
| **Notifications** | register device, list, mark read | Notification Center |
| **Support**       | create ticket, list, reply       | Help & Support      |
| **Feedback**      | submit feedback                  | Feedback Form       |

**APIs:**

```
POST   /api/v1/devices/register
DELETE /api/v1/devices/:id

GET    /api/v1/notifications
PUT    /api/v1/notifications/:id/read
PUT    /api/v1/notifications/read-all

POST   /api/v1/support/tickets
GET    /api/v1/support/tickets
GET    /api/v1/support/tickets/:id
POST   /api/v1/support/tickets/:id/reply

POST   /api/v1/feedback
```

---

## Testing Strategy

### 1. Postman Testing

```
AwaazAI API Collection/
├── Auth/
│   ├── Signup
│   ├── Login
│   ├── Verify OTP
│   └── ...
├── Profile/
│   ├── Get Profile
│   ├── Update Profile
│   └── ...
├── Bots/
│   └── ...
└── ...
```

**Best Practices:**

- Save example responses
- Use environment variables for tokens
- Create test scripts for validation
- Export collection for backup

### 2. Frontend Testing

| Platform           | Testing Method                                |
| ------------------ | --------------------------------------------- |
| **Web**            | Staging website (`test.awaazai.com`)          |
| **Mobile**         | Expo Development Build                        |
| **Mobile (Later)** | TestFlight (iOS) / Internal Testing (Android) |

### 3. End-to-End Testing

After each module:

1. Test complete user flow
2. Test edge cases
3. Test error scenarios
4. Fix bugs before next module

---

## Folder Structure

### Backend

```
apps/server/
├── prisma/
│   ├── schema/           # Multi-file Prisma schema
│   │   ├── base.prisma
│   │   ├── enums.prisma
│   │   ├── auth.prisma
│   │   ├── bot.prisma
│   │   └── ...
│   └── migrations/
├── src/
│   ├── config/           # Environment, database config
│   ├── modules/          # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.validation.ts
│   │   │   └── auth.types.ts
│   │   ├── profile/
│   │   ├── bot/
│   │   └── ...
│   ├── middlewares/      # Auth, error handling, etc.
│   ├── utils/            # Helpers, constants
│   ├── generated/        # Prisma client
│   └── app.ts            # Express/Fastify setup
├── tests/
└── package.json
```

### Frontend (Mobile)

```
apps/client/mob/
├── app/                  # Expo Router pages
│   ├── (auth)/           # Auth screens
│   ├── (tabs)/           # Main tabs
│   ├── (routes)/         # Feature routes
│   └── _layout.tsx
├── src/
│   ├── components/       # Reusable components
│   ├── hooks/            # Custom hooks
│   ├── services/         # API services
│   ├── stores/           # State management
│   ├── utils/            # Helpers
│   └── types/            # TypeScript types
└── package.json
```

---

## Git Workflow

### Branches

```
main              → Production ready code
├── develop       → Development branch
├── feature/*     → New features
├── bugfix/*      → Bug fixes
└── hotfix/*      → Urgent production fixes
```

### Commit Convention

```
feat: Add user authentication
fix: Fix OTP expiry issue
docs: Update API documentation
refactor: Restructure auth module
test: Add auth unit tests
chore: Update dependencies
```

### PR Process

1. Create feature branch from `develop`
2. Write code + tests
3. Create PR to `develop`
4. Review + merge
5. After testing, merge `develop` to `main`

---

## Timeline Overview

| Week | Backend                 | Frontend                  | Milestone                 |
| ---- | ----------------------- | ------------------------- | ------------------------- |
| 1-2  | Auth + Profile APIs     | Auth + Onboarding Screens | User can signup/login     |
| 3-4  | Bot + Voice APIs        | Bot Creation Flow         | User can create voice bot |
| 5-6  | Chat APIs + WebSocket   | Chat UI                   | User can chat with bot    |
| 7-8  | Subscription + Payment  | Payment Flow              | User can subscribe        |
| 9-10 | Notifications + Support | Notification UI           | Full B2C MVP              |

---

## Success Metrics

| Metric              | Target      |
| ------------------- | ----------- |
| API Response Time   | < 200ms     |
| App Load Time       | < 3 seconds |
| Voice Training Time | < 5 minutes |
| Chat Response Time  | < 2 seconds |
| Crash Rate          | < 1%        |

---

## Next Steps

1. [ ] Setup backend project structure
2. [ ] Configure Prisma + PostgreSQL
3. [ ] Implement Auth module
4. [ ] Test with Postman
5. [ ] Build frontend auth screens
6. [ ] End-to-end testing
7. [ ] Move to next module

---

## References

- [Product Vision](./PRODUCT-VISION.md)
- [Actors](./ACTORS.md)
- [Actor Lifecycles](./ACTOR-LIFECYCLES.md)
- [Database Schema](./DATABASE-SCHEMA.md)

---

_Last Updated: February 2026_
