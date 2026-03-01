# AwaazAI Product Vision

## Overview

AwaazAI is a **Personalized AI Assistant** platform that combines voice cloning with intelligent bot training to help users in their daily life.

---

## Product Evolution

| Stage       | Vision                | Focus                     |
| ----------- | --------------------- | ------------------------- |
| Initial     | Voice cloning + chat  | Talk to cloned voices     |
| **Current** | Personal AI Assistant | Voice + Task-trained bots |

---

## Core Value Proposition

```
"Your personal AI that sounds like anyone and helps with everything"
```

- **Emotional**: Clone voices of loved ones
- **Practical**: Train bot for daily tasks (study, work, fitness)
- **Unique**: Voice + Training combined (Hybrid)

---

## Platform Distribution

| Platform        | Target            | Features                           |
| --------------- | ----------------- | ---------------------------------- |
| **Mobile App**  | B2C Customers     | Voice clone, chat, daily assistant |
| **Web App**     | B2B Organizations | Team bots, meetings, dashboard     |
| **Admin Panel** | System Admin      | User management, platform control  |

---

## Bot Types

### 1. VOICE_CLONE (Starter)

```
Clone voice of anyone → Chat in their voice
```

- Upload voice samples
- AI trains on voice
- Chat with cloned voice
- Use case: Talk to mom, grandparents, friends

### 2. TRAINED (Pro)

```
Train bot for specific tasks → Get specialized help
```

- Upload training data (notes, documents)
- Select category (study, work, fitness)
- Bot becomes expert in that area
- Use case: Study helper, work assistant

### 3. HYBRID (Premium)

```
Voice Clone + Trained = Best of both
```

- Cloned voice + task training
- Example: Mom's voice that helps with homework
- Use case: Personalized tutor with familiar voice

---

## Use Cases by Category

```
Personal AI Bot
│
├── 📚 Study Mode
│   ├── Subject-wise help (Math, Science, History)
│   ├── Explain concepts in simple terms
│   ├── Quiz mode for practice
│   ├── Homework helper
│   └── Exam preparation
│
├── 🎨 Creative Mode
│   ├── Drawing ideas & techniques
│   ├── Art style suggestions
│   ├── Creative writing prompts
│   └── Music/lyrics help
│
├── 💼 Work Mode
│   ├── Email drafting
│   ├── Meeting prep & summaries
│   ├── Task planning
│   ├── Report writing
│   └── Presentation ideas
│
├── 🏋️ Fitness Mode
│   ├── Workout plans
│   ├── Diet suggestions
│   ├── Progress tracking
│   ├── Motivation
│   └── Health tips
│
├── 🧘 Wellness Mode
│   ├── Meditation guidance
│   ├── Sleep stories
│   ├── Stress relief
│   └── Daily affirmations
│
└── 🎭 Personality Mode (Voice Clone)
    ├── Talk like Mom/Dad
    ├── Talk like Friend
    ├── Celebrity voice (if legal)
    └── Custom personality
```

---

## Subscription Tiers

| Tier        | Price   | Features                              |
| ----------- | ------- | ------------------------------------- |
| **Free**    | ₹0      | Basic chat, 50 messages/day, no voice |
| **Starter** | ₹199/mo | 1 voice clone, unlimited chat         |
| **Pro**     | ₹499/mo | 3 voice clones + 2 trained bots       |
| **Premium** | ₹999/mo | Unlimited + Hybrid bots + Priority    |

### Feature Matrix

| Feature              | Free | Starter   | Pro       | Premium   |
| -------------------- | ---- | --------- | --------- | --------- |
| Basic chat           | ✅   | ✅        | ✅        | ✅        |
| Messages/day         | 50   | Unlimited | Unlimited | Unlimited |
| Voice clones         | 0    | 1         | 3         | Unlimited |
| Trained bots         | 0    | 0         | 2         | Unlimited |
| Hybrid bots          | 0    | 0         | 0         | ✅        |
| Training data upload | ❌   | ❌        | 100MB     | Unlimited |
| Priority response    | ❌   | ❌        | ❌        | ✅        |
| API access           | ❌   | ❌        | ❌        | ✅        |

---

## B2C Actors

| Actor        | Platform   | Description                   |
| ------------ | ---------- | ----------------------------- |
| **Guest**    | Mobile App | Non-registered, exploring app |
| **Customer** | Mobile App | Registered individual user    |
| **Admin**    | Web Panel  | Manages B2C users & platform  |

---

## Development Phases

### Phase 1: Foundation (Current)

```
✅ Auth system design
✅ Database schema design
⏳ Actor lifecycles
⏳ API design
```

### Phase 2: MVP

```
□ User auth (signup, login, OTP)
□ Basic chat (no voice)
□ Simple bot interaction
□ Subscription (Razorpay)
```

### Phase 3: Voice Clone

```
□ Voice sample upload
□ Voice training pipeline
□ Voice chat
□ Starter tier launch
```

### Phase 4: Bot Training

```
□ Training data upload
□ Category system
□ Trained bot chat
□ Pro tier launch
```

### Phase 5: Hybrid & Scale

```
□ Hybrid bots
□ Premium tier
□ Performance optimization
□ B2B features
```

---

## Database Modules

| Module           | Tables                                                        | Status      |
| ---------------- | ------------------------------------------------------------- | ----------- |
| **Auth**         | User, Profile, RefreshToken, Preferences, LoginHistory, OTP   | ✅ Designed |
| **Org**          | Org, OrgVerification, OrgMember, Invitation, Team, TeamMember | ✅ Designed |
| **Bot**          | Bot, BotVoice, BotTraining, BotKnowledge                      | ⏳ Pending  |
| **Chat**         | Chat, Conversation, Message                                   | ⏳ Pending  |
| **Subscription** | Plan, Subscription, Payment, Invoice                          | ⏳ Pending  |
| **Logs**         | ActivityLog, LoginHistory, ApiLog                             | ✅ Designed |

---

## Competitive Advantage

| Competitor   | What they do      | AwaazAI Advantage                |
| ------------ | ----------------- | -------------------------------- |
| ChatGPT      | Text AI assistant | Voice cloning + personalization  |
| ElevenLabs   | Voice cloning     | Task training + daily assistant  |
| Character.ai | Personality bots  | Real voice + practical use cases |
| Replica      | AI companion      | Training + multiple modes        |

**AwaazAI = Voice Cloning + Task Training + Personalization**

---

## Notes from Discussion

1. **Voice-only was limited** - Users would lose interest after novelty fades
2. **Personal AI Assistant** - Daily use = better retention
3. **Hybrid model unique** - Mom's voice helping with homework = emotional + practical
4. **Phased development** - DB design now, build in phases
5. **Revenue potential** - More tiers = more monetization options

---

## Next Steps

1. ⏳ Complete actor lifecycles (Guest, Customer, Admin)
2. ⏳ Design Bot module tables
3. ⏳ Design Chat module tables
4. ⏳ Design Subscription module tables
5. ⏳ Finalize Prisma schema
