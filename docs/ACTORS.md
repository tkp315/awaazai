# AwaazAI System Actors

## Overview

This document defines all actors (users/entities) that interact with the AwaazAI platform.

---

## Actor Categories

| Category | Description             |
| -------- | ----------------------- |
| Public   | Non-authenticated users |
| B2C      | Individual customers    |
| B2B      | Organization users      |
| Internal | Platform staff          |
| Entities | Non-human actors (bots) |

---

## Public Actors (No Auth)

| Actor     | Description                                             | Access                   |
| --------- | ------------------------------------------------------- | ------------------------ |
| **Guest** | Visitor on landing page, can explore features, try demo | Read-only, limited trial |

---

## B2C Actors (Individual)

| Actor        | Description                 | Access            |
| ------------ | --------------------------- | ----------------- |
| **Customer** | Registered individual user  | Full B2C features |
|              | - Clone voice of loved ones |                   |
|              | - Chat with cloned voices   |                   |
|              | - Manage subscription       |                   |

---

## B2B Actors (Organization)

### Organization Level

| Actor          | Role   | Description                   | Permissions             |
| -------------- | ------ | ----------------------------- | ----------------------- |
| **Org Owner**  | OWNER  | Created the organization      | Full control            |
|                |        | - Owns billing & subscription | - Delete org            |
|                |        | - Can transfer ownership      | - Manage billing        |
|                |        |                               | - All admin permissions |
| **Org Admin**  | ADMIN  | Manages organization          | High access             |
|                |        | - Invited by owner            | - Invite/remove members |
|                |        | - Manages teams & bots        | - Create/manage teams   |
|                |        |                               | - Create/manage bots    |
|                |        |                               | - View analytics        |
| **Org Member** | MEMBER | Regular employee              | Basic access            |
|                |        | - Invited by owner/admin      | - Use assigned bots     |
|                |        | - Works within assigned teams | - View own reports      |
|                |        |                               | - Join meetings         |

### Team Level

| Actor           | Role   | Description                | Permissions             |
| --------------- | ------ | -------------------------- | ----------------------- |
| **Team Lead**   | LEAD   | Leads a team               | Team management         |
|                 |        | - Assigned by org admin    | - Manage team members   |
|                 |        | - Manages team activities  | - Assign tasks          |
|                 |        |                            | - Team analytics        |
| **Team Member** | MEMBER | Part of a team             | Team access             |
|                 |        | - Added by team lead/admin | - Collaborate with team |
|                 |        | - Works on team projects   | - Use team bots         |

### Pending/External

| Actor                   | Description                         | Access                  |
| ----------------------- | ----------------------------------- | ----------------------- |
| **Invited User**        | Received invitation, not yet joined | Pending verification    |
| **Meeting Participant** | External person joining a meeting   | Meeting access only     |
|                         | - Not part of organization          | - Join specific meeting |
|                         | - Invited via meeting link          | - No org access         |

---

## Internal Actors (Platform Staff)

| Actor             | Description               | Access              |
| ----------------- | ------------------------- | ------------------- |
| **System Admin**  | Platform super admin      | Full system access  |
|                   | - Manages entire platform | - All organizations |
|                   | - Handles escalations     | - User management   |
|                   | - System configuration    | - Platform settings |
| **Support Agent** | Customer support staff    | Support access      |
|                   | - Handles support tickets | - View user issues  |
|                   | - Assists users           | - Limited user data |
|                   |                           | - Ticket management |

---

## Non-Human Entities

| Entity          | Description                  | Context                 |
| --------------- | ---------------------------- | ----------------------- |
| **Voice Bot**   | AI-powered cloned voice      | B2C & B2B               |
|                 | - Created from voice samples | - Chat interactions     |
|                 | - Responds to user messages  | - Meeting participation |
| **Meeting Bot** | AI assistant in meetings     | B2B only                |
|                 | - Joins meetings             | - Cross-questioning     |
|                 | - Takes notes                | - Suggestions           |
|                 | - Provides suggestions       | - Note generation       |

