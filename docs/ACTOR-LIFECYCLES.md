# AwaazAI Actor Lifecycles

## Overview

This document defines the lifecycle (states & transitions) for each actor in the system.

---

## B2C Actors

### 1. Guest User

**Platform:** Mobile App

**Description:** Non-registered user exploring the app with limited trial.

**Lifecycle Diagram:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌────────────┐
│ ENTERED  │────▶│  ACTIVE  │────▶│TRIAL_USED│────▶│  DECISION  │
│(download)│     │(browsing)│     │(1 chat)  │     │            │
└──────────┘     └──────────┘     └──────────┘     └─────┬──────┘
                                                         │
                                    ┌────────────────────┼────────────────────┐
                                    │                    │                    │
                                    ▼                    ▼                    ▼
                             ┌───────────┐        ┌───────────┐        ┌───────────┐
                             │ CONVERTED │        │   LEFT    │        │LEFT_RATED │
                             │(signup)   │        │(no rating)│        │(with rating)│
                             └───────────┘        └───────────┘        └───────────┘
```

**States:**

| State      | Description             | DB Field                          |
| ---------- | ----------------------- | --------------------------------- |
| ENTERED    | App downloaded & opened | `enteredAt` set                   |
| ACTIVE     | Browsing app            | -                                 |
| TRIAL_USED | Used 1 free chat        | `trialUsed = true`, `triedAt` set |
| CONVERTED  | Signed up as Customer   | `convertedAt` set                 |
| LEFT       | Left without signup     | `leftAt` set                      |
| LEFT_RATED | Left with rating/review | `leftAt` set, `rating` set        |

**Transitions:**

| From       | To         | Trigger               | Action                           |
| ---------- | ---------- | --------------------- | -------------------------------- |
| ENTERED    | ACTIVE     | Open app              | Track device                     |
| ACTIVE     | TRIAL_USED | Start demo chat       | Set `trialUsed`, `triedAt`       |
| TRIAL_USED | CONVERTED  | Click signup          | Create User, set `convertedAt`   |
| TRIAL_USED | LEFT       | Close app             | Set `leftAt`                     |
| TRIAL_USED | LEFT_RATED | Submit rating & leave | Set `rating`, `review`, `leftAt` |

**Trial Limit:** 1 chat session

**DB Table:** `GuestUser`

```prisma
model GuestUser {
  id          String    @id @default(uuid())
  deviceId    String    @unique
  enteredAt   DateTime  @default(now())
  trialUsed   Boolean   @default(false)
  triedAt     DateTime?
  rating      Int?      // 1-5 stars
  review      String?
  leftAt      DateTime?
  convertedAt DateTime?
  convertedTo String?   // userId if converted
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([deviceId])
}
```

---

### 2. Customer (B2C User)

**Platform:** Mobile App

**Description:** Registered individual user who uses voice cloning and AI assistant features.

---

#### Account Lifecycle Diagram:

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│ SIGNUP   │────▶│  VERIFY  │────▶│ PROFILE  │────▶│  ACTIVE  │
│          │     │  (OTP)   │     │  SETUP   │     │          │
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
                      │                                  │
                      ▼                                  │
                ┌──────────┐                             │
                │  EXPIRED │                             │
                │(OTP fail)│                             │
                └──────────┘                             │
                                                         │
      ┌──────────────────────────────────────────────────┤
      │                    │                             │
      ▼                    ▼                             ▼
┌──────────┐        ┌──────────┐                  ┌──────────┐
│ INACTIVE │        │SUSPENDED │                  │ DELETED  │
│(no login)│        │(by admin)│                  │(by user) │
└──────────┘        └──────────┘                  └──────────┘
      │                    │
      │                    │
      ▼                    ▼
┌──────────┐        ┌──────────┐
│REACTIVATE│        │ APPEAL   │
│(login)   │        │(contact) │
└──────────┘        └──────────┘
```

---

