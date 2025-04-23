/*
  Warnings:

  - You are about to drop the `AssignmentReview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubjectEnrollment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `previousAssignment` to the `Assignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AssignmentReview" DROP CONSTRAINT "AssignmentReview_reviewAssignmentId_fkey";

-- DropForeignKey
ALTER TABLE "AssignmentReview" DROP CONSTRAINT "AssignmentReview_reviewerAssignmentId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectEnrollment" DROP CONSTRAINT "SubjectEnrollment_subjectId_fkey";

-- DropForeignKey
ALTER TABLE "SubjectEnrollment" DROP CONSTRAINT "SubjectEnrollment_userId_fkey";

-- AlterTable
ALTER TABLE "Assignment" ADD COLUMN     "previousAssignment" TEXT NOT NULL;

-- DropTable
DROP TABLE "AssignmentReview";

-- DropTable
DROP TABLE "SubjectEnrollment";

-- CreateTable
CREATE TABLE "_SubjectToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubjectToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubjectToUser_B_index" ON "_SubjectToUser"("B");

-- AddForeignKey
ALTER TABLE "_SubjectToUser" ADD CONSTRAINT "_SubjectToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubjectToUser" ADD CONSTRAINT "_SubjectToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
