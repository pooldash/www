-- CreateTable
CREATE TABLE "InternalTransfer" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "blockHeight" BIGINT NOT NULL,
    "fromEthAddr" TEXT NOT NULL,
    "toEthAddr" TEXT NOT NULL,

    CONSTRAINT "InternalTransfer_pkey" PRIMARY KEY ("id")
);