#### Complete Customer Journey:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER JOURNEY                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐              │
│  │ SIGNUP │───▶│  OTP   │───▶│PROFILE │───▶│  HOME  │              │
│  │        │    │ VERIFY │    │ SETUP  │    │        │              │
│  └────────┘    └────────┘    └────────┘    └───┬────┘              │
│                                                 │                   │
│                    ┌───────────────────────────┴────────┐          │
│                    │                                    │          │
│                    ▼                                    ▼          │
│             ┌────────────┐                      ┌────────────┐     │
│             │ SELECT PLAN│                      │ CREATE BOT │     │
│             │ (optional) │                      │            │     │
│             └────────────┘                      └─────┬──────┘     │
│                                                       │            │
│                         ┌─────────────────────────────┤            │
│                         │              │              │            │
│                         ▼              ▼              ▼            │
│                   ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│                   │  VOICE   │  │ TRAINED  │  │  HYBRID  │        │
│                   │  CLONE   │  │   BOT    │  │   BOT    │        │
│                   └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│                        │             │             │               │
│                        ▼             ▼             ▼               │
│                   ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│                   │ UPLOAD   │  │ UPLOAD   │  │  BOTH    │        │
│                   │ VOICE    │  │ DOCS     │  │          │        │
│                   └────┬─────┘  └────┬─────┘  └────┬─────┘        │
│                        │             │             │               │
│                        └─────────────┴─────────────┘               │
│                                      │                             │
│                                      ▼                             │
│                               ┌──────────┐                         │
│                               │ TRAINING │                         │
│                               └────┬─────┘                         │
│                                    │                               │
│                                    ▼                               │
│                               ┌──────────┐                         │
│                               │  READY   │                         │
│                               └────┬─────┘                         │
│                                    │                               │
│                                    ▼                               │
│                               ┌──────────┐                         │
│                               │  CHAT    │◀──── Usage tracked      │
│                               └────┬─────┘                         │
│                                    │                               │
│                                    ▼                               │
│                          ┌─────────────────┐                       │
│                          │ LIMIT REACHED?  │                       │
│                          └────────┬────────┘                       │
│                                   │                                │
│                    ┌──────────────┼──────────────┐                 │
│                    │              │              │                 │
│                    ▼              ▼              ▼                 │
│              ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│              │ UPGRADE  │  │  WAIT    │  │ CONTINUE │             │
│              │  PLAN    │  │(next mo) │  │(has quota)│            │
│              └──────────┘  └──────────┘  └──────────┘             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

#### Account States:

| State          | Description            | DB Field                           |
| -------------- | ---------------------- | ---------------------------------- |
| SIGNUP         | Registration started   | User created, `isVerified = false` |
| VERIFY_PENDING | OTP sent, waiting      | OTP record created                 |
| VERIFIED       | Email verified         | `isVerified = true`                |
| PROFILE_SETUP  | Setting up profile     | Profile created                    |
| ACTIVE         | Fully onboarded        | `userStatus = ACTIVE`              |
| INACTIVE       | No activity (30+ days) | `userStatus = INACTIVE`            |
| SUSPENDED      | Banned by admin        | `userStatus = SUSPENDED`           |
| DELETED        | Account deleted        | Soft delete / anonymize            |

---

#### Account Transitions:

| From           | To             | Trigger               | Action                        |
| -------------- | -------------- | --------------------- | ----------------------------- |
| -              | SIGNUP         | Submit email/password | Create User record            |
| SIGNUP         | VERIFY_PENDING | -                     | Send OTP email                |
| VERIFY_PENDING | VERIFIED       | Enter correct OTP     | Set `isVerified = true`       |
| VERIFY_PENDING | EXPIRED        | OTP timeout           | Allow resend                  |
| VERIFIED       | PROFILE_SETUP  | -                     | Redirect to profile form      |
| PROFILE_SETUP  | ACTIVE         | Complete profile      | Create Profile, Preferences   |
| ACTIVE         | INACTIVE       | 30 days no login      | Background job updates status |
| INACTIVE       | ACTIVE         | Login again           | Set `userStatus = ACTIVE`     |
| ACTIVE         | SUSPENDED      | Admin action          | Set `userStatus = SUSPENDED`  |
| SUSPENDED      | ACTIVE         | Admin unban           | Set `userStatus = ACTIVE`     |
| ACTIVE         | DELETED        | User requests delete  | Soft delete / anonymize       |

---

#### Complete Journey Steps:

