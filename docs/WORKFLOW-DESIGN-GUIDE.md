# Workflow Design Guide

## Normal API Calling vs Workflow

### Normal API Call

```
User clicks "Clone Voice" → API call → Response → Done
```

- Synchronous (turant response)
- Short tasks (milliseconds to few seconds)
- Agar fail ho gaya to user ko phir se try karna padega

### Workflow

```
User clicks "Clone Voice"
  → Job queued (instant response: "Processing started")
  → Step 1: Validate audio (10 sec)
  → Step 2: Process audio (30 sec)
  → Step 3: Train model (5 min)
  → Step 4: Save & notify user
  → Done
```

- Asynchronous (background mein hota hai)
- Long running tasks (minutes to hours)
- Fail hone pe automatic retry
- User can track progress
- Server restart hone pe bhi resume ho sakta hai

---

## Workflow Design Steps

### Step 1: Identify States

Pehle soch ki process mein kya kya stages hain:

```
Voice Cloning Example:
- pending (user ne upload kiya)
- validating (audio check ho raha)
- processing (audio clean ho raha)
- training (AI model train ho raha)
- ready (complete)
- failed (kuch galat hua)
```

### Step 2: Define Transitions

Kaunsi state se kaunsi state mein ja sakte hain:

```
pending → validating (auto)
validating → processing (if valid)
validating → failed (if invalid)
processing → training (auto)
training → ready (if success)
training → failed (if error)
failed → pending (retry)
```

### Step 3: Define Actions

Har transition pe kya karna hai:

```
pending → validating:
  - Check audio format
  - Check audio length
  - Check audio quality

validating → processing:
  - Remove noise
  - Normalize volume
  - Split into chunks

processing → training:
  - Send to AI model
  - Train voice clone
  - Save model weights

training → ready:
  - Save to S3
  - Update DB status
  - Notify user (push/email)
```

### Step 4: Handle Failures

Kya karna hai agar fail ho jaye:

```
- Retry logic (3 attempts)
- Backoff (1s, 5s, 30s wait)
- Dead letter queue (permanently failed)
- Notify admin
- Refund if paid
```

### Step 5: Track Progress

User ko progress dikhana:

```json
{
  "status": "training",
  "progress": 65,
  "currentStep": "Training AI model",
  "estimatedTime": "2 minutes remaining"
}
```

---

## Visual Diagram

```
┌─────────┐     ┌────────────┐     ┌────────────┐     ┌──────────┐     ┌───────┐
│ PENDING │────▶│ VALIDATING │────▶│ PROCESSING │────▶│ TRAINING │────▶│ READY │
└─────────┘     └────────────┘     └────────────┘     └──────────┘     └───────┘
                      │                   │                 │
                      │                   │                 │
                      ▼                   ▼                 ▼
                 ┌─────────┐         ┌─────────┐       ┌─────────┐
                 │ FAILED  │◀────────│ FAILED  │◀──────│ FAILED  │
                 └─────────┘         └─────────┘       └─────────┘
                      │
                      │ (retry)
                      ▼
                 ┌─────────┐
                 │ PENDING │
                 └─────────┘
```

---

## Code Example (BullMQ)

### Creating a Job

```typescript
// Job create karo
await voiceCloneQueue.add('clone', {
  userId: 'user123',
  audioUrl: 's3://bucket/audio.mp3',
});
```

### Worker Processing

```typescript
const worker = new Worker('voiceClone', async job => {
  const { userId, audioUrl } = job.data;

  // Update status in DB
  await updateStatus(userId, 'validating');
  await job.updateProgress(10);

  // Step 1: Validate
  const isValid = await validateAudio(audioUrl);
  if (!isValid) throw new Error('Invalid audio');

  await updateStatus(userId, 'processing');
  await job.updateProgress(30);

  // Step 2: Process
  const processedAudio = await processAudio(audioUrl);

  await updateStatus(userId, 'training');
  await job.updateProgress(50);

  // Step 3: Train
  const modelUrl = await trainVoiceModel(processedAudio);

  await updateStatus(userId, 'ready');
  await job.updateProgress(100);

  // Step 4: Notify
  await notifyUser(userId, 'Your voice clone is ready!');

  return { modelUrl };
});
```

---

## When to Use Workflow vs API?

| Scenario                 | Use          |
| ------------------------ | ------------ |
| Login/Signup             | Normal API   |
| Get user profile         | Normal API   |
| Send message             | Normal API   |
| **Voice cloning**        | **Workflow** |
| **Meeting recording**    | **Workflow** |
| **Payment processing**   | **Workflow** |
| **Email sending (bulk)** | **Workflow** |
| **Report generation**    | **Workflow** |

### Rule of Thumb

> Agar task 5 second se zyada lega ya fail hone pe retry chahiye → **Workflow use karo**

---

## Workflow Implementation Options

### 1. BullMQ (Recommended for our use case)

- Redis-based job queue
- Simple to use
- Good for most workflows
- Already integrated in our project

### 2. XState (State Machines)

- Complex state transitions
- Visual editor available
- Good for UI state management

### 3. Temporal.io

- Heavy duty distributed workflows
- Complex retry logic
- Overkill for most cases

### 4. Custom Workflow Engine

- Full control
- More code to maintain
- Build only if needed

---

## Database Schema for Workflows

```sql
-- Workflow Jobs Table
CREATE TABLE workflow_jobs (
  id UUID PRIMARY KEY,
  type VARCHAR(50) NOT NULL,        -- 'voice_clone', 'meeting', etc.
  status VARCHAR(20) NOT NULL,      -- 'pending', 'processing', 'ready', 'failed'
  progress INT DEFAULT 0,           -- 0-100
  current_step VARCHAR(100),        -- 'Training AI model'
  data JSONB,                       -- Job specific data
  result JSONB,                     -- Final result
  error TEXT,                       -- Error message if failed
  attempts INT DEFAULT 0,           -- Retry count
  max_attempts INT DEFAULT 3,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Workflow History Table (Audit Trail)
CREATE TABLE workflow_history (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES workflow_jobs(id),
  from_status VARCHAR(20),
  to_status VARCHAR(20),
  message TEXT,
  created_at TIMESTAMP
);
```

---

## Best Practices

1. **Always save state to DB** - Server crash pe bhi recover ho sake
2. **Use idempotent operations** - Same job 2 baar run ho to bhi same result aaye
3. **Set timeouts** - Infinite loops se bachne ke liye
4. **Log everything** - Debugging ke liye
5. **Notify on failures** - Admin ko pata chale
6. **Use dead letter queue** - Permanently failed jobs track karo
7. **Show progress to user** - UX better hoga
