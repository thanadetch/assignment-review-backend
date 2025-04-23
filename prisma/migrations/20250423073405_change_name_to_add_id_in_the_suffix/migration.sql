/*
  Warnings:

  - You are about to drop the column `previousAssignment` on the `Assignment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assignment" DROP COLUMN "previousAssignment",
ADD COLUMN     "previousAssignmentId" TEXT;