| Step | Action                            | Screen             | DB Impact                      |
| ---- | --------------------------------- | ------------------ | ------------------------------ |
| 1    | **Signup**                        | Signup Screen      | Create `User` record           |
|      | - Email + Password                |                    | `isVerified = false`           |
|      | - OR Google OAuth                 |                    | `googleId` set                 |
| 2    | **OTP Verify**                    | OTP Screen         | Create `OTP` record            |
|      | - Enter 6-digit code              |                    | Update `isVerified = true`     |
|      | - Resend if expired               |                    |                                |
| 3    | **Profile Setup**                 | Profile Screen     | Create `Profile` record        |
|      | - Name                            |                    |                                |
|      | - Avatar (optional)               |                    |                                |
|      | - Gender                          |                    |                                |
| 4    | **Preferences Setup**             | Preferences Screen | Create `Preferences` record    |
|      | - Preferred language              |                    |                                |
|      | - Talk type                       |                    |                                |
|      | - Voice speed                     |                    |                                |
| 5    | **Home Screen**                   | Home               | User is now ACTIVE             |
| 6    | **Select Plan** (optional)        | Plans Screen       | Create `Subscription`          |
|      | - Free (default)                  |                    |                                |
|      | - Starter / Pro / Premium         |                    |                                |
| 7    | **Create Bot**                    | Create Bot Screen  | Create `Bot` record            |
| 8    | **Select Bot Type**               | Bot Type Screen    | Set `Bot.type`                 |
|      | - VOICE_CLONE                     |                    |                                |
|      | - TRAINED                         |                    |                                |
|      | - HYBRID                          |                    |                                |
| 9    | **Upload Data**                   | Upload Screen      |                                |
|      | - Voice samples (for voice clone) |                    | Create `BotVoice` records      |
|      | - Documents/notes (for trained)   |                    | Create `BotKnowledge` records  |
|      | - Both (for hybrid)               |                    |                                |
| 10   | **Training**                      | Training Screen    | Update `Bot.status = TRAINING` |
|      | - Show progress                   |                    | Create `BotTraining` record    |
|      | - Wait for completion             |                    |                                |
| 11   | **Bot Ready**                     | Success Screen     | Update `Bot.status = READY`    |
| 12   | **Start Chat**                    | Chat Screen        | Create `Chat` record           |
|      | - Select bot                      |                    | Create `Conversation` record   |
|      | - Start conversation              |                    | Create `Message` records       |
| 13   | **Usage Tracked**                 | -                  | Update `UsageTrack`            |
|      | - Messages counted                |                    |                                |
|      | - Voice minutes tracked           |                    |                                |
| 14   | **Limit Check**                   | -                  | Check against `Plan` limits    |
|      | - Compare usage vs plan           |                    |                                |
| 15   | **If Limit Reached**              | Upgrade Screen     |                                |
|      | - Upgrade plan                    |                    | Update `Subscription`          |
|      | - Wait for next month             |                    | Reset `UsageTrack`             |
|      | - Continue (if quota left)        |                    |                                |

---

#### Onboarding Flow Summary:

```
Signup → OTP → Profile → Preferences → Home → Create Bot → Upload → Training → Chat → Usage Track
```

---

#### Bot Creation Sub-flow:

```
┌─────────────────────────────────────────────────────────────────┐
│                     BOT CREATION FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Select Use Case                                        │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  What do you want to do?                                │   │
│  │                                                         │   │
│  │  [ ] Chat with loved ones (Voice Clone)                 │   │
│  │  [ ] Get help with tasks (Trained Bot)                  │   │
│  │  [ ] Both - familiar voice + smart help (Hybrid)        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  Step 2: Upload Data                                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  VOICE CLONE:           TRAINED:           HYBRID:      │   │
│  │  - Record voice         - Upload docs      - Both       │   │
│  │  - Upload audio         - Add notes                     │   │
│  │  - Min 30 seconds       - Select category               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  Step 3: Configure Bot                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  - Bot name ("Mom", "Study Buddy")                      │   │
│  │  - Personality (warm, professional)                     │   │
│  │  - Language preference                                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  Step 4: Training                                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Training your bot...                                   │   │
│  │  ████████████░░░░░░░░ 60%                               │   │
│  │  This may take a few minutes                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  Step 5: Ready!                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🎉 Your bot is ready!                                  │   │
│  │  [Start Chatting]                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

#### DB Tables Involved:

| Table          | Purpose             |
| -------------- | ------------------- |
| `User`         | Account data        |
| `Profile`      | User details        |
| `Preferences`  | Chat preferences    |
| `OTP`          | Email verification  |
| `Bot`          | Bot entity          |
| `BotVoice`     | Voice samples       |
| `BotKnowledge` | Training documents  |
| `BotTraining`  | Training status     |
| `Chat`         | Chat thread         |
| `Conversation` | Chat session        |
| `Message`      | Individual messages |
| `Subscription` | User's plan         |
| `UsageTrack`   | Usage monitoring    |

---

### 3. Admin (System Admin)

**Platform:** Web Admin Panel

**Description:** Platform administrator who monitors users and manages the B2C platform.

---

#### Admin Lifecycle Diagram:

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ CREATED  │────▶│  ACTIVE  │────▶│DEACTIVATED│
│(by super)│     │          │     │           │
└──────────┘     └──────────┘     └───────────┘
                      │                 │
                      │                 │
                      ▼                 ▼
                ┌──────────┐     ┌───────────┐
                │ REMOVED  │     │REACTIVATED│
                │          │     │           │
                └──────────┘     └───────────┘
```

