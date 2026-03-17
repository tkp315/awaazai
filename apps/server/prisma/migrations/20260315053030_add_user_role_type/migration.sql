-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CONSUMER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'CONSUMER';
