/*
  Warnings:

  - You are about to drop the `_AvailableBotToCapability` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `availableBotId` to the `Capability` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_AvailableBotToCapability" DROP CONSTRAINT "_AvailableBotToCapability_A_fkey";

-- DropForeignKey
ALTER TABLE "_AvailableBotToCapability" DROP CONSTRAINT "_AvailableBotToCapability_B_fkey";

-- AlterTable
ALTER TABLE "Capability" ADD COLUMN     "availableBotId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_AvailableBotToCapability";

-- AddForeignKey
ALTER TABLE "Capability" ADD CONSTRAINT "Capability_availableBotId_fkey" FOREIGN KEY ("availableBotId") REFERENCES "AvailableBot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
