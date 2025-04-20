/*
  Warnings:

  - Added the required column `subjectId` to the `MasterAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('DUE_DATE', 'ASSIGN_REVIEW', 'COMMENT', 'REVIEWED');

-- AlterTable
ALTER TABLE "MasterAssignment" ADD COLUMN     "subjectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "NotificationType" NOT NULL;

-- AddForeignKey
ALTER TABLE "MasterAssignment" ADD CONSTRAINT "MasterAssignment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
