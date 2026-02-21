# AwaazAI Business Model Documentation

Ye document B2C aur B2B dono models ka complete reference hai. Jab implement karna ho tab ye doc follow karna.

---

## 📊 Platform Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AWAAZAI PLATFORM                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   "Har awaaz mein ek connection hai"                                    │
│                                                                         │
│   ┌───────────────────────┐       ┌───────────────────────┐            │
│   │                       │       │                       │            │
│   │      B2C MODEL        │       │      B2B MODEL        │            │
│   │    (Personal Use)     │       │   (Business Use)      │            │
│   │                       │       │                       │            │
│   │  👤 Individual Users  │       │  🏢 Organizations     │            │
│   │  💔 Lonely People     │       │  💼 Enterprises       │            │
│   │  🎙️ Clone loved ones  │       │  🎙️ Clone brand voice │            │
│   │  💬 Personal chats    │       │  📞 Meetings & Calls  │            │
│   │                       │       │                       │            │
│   └───────────────────────┘       └───────────────────────┘            │
│                                                                         │
│                    ┌─────────────────────┐                              │
│                    │    SHARED CORE      │                              │
│                    │  ─────────────────  │                              │
│                    │  • Voice Cloning    │                              │
│                    │  • AI Chat (GPT-4)  │                              │
│                    │  • TTS (ElevenLabs) │                              │
│                    │  • STT (Whisper)    │                              │
│                    │  • S3 Storage       │                              │
│                    │  • Redis Cache      │                              │
│                    └─────────────────────┘                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 B2C MODEL (Personal Use)

### Target Audience

| Segment                         | Description                  | Pain Point                       |
| ------------------------------- | ---------------------------- | -------------------------------- |
| **Lonely Individuals**          | Log jo akele feel karte hain | Emotional connection ki zaroorat |
| **Grieving People**             | Jinke loved ones nahi rahe   | Unki awaaz sunna chahte hain     |
| **Long Distance Relationships** | Couples/Family door hain     | Voice se connected rehna         |
| **Nostalgia Seekers**           | Purani memories preserve     | Grandparents, parents ki awaaz   |
| **Companionship Seekers**       | Daily conversation partner   | AI companion with familiar voice |

### Features

```
┌─────────────────────────────────────────────────────────────┐
│                    B2C FEATURES                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📱 MOBILE APP                                              │
│  ────────────                                               │
│  • Simple onboarding                                        │
│  • Voice sample upload (30 sec - 3 min)                     │
│  • Voice cloning (background job)                           │
│  • Chat interface (text + voice)                            │
│  • Voice message playback                                   │
│  • Push notifications                                       │
│                                                             │
│  🎙️ VOICE CLONING                                           │
│  ────────────────                                           │
│  • Upload audio samples                                     │
│  • Clone loved one's voice                                  │
│  • Multiple voices (based on plan)                          │
│  • Voice quality settings                                   │
│                                                             │
│  💬 AI CHAT                                                 │
│  ──────────                                                 │
│  • Text input → Voice response                              │
│  • Voice input → Voice response                             │
│  • Personality customization                                │
│  • Memory (remembers conversations)                         │
│  • Emotional responses                                      │
│                                                             │
│  🔒 PRIVACY                                                 │
│  ──────────                                                 │
│  • End-to-end encryption                                    │
│  • Voice data protection                                    │
│  • Delete anytime                                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### User Journey

```
1. ONBOARDING
   ↓
   Download App → Sign up (Google) → Tutorial

2. VOICE CREATION
   ↓
   Upload Audio (30s-3min) → Processing (2-5 min) → Voice Ready

3. DAILY USE
   ↓
   Open Chat → Type/Speak → AI responds in cloned voice

4. EMOTIONAL CONNECTION
   ↓
   Feel connected → Daily conversations → Retention
