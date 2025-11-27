-- CreateTable
CREATE TABLE "SafetyIncident" (
    "id" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "siteId" TEXT,
    "severity" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SafetyIncident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inspection" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "siteId" TEXT,
    "type" TEXT NOT NULL,
    "findings" TEXT,
    "passed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Inspection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PPEIssued" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PPEIssued_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnvironmentalReading" (
    "id" TEXT NOT NULL,
    "siteId" TEXT,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "takenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnvironmentalReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Emission" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Emission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WasteLog" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disposed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WasteLog_pkey" PRIMARY KEY ("id")
);
