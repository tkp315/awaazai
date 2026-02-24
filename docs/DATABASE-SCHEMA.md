# AwaazAI Database Schema

## Database Strategy

| Data Type               | Database   | Why                            |
| ----------------------- | ---------- | ------------------------------ |
| Users, Orgs, Auth       | PostgreSQL | Relational, ACID transactions  |
| Subscriptions, Payments | PostgreSQL | Financial data = strict schema |
| Voice Models, Bots      | PostgreSQL | Relational                     |
| Chat Messages           | MongoDB    | High volume, fast writes       |
| Conversation History    | MongoDB    | Flexible, document-based       |
| Meeting Transcripts     | MongoDB    | Unstructured text data         |

---

## Auth Module

### B2C (Individual)

| Table        | Status | Purpose                             |
| ------------ | ------ | ----------------------------------- |
| User         | ✅     | Auth data (email, googleId, status) |
| Profile      | ✅     | User details (name, avatar, bio)    |
| RefreshToken | ✅     | JWT refresh tokens                  |

### B2B (Organisation)

| Table      | Status | Purpose                            |
| ---------- | ------ | ---------------------------------- |
| Org        | ✅     | Organization details               |
| OrgMember  | ✅     | User ↔ Org link                    |
| Invitation | ✅     | Pending member invites             |
| OTP        | ✅     | Email verification for org members |
| Team       | ✅     | Teams within org                   |
| TeamMember | ✅     | User ↔ Team link                   |

---

## Tables Detail

### 1. User (PostgreSQL)

```
- id (UUID)
- email (unique)
- googleId (nullable, for Google OAuth)
- orgId (nullable, if belongs to org)
- orgRole (nullable, admin/member)
- status (active, inactive, suspended)
- lastLoginAt
- createdAt
- updatedAt
```

### 2. Profile (PostgreSQL)

```
- id (UUID)
- userId (FK → User)
- name
- avatar
- phone
- bio
- preferences (JSONB)
- createdAt
- updatedAt
```

### 3. RefreshToken (PostgreSQL)

```
- id (UUID)
- userId (FK → User)
- token (hashed)
- deviceInfo
- expiresAt
- createdAt
```

### 4. OTP (PostgreSQL)

```
- id (UUID)
- email
- otp (hashed)
- type (login, verify_email, reset_password)
- expiresAt
- verified (boolean)
- attempts (int, for rate limiting)
- createdAt
```

### 5. Org (PostgreSQL)

```
- id (UUID)
- name
- slug (unique)
- logo
- status (active, inactive, suspended)
- plan (free, basic, pro, enterprise)
- createdAt
- updatedAt
```

### 6. Invitation (PostgreSQL)

```
- id (UUID)
- orgId (FK → Org)
- email
- role (admin, member)
- invitedBy (FK → User)
- status (pending, accepted, rejected, expired)
- expiresAt
- createdAt
```

### 7. OrgMember (PostgreSQL)

```
- id (UUID)
- userId (FK → User)
- orgId (FK → Org)
- role (owner, admin, member)
- status (active, inactive)
- joinedAt
- createdAt
- updatedAt
```

### 8. Team (PostgreSQL)

```
- id (UUID)
- orgId (FK → Org)
- name
- description
- createdBy (FK → User)
- createdAt
- updatedAt
```

### 9. TeamMember (PostgreSQL)

```
- id (UUID)
- teamId (FK → Team)
- userId (FK → User)
- role (lead, member)
- joinedAt
- createdAt
```

---

## Voice Module

### B2C & B2B (Shared)

| Table         | Status | Purpose                      |
| ------------- | ------ | ---------------------------- |
| Voice         | ✅     | Main cloned voice            |
| VoiceSample   | ✅     | Audio samples for training   |
| VoiceTraining | ✅     | Training history/status      |
| VoiceUsage    | ✅     | Usage tracking (kab use hui) |

### 10. Voice (PostgreSQL)

```
- id (UUID)
- userId (FK → User, for B2C)
- orgId (FK → Org, for B2B, nullable)
- name ("Mom's Voice", "Support Bot")
- status (pending, training, ready, failed)
- modelUrl (S3 path to trained model)
- settings (JSONB - pitch, speed, tone)
- createdAt
- updatedAt
```

### 11. VoiceSample (PostgreSQL)

```
- id (UUID)
- voiceId (FK → Voice)
- audioUrl (S3 path)
- duration (seconds)
- quality (good, poor, rejected)
- status (uploaded, validated, used)
- createdAt
```

### 12. VoiceTraining (PostgreSQL)

```
- id (UUID)
- voiceId (FK → Voice)
- status (queued, processing, completed, failed)
- progress (0-100)
- startedAt
- completedAt
- error (if failed)
- createdAt
```

### 13. VoiceUsage (PostgreSQL)

```
- id (UUID)
- voiceId (FK → Voice)
- userId (FK → User, who used it)
- usedFor (chat, meeting, tts, bot)
- duration (seconds)
- createdAt
```

---

## Chat Module