```

### Pricing (B2C)

| Plan         | Price          | Features                                                    |
| ------------ | -------------- | ----------------------------------------------------------- |
| **Free**     | ₹0/month       | 1 voice, 10 msgs/day, basic quality                         |
| **Basic**    | ₹199/month     | 2 voices, 50 msgs/day, HD quality                           |
| **Pro**      | ₹499/month     | 5 voices, unlimited msgs, premium quality, priority support |
| **Lifetime** | ₹4999 one-time | Everything in Pro, forever                                  |

---

## 🏢 B2B MODEL (Business Use)

### Target Audience

| Segment                | Description        | Use Case                            |
| ---------------------- | ------------------ | ----------------------------------- |
| **Startups**           | Small teams        | Meeting assistant, customer support |
| **SMBs**               | Medium businesses  | Sales calls, training               |
| **Enterprises**        | Large corporations | Brand voice, global support         |
| **Call Centers**       | Support teams      | AI agents with human voice          |
| **Sales Teams**        | Outbound sales     | AI sales reps                       |
| **Training Companies** | L&D teams          | Consistent training voice           |

### Features

```
┌─────────────────────────────────────────────────────────────┐
│                    B2B FEATURES                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏢 ORGANIZATION MANAGEMENT                                 │
│  ──────────────────────────                                 │
│  • Create organization                                      │
│  • Invite team members                                      │
│  • Role-based access (Owner, Admin, Member)                 │
│  • Team creation                                            │
│  • Centralized billing                                      │
│                                                             │
│  🎙️ SHARED VOICES                                           │
│  ─────────────────                                          │
│  • Organization-level voice cloning                         │
│  • CEO/Founder voice clone                                  │
│  • Brand voice creation                                     │
│  • Multiple voices per org                                  │
│  • Voice access control                                     │
│                                                             │
│  📞 MEETING INTEGRATION                                     │
│  ──────────────────────                                     │
│  • Zoom integration                                         │
│  • Google Meet integration                                  │
│  • Microsoft Teams integration                              │
│  • AI participant joins meeting                             │
│  • Real-time voice conversation                             │
│  • Meeting transcription                                    │
│  • Meeting summary (AI generated)                           │
│  • Action items extraction                                  │
│                                                             │
│  📅 CALENDAR INTEGRATION                                    │
│  ───────────────────────                                    │
│  • Google Calendar sync                                     │
│  • Auto-join scheduled meetings                             │
│  • Meeting reminders                                        │
│                                                             │
│  📊 ANALYTICS DASHBOARD                                     │
│  ────────────────────────                                   │
│  • Usage statistics                                         │
│  • Meeting minutes saved                                    │
│  • Voice usage per member                                   │
│  • Cost tracking                                            │
│  • Export reports                                           │
│                                                             │
│  🔌 API ACCESS                                              │
│  ─────────────                                              │
│  • REST API                                                 │
│  • Webhook support                                          │
│  • Custom integrations                                      │
│  • SDKs (Node, Python)                                      │
│                                                             │
│  💼 ENTERPRISE FEATURES                                     │
│  ─────────────────────                                      │
│  • SSO (SAML, OIDC)                                         │
│  • Custom contracts                                         │
│  • Dedicated support                                        │
│  • SLA guarantees                                           │
│  • On-premise option                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### B2B Use Cases (Detailed)

#### 1. Meeting Assistant

```
┌─────────────────────────────────────────────────────────────┐
│  USE CASE: Meeting Assistant                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Scenario: CEO ki meeting hai but wo busy hai               │
│                                                             │
│  Flow:                                                      │
│  1. Schedule meeting in calendar                            │
│  2. Assign AI participant with CEO's cloned voice           │
│  3. AI joins meeting automatically                          │
│  4. AI listens, takes notes, responds when needed           │
│  5. After meeting: transcript + summary + action items      │
│                                                             │
│  Value: CEO ka time save, meeting still happens             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Customer Support

```
┌─────────────────────────────────────────────────────────────┐
│  USE CASE: AI Customer Support                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Scenario: 24/7 customer support with consistent voice      │
│                                                             │
│  Flow:                                                      │
│  1. Clone brand voice (professional, friendly)              │
│  2. Train AI on FAQs, product info                          │
│  3. Customer calls → AI answers in brand voice              │
│  4. Complex queries → escalate to human                     │
│                                                             │
│  Value: 24/7 availability, consistent experience            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 3. Sales Calls

