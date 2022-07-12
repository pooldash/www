-- CreateTable
CREATE TABLE "DepositTransfer" (
    "id" BIGSERIAL NOT NULL,
    "transferTxHash" TEXT,
    "ethAddr" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "fee" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepositTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepositAssoc" (
    "depositTxHash" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepositAssoc_pkey" PRIMARY KEY ("depositTxHash")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepositTransfer_transferTxHash_key" ON "DepositTransfer"("transferTxHash");

-- CreateIndex
CREATE UNIQUE INDEX "DepositAssoc_depositTxHash_key" ON "DepositAssoc"("depositTxHash");

-- AddForeignKey
ALTER TABLE "DepositAssoc" ADD CONSTRAINT "DepositAssoc_depositTxHash_fkey" FOREIGN KEY ("depositTxHash") REFERENCES "DepositTransfer"("transferTxHash") ON DELETE RESTRICT ON UPDATE CASCADE;
