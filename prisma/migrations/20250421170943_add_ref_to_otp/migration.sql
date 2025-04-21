/*
  Warnings:

  - Added the required column `ref` to the `OtpChallenge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OtpChallenge" ADD COLUMN     "ref" TEXT NOT NULL;
