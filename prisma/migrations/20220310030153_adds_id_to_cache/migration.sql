/*
  Warnings:

  - The primary key for the `Cache` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Cache" DROP CONSTRAINT "Cache_pkey",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "Cache_pkey" PRIMARY KEY ("id");