```
┌─────────────────────────────────────────────────────────────┐
│  USE CASE: AI Sales Representative                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Scenario: Initial sales outreach at scale                  │
│                                                             │
│  Flow:                                                      │
│  1. Clone top salesperson's voice                           │
│  2. AI makes outbound calls                                 │
│  3. Qualifies leads, books meetings                         │
│  4. Hot leads → human salesperson takes over                │
│                                                             │
│  Value: Scale outreach, qualify leads automatically         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 4. Training & Onboarding

```
┌─────────────────────────────────────────────────────────────┐
│  USE CASE: Employee Training                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Scenario: Consistent training for all new employees        │
│                                                             │
│  Flow:                                                      │
│  1. Clone founder/trainer's voice                           │
│  2. Create training modules with AI voice                   │
│  3. New employees interact with AI trainer                  │
│  4. Q&A sessions with AI                                    │
│                                                             │
│  Value: Scalable training, founder's vision preserved       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Pricing (B2B)

| Plan             | Price         | Features                                                          |
| ---------------- | ------------- | ----------------------------------------------------------------- |
| **Starter**      | ₹4,999/month  | 5 users, 3 voices, 10 meetings/month, basic analytics             |
| **Professional** | ₹14,999/month | 20 users, 10 voices, 50 meetings/month, full analytics, API       |
| **Business**     | ₹49,999/month | 100 users, unlimited voices, unlimited meetings, priority support |
| **Enterprise**   | Custom        | Unlimited everything, SSO, SLA, dedicated support, on-premise     |

### Per-Usage Pricing (Optional Add-on)

| Resource               | Price                  |
| ---------------------- | ---------------------- |
| Additional voice clone | ₹999/voice/month       |
| Extra meeting minutes  | ₹5/minute              |
| API calls              | ₹0.10/call after limit |
| Storage                | ₹50/GB/month           |

---

## 🗄️ Database Schema

### Complete Prisma Schema

