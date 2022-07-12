-- AlterTable
ALTER TABLE "BlockBalances" ADD COLUMN     "date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Ledger" ADD COLUMN     "date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "RevenueLedger" ADD COLUMN     "date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ValidatorReward" ADD COLUMN     "date" TIMESTAMP(3);
