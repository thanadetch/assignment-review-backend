/*
  Warnings:

  - You are about to drop the column `previousAssignmentId` on the `Assignment` table. All the data in the column will be lost.
  - Added the required column `type` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AssignmentType" AS ENUM ('SUBMISSION', 'REVIEW');

-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "previousAssignmentId",
ADD COLUMN     "type" "AssignmentType" NOT NULL;

-- CreateTable
CREATE TABLE "AssignmentReview" (
    "id" TEXT NOT NULL,
    "reviewerAssignmentId" TEXT NOT NULL,
    "reviewAssignmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssignmentReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssignmentReview" ADD CONSTRAINT "AssignmentReview_reviewerAssignmentId_fkey" FOREIGN KEY ("reviewerAssignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssignmentReview" ADD CONSTRAINT "AssignmentReview_reviewAssignmentId_fkey" FOREIGN KEY ("reviewAssignmentId") REFERENCES "Assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
