-- CreateTable
CREATE TABLE "Validator" (
    "name" TEXT NOT NULL,
    "poktAddr" TEXT NOT NULL,

    CONSTRAINT "Validator_pkey" PRIMARY KEY ("poktAddr")
);

-- CreateTable
CREATE TABLE "ValidatorReward" (
    "txHash" TEXT NOT NULL,
    "validatorAddr" TEXT NOT NULL,
    "amount" BIGINT NOT NULL,
    "blockHeight" BIGINT NOT NULL,

    CONSTRAINT "ValidatorReward_pkey" PRIMARY KEY ("txHash")
);

-- CreateIndex
CREATE UNIQUE INDEX "Validator_name_key" ON "Validator"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Validator_poktAddr_key" ON "Validator"("poktAddr");

-- CreateIndex
CREATE UNIQUE INDEX "ValidatorReward_txHash_key" ON "ValidatorReward"("txHash");

-- AddForeignKey
ALTER TABLE "ValidatorReward" ADD CONSTRAINT "ValidatorReward_validatorAddr_fkey" FOREIGN KEY ("validatorAddr") REFERENCES "Validator"("poktAddr") ON DELETE RESTRICT ON UPDATE CASCADE;
