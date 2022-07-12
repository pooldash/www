-- CreateTable
CREATE TABLE "RebaseAttempt" (
    "id" BIGSERIAL NOT NULL,
    "blockHeight" BIGINT NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RebaseAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RebaseLock" (
    "id" BIGSERIAL NOT NULL,
    "blockHeight" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RebaseLock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RebaseLock_blockHeight_key" ON "RebaseLock"("blockHeight");
