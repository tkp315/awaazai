# AwaazAI B2B Database Schema

## B2B Product Vision

1. **Org Management** - Onboarding, teams, invitations
2. **Voice Bot Creation** - Clone voice, train with notes, custom personality
3. **Meeting Bot** - Real-time participation, cross-questioning, suggestions, personalized notes

---

## Auth Module (Already in main schema)

| Table      | Status | Purpose                |
| ---------- | ------ | ---------------------- |
| Org        | ✅     | Organization details   |
| OrgMember  | ✅     | User ↔ Org link        |
| Invitation | ✅     | Pending member invites |
| OTP        | ✅     | Email verification     |
| Team       | ✅     | Teams within org       |
| TeamMember | ✅     | User ↔ Team link       |

---

## Bot Module

| Table        | Status | Purpose                     |
| ------------ | ------ | --------------------------- |
| Bot          | ✅     | Main bot entity             |
| BotConfig    | ✅     | Settings, personality, tone |
| BotKnowledge | ✅     | Training data (notes, docs) |
| BotTraining  | ✅     | Training history            |

### 1. Bot (PostgreSQL)

```
- id (UUID)
- orgId (FK → Org)
- voiceId (FK → Voice)
- name ("Sales Assistant", "Meeting Helper")
- description
- avatar
- status (draft, training, active, paused, archived)
- createdBy (FK → User)
- createdAt
- updatedAt
```

### 2. BotConfig (PostgreSQL)

```
- id (UUID)
- botId (FK → Bot)
- personality (JSONB - tone, style, behavior)
- language (en, hi, etc.)
- responseStyle (formal, casual, friendly)
- allowCrossQuestion (boolean)
- allowSuggestions (boolean)
- noteStyle (detailed, summary, bullet_points)
- customInstructions (text)
- createdAt
- updatedAt
```

**Personality JSONB example:**

```json
{
  "tone": "professional",
  "style": "concise",
  "behavior": "proactive",
  "expertise": ["sales", "product"],
  "avoid": ["technical jargon"]
}
```

### 3. BotKnowledge (PostgreSQL)

```
- id (UUID)
- botId (FK → Bot)
- type (note, document, faq, url)
- title
- content (text)
- fileUrl (S3 path, nullable)
- status (pending, processed, failed)
- metadata (JSONB - pages, wordCount, etc.)
- uploadedBy (FK → User)
- createdAt
- updatedAt
```

### 4. BotTraining (PostgreSQL)

```
- id (UUID)
- botId (FK → Bot)
- knowledgeIds (array of BotKnowledge ids used)
- status (queued, processing, completed, failed)
- progress (0-100)
- startedAt
- completedAt
- error (nullable)
- modelVersion
- createdAt
```

---

## Meeting Module

| Table              | Status | Purpose                |
| ------------------ | ------ | ---------------------- |
| Meeting            | ✅     | Scheduled/live meeting |
| MeetingParticipant | ✅     | Who joined             |
| MeetingBot         | ✅     | Bot in meeting         |
| MeetingTranscript  | ✅     | Full transcript        |
| MeetingNote        | ✅     | Personalized notes     |
| MeetingSuggestion  | ✅     | AI suggestions         |
| MeetingAction      | ✅     | Action items           |

### 5. Meeting (PostgreSQL)

```
- id (UUID)
- orgId (FK → Org)
- title
- description
- scheduledAt
- startedAt (nullable)
- endedAt (nullable)
- duration (minutes)
- status (scheduled, live, ended, cancelled)
- meetingType (internal, external, interview, sales)
- meetingUrl (Zoom/Meet link)
- recordingUrl (S3 path, nullable)
- createdBy (FK → User)
- createdAt
- updatedAt
```

### 6. MeetingParticipant (PostgreSQL)

```
- id (UUID)
- meetingId (FK → Meeting)
- userId (FK → User, nullable for external)
- name (for external participants)
- email
- role (host, participant, guest)
- joinedAt
- leftAt (nullable)
- status (invited, joined, left, declined)
- createdAt
```

### 7. MeetingBot (PostgreSQL)

```
- id (UUID)
- meetingId (FK → Meeting)
- botId (FK → Bot)
- status (standby, active, paused, ended)
- joinedAt
- leftAt (nullable)
- settings (JSONB - override bot config for this meeting)
- createdAt
```

**Settings JSONB example:**

```json
{
  "autoJoin": true,
  "mutedByDefault": false,
  "crossQuestionEnabled": true,
  "suggestionsEnabled": true,
  "notesTaking": true
}
```

### 8. MeetingTranscript (MongoDB)

```
- _id (ObjectId)
- meetingId (ref → Meeting)
- segments [
    {
      speakerId (userId or "bot" or "unknown")
      speakerName
      text
      startTime (seconds)
      endTime (seconds)
      confidence (0-1)
    }
  ]
- fullText (complete transcript)
- language
- createdAt
- updatedAt
```

### 9. MeetingNote (PostgreSQL)

```
- id (UUID)
- meetingId (FK → Meeting)
- botId (FK → Bot)
- type (summary, detailed, bullet_points)
- content (text)
- topics (array of strings)
- keyPoints (JSONB)
- generatedAt
- createdAt
```

**KeyPoints JSONB example:**

```json
{
  "decisions": ["Launch date set to March 15"],
  "discussions": ["Budget allocation for Q2"],
  "concerns": ["Resource availability"],
  "followUps": ["Schedule design review"]
}
```

### 10. MeetingSuggestion (PostgreSQL)

```
- id (UUID)
- meetingId (FK → Meeting)
- botId (FK → Bot)
- type (topic, question, clarification, resource)
- content (text)
- context (what triggered this suggestion)
- wasUsed (boolean - did host use it?)
- suggestedAt
- createdAt
```

### 11. MeetingAction (PostgreSQL)

```
- id (UUID)
- meetingId (FK → Meeting)
- title
- description
- assignedTo (FK → User, nullable)
- assignedToName (for external)
- dueDate (nullable)
- priority (low, medium, high)
- status (pending, in_progress, completed)
- extractedFrom (transcript segment reference)
- createdAt
- updatedAt
```

---

## B2B Tables Summary

```
Bot Module (4 tables):
├── Bot
├── BotConfig
├── BotKnowledge
└── BotTraining

Meeting Module (7 tables):
├── Meeting
├── MeetingParticipant
├── MeetingBot
├── MeetingTranscript (MongoDB)
├── MeetingNote
├── MeetingSuggestion
└── MeetingAction

Total B2B specific: 11 tables
```

---

## Complete Database Overview

```
B2C Tables: 19
├── Auth: User, Profile, RefreshToken
├── Voice: Voice, VoiceSample, VoiceTraining, VoiceUsage
├── Chat: Chat, Conversation, Message
├── Subscription: Plan, Subscription, Payment, Invoice, UsageLimit, UsageTrack
└── Support: Notification, SupportTicket, Feedback

B2B Tables: 17 (6 shared from Auth + 11 new)
├── Auth: Org, OrgMember, Invitation, OTP, Team, TeamMember
├── Bot: Bot, BotConfig, BotKnowledge, BotTraining
└── Meeting: Meeting, MeetingParticipant, MeetingBot, MeetingTranscript,
             MeetingNote, MeetingSuggestion, MeetingAction

Shared Tables: Voice, Subscription modules

Grand Total: ~30 tables (PostgreSQL + MongoDB)
```
