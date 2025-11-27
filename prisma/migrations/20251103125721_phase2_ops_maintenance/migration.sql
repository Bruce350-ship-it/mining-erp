-- CreateTable
CREATE TABLE "Mine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "siteId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mineId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OperationsLog" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pitId" TEXT,
    "equipmentId" TEXT,
    "notes" TEXT,

    CONSTRAINT "OperationsLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrillLog" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pitId" TEXT NOT NULL,
    "meters" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,

    CONSTRAINT "DrillLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlastRecord" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pitId" TEXT NOT NULL,
    "explosivesKg" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,

    CONSTRAINT "BlastRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OreGrade" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pitId" TEXT NOT NULL,
    "gradeAu" DOUBLE PRECISION,
    "gradeCu" DOUBLE PRECISION,
    "gradeFe" DOUBLE PRECISION,

    CONSTRAINT "OreGrade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialMovement" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sourcePitId" TEXT,
    "destination" TEXT NOT NULL,
    "materialType" TEXT NOT NULL,
    "tons" DOUBLE PRECISION NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MaterialMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceSchedule" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "nextDueDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkOrder" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "WorkOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FuelLog" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liters" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "FuelLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BreakdownReport" (
    "id" TEXT NOT NULL,
    "equipmentId" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "severity" TEXT NOT NULL,
    "description" TEXT,
    "workOrderId" TEXT,

    CONSTRAINT "BreakdownReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_code_key" ON "Equipment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_code_key" ON "Asset"("code");

-- AddForeignKey
ALTER TABLE "Pit" ADD CONSTRAINT "Pit_mineId_fkey" FOREIGN KEY ("mineId") REFERENCES "Mine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationsLog" ADD CONSTRAINT "OperationsLog_pitId_fkey" FOREIGN KEY ("pitId") REFERENCES "Pit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OperationsLog" ADD CONSTRAINT "OperationsLog_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrillLog" ADD CONSTRAINT "DrillLog_pitId_fkey" FOREIGN KEY ("pitId") REFERENCES "Pit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlastRecord" ADD CONSTRAINT "BlastRecord_pitId_fkey" FOREIGN KEY ("pitId") REFERENCES "Pit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OreGrade" ADD CONSTRAINT "OreGrade_pitId_fkey" FOREIGN KEY ("pitId") REFERENCES "Pit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialMovement" ADD CONSTRAINT "MaterialMovement_sourcePitId_fkey" FOREIGN KEY ("sourcePitId") REFERENCES "Pit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceSchedule" ADD CONSTRAINT "MaintenanceSchedule_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkOrder" ADD CONSTRAINT "WorkOrder_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelLog" ADD CONSTRAINT "FuelLog_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakdownReport" ADD CONSTRAINT "BreakdownReport_equipmentId_fkey" FOREIGN KEY ("equipmentId") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakdownReport" ADD CONSTRAINT "BreakdownReport_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
