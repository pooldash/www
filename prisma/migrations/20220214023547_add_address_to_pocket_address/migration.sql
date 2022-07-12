/*
  Warnings:

  - Added the required column `address` to the `PocketAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PocketAddress" ADD COLUMN     "address" TEXT NOT NULL;