---

#### Admin Daily Flow:

```
┌─────────┐     ┌─────────┐     ┌──────────────────────────────┐
│  LOGIN  │────▶│  DASH   │────▶│  Actions:                    │
│         │     │  BOARD  │     │  - View users                │
└─────────┘     └─────────┘     │  - View activity             │
                                │  - Manage subscriptions      │
                                │  - Handle tickets            │
                                │  - View analytics            │
                                │  - Suspend/unsuspend users   │
                                └──────────────────────────────┘
```

---

#### States:

| State       | Description                          | DB Field                |
| ----------- | ------------------------------------ | ----------------------- |
| CREATED     | Admin account created by super admin | `role = ADMIN`          |
| ACTIVE      | Working admin                        | `userStatus = ACTIVE`   |
| DEACTIVATED | Temporarily disabled                 | `userStatus = INACTIVE` |
| REMOVED     | Permanently removed                  | Soft delete             |

---

#### Admin Tasks:

| Task                | Description                   | Frequency |
| ------------------- | ----------------------------- | --------- |
| **Login**           | Access admin panel            | Daily     |
| **View Users**      | List all customers            | Daily     |
| **User Activity**   | See who's active, usage stats | Daily     |
| **Manage Plans**    | View/edit subscriptions       | Rare      |
| **Suspend User**    | Ban for violation             | Rare      |
| **View Analytics**  | Signups, revenue, usage       | Daily     |
| **Support Tickets** | Handle user queries           | As needed |
| **Guest Reviews**   | See guest ratings/feedback    | Weekly    |

---

#### Admin Permissions (B2C):

```
Admin Panel
│
├── 👥 Users
│   ├── View all users
│   ├── Search users
│   ├── View user details
│   ├── Suspend user
│   └── Delete user (GDPR request)
│
├── 📊 Analytics
│   ├── Total signups
│   ├── Active users (DAU/MAU)
│   ├── Revenue
│   └── Conversion rate (guest → customer)
│
├── 💰 Subscriptions
│   ├── View all subscriptions
│   ├── View plan distribution
│   └── Manual upgrade/downgrade (rare)
│
├── 🎫 Support
│   ├── View tickets
│   └── Respond/resolve
│
└── 📝 Guest Feedback
    ├── View ratings
    └── View reviews
```

---

#### Admin Journey Steps:

| Step | Action               | Screen             | Purpose                  |
| ---- | -------------------- | ------------------ | ------------------------ |
| 1    | **Login**            | Login Page         | Access admin panel       |
| 2    | **Dashboard**        | Dashboard          | Overview of platform     |
| 3    | **View Users**       | Users List         | See all customers        |
| 4    | **User Details**     | User Profile       | See specific user info   |
| 5    | **Activity Monitor** | Activity Page      | Track user activity      |
| 6    | **Subscriptions**    | Subscriptions Page | View/manage plans        |
| 7    | **Analytics**        | Analytics Page     | View stats & reports     |
| 8    | **Support**          | Tickets Page       | Handle user issues       |
| 9    | **Guest Feedback**   | Feedback Page      | View ratings/reviews     |
| 10   | **Take Action**      | -                  | Suspend/delete if needed |

---

#### Note:

Admin role in B2C is **limited and simple**:

