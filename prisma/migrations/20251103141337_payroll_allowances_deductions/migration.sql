-- CreateTable
CREATE TABLE "Allowance" (
    "id" TEXT NOT NULL,
    "payrollLineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Allowance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deduction" (
    "id" TEXT NOT NULL,
    "payrollLineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Deduction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Allowance" ADD CONSTRAINT "Allowance_payrollLineId_fkey" FOREIGN KEY ("payrollLineId") REFERENCES "PayrollLine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deduction" ADD CONSTRAINT "Deduction_payrollLineId_fkey" FOREIGN KEY ("payrollLineId") REFERENCES "PayrollLine"("id") ON DELETE CASCADE ON UPDATE CASCADE;
