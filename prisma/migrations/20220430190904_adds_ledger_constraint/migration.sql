/*
  Warnings:

  - A unique constraint covering the columns `[ethAddr,blockHeight,type]` on the table `Ledger` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "HealthCheck" ALTER COLUMN "healthy" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Ledger_ethAddr_blockHeight_type_unique_constraint" ON "Ledger"("ethAddr", "blockHeight", "type");
