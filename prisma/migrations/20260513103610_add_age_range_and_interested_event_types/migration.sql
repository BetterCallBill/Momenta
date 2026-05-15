-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "ageRange" TEXT,
ADD COLUMN     "interestedEventTypes" TEXT NOT NULL DEFAULT '[]';
