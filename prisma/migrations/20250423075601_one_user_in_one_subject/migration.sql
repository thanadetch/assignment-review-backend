/*
  Warnings:

  - You are about to drop the `_SubjectToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SubjectToUser" DROP CONSTRAINT "_SubjectToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToUser" DROP CONSTRAINT "_SubjectToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "subjectId" TEXT;

-- DropTable
DROP TABLE "_SubjectToUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
