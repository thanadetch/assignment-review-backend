/*
  Warnings:

  - You are about to drop the `_SubjectToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SubjectToUser" DROP CONSTRAINT "_SubjectToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubjectToUser" DROP CONSTRAINT "_SubjectToUser_B_fkey";

-- DropTable
DROP TABLE "_SubjectToUser";

-- CreateTable
CREATE TABLE "SubjectEnrollment" (
    "subjectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SubjectEnrollment_pkey" PRIMARY KEY ("subjectId","userId")
);

-- AddForeignKey
ALTER TABLE "SubjectEnrollment" ADD CONSTRAINT "SubjectEnrollment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectEnrollment" ADD CONSTRAINT "SubjectEnrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
