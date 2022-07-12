/*
  Warnings:

  - Added the required column `amount` to the `InternalTransfer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "InternalTransfer" ADD COLUMN     "amount" BIGINT NOT NULL;
