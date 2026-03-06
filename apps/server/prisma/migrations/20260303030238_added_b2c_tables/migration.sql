-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('MOBILE', 'DESKTOP', 'TABLET', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('INDIVIDUAL', 'ORGANIZATION');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('CUSTOMER', 'ADMIN', 'GUEST_USER');

-- CreateEnum
CREATE TYPE "VerificationType" AS ENUM ('EMAIL_VERIFY', 'PASSWORD_RESET');

-- CreateEnum
CREATE TYPE "TalkType" AS ENUM ('CASUAL', 'FORMAL', 'FRIENDLY', 'MOTIVATIONAL', 'STORYTELLING');

-- CreateEnum
CREATE TYPE "TalkingTone" AS ENUM ('CALM', 'WARM', 'ENERGETIC', 'SERIOUS', 'HUMOROUS');

-- CreateEnum
CREATE TYPE "Emotion" AS ENUM ('HAPPY', 'NEUTRAL', 'EMPATHETIC', 'ENCOURAGING', 'RELAXED');

-- CreateEnum
CREATE TYPE "ResponseLength" AS ENUM ('SHORT', 'MEDIUM', 'DETAILED');

-- CreateEnum
CREATE TYPE "VoiceSpeed" AS ENUM ('SLOW', 'NORMAL', 'FAST');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('PRIVATE_LIMITED', 'LLP', 'PARTNERSHIP', 'PROPRIETORSHIP', 'PUBLIC_LIMITED', 'OTHER');

-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('PENDING_VERIFICATION', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "OrgPlan" AS ENUM ('FREE', 'BASIC', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "OrgMemberRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "OrgMemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'REMOVED');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TeamStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TeamMemberRole" AS ENUM ('LEAD', 'MEMBER');

-- CreateEnum
CREATE TYPE "BotStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "TrainingTrigger" AS ENUM ('USER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "KnowledgeType" AS ENUM ('DOCUMENT', 'NOTE', 'URL', 'FAQ');

-- CreateEnum
CREATE TYPE "KnowledgeStatus" AS ENUM ('PENDING', 'PROCESSING', 'PROCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "BotTone" AS ENUM ('FORMAL', 'CASUAL', 'FRIENDLY', 'PROFESSIONAL', 'HUMOROUS');

-- CreateEnum
CREATE TYPE "ResponseFormat" AS ENUM ('TEXT_ONLY', 'TEXT_WITH_EMOJI', 'MARKDOWN', 'RICH_TEXT');

-- CreateEnum
CREATE TYPE "FileCategory" AS ENUM ('GENERATED', 'SAMPLE', 'MESSAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('UPLOADING', 'UPLOADED', 'PROCESSING', 'READY', 'FAILED', 'DELETED');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('AUDIO', 'IMAGE', 'DOCUMENT', 'VIDEO');

-- CreateEnum
CREATE TYPE "TokenStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('MAIL', 'PUSH_NOTIFICATION', 'SYSTEM', 'PROMO', 'ALERT', 'BOT_MESSAGE', 'REMAINDER');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('SENT', 'FAILED', 'PENDING', 'DELIVERED', 'READ');

-- CreateEnum
CREATE TYPE "ScheduleType" AS ENUM ('BOT_REMINDER', 'REPORT', 'CLEANUP', 'EMAIL', 'SUBSCRIPTION', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "RepeatPattern" AS ENUM ('ONCE', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('ORGANIZATION', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'INR');

-- CreateEnum
CREATE TYPE "LimitKey" AS ENUM ('VOICE_CLONES', 'TRAINED_BOTS', 'MESSAGES_PER_DAY', 'VOICE_MIN_PER_MONTH', 'STORAGE_GB', 'API_CALLS_PER_DAY', 'TRAINING_DATA_MB');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "ResetPeriod" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'NEVER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('UPI', 'NETBANKING', 'CARD', 'WALLET');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'VOID');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'EXPORT', 'LOGIN', 'LOGOUT', 'UPLOAD', 'DOWNLOAD');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('USER', 'PROFILE', 'BOT', 'VOICE', 'CHAT', 'SESSION', 'SUBSCRIPTION', 'PAYMENT', 'INVOICE', 'SETTINGS');

-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('BUG', 'FEATURE_REQUEST', 'BILLING', 'ACCOUNT', 'VOICE_QUALITY', 'GENERAL');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('VOICE_QUALITY', 'APP_EXPERIENCE', 'BOT_RESPONSE', 'FEATURE_REQUEST', 'GENERAL');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "userStatus" "UserStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountType" "AccountType" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestUser" (
    "id" TEXT NOT NULL,
    "enteredAt" TIMESTAMP(3),
    "deviceId" TEXT,
    "trialUsed" BOOLEAN NOT NULL,
    "rating" INTEGER,
    "review" TEXT,
    "leftAt" TIMESTAMP(3),
    "triedAt" TIMESTAMP(3),
    "convertedAt" TIMESTAMP(3),
    "convertedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "age" INTEGER,
    "gender" "Gender" NOT NULL,
    "totalPlansPurchased" INTEGER,
    "avatar" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Preferences" (
    "id" TEXT NOT NULL,
    "talkType" "TalkType" NOT NULL DEFAULT 'FRIENDLY',
    "talkingTone" "TalkingTone" NOT NULL DEFAULT 'WARM',
    "emotion" "Emotion" NOT NULL DEFAULT 'NEUTRAL',
    "responseLength" "ResponseLength" NOT NULL DEFAULT 'MEDIUM',
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "voiceSpeed" "VoiceSpeed" NOT NULL DEFAULT 'NORMAL',
    "topicsOfInterest" TEXT[],
    "avoidTopics" TEXT[],
    "reminderEnabled" BOOLEAN NOT NULL DEFAULT false,
    "reminderTime" TEXT,
    "dailyGoalMinutes" INTEGER,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginHistory" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "location" JSONB NOT NULL,
    "loginAt" TIMESTAMP(3) NOT NULL,
    "userAgent" TEXT,
    "sessionId" TEXT,
    "failReason" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "deviceId" TEXT,
    "deviceInfo" TEXT,
    "isRevoked" BOOLEAN NOT NULL,
    "revokedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OTP" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL,
    "type" "VerificationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bot" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "purpose" TEXT,
    "status" "BotStatus" NOT NULL DEFAULT 'ACTIVE',
    "avatar" TEXT,
    "lastUsedAt" TIMESTAMP(3),
    "isPublic" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Capability" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Capability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapabilityFunction" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "capabilityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CapabilityFunction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotCapability" (
    "id" TEXT NOT NULL,
    "isEnabled" BOOLEAN,
    "settings" JSONB NOT NULL,
    "botId" TEXT NOT NULL,
    "capabilityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotCapability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotVoice" (
    "id" TEXT NOT NULL,
    "generatedVoiceSample" TEXT,
    "elvenlabsVoiceId" TEXT,
    "voiceName" TEXT,
    "relation" TEXT,
    "status" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "slangs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "aiObservations" JSONB,
    "aiCallUserAs" TEXT,
    "botId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BotVoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SampleVoice" (
    "id" TEXT NOT NULL,
    "url" TEXT,
    "status" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "botVoiceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SampleVoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotTraining" (
    "id" TEXT NOT NULL,
    "status" "TrainingStatus" NOT NULL DEFAULT 'QUEUED',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "error" TEXT,
    "trainedModelUrl" TEXT,
    "modelVersion" TEXT,
    "triggeredBy" "TrainingTrigger" NOT NULL DEFAULT 'USER',
    "metadata" JSONB,
    "botId" TEXT NOT NULL,
    "capabilityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotTraining_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotKnowledge" (
    "id" TEXT NOT NULL,
    "type" "KnowledgeType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "fileUrl" TEXT,
    "sourceUrl" TEXT,
    "percentage" INTEGER,
    "observations" JSONB,
    "status" "KnowledgeStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB,
    "botId" TEXT NOT NULL,
    "capabilityId" TEXT,
    "trainingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotKnowledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotConfig" (
    "id" TEXT NOT NULL,
    "tone" "BotTone" NOT NULL DEFAULT 'FRIENDLY',
    "personality" JSONB,
    "customPrompt" TEXT,
    "primaryLanguage" TEXT NOT NULL DEFAULT 'en',
    "secondaryLanguage" TEXT,
    "languageMixing" BOOLEAN NOT NULL DEFAULT false,
    "responseLength" "ResponseLength" NOT NULL DEFAULT 'MEDIUM',
    "responseFormat" "ResponseFormat" NOT NULL DEFAULT 'TEXT_ONLY',
    "useEmoji" BOOLEAN NOT NULL DEFAULT false,
    "welcomeMessage" TEXT,
    "fallbackMessage" TEXT,
    "voiceSpeed" "VoiceSpeed" NOT NULL DEFAULT 'NORMAL',
    "voicePitch" TEXT,
    "voiceVolume" INTEGER DEFAULT 100,
    "typingDelay" INTEGER DEFAULT 500,
    "autoGreet" BOOLEAN NOT NULL DEFAULT true,
    "rememberContext" BOOLEAN NOT NULL DEFAULT true,
    "capabilitySettings" JSONB,
    "botId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotRules" (
    "id" TEXT NOT NULL,
    "profanityFilter" BOOLEAN NOT NULL DEFAULT true,
    "blockedWords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "blockedPatterns" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "avoidTopics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "allowedTopics" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sensitiveMode" BOOLEAN NOT NULL DEFAULT false,
    "maxResponseLength" INTEGER DEFAULT 2000,
    "maxMessagesPerMin" INTEGER DEFAULT 10,
    "sessionTimeout" INTEGER DEFAULT 30,
    "canInitiateChat" BOOLEAN NOT NULL DEFAULT false,
    "canAccessUserData" BOOLEAN NOT NULL DEFAULT false,
    "canMakeToolCalls" BOOLEAN NOT NULL DEFAULT false,
    "canShareExternal" BOOLEAN NOT NULL DEFAULT false,
    "dataRetentionDays" INTEGER DEFAULT 90,
    "ageRestriction" INTEGER DEFAULT 0,
    "gdprCompliant" BOOLEAN NOT NULL DEFAULT true,
    "doList" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dontList" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "customInstructions" TEXT,
    "capabilityRules" JSONB,
    "botId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotRules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotRemainder" (
    "id" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "botId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "notificationId" TEXT NOT NULL,
    "schedulerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BotRemainder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "lastMessage" TEXT,
    "name" TEXT,
    "UsedFor" TEXT,
    "botVoiceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "messages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "userFeedback" JSONB,
    "chatId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "fileName" TEXT,
    "fileUrl" TEXT,
    "fileCategory" "FileCategory" NOT NULL,
    "type" "FileType" NOT NULL,
    "status" "FileStatus" NOT NULL,
    "fileSize" INTEGER,
    "duration" INTEGER,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "action" "ActionType" NOT NULL,
    "resource" "ResourceType" NOT NULL,
    "resourceId" TEXT,
    "details" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiLog" (
    "id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "requestBody" JSONB,
    "responseTime" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "error" TEXT,
    "userId" TEXT,
    "apiKeyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeviceToken" (
    "id" TEXT NOT NULL,
    "fcmToken" TEXT NOT NULL,
    "deviceId" TEXT,
    "status" "TokenStatus" NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeviceToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "subject" TEXT,
    "imageUrl" TEXT,
    "attachment" TEXT,
    "refrenceId" TEXT,
    "actionUrl" TEXT,
    "data" JSONB,
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "failReason" TEXT,
    "tokenId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scheduler" (
    "id" TEXT NOT NULL,
    "type" "ScheduleType" NOT NULL,
    "referenceId" TEXT,
    "referenceType" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "fromDate" TIMESTAMP(3),
    "toDate" TIMESTAMP(3),
    "repeatPattern" "RepeatPattern" NOT NULL DEFAULT 'ONCE',
    "repeateConfig" JSONB,
    "nextRunAt" TIMESTAMP(3),
    "lastRunAt" TIMESTAMP(3),
    "status" "ScheduleStatus" NOT NULL,
    "runCount" INTEGER NOT NULL DEFAULT 0,
    "failCount" INTEGER NOT NULL DEFAULT 0,
    "maxRuns" INTEGER,
    "lastError" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scheduler_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Org" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ownerName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Org_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgVerification" (
    "id" TEXT NOT NULL,
    "businessType" "BusinessType",
    "gstNumber" TEXT,
    "panNumber" TEXT,
    "verificationStatus" "OrgStatus" NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "documentUrl" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "verifiedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrgVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrgMember" (
    "id" TEXT NOT NULL,
    "role" "OrgMemberRole" NOT NULL,
    "permissions" JSONB NOT NULL,
    "status" "OrgMemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrgMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "OrgMemberRole" NOT NULL,
    "invitedBy" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "orgId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "department" TEXT,
    "teamStatus" "TeamStatus" NOT NULL,
    "orgId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "role" "TeamMemberRole" NOT NULL,
    "permissions" JSONB,
    "memberId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "PlanType" NOT NULL,
    "monthlyPrice" DECIMAL(65,30) NOT NULL,
    "yearlyPrice" DECIMAL(65,30) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'INR',
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlanFeature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "limitKey" "LimitKey" NOT NULL,
    "limitValue" INTEGER NOT NULL,
    "resetPeriod" "ResetPeriod" NOT NULL DEFAULT 'NEVER',
    "planId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlanFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
    "billingCycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "trialEndsAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "cancelReason" TEXT,
    "razorpaySubscriptionId" TEXT,
    "userId" TEXT NOT NULL,
    "orgId" TEXT,
    "planId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod",
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "paidAt" TIMESTAMP(3),
    "failReason" TEXT,
    "refundedAt" TIMESTAMP(3),
    "refundAmount" DECIMAL(65,30),
    "metadata" JSONB,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "tax" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "discount" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(65,30) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "invoiceUrl" TEXT,
    "billingPeriodStart" TIMESTAMP(3) NOT NULL,
    "billingPeriodEnd" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageTrack" (
    "id" TEXT NOT NULL,
    "limitKey" "LimitKey" NOT NULL,
    "used" INTEGER NOT NULL DEFAULT 0,
    "period" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscriptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsageTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "TicketCategory" NOT NULL,
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "userId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "userId" TEXT NOT NULL,
    "voiceId" TEXT,
    "botId" TEXT,
    "chatId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Preferences_profileId_key" ON "Preferences"("profileId");

-- CreateIndex
CREATE INDEX "LoginHistory_userId_idx" ON "LoginHistory"("userId");

-- CreateIndex
CREATE INDEX "LoginHistory_createdAt_idx" ON "LoginHistory"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_key" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "BotTraining_botId_idx" ON "BotTraining"("botId");

-- CreateIndex
CREATE INDEX "BotTraining_status_idx" ON "BotTraining"("status");

-- CreateIndex
CREATE INDEX "BotKnowledge_botId_idx" ON "BotKnowledge"("botId");

-- CreateIndex
CREATE INDEX "BotKnowledge_status_idx" ON "BotKnowledge"("status");

-- CreateIndex
CREATE UNIQUE INDEX "BotConfig_botId_key" ON "BotConfig"("botId");

-- CreateIndex
CREATE UNIQUE INDEX "BotRules_botId_key" ON "BotRules"("botId");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_botVoiceId_key" ON "Chat"("botVoiceId");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "ActivityLog_action_idx" ON "ActivityLog"("action");

-- CreateIndex
CREATE INDEX "ActivityLog_resource_idx" ON "ActivityLog"("resource");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "ApiLog_userId_idx" ON "ApiLog"("userId");

-- CreateIndex
CREATE INDEX "ApiLog_endpoint_idx" ON "ApiLog"("endpoint");

-- CreateIndex
CREATE INDEX "ApiLog_statusCode_idx" ON "ApiLog"("statusCode");

-- CreateIndex
CREATE INDEX "ApiLog_createdAt_idx" ON "ApiLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "DeviceToken_deviceId_key" ON "DeviceToken"("deviceId");

-- CreateIndex
CREATE INDEX "DeviceToken_userId_idx" ON "DeviceToken"("userId");

-- CreateIndex
CREATE INDEX "DeviceToken_fcmToken_idx" ON "DeviceToken"("fcmToken");

-- CreateIndex
CREATE INDEX "Scheduler_type_idx" ON "Scheduler"("type");

-- CreateIndex
CREATE INDEX "Scheduler_status_idx" ON "Scheduler"("status");

-- CreateIndex
CREATE INDEX "Scheduler_nextRunAt_idx" ON "Scheduler"("nextRunAt");

-- CreateIndex
CREATE INDEX "Scheduler_scheduledAt_idx" ON "Scheduler"("scheduledAt");

-- CreateIndex
CREATE UNIQUE INDEX "Org_email_key" ON "Org"("email");

-- CreateIndex
CREATE UNIQUE INDEX "OrgVerification_gstNumber_key" ON "OrgVerification"("gstNumber");

-- CreateIndex
CREATE UNIQUE INDEX "OrgVerification_verifiedById_key" ON "OrgVerification"("verifiedById");

-- CreateIndex
CREATE UNIQUE INDEX "OrgMember_userId_key" ON "OrgMember"("userId");

-- CreateIndex
CREATE INDEX "OrgMember_orgId_idx" ON "OrgMember"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "OrgMember_userId_orgId_key" ON "OrgMember"("userId", "orgId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_adminId_key" ON "Team"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_memberId_key" ON "TeamMember"("teamId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_slug_key" ON "Plan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PlanFeature_planId_limitKey_key" ON "PlanFeature"("planId", "limitKey");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_orgId_idx" ON "Subscription"("orgId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE INDEX "Payment_subscriptionId_idx" ON "Payment"("subscriptionId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_subscriptionId_idx" ON "Invoice"("subscriptionId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "Invoice"("status");

-- CreateIndex
CREATE INDEX "UsageTrack_subscriptionId_idx" ON "UsageTrack"("subscriptionId");

-- CreateIndex
CREATE INDEX "UsageTrack_limitKey_idx" ON "UsageTrack"("limitKey");

-- CreateIndex
CREATE UNIQUE INDEX "UsageTrack_subscriptionId_limitKey_period_key" ON "UsageTrack"("subscriptionId", "limitKey", "period");

-- CreateIndex
CREATE INDEX "SupportTicket_userId_idx" ON "SupportTicket"("userId");

-- CreateIndex
CREATE INDEX "SupportTicket_status_idx" ON "SupportTicket"("status");

-- CreateIndex
CREATE INDEX "SupportTicket_priority_idx" ON "SupportTicket"("priority");

-- CreateIndex
CREATE INDEX "SupportTicket_category_idx" ON "SupportTicket"("category");

-- CreateIndex
CREATE INDEX "Feedback_userId_idx" ON "Feedback"("userId");

-- CreateIndex
CREATE INDEX "Feedback_type_idx" ON "Feedback"("type");

-- CreateIndex
CREATE INDEX "Feedback_rating_idx" ON "Feedback"("rating");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Preferences" ADD CONSTRAINT "Preferences_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapabilityFunction" ADD CONSTRAINT "CapabilityFunction_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotCapability" ADD CONSTRAINT "BotCapability_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotCapability" ADD CONSTRAINT "BotCapability_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotVoice" ADD CONSTRAINT "BotVoice_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SampleVoice" ADD CONSTRAINT "SampleVoice_botVoiceId_fkey" FOREIGN KEY ("botVoiceId") REFERENCES "BotVoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotTraining" ADD CONSTRAINT "BotTraining_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotTraining" ADD CONSTRAINT "BotTraining_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotKnowledge" ADD CONSTRAINT "BotKnowledge_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotKnowledge" ADD CONSTRAINT "BotKnowledge_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotKnowledge" ADD CONSTRAINT "BotKnowledge_trainingId_fkey" FOREIGN KEY ("trainingId") REFERENCES "BotTraining"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotConfig" ADD CONSTRAINT "BotConfig_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotRules" ADD CONSTRAINT "BotRules_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotRemainder" ADD CONSTRAINT "BotRemainder_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotRemainder" ADD CONSTRAINT "BotRemainder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotRemainder" ADD CONSTRAINT "BotRemainder_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_botVoiceId_fkey" FOREIGN KEY ("botVoiceId") REFERENCES "BotVoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiLog" ADD CONSTRAINT "ApiLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeviceToken" ADD CONSTRAINT "DeviceToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "DeviceToken"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgVerification" ADD CONSTRAINT "OrgVerification_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgMember" ADD CONSTRAINT "OrgMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrgMember" ADD CONSTRAINT "OrgMember_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "OrgMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlanFeature" ADD CONSTRAINT "PlanFeature_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Org"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsageTrack" ADD CONSTRAINT "UsageTrack_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
