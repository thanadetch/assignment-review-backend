/*
  Warnings:

  - You are about to drop the column `expireAt` on the `OtpChallenge` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ref]` on the table `OtpChallenge` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OtpChallenge" DROP COLUMN "expireAt";

-- CreateIndex
CREATE UNIQUE INDEX "OtpChallenge_ref_key" ON "OtpChallenge"("ref");
