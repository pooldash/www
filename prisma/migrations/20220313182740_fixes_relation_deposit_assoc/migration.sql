/*
  Warnings:

  - Added the required column `transferTxId` to the `DepositAssoc` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DepositAssoc" DROP CONSTRAINT "DepositAssoc_depositTxHash_fkey";

-- AlterTable
ALTER TABLE "DepositAssoc" ADD COLUMN     "transferTxId" BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE "DepositAssoc" ADD CONSTRAINT "DepositAssoc_transferTxId_fkey" FOREIGN KEY ("transferTxId") REFERENCES "DepositTransfer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
