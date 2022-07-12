/*
  Warnings:

  - The primary key for the `DepositAssoc` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "DepositAssoc" DROP CONSTRAINT "DepositAssoc_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "DepositAssoc_pkey" PRIMARY KEY ("id");
