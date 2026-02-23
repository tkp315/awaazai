# AwaazAI Workflows

## B2C Workflows

### 1. User Onboarding

```
signup → verify_email → profile_setup → first_voice_sample → complete
```

### 2. Voice Cloning

```
upload_samples → validate_quality → processing → train_model → ready
```

**States:** pending, validating, processing, training, ready, failed

### 3. Subscription

```
select_plan → payment_pending → payment_success → active → renew/cancel
```

### 4. Voice Chat Session

```
start → active → pause → resume → end → save_history
```

---

## B2B Workflows

### 1. Org Onboarding

```
register → verify_business → setup_org → invite_members → complete
```

### 2. Voice Bot Creation

```
create_bot → upload_voice → configure_personality → testing → deploy → live
```

**States:** draft, voice_pending, configuring, testing, deployed, paused

### 3. Meeting

```
scheduled → participants_joining → live → recording → ended → transcript_ready
```

### 4. Member Invitation

```
invite_sent → pending → accepted/rejected → role_assigned → active
```

---

## Common/Shared Workflows

### 1. Audio Processing Pipeline

```
upload → validate → transcribe(STT) → process_response → generate(TTS) → deliver
```

### 2. Payment/Billing

```
invoice_generated → payment_pending → paid → receipt_sent
```

### 3. Support Ticket

```
created → assigned → in_progress → resolved → closed
```

### 4. Content Moderation

```
submitted → ai_check → flagged/approved → action_taken
```

---

## Advanced Workflows (Future)

### 1. Voice Model Training

```
queued → training → validation → deployment → monitoring
```

### 2. API Rate Limit

```
active → limit_hit → cooldown → reset → active
```

### 3. Notification Delivery

```
created → queued → sending → delivered/failed → retry
```

---

## Implementation Notes

**Recommended Approach:**

- Simple workflows: BullMQ jobs with status tracking in DB
- Complex workflows: XState (state machines) or custom workflow engine
- Heavy duty: Temporal.io (for distributed workflows)

**Status Tracking:**

- Store current state in DB (status field)
- Store state history for audit trail
- Use Redis for real-time state updates

**Job Queue Integration:**

- Voice cloning → `voiceClone` queue
- Audio processing → `tts`, `stt` queues
- Meeting → `meeting` queue