### B2C (Individual)

| Table        | Status | Purpose                          |
| ------------ | ------ | -------------------------------- |
| Chat         | ✅     | Main chat thread (user + voice)  |
| Conversation | ✅     | Session within chat (ek sitting) |
| Message      | ✅     | Individual messages              |

### 14. Chat (PostgreSQL)

```
- id (UUID)
- userId (FK → User)
- voiceId (FK → Voice)
- title ("Chat with Mom")
- lastMessageAt
- status (active, archived, deleted)
- createdAt
- updatedAt
```

### 15. Conversation (PostgreSQL)

```
- id (UUID)
- chatId (FK → Chat)
- startedAt
- endedAt
- status (active, ended, archived)
- summary (AI generated summary, nullable)
- createdAt
```

### 16. Message (MongoDB)

```
- _id (ObjectId)
- conversationId (ref → Conversation)
- role (user, assistant, system)
- content (text)
- audioUrl (S3 path, nullable)
- duration (seconds, nullable)
- metadata (JSONB - tokens, latency, etc.)
- createdAt
```

---

## Subscription Module

### B2C & B2B (Shared)

| Table        | Status | Purpose                |
| ------------ | ------ | ---------------------- |
| Plan         | ✅     | Pricing plans          |
| Subscription | ✅     | User/Org active plan   |
| Payment      | ✅     | Payment history        |
| Invoice      | ✅     | Monthly invoices       |
| UsageLimit   | ✅     | Plan limits            |
| UsageTrack   | ✅     | Current usage tracking |

### 17. Plan (PostgreSQL)

```
- id (UUID)
- name (Free, Basic, Pro, Enterprise)
- slug (free, basic, pro, enterprise)
- type (individual, organization)
- price (monthly price)
- yearlyPrice (annual price)
- features (JSONB)
- isActive (boolean)
- createdAt
- updatedAt
```

**Features JSONB example:**

```json
{
  "voiceClones": 3,
  "voiceMinutes": 100,
  "chatMessages": 1000,
  "apiAccess": false,
  "prioritySupport": false,
  "customBots": 0
}
```

### 18. Subscription (PostgreSQL)

```
- id (UUID)
- userId (FK → User, for B2C, nullable)
- orgId (FK → Org, for B2B, nullable)
- planId (FK → Plan)
- status (active, cancelled, expired, trial)
- billingCycle (monthly, yearly)
- currentPeriodStart
- currentPeriodEnd
- cancelledAt (nullable)
- createdAt
- updatedAt
```

### 19. Payment (PostgreSQL)

```
- id (UUID)
- subscriptionId (FK → Subscription)
- amount
- currency (INR, USD)
- status (pending, success, failed, refunded)
- paymentMethod (card, upi, netbanking)
- transactionId (payment gateway ref)
- paidAt
- createdAt
```

### 20. Invoice (PostgreSQL)

```
- id (UUID)
- subscriptionId (FK → Subscription)
- invoiceNumber (INV-2024-001)
- amount
- tax
- totalAmount
- status (draft, sent, paid, overdue)
- dueDate
- paidAt (nullable)
- invoiceUrl (PDF link)
- createdAt
```

### 21. UsageLimit (PostgreSQL)

```
- id (UUID)
- planId (FK → Plan)
- feature (voice_minutes, chat_messages, api_calls, storage_gb)
- limitValue (100, 1000, -1 for unlimited)
- createdAt
```

### 22. UsageTrack (PostgreSQL)

```
- id (UUID)
- subscriptionId (FK → Subscription)
- feature (voice_minutes, chat_messages, api_calls, storage_gb)
- used (current usage count)
- period (2024-01 for monthly reset)
- createdAt
- updatedAt
```

---

## Support Module

### B2C (Individual)

| Table         | Status | Purpose                  |
| ------------- | ------ | ------------------------ |
| Notification  | ✅     | Push notifications track |
| SupportTicket | ✅     | User support queries     |
| Feedback      | ✅     | Ratings & reviews        |

### 23. Notification (PostgreSQL)

```
- id (UUID)
- userId (FK → User)
- title
- body
- type (system, promo, reminder, alert)
- data (JSONB - extra payload)
- isRead (boolean)
- readAt (nullable)
- createdAt
```

### 24. SupportTicket (PostgreSQL)

```
- id (UUID)
- userId (FK → User)
- subject
- description
- category (bug, feature, billing, general)
- priority (low, medium, high, urgent)
- status (open, in_progress, resolved, closed)
- assignedTo (FK → User, admin, nullable)
- resolvedAt (nullable)
- createdAt
- updatedAt
```

### 25. Feedback (PostgreSQL)

```
- id (UUID)
- userId (FK → User)
- voiceId (FK → Voice, nullable)
- type (voice_quality, app_experience, feature_request)
- rating (1-5)
- comment (text, nullable)
- createdAt
```

---

## Other Modules (To Be Added)

- [ ] Bot Module (Bot, BotConfig)
- [ ] Meeting Module (Meeting, Participant, Transcript)
