-- CreateTable
CREATE TABLE "RevenueLedger" (
    "id" BIGSERIAL NOT NULL,
    "virtualTxNum" BIGINT NOT NULL,
    "blockHeight" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "balanceBefore" BIGINT NOT NULL,
    "balanceAfter" BIGINT NOT NULL,
    "txHash" TEXT,

    CONSTRAINT "RevenueLedger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RevenueLedger_virtualTxNum_key" ON "RevenueLedger"("virtualTxNum");