```prisma
// =====================================
// ENUMS
// =====================================

enum UserType {
  PERSONAL      // B2C user
  BUSINESS      // B2B user (part of org)
}

enum VoiceStatus {
  PENDING
  PROCESSING
  READY
  FAILED
}

enum VoiceOwnerType {
  USER          // Personal voice (B2C)
  ORGANIZATION  // Org voice (B2B)
}

enum OrgRole {
  OWNER
  ADMIN
  MEMBER
}

enum MeetingPlatform {
  ZOOM
  GOOGLE_MEET
  TEAMS
  CUSTOM
}

enum MeetingStatus {
  SCHEDULED
  JOINING
  LIVE
  ENDED
  CANCELLED
  FAILED
}

enum PlanType {
  // B2C Plans
  FREE
  PERSONAL_BASIC
  PERSONAL_PRO
  PERSONAL_LIFETIME

  // B2B Plans
  BUSINESS_STARTER
  BUSINESS_PRO
  BUSINESS_ENTERPRISE
}

enum PlanCategory {
  B2C
  B2B
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  PAST_DUE
  TRIALING
  PAUSED
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

// =====================================
// USER & AUTH
// =====================================

model User {
  id                String    @id @default(uuid())
  email             String    @unique
  name              String
  googleId          String?   @unique
  avatar            String?
  phone             String?
  userType          UserType  @default(PERSONAL)

  // Timestamps
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  lastLoginAt       DateTime?

  // Relations - B2C
  personalVoices    Voice[]   @relation("UserVoices")
  chats             Chat[]
  messages          Message[]
  subscription      Subscription? @relation("UserSubscription")

  // Relations - B2B
  ownedOrgs         Organization[] @relation("OrgOwner")
  orgMemberships    OrgMember[]

  // Relations - Common
  payments          Payment[]
  usageLogs         UsageLog[]

  @@index([email])
  @@index([googleId])
}

model RefreshToken {
  id                String    @id @default(uuid())
  token             String    @unique
  userId            String
  expiresAt         DateTime
  createdAt         DateTime  @default(now())

  @@index([userId])
  @@index([token])
}

// =====================================
// VOICE
// =====================================

model Voice {
  id                String          @id @default(uuid())
  name              String
  description       String?
  elevenLabsVoiceId String?

  // Audio samples
  sampleUrls        String[]        // S3 URLs

  // Status
  status            VoiceStatus     @default(PENDING)
  errorMessage      String?

  // Owner - polymorphic (User OR Organization)
  ownerType         VoiceOwnerType
  userId            String?
  user              User?           @relation("UserVoices", fields: [userId], references: [id])
  orgId             String?
  organization      Organization?   @relation(fields: [orgId], references: [id])

  // Settings
  stability         Float           @default(0.5)
  similarityBoost   Float           @default(0.75)
  style             Float           @default(0.0)

  // Relations
  chats             Chat[]
  meetings          Meeting[]

  // Timestamps
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  @@index([userId])
  @@index([orgId])
  @@index([status])
}

// =====================================
// CHAT & MESSAGES (B2C primarily)
// =====================================

model Chat {
  id                String    @id @default(uuid())
  title             String?

  // Owner
  userId            String
  user              User      @relation(fields: [userId], references: [id])

  // Voice used in this chat
  voiceId           String
  voice             Voice     @relation(fields: [voiceId], references: [id])

  // AI Personality settings
  personality       Json?     // { name, traits, backstory, etc. }

  // Relations
  messages          Message[]

  // Timestamps
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  lastMessageAt     DateTime?

  @@index([userId])
  @@index([voiceId])
}

model Message {
  id                String    @id @default(uuid())

  // Content
  content           String    // Text content
  audioUrl          String?   // S3 URL for voice message

  // Sender
  role              String    // "user" or "assistant"

  // Relations
  chatId            String
  chat              Chat      @relation(fields: [chatId], references: [id], onDelete: Cascade)
  userId            String
  user              User      @relation(fields: [userId], references: [id])

  // Timestamps
  createdAt         DateTime  @default(now())

  @@index([chatId])
  @@index([userId])
}

// =====================================
// ORGANIZATION (B2B)
// =====================================

model Organization {
  id                String    @id @default(uuid())
  name              String
  slug              String    @unique
  logo              String?
  website           String?
  industry          String?
  size              String?   // "1-10", "11-50", "51-200", "201-500", "500+"

  // Owner
  ownerId           String
  owner             User      @relation("OrgOwner", fields: [ownerId], references: [id])

  // Billing
  stripeCustomerId  String?

  // Relations
  members           OrgMember[]
  teams             Team[]
  voices            Voice[]
  meetings          Meeting[]
  subscription      Subscription? @relation("OrgSubscription")
  usageLogs         UsageLog[]

  // Settings
  settings          Json?     // { timezone, notifications, etc. }

  // Timestamps
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@index([slug])
  @@index([ownerId])
}

model OrgMember {
  id                String    @id @default(uuid())
  role              OrgRole   @default(MEMBER)

  // Relations
  userId            String
  user              User      @relation(fields: [userId], references: [id])
  orgId             String
  organization      Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  teamId            String?
  team              Team?     @relation(fields: [teamId], references: [id])

  // Permissions (optional granular control)
  permissions       String[]  // ["voice:create", "meeting:join", etc.]

  // Timestamps
  joinedAt          DateTime  @default(now())

  @@unique([userId, orgId])
  @@index([orgId])
}

model Team {
  id                String    @id @default(uuid())
  name              String
  description       String?

  // Relations
  orgId             String
  organization      Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  members           OrgMember[]

  // Timestamps
  createdAt         DateTime  @default(now())

  @@index([orgId])
}

model OrgInvite {
  id                String    @id @default(uuid())
  email             String
  role              OrgRole   @default(MEMBER)
  token             String    @unique

  // Relations
  orgId             String

  // Timestamps
  createdAt         DateTime  @default(now())
  expiresAt         DateTime
  acceptedAt        DateTime?

  @@index([token])
  @@index([orgId])
}

// =====================================
// MEETINGS (B2B)
// =====================================

model Meeting {
  id                String          @id @default(uuid())
  title             String
  description       String?

  // Platform
  platform          MeetingPlatform
  externalMeetingId String?         // Zoom/Meet meeting ID
  joinUrl           String?
  hostUrl           String?

  // Schedule
  scheduledAt       DateTime?
  startedAt         DateTime?
  endedAt           DateTime?
  duration          Int?            // in minutes

  // Status
  status            MeetingStatus   @default(SCHEDULED)

  // AI Settings
  voiceId           String?
  voice             Voice?          @relation(fields: [voiceId], references: [id])
  aiEnabled         Boolean         @default(true)
  aiInstructions    String?         // Custom instructions for AI

  // Results
  transcript        String?         @db.Text
  summary           String?         @db.Text
  actionItems       Json?           // [{ task, assignee, dueDate }]

  // Relations
  orgId             String
  organization      Organization    @relation(fields: [orgId], references: [id])
  participants      MeetingParticipant[]

  // Timestamps
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  @@index([orgId])
  @@index([status])
  @@index([scheduledAt])
}

model MeetingParticipant {
  id                String    @id @default(uuid())
  name              String
  email             String?
  isAI              Boolean   @default(false)

  // Relations
  meetingId         String
  meeting           Meeting   @relation(fields: [meetingId], references: [id], onDelete: Cascade)

  // Timestamps
  joinedAt          DateTime?
  leftAt            DateTime?

  @@index([meetingId])
}

// =====================================
// BILLING & SUBSCRIPTION
// =====================================

model Plan {
  id                String        @id @default(uuid())
  name              String
  slug              String        @unique
  type              PlanType
  category          PlanCategory

  // Pricing
  priceMonthly      Int           // in paise (INR)
  priceYearly       Int?
  stripePriceId     String?

  // Limits
  maxVoices         Int
  maxMessagesPerDay Int?          // null = unlimited
  maxMeetingsPerMonth Int?
  maxTeamMembers    Int?

  // Features
  features          String[]

  // Status
  isActive          Boolean       @default(true)

  // Timestamps
  createdAt         DateTime      @default(now())

  @@index([type])
  @@index([category])
}

model Subscription {
  id                String              @id @default(uuid())
  stripeSubId       String?             @unique
  status            SubscriptionStatus  @default(ACTIVE)

  // Plan
  planId            String

  // Owner - User (B2C) OR Organization (B2B)
  userId            String?             @unique
  user              User?               @relation("UserSubscription", fields: [userId], references: [id])
  orgId             String?             @unique
  organization      Organization?       @relation("OrgSubscription", fields: [orgId], references: [id])

  // Billing cycle
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAtPeriodEnd  Boolean            @default(false)

  // Trial
  trialStart        DateTime?
  trialEnd          DateTime?

  // Timestamps
  createdAt         DateTime            @default(now())
  updatedAt         DateTime            @updatedAt

  @@index([status])
}

model Payment {
  id                String        @id @default(uuid())
  stripePaymentId   String?       @unique
  amount            Int           // in paise
  currency          String        @default("INR")
  status            PaymentStatus @default(PENDING)

  // Payer
  userId            String
  user              User          @relation(fields: [userId], references: [id])

  // Details
  description       String?
  metadata          Json?

  // Timestamps
  createdAt         DateTime      @default(now())
  paidAt            DateTime?

  @@index([userId])
  @@index([status])
}

// =====================================
// ANALYTICS & USAGE
// =====================================

model UsageLog {
  id                String    @id @default(uuid())

  // Action
  action            String    // "voice_clone", "message_sent", "meeting_joined", etc.
  resourceType      String?   // "voice", "chat", "meeting"
  resourceId        String?

  // Metrics
  tokensUsed        Int?      // AI tokens
  durationSeconds   Int?      // For voice/meeting

  // Actor
  userId            String?
  user              User?     @relation(fields: [userId], references: [id])
  orgId             String?
  organization      Organization? @relation(fields: [orgId], references: [id])

  // Metadata
  metadata          Json?

  // Timestamp
  createdAt         DateTime  @default(now())

  @@index([action])
  @@index([userId])
  @@index([orgId])
  @@index([createdAt])
}
```

