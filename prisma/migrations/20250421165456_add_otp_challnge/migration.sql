-- CreateTable
CREATE TABLE "OtpChallenge" (
    "id" TEXT NOT NULL,
    "otpCode" TEXT NOT NULL,
    "expireAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "OtpChallenge_pkey" PRIMARY KEY ("id")
);
