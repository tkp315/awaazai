-- CreateEnum
CREATE TYPE "KnowledgeMode" AS ENUM ('AI_ONLY', 'RAG', 'HYBRID');

-- CreateEnum
CREATE TYPE "BotMessageRole" AS ENUM ('USER', 'BOT', 'SYSTEM');

-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "knowledgeMode" "KnowledgeMode" NOT NULL DEFAULT 'AI_ONLY',
ADD COLUMN     "selectedVoiceId" TEXT;

-- CreateTable
CREATE TABLE "BotChat" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "botId" TEXT NOT NULL,

    CONSTRAINT "BotChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotSession" (
    "id" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "summary" TEXT,
    "botChatId" TEXT NOT NULL,

    CONSTRAINT "BotSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotMessage" (
    "id" TEXT NOT NULL,
    "role" "BotMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "voiceUrl" TEXT,
    "ragUsed" BOOLEAN NOT NULL DEFAULT false,
    "ragSources" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "botSessionId" TEXT NOT NULL,

    CONSTRAINT "BotMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BotChat_userId_idx" ON "BotChat"("userId");

-- CreateIndex
CREATE INDEX "BotChat_botId_idx" ON "BotChat"("botId");

-- CreateIndex
CREATE INDEX "BotSession_botChatId_idx" ON "BotSession"("botChatId");

-- CreateIndex
CREATE INDEX "BotMessage_botSessionId_idx" ON "BotMessage"("botSessionId");

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_selectedVoiceId_fkey" FOREIGN KEY ("selectedVoiceId") REFERENCES "BotVoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotChat" ADD CONSTRAINT "BotChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotChat" ADD CONSTRAINT "BotChat_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotSession" ADD CONSTRAINT "BotSession_botChatId_fkey" FOREIGN KEY ("botChatId") REFERENCES "BotChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotMessage" ADD CONSTRAINT "BotMessage_botSessionId_fkey" FOREIGN KEY ("botSessionId") REFERENCES "BotSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