---

## 🔗 API Endpoints

### B2C Endpoints

```
AUTH
────
POST   /api/auth/google              Google OAuth login
POST   /api/auth/refresh             Refresh access token
POST   /api/auth/logout              Logout

USER
────
GET    /api/user/me                  Get current user
PATCH  /api/user/me                  Update profile
DELETE /api/user/me                  Delete account

VOICE
─────
GET    /api/voices                   List my voices
POST   /api/voices                   Create/clone voice
GET    /api/voices/:id               Get voice details
PATCH  /api/voices/:id               Update voice
DELETE /api/voices/:id               Delete voice

CHAT
────
GET    /api/chats                    List my chats
POST   /api/chats                    Create new chat
GET    /api/chats/:id                Get chat with messages
DELETE /api/chats/:id                Delete chat

MESSAGE
───────
POST   /api/chats/:chatId/messages   Send message
GET    /api/chats/:chatId/messages   Get messages (paginated)

SUBSCRIPTION (B2C)
──────────────────
GET    /api/subscription             Get my subscription
POST   /api/subscription/checkout    Create checkout session
POST   /api/subscription/portal      Create billing portal
```

### B2B Endpoints

```
ORGANIZATION
────────────
POST   /api/orgs                     Create organization
GET    /api/orgs/:orgId              Get org details
PATCH  /api/orgs/:orgId              Update org
DELETE /api/orgs/:orgId              Delete org

TEAM
────
GET    /api/orgs/:orgId/teams        List teams
POST   /api/orgs/:orgId/teams        Create team
PATCH  /api/orgs/:orgId/teams/:id    Update team
DELETE /api/orgs/:orgId/teams/:id    Delete team

MEMBERS
───────
GET    /api/orgs/:orgId/members      List members
POST   /api/orgs/:orgId/invites      Invite member
PATCH  /api/orgs/:orgId/members/:id  Update member role
DELETE /api/orgs/:orgId/members/:id  Remove member

ORG VOICES
──────────
GET    /api/orgs/:orgId/voices       List org voices
POST   /api/orgs/:orgId/voices       Create org voice
PATCH  /api/orgs/:orgId/voices/:id   Update voice
DELETE /api/orgs/:orgId/voices/:id   Delete voice

MEETINGS
────────
GET    /api/orgs/:orgId/meetings     List meetings
POST   /api/orgs/:orgId/meetings     Schedule meeting
GET    /api/orgs/:orgId/meetings/:id Get meeting details
PATCH  /api/orgs/:orgId/meetings/:id Update meeting
DELETE /api/orgs/:orgId/meetings/:id Cancel meeting
POST   /api/orgs/:orgId/meetings/:id/join   Join meeting (AI)

ANALYTICS
─────────
GET    /api/orgs/:orgId/analytics/usage     Usage stats
GET    /api/orgs/:orgId/analytics/reports   Generate report

BILLING (B2B)
─────────────
GET    /api/orgs/:orgId/billing              Get billing info
POST   /api/orgs/:orgId/billing/checkout     Create checkout
POST   /api/orgs/:orgId/billing/portal       Billing portal
```

