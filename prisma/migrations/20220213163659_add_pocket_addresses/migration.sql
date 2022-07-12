-- CreateTable
CREATE TABLE "PocketAddress" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "publicKey" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "ethAddr" TEXT NOT NULL,

    CONSTRAINT "PocketAddress_pkey" PRIMARY KEY ("id")
);
