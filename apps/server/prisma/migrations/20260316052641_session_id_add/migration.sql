/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `BotVoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `BotVoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionId` to the `SampleVoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SampleVoice" DROP CONSTRAINT "SampleVoice_botVoiceId_fkey";

-- AlterTable
ALTER TABLE "BotVoice" ADD COLUMN     "sessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SampleVoice" ADD COLUMN     "sessionId" TEXT NOT NULL,
ALTER COLUMN "botVoiceId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BotVoice_sessionId_key" ON "BotVoice"("sessionId");

-- AddForeignKey
ALTER TABLE "SampleVoice" ADD CONSTRAINT "SampleVoice_botVoiceId_fkey" FOREIGN KEY ("botVoiceId") REFERENCES "BotVoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
