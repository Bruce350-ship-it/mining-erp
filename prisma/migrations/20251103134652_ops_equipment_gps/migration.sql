-- AlterTable
ALTER TABLE "Equipment" ADD COLUMN     "lastKnownAt" TIMESTAMP(3),
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;
