/*
  Warnings:

  - Added the required column `dueDate` to the `MasterAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isGroupAssignment` to the `MasterAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MasterAssignment" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "isGroupAssignment" BOOLEAN NOT NULL;
