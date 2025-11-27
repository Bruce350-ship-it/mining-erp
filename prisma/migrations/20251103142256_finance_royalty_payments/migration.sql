-- CreateTable
CREATE TABLE "RoyaltyPayment" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL,
    "authority" TEXT NOT NULL,

    CONSTRAINT "RoyaltyPayment_pkey" PRIMARY KEY ("id")
);
