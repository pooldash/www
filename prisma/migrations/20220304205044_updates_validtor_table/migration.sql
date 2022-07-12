/*
  Warnings:

  - The primary key for the `ValidatorReward` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `txHash` on the `ValidatorReward` table. All the data in the column will be lost.
  - You are about to drop the column `validatorAddr` on the `ValidatorReward` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[addr,blockHeight]` on the table `ValidatorReward` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addr` to the `ValidatorReward` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ValidatorReward" DROP CONSTRAINT "ValidatorReward_validatorAddr_fkey";

-- DropIndex
DROP INDEX "ValidatorReward_txHash_key";

-- AlterTable
ALTER TABLE "ValidatorReward" DROP CONSTRAINT "ValidatorReward_pkey",
DROP COLUMN "txHash",
DROP COLUMN "validatorAddr",
ADD COLUMN     "addr" TEXT NOT NULL,
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "ValidatorReward_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ValidatorReward_addr_blockHeight_unique_constraint" ON "ValidatorReward"("addr", "blockHeight");

-- AddForeignKey
ALTER TABLE "ValidatorReward" ADD CONSTRAINT "ValidatorReward_addr_fkey" FOREIGN KEY ("addr") REFERENCES "Validator"("poktAddr") ON DELETE RESTRICT ON UPDATE CASCADE;
