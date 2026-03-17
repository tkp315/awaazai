-- AlterTable
ALTER TABLE "Preferences" ALTER COLUMN "topicsOfInterest" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "avoidTopics" SET DEFAULT ARRAY[]::TEXT[];
