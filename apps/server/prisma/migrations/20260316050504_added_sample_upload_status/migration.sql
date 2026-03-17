/*
  Warnings:

  - The `status` column on the `BotVoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `SampleVoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "VoiceStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "SampleStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'TRANSCRIBED', 'FAILED');

-- AlterTable
ALTER TABLE "BotVoice" DROP COLUMN "status",
ADD COLUMN     "status" "VoiceStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "SampleVoice" ADD COLUMN     "transcription" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "SampleStatus" NOT NULL DEFAULT 'UPLOADED';
