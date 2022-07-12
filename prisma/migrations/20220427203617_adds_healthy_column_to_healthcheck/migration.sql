/*
  Warnings:

  - Added the required column `healthy` to the `HealthCheck` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HealthCheck" ADD COLUMN     "healthy" BOOLEAN NOT NULL DEFAULT TRUE;