- Mostly monitoring (view users, activity, analytics)
- Rare actions (suspend user, handle tickets)
- No complex workflows

**DB Table:** `User` with `role = ADMIN`

---

## B2C Entity Lifecycles

### 4. Bot (Voice Clone / Trained / Hybrid)

**Description:** AI entity created by customer for voice chat or task assistance.

**Lifecycle Diagram:**

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  DRAFT   │────▶│ TRAINING │────▶│  READY   │────▶│  ACTIVE  │
│          │     │          │     │          │     │ (in use) │
└──────────┘     └──────────┘     └──────────┘     └────┬─────┘
      │                │                                 │
      │                │                                 │
      ▼                ▼                                 │
┌──────────┐     ┌──────────┐                           │
│ DELETED  │     │  FAILED  │                           │
│          │     │          │                           │
└──────────┘     └─────┬────┘                           │
                       │                                 │
                       ▼                                 │
                 ┌──────────┐                           │
                 │  RETRY   │                           │
                 └──────────┘                           │
                                                        │
                       ┌────────────────────────────────┤
                       │                                │
                       ▼                                ▼
                ┌──────────┐                     ┌──────────┐
                │  PAUSED  │                     │ ARCHIVED │
                │          │                     │          │
                └──────────┘                     └──────────┘
```

**States:**

| State    | Description                | DB Field            |
| -------- | -------------------------- | ------------------- |
| DRAFT    | Bot created, not trained   | `status = DRAFT`    |
| TRAINING | Voice/data being processed | `status = TRAINING` |
| FAILED   | Training failed            | `status = FAILED`   |
| READY    | Training complete          | `status = READY`    |
| ACTIVE   | Being used in chats        | `status = ACTIVE`   |
| PAUSED   | Temporarily disabled       | `status = PAUSED`   |
| ARCHIVED | No longer used             | `status = ARCHIVED` |
| DELETED  | Permanently removed        | Soft delete         |

**Bot Types:**

| Type        | Training Required | Features             |
| ----------- | ----------------- | -------------------- |
| VOICE_CLONE | Voice samples     | Chat in cloned voice |
| TRAINED     | Documents/notes   | Task-specific help   |
| HYBRID      | Voice + Documents | Voice + Task help    |

**Transitions:**

| From     | To       | Trigger             | Action                 |
| -------- | -------- | ------------------- | ---------------------- |
| -        | DRAFT    | Create bot          | Create Bot record      |
| DRAFT    | TRAINING | Upload samples/data | Start training job     |
| TRAINING | READY    | Training complete   | Update status          |
| TRAINING | FAILED   | Training error      | Log error, notify user |
| FAILED   | TRAINING | Retry               | Restart training       |
| READY    | ACTIVE   | First chat started  | Update status          |
| ACTIVE   | PAUSED   | User pauses         | Update status          |
| PAUSED   | ACTIVE   | User resumes        | Update status          |
| ACTIVE   | ARCHIVED | User archives       | Update status          |
| \*       | DELETED  | User deletes        | Soft delete            |

---

## B2B Actors (To Be Discussed)

### 5. Organization Owner

```
TODO: Discuss and document
```

### 6. Organization Admin

```
TODO: Discuss and document
```

### 7. Organization Member

```
TODO: Discuss and document
```

### 8. Team Lead

```
TODO: Discuss and document
```

### 9. Team Member

```
TODO: Discuss and document
```

### 10. Invited User

```
TODO: Discuss and document
```

### 11. Meeting Participant

```
TODO: Discuss and document
```

---

## Summary

| Actor               | States | Platform  | Status        |
| ------------------- | ------ | --------- | ------------- |
| Guest               | 6      | Mobile    | ✅ Documented |
| Customer            | 8      | Mobile    | ✅ Documented |
| Admin               | 4      | Web Panel | ✅ Documented |
| Bot                 | 8      | -         | ✅ Documented |
| Org Owner           | -      | Web       | ⏳ Pending    |
| Org Admin           | -      | Web       | ⏳ Pending    |
| Org Member          | -      | Web       | ⏳ Pending    |
| Team Lead           | -      | Web       | ⏳ Pending    |
| Team Member         | -      | Web       | ⏳ Pending    |
| Invited User        | -      | Web       | ⏳ Pending    |
| Meeting Participant | -      | Web       | ⏳ Pending    |
