-- CreateTable
CREATE TABLE "BerbixEvent" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,

    CONSTRAINT "BerbixEvent_pkey" PRIMARY KEY ("id")
);
