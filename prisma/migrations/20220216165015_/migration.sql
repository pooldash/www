/*
  Warnings:

  - A unique constraint covering the columns `[publicKey]` on the table `PocketAddress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[privateKey]` on the table `PocketAddress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[address]` on the table `PocketAddress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ethAddr]` on the table `PocketAddress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PocketAddress_publicKey_key" ON "PocketAddress"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "PocketAddress_privateKey_key" ON "PocketAddress"("privateKey");

-- CreateIndex
CREATE UNIQUE INDEX "PocketAddress_address_key" ON "PocketAddress"("address");

-- CreateIndex
CREATE UNIQUE INDEX "PocketAddress_ethAddr_key" ON "PocketAddress"("ethAddr");
