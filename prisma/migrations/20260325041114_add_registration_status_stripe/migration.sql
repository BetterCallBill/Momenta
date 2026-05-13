/*
  Warnings:

  - A unique constraint covering the columns `[stripeSessionId]` on the table `Registration` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Registration" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'confirmed',
ADD COLUMN     "stripeSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Registration_stripeSessionId_key" ON "Registration"("stripeSessionId");
