-- CreateTable
CREATE TABLE "HealthCheck" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "HealthCheck_pkey" PRIMARY KEY ("id")
);
