-- CreateTable
CREATE TABLE "ApiKey" (
    "id" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "label" TEXT,
    "apiKey" TEXT NOT NULL,
    "apiSecret" TEXT NOT NULL,
    "passphrase" TEXT,
    "permissions" TEXT[],
    "isTestnet" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trade" (
    "id" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quoteQty" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION,
    "commissionAsset" TEXT,
    "orderId" TEXT NOT NULL,
    "tradeId" TEXT,
    "isMaker" BOOLEAN NOT NULL DEFAULT false,
    "executedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "clientOrderId" TEXT,
    "side" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION,
    "stopPrice" DOUBLE PRECISION,
    "filledQty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "avgPrice" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioSnapshot" (
    "id" TEXT NOT NULL,
    "totalValueUSD" DOUBLE PRECISION NOT NULL,
    "spotValueUSD" DOUBLE PRECISION NOT NULL,
    "futuresValueUSD" DOUBLE PRECISION NOT NULL,
    "unrealizedPnL" DOUBLE PRECISION NOT NULL,
    "realizedPnL" DOUBLE PRECISION NOT NULL,
    "snapshotAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PortfolioSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApiKey_exchange_idx" ON "ApiKey"("exchange");

-- CreateIndex
CREATE INDEX "ApiKey_isActive_idx" ON "ApiKey"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_exchange_label_key" ON "ApiKey"("exchange", "label");

-- CreateIndex
CREATE INDEX "Trade_exchange_symbol_idx" ON "Trade"("exchange", "symbol");

-- CreateIndex
CREATE INDEX "Trade_executedAt_idx" ON "Trade"("executedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Trade_exchange_orderId_key" ON "Trade"("exchange", "orderId");

-- CreateIndex
CREATE INDEX "Order_exchange_symbol_idx" ON "Order"("exchange", "symbol");

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Order_exchange_orderId_key" ON "Order"("exchange", "orderId");

-- CreateIndex
CREATE INDEX "PortfolioSnapshot_snapshotAt_idx" ON "PortfolioSnapshot"("snapshotAt");
