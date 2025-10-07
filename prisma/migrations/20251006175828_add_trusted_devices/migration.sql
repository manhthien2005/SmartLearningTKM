-- CreateTable
CREATE TABLE "Trusted_Devices" (
    "device_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "device_token" TEXT NOT NULL,
    "device_name" TEXT,
    "device_type" TEXT,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "last_used" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trusted_Devices_pkey" PRIMARY KEY ("device_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trusted_Devices_device_token_key" ON "Trusted_Devices"("device_token");

-- CreateIndex
CREATE INDEX "Trusted_Devices_user_id_device_token_idx" ON "Trusted_Devices"("user_id", "device_token");

-- CreateIndex
CREATE INDEX "Trusted_Devices_expires_at_idx" ON "Trusted_Devices"("expires_at");

-- AddForeignKey
ALTER TABLE "Trusted_Devices" ADD CONSTRAINT "Trusted_Devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
