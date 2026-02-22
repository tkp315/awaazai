server.ts
↓
loaders/index.ts (master loader)
├── config.loader.ts → config/index.ts → (env, app, aws,
redis, etc.)
├── lib.loader.ts
├── middleware.loader.ts
├── jobs.loader.ts
└── helper.loader.ts
↓
app.ts (express)

---

Correct Flow:

1. config/env/index.ts - Individual config

2. config/index.ts - Sab configs load kare

3. loaders/config.loader.ts - Config loader wrap kare

4. loaders/index.ts - Sab loaders ko call kare

5. server.ts - Loaders use karke server start kare

---

Files likhne ka order:
#: 1
File: config/env/index.ts
Purpose: Env variables
────────────────────────────────────────
#: 2
File: config/index.ts
Purpose: Dynamic config loader
────────────────────────────────────────
#: 3
File: loaders/config.loader.ts
Purpose: Config ko app mein attach kare
────────────────────────────────────────
#: 4
File: loaders/index.ts
Purpose: Master loader
────────────────────────────────────────
#: 5
File: server.ts
Purpose: Entry point

---

# Rate Limit

┌────────┬───────────────────────────────┬───────────────┐
│ Type │ Where │ Limit │
├────────┼───────────────────────────────┼───────────────┤
│ Global │ lib/app/middlewares/ratelimit │ 100 req/15min │
├────────┼───────────────────────────────┼───────────────┤
│ Auth │ /api/auth/_ routes │ 10 req/15min │
├────────┼───────────────────────────────┼───────────────┤
│ API │ /api/_ routes │ 200 req/15min │
├────────┼───────────────────────────────┼───────────────┤
│ Upload │ /api/upload/_ routes │ 20 req/hour │
├────────┼───────────────────────────────┼───────────────┤
│ AI │ /api/ai/_ routes │ 50 req/hour │
└────────┴───────────────────────────────┴───────────────┘
