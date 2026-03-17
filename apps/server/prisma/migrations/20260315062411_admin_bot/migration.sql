/*
  Warnings:

  - You are about to drop the `AvailableBotCapability` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AvailableBotCapability" DROP CONSTRAINT "AvailableBotCapability_availableBotId_fkey";

-- DropForeignKey
ALTER TABLE "AvailableBotCapability" DROP CONSTRAINT "AvailableBotCapability_capabilityId_fkey";

-- DropTable
DROP TABLE "AvailableBotCapability";

-- CreateTable
CREATE TABLE "_AvailableBotToCapability" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AvailableBotToCapability_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_AvailableBotToCapability_B_index" ON "_AvailableBotToCapability"("B");

-- AddForeignKey
ALTER TABLE "_AvailableBotToCapability" ADD CONSTRAINT "_AvailableBotToCapability_A_fkey" FOREIGN KEY ("A") REFERENCES "AvailableBot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AvailableBotToCapability" ADD CONSTRAINT "_AvailableBotToCapability_B_fkey" FOREIGN KEY ("B") REFERENCES "Capability"("id") ON DELETE CASCADE ON UPDATE CASCADE;
