-- CreateTable
CREATE TABLE "Ledger" (
    "id" BIGSERIAL NOT NULL,
    "ethAddr" TEXT NOT NULL,
    "virtualTxNum" BIGINT NOT NULL,
    "blockHeight" BIGINT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "balanceBefore" BIGINT NOT NULL,
    "balanceAfter" BIGINT NOT NULL,
    "txHash" TEXT,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockBalances" (
    "id" BIGSERIAL NOT NULL,
    "ethAddr" TEXT NOT NULL,
    "blockHeight" BIGINT NOT NULL,
    "balance" BIGINT NOT NULL,
    "percent" DOUBLE PRECISION,

    CONSTRAINT "BlockBalances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ledger_ethAddr_virtualTxNum_unique_constraint" ON "Ledger"("ethAddr", "virtualTxNum");

-- CreateIndex
CREATE UNIQUE INDEX "BlockBalances_ethAddr_blockHeight_unique_constraint" ON "BlockBalances"("ethAddr", "blockHeight");