---

## 📱 Mobile App Screens

### B2C Screens

```
1. Onboarding
   - Splash → Login → Tutorial → Home

2. Home
   - Voice cards → Chat list → Quick actions

3. Voice
   - Create voice → Upload samples → Processing → Ready

4. Chat
   - Chat list → Chat detail → Voice/Text input

5. Settings
   - Profile → Subscription → Privacy → Help
```

### B2B Screens (Add-on)

```
1. Organization
   - Org switcher → Org settings → Team management

2. Meetings
   - Meeting list → Schedule → Join → Summary

3. Analytics
   - Dashboard → Reports → Export
```

---

## 🚀 Implementation Phases

### Phase 1: MVP (Week 1-3)

```
✅ Core Setup
   - Project structure
   - Database setup
   - Auth (Google OAuth)
   - Basic API

✅ Voice Cloning
   - Upload audio
   - ElevenLabs integration
   - Voice management

✅ Chat
   - Create chat
   - Send message
   - GPT-4 response
   - TTS response
```

### Phase 2: B2C Complete (Week 4-5)

```
✅ Mobile App
   - All B2C screens
   - Voice recording
   - Chat UI

✅ Subscription
   - Stripe integration
   - Plans
   - Payment flow
```

### Phase 3: B2B Foundation (Week 6-7)

```
✅ Organization
   - Org CRUD
   - Member management
   - Team structure

✅ Org Voices
   - Shared voice cloning
   - Access control
```

### Phase 4: Meetings (Week 8-10)

```
✅ Meeting Integration
   - Zoom API
   - Google Meet API
   - AI participant

✅ Meeting Features
   - Join meeting
   - Transcription
   - Summary
```

### Phase 5: Polish (Week 11-12)

```
✅ Analytics
   - Usage tracking
   - Reports

✅ Enterprise
   - API access
   - Webhooks
   - SSO (future)
```

---

## 📞 Support Contacts

- **Technical Issues**: tech@awaazai.com
- **Sales (B2B)**: sales@awaazai.com
- **Support**: support@awaazai.com

---

## 📝 Notes

1. **Privacy First**: Voice data is sensitive - encrypt everything
2. **Consent Required**: Get explicit consent before cloning anyone's voice
3. **Ethical Use**: Prevent misuse (deepfakes, fraud)
4. **Compliance**: GDPR, data protection laws
5. **Scalability**: Design for 100x growth from day 1

---

_Last Updated: February 2026_
_Version: 1.0_
