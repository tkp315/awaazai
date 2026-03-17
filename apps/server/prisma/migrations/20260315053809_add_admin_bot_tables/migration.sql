/*
  Warnings:

  - Added the required column `availableBotId` to the `Bot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "availableBotId" TEXT NOT NULL,
ALTER COLUMN "isPublic" SET DEFAULT false;

-- CreateTable
CREATE TABLE "AvailableBot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailableBot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableBotCapability" (
    "id" TEXT NOT NULL,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "availableBotId" TEXT NOT NULL,
    "capabilityId" TEXT NOT NULL,

    CONSTRAINT "AvailableBotCapability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AvailableBotCapability_availableBotId_capabilityId_key" ON "AvailableBotCapability"("availableBotId", "capabilityId");

-- CreateIndex
CREATE INDEX "Bot_userId_idx" ON "Bot"("userId");

-- CreateIndex
CREATE INDEX "Bot_availableBotId_idx" ON "Bot"("availableBotId");

-- AddForeignKey
ALTER TABLE "AvailableBotCapability" ADD CONSTRAINT "AvailableBotCapability_availableBotId_fkey" FOREIGN KEY ("availableBotId") REFERENCES "AvailableBot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvailableBotCapability" ADD CONSTRAINT "AvailableBotCapability_capabilityId_fkey" FOREIGN KEY ("capabilityId") REFERENCES "Capability"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bot" ADD CONSTRAINT "Bot_availableBotId_fkey" FOREIGN KEY ("availableBotId") REFERENCES "AvailableBot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