---

## Actor Hierarchy

```
AwaazAI Platform
│
├── 🌐 PUBLIC
│   └── Guest User
│
├── 👤 B2C (Individual)
│   ├── Customer
│   └── [Voice Bot] 🤖
│
├── 🏢 B2B (Organization)
│   │
│   ├── Organization Level
│   │   ├── 👑 Org Owner
│   │   ├── 🔑 Org Admin
│   │   └── 👤 Org Member
│   │
│   ├── Team Level
│   │   ├── 👤 Team Lead
│   │   └── 👤 Team Member
│   │
│   ├── Pending/External
│   │   ├── ⏳ Invited User
│   │   └── 🔗 Meeting Participant
│   │
│   └── [Voice Bot] 🤖
│       [Meeting Bot] 🤖
│
└── 🔧 INTERNAL (Platform)
    ├── 🔐 System Admin
    └── 🎧 Support Agent
```

---

## Role Mapping to Database

### User.accountType

```
INDIVIDUAL   → B2C Customer
ORGANIZATION → B2B User (check OrgMember for specific role)
```

### User.role (RoleType enum)

```
CUSTOMER      → B2C individual user
ADMIN         → System admin (platform level)
GUEST_USER    → Trial/demo user
```

### OrgMember.role (OrgMemberRole enum)

```
OWNER  → Organization owner
ADMIN  → Organization admin
MEMBER → Organization member
```

### TeamMember.role (TeamMemberRole enum)

```
LEAD   → Team lead
MEMBER → Team member
```

---

## Permission Matrix

### B2C Permissions

| Permission          | Guest | Customer |
| ------------------- | ----- | -------- |
| View landing page   | ✅    | ✅       |
| Try demo            | ✅    | ✅       |
| Create account      | ✅    | -        |
| Clone voice         | ❌    | ✅       |
| Chat with voice     | ❌    | ✅       |
| Manage subscription | ❌    | ✅       |
| View chat history   | ❌    | ✅       |

### B2B Org Permissions

| Permission          | Owner | Admin | Member |
| ------------------- | ----- | ----- | ------ |
| Delete organization | ✅    | ❌    | ❌     |
| Manage billing      | ✅    | ❌    | ❌     |
| Transfer ownership  | ✅    | ❌    | ❌     |
| Invite members      | ✅    | ✅    | ❌     |
| Remove members      | ✅    | ✅    | ❌     |
| Create teams        | ✅    | ✅    | ❌     |
| Delete teams        | ✅    | ❌    | ❌     |
| Create bots         | ✅    | ✅    | ❌     |
| Delete bots         | ✅    | ❌    | ❌     |
| Use bots            | ✅    | ✅    | ✅     |
| View analytics      | ✅    | ✅    | ❌     |
| View own reports    | ✅    | ✅    | ✅     |

### B2B Team Permissions

| Permission          | Lead | Member |
| ------------------- | ---- | ------ |
| Add team members    | ✅   | ❌     |
| Remove team members | ✅   | ❌     |
| Assign tasks        | ✅   | ❌     |
| View team analytics | ✅   | ❌     |
| Use team bots       | ✅   | ✅     |
| Collaborate         | ✅   | ✅     |

---

## Actor Count Summary

| Category  | Count  | Actors                      |
| --------- | ------ | --------------------------- |
| Public    | 1      | Guest                       |
| B2C       | 1      | Customer                    |
| B2B Org   | 3      | Owner, Admin, Member        |
| B2B Team  | 2      | Lead, Member                |
| B2B Other | 2      | Invited, Participant        |
| Internal  | 2      | System Admin, Support Agent |
| Entities  | 2      | Voice Bot, Meeting Bot      |
| **Total** | **13** |                             |

---

## Notes

1. **Bot is not a user** - Bots are entities created by users, not actors themselves
2. **One user, multiple roles** - A user can be Customer (B2C) AND Org Member (B2B)
3. **Team membership** - One OrgMember can be in multiple teams
4. **Meeting Participant** - External, no account needed, just meeting access
