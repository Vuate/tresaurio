// lib/services/exchangeService.ts
// Unified exchange API service for authenticated requests

import crypto from "crypto";
import { getDecryptedApiKey, Exchange } from "./apiKeyService";
import { exchangeFetch } from "./exchangeFetch";

// ============================================
// Types
// ============================================

export interface SpotBalance {
  asset: string;
  free: number;
  locked: number;
  total: number;
  usdValue?: number;
}

export interface FuturesPosition {
  symbol: string;
  side: "long" | "short";
  size: number;
  entryPrice: number;
  markPrice: number;
  leverage: number;
  unrealizedPnl: number;
  marginType: "cross" | "isolated";
  liquidationPrice: number;
}

export interface OrderResult {
  orderId: string;
  symbol: string;
  side: "buy" | "sell";
  type: string;
  quantity: number;
  price?: number;
  status: string;
  executedQty: number;
  avgPrice?: number;
}

// ============================================
// Binance Implementation
// ============================================

async function getBinanceServerTime(): Promise<number> {
  const response = await exchangeFetch("https://api.binance.com/api/v3/time");
  const data = await response.json();
  return data.serverTime;
}

async function binanceRequest(
  endpoint: string,
  method: "GET" | "POST" | "DELETE",
  params: Record<string, string | number> = {},
  credentials: { apiKey: string; apiSecret: string },
  baseUrl: string = "https://api.binance.com",
): Promise<unknown> {
  const timestamp = await getBinanceServerTime();
  const queryParams = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ),
    timestamp: String(timestamp),
  });

  const signature = crypto
    .createHmac("sha256", credentials.apiSecret)
    .update(queryParams.toString())
    .digest("hex");

  queryParams.append("signature", signature);

  const url = `${baseUrl}${endpoint}?${queryParams.toString()}`;

  const response = await exchangeFetch(url, {
    method,
    headers: {
      "X-MBX-APIKEY": credentials.apiKey,
    },
  });

  const responseText = await response.text();

  if (!responseText) {
    throw new Error(
      "Binance API Error: Empty response - exchange may be blocking requests",
    );
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Binance API Error: Invalid JSON response - ${responseText.substring(0, 200)}`,
    );
  }

  if (!response.ok) {
    console.error("[Binance] Error:", response.status, data.msg);
    throw new Error(`Binance API Error: ${data.msg || response.statusText}`);
  }

  return data;
}

async function getBinanceSpotBalances(credentials: {
  apiKey: string;
  apiSecret: string;
}): Promise<SpotBalance[]> {
  const data = (await binanceRequest(
    "/api/v3/account",
    "GET",
    {},
    credentials,
  )) as { balances: { asset: string; free: string; locked: string }[] };

  return data.balances
    .filter((b) => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0)
    .map((b) => ({
      asset: b.asset,
      free: parseFloat(b.free),
      locked: parseFloat(b.locked),
      total: parseFloat(b.free) + parseFloat(b.locked),
    }));
}

async function getBinanceAvgEntryPrice(
  credentials: { apiKey: string; apiSecret: string },
  symbol: string
): Promise<number | null> {
  try {
    const trades = (await binanceRequest(
      "/api/v3/myTrades",
      "GET",
      { symbol, limit: 1000 },
      credentials,
    )) as { price: string; qty: string; quoteQty: string; isBuyer: boolean; time: number }[];

    if (!trades || trades.length === 0) return null;

    // Calculate weighted average from BUY trades only
    let totalBuyQty = 0;
    let totalBuyCost = 0;

    for (const trade of trades) {
      if (trade.isBuyer) {
        totalBuyQty += parseFloat(trade.qty);
        totalBuyCost += parseFloat(trade.quoteQty);
      }
    }

    if (totalBuyQty <= 0) return null;
    return totalBuyCost / totalBuyQty;
  } catch (error) {
    console.error(`[Binance] Failed to get avg entry for ${symbol}:`, error);
    return null;
  }
}

async function getBinanceFuturesPositions(credentials: {
  apiKey: string;
  apiSecret: string;
}): Promise<FuturesPosition[]> {
  const data = (await binanceRequest(
    "/fapi/v2/positionRisk",
    "GET",
    {},
    credentials,
    "https://fapi.binance.com",
  )) as {
    symbol: string;
    positionAmt: string;
    entryPrice: string;
    markPrice: string;
    unRealizedProfit: string;
    leverage: string;
    marginType: string;
    liquidationPrice: string;
  }[];

  return data
    .filter((p) => parseFloat(p.positionAmt) !== 0)
    .map((p) => ({
      symbol: p.symbol,
      side:
        parseFloat(p.positionAmt) > 0 ? ("long" as const) : ("short" as const),
      size: Math.abs(parseFloat(p.positionAmt)),
      entryPrice: parseFloat(p.entryPrice),
      markPrice: parseFloat(p.markPrice),
      leverage: parseInt(p.leverage),
      unrealizedPnl: parseFloat(p.unRealizedProfit),
      marginType: p.marginType.toLowerCase() as "cross" | "isolated",
      liquidationPrice: parseFloat(p.liquidationPrice),
    }));
}

async function getBinanceFuturesAvailableBalance(
  credentials: { apiKey: string; apiSecret: string },
  asset: string = "USDT",
): Promise<{ asset: string; availableBalance: number }> {

  const data = (await binanceRequest(
    "/fapi/v2/balance",
    "GET",
    {},
    credentials,
    "https://fapi.binance.com",
  )) as { asset: string; availableBalance: string }[];

const usdt = data.find((b) => b.asset.toUpperCase() === asset.toUpperCase());

return {
  asset,
  availableBalance: usdt ? parseFloat(usdt.availableBalance) : 0,
};
}
// ============================================
// OKX Implementation
// ============================================

async function okxRequest(
  endpoint: string,
  method: "GET" | "POST",
  body: Record<string, unknown> | null = null,
  credentials: { apiKey: string; apiSecret: string; passphrase?: string },
): Promise<unknown> {
  const timestamp = new Date().toISOString();
  const bodyStr = body ? JSON.stringify(body) : "";
  const signStr = timestamp + method + endpoint + bodyStr;

  const signature = crypto
    .createHmac("sha256", credentials.apiSecret)
    .update(signStr)
    .digest("base64");

  const response = await exchangeFetch(`https://www.okx.com${endpoint}`, {
    method,
    headers: {
      "OK-ACCESS-KEY": credentials.apiKey,
      "OK-ACCESS-SIGN": signature,
      "OK-ACCESS-TIMESTAMP": timestamp,
      "OK-ACCESS-PASSPHRASE": credentials.passphrase || "",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const responseText = await response.text();

  if (!responseText) {
    throw new Error(
      "OKX API Error: Empty response - exchange may be blocking requests",
    );
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `OKX API Error: Invalid JSON response - ${responseText.substring(0, 200)}`,
    );
  }

  if (data.code !== "0") {
    console.error("[OKX] Error:", data.code, data.msg);
    throw new Error(`OKX API Error: ${data.msg}`);
  }

  return data.data;
}

async function getOKXSpotBalances(credentials: {
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
}): Promise<SpotBalance[]> {
  const data = (await okxRequest(
    "/api/v5/account/balance",
    "GET",
    null,
    credentials,
  )) as { details: { ccy: string; availBal: string; frozenBal: string }[] }[];

  if (!data || !data[0]) return [];

  return data[0].details
    .filter((d) => parseFloat(d.availBal) > 0 || parseFloat(d.frozenBal) > 0)
    .map((d) => ({
      asset: d.ccy,
      free: parseFloat(d.availBal),
      locked: parseFloat(d.frozenBal),
      total: parseFloat(d.availBal) + parseFloat(d.frozenBal),
    }));
}

async function getOKXFuturesPositions(credentials: {
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
}): Promise<FuturesPosition[]> {
  const data = (await okxRequest(
    "/api/v5/account/positions?instType=SWAP",
    "GET",
    null,
    credentials,
  )) as {
    instId: string;
    pos: string;
    avgPx: string;
    markPx: string;
    lever: string;
    upl: string;
    liqPx: string;
    mgnMode: string;
  }[];

  if (!data || data.length === 0) return [];

  return data
    .filter((p) => parseFloat(p.pos) !== 0)
    .map((p) => {
      const size = parseFloat(p.pos);
      // OKX instId format: "BTC-USDT-SWAP" → symbol "BTCUSDT"
      const symbol = p.instId.replace("-SWAP", "").replace("-", "");
      return {
        symbol,
        side: size > 0 ? ("long" as const) : ("short" as const),
        size: Math.abs(size),
        entryPrice: parseFloat(p.avgPx),
        markPrice: parseFloat(p.markPx),
        leverage: parseInt(p.lever),
        unrealizedPnl: parseFloat(p.upl),
        marginType: p.mgnMode === "cross" ? ("cross" as const) : ("isolated" as const),
        liquidationPrice: p.liqPx ? parseFloat(p.liqPx) : 0,
      };
    });
}

// ============================================
// Bybit Implementation
// ============================================

async function bybitRequest(
  endpoint: string,
  method: "GET" | "POST",
  params: Record<string, string | number> = {},
  credentials: { apiKey: string; apiSecret: string },
): Promise<unknown> {
  const timestamp = String(Date.now());
  const recvWindow = "5000";

  // Sort params alphabetically and build query string
  const sortedParams = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  // Bybit V5 signature: timestamp + api_key + recv_window + queryString
  const signPayload =
    timestamp + credentials.apiKey + recvWindow + sortedParams;
  const signature = crypto
    .createHmac("sha256", credentials.apiSecret)
    .update(signPayload)
    .digest("hex");

  const url = `https://api.bybit.com${endpoint}${sortedParams ? "?" + sortedParams : ""}`;

  const response = await exchangeFetch(url, {
    method,
    headers: {
      "X-BAPI-API-KEY": credentials.apiKey,
      "X-BAPI-SIGN": signature,
      "X-BAPI-SIGN-TYPE": "2",
      "X-BAPI-TIMESTAMP": timestamp,
      "X-BAPI-RECV-WINDOW": recvWindow,
    },
  });

  const responseText = await response.text();

  if (!responseText) {
    throw new Error(
      "Bybit API Error: Empty response - exchange may be blocking requests",
    );
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Bybit API Error: Invalid JSON response - ${responseText.substring(0, 200)}`,
    );
  }

  if (data.retCode !== 0) {
    console.error("[Bybit] Error:", data.retCode, data.retMsg);
    throw new Error(`Bybit API Error: ${data.retMsg}`);
  }

  return data.result;
}

async function getBybitSpotBalances(credentials: {
  apiKey: string;
  apiSecret: string;
}): Promise<SpotBalance[]> {
  const data = (await bybitRequest(
    "/v5/account/wallet-balance",
    "GET",
    { accountType: "UNIFIED" },
    credentials,
  )) as {
    list: { coin: { coin: string; walletBalance: string; locked: string }[] }[];
  };

  if (!data.list || !data.list[0]) return [];

  return data.list[0].coin
    .filter((c) => parseFloat(c.walletBalance) > 0)
    .map((c) => ({
      asset: c.coin,
      free: parseFloat(c.walletBalance) - parseFloat(c.locked || "0"),
      locked: parseFloat(c.locked || "0"),
      total: parseFloat(c.walletBalance),
    }));
}

async function getBybitFuturesPositions(credentials: {
  apiKey: string;
  apiSecret: string;
}): Promise<FuturesPosition[]> {
  const data = (await bybitRequest(
    "/v5/position/list",
    "GET",
    { category: "linear", settleCoin: "USDT" },
    credentials,
  )) as {
    list: {
      symbol: string;
      side: string;
      size: string;
      avgPrice: string;
      markPrice: string;
      leverage: string;
      unrealisedPnl: string;
      liqPrice: string;
      tradeMode: number;
    }[];
  };

  if (!data.list || data.list.length === 0) return [];

  return data.list
    .filter((p) => parseFloat(p.size) !== 0)
    .map((p) => ({
      symbol: p.symbol,
      side: p.side === "Buy" ? ("long" as const) : ("short" as const),
      size: parseFloat(p.size),
      entryPrice: parseFloat(p.avgPrice),
      markPrice: parseFloat(p.markPrice),
      leverage: parseInt(p.leverage),
      unrealizedPnl: parseFloat(p.unrealisedPnl),
      marginType: p.tradeMode === 0 ? ("cross" as const) : ("isolated" as const),
      liquidationPrice: p.liqPrice ? parseFloat(p.liqPrice) : 0,
    }));
}

// ============================================
// Binance TR Implementation
// ============================================

async function getBinanceTrServerTime(): Promise<number> {
  const response = await exchangeFetch("https://www.binance.tr/open/v1/common/time");
  const data = await response.json();
  return data.timestamp;
}

async function binanceTrRequest(
  endpoint: string,
  method: "GET" | "POST",
  params: Record<string, string | number> = {},
  credentials: { apiKey: string; apiSecret: string },
): Promise<unknown> {
  const timestamp = await getBinanceTrServerTime();
  const queryParams = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ),
    timestamp: String(timestamp),
  });

  const signature = crypto
    .createHmac("sha256", credentials.apiSecret)
    .update(queryParams.toString())
    .digest("hex");

  queryParams.append("signature", signature);

  const url = `https://www.binance.tr${endpoint}?${queryParams.toString()}`;

  const response = await exchangeFetch(url, {
    method,
    headers: {
      "X-MBX-APIKEY": credentials.apiKey,
    },
  });

  const responseText = await response.text();

  if (!responseText) {
    throw new Error(
      "Binance TR API Error: Empty response - exchange may be blocking requests",
    );
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Binance TR API Error: Invalid JSON response - ${responseText.substring(0, 200)}`,
    );
  }

  if (data.code !== 0) {
    console.error("[BinanceTR] Error:", data.code, data.msg);
    throw new Error(`Binance TR API Error: ${data.msg || "Unknown error"}`);
  }

  return data.data;
}

async function getBinanceTrSpotBalances(credentials: {
  apiKey: string;
  apiSecret: string;
}): Promise<SpotBalance[]> {
  const data = (await binanceTrRequest(
    "/open/v1/account/spot",
    "GET",
    {},
    credentials,
  )) as { accountAssets: { asset: string; free: string; locked: string }[] };

  return data.accountAssets
    .filter((b) => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0)
    .map((b) => ({
      asset: b.asset,
      free: parseFloat(b.free),
      locked: parseFloat(b.locked),
      total: parseFloat(b.free) + parseFloat(b.locked),
    }));
}

// ============================================
// Hyperliquid Implementation (DEX - No Auth)
// ============================================

async function getHyperliquidSpotBalances(
  walletAddress: string,
): Promise<SpotBalance[]> {
  const response = await exchangeFetch("https://api.hyperliquid.xyz/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "spotClearinghouseState",
      user: walletAddress,
    }),
  });
  const responseText = await response.text();

  if (!responseText) {
    throw new Error("Hyperliquid API Error: Empty response");
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Hyperliquid API Error: Invalid JSON - ${responseText.substring(0, 200)}`,
    );
  }

  if (!data.balances) return [];

  return data.balances
    .filter(
      (b: { coin: string; total: string; hold: string }) =>
        parseFloat(b.total) > 0,
    )
    .map((b: { coin: string; total: string; hold: string }) => ({
      asset: b.coin,
      free: parseFloat(b.total) - parseFloat(b.hold),
      locked: parseFloat(b.hold),
      total: parseFloat(b.total),
    }));
}

async function getHyperliquidFuturesPositions(
  walletAddress: string,
): Promise<FuturesPosition[]> {
  const response = await exchangeFetch("https://api.hyperliquid.xyz/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "clearinghouseState",
      user: walletAddress,
    }),
  });

  const responseText = await response.text();

  if (!responseText) {
    throw new Error("Hyperliquid API Error: Empty response");
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(
      `Hyperliquid API Error: Invalid JSON - ${responseText.substring(0, 200)}`,
    );
  }

  if (!data.assetPositions) return [];

  return data.assetPositions
    .filter(
      (p: { position: { szi: string } }) => parseFloat(p.position.szi) !== 0,
    )
    .map(
      (p: {
        position: {
          coin: string;
          szi: string;
          entryPx: string;
          positionValue: string;
          leverage: { type: string; value: number };
          unrealizedPnl: string;
          liquidationPx: string | null;
        };
      }) => ({
        symbol: p.position.coin,
        side: parseFloat(p.position.szi) > 0 ? ("long" as const) : ("short" as const),
        size: Math.abs(parseFloat(p.position.szi)),
        entryPrice: parseFloat(p.position.entryPx),
        markPrice: parseFloat(p.position.positionValue) / Math.abs(parseFloat(p.position.szi)),
        leverage: p.position.leverage.value,
        unrealizedPnl: parseFloat(p.position.unrealizedPnl),
        marginType: p.position.leverage.type === "cross" ? ("cross" as const) : ("isolated" as const),
        liquidationPrice: p.position.liquidationPx ? parseFloat(p.position.liquidationPx) : 0,
      }),
    );
}

// ============================================
// Permission Detection
// ============================================

export type ApiPermission =
  | "read"
  | "spot"
  | "futures"
  | "margin"
  | "withdraw"
  | "internal_transfer";

export interface DetectedPermissions {
  permissions: ApiPermission[];
  detectedAt: string;
  partial: boolean;
  warnings: string[];
}

function emptyDetection(
  warnings = ["Could not detect permissions automatically"],
): DetectedPermissions {
  return {
    permissions: [],
    detectedAt: new Date().toISOString(),
    partial: true,
    warnings,
  };
}

async function detectBinancePermissions(
  credentials: { apiKey: string; apiSecret: string },
  baseUrl = "https://api.binance.com",
): Promise<DetectedPermissions> {
  try {
    const data = (await binanceRequest(
      "/sapi/v1/account/apiRestrictions",
      "GET",
      {},
      credentials,
      baseUrl,
    )) as Record<string, unknown>;

    const permissions: ApiPermission[] = [];
    const warnings: string[] = [];

    if (data.enableReading) permissions.push("read");
    if (data.enableSpotAndMarginTrading) permissions.push("spot");
    if (data.enableFutures) permissions.push("futures");
    if (data.enableMargin) permissions.push("margin");
    if (data.enableWithdrawals) {
      permissions.push("withdraw");
      warnings.push(
        "This key has withdrawal permission enabled. For better security, consider creating a read-only key.",
      );
    }
    if (data.enableInternalTransfer) permissions.push("internal_transfer");

    if (permissions.length === 0) permissions.push("read");

    return {
      permissions,
      detectedAt: new Date().toISOString(),
      partial: false,
      warnings,
    };
  } catch (error) {
    console.warn(
      "[detectPermissions] Binance failed:",
      error instanceof Error ? error.message : error,
    );
    return emptyDetection();
  }
}

async function detectBybitPermissions(
  credentials: { apiKey: string; apiSecret: string },
): Promise<DetectedPermissions> {
  try {
    const result = (await bybitRequest(
      "/v5/user/query-api",
      "GET",
      {},
      credentials,
    )) as {
      readOnly: number;
      permissions: Record<string, string[]>;
    };

    const permissions: ApiPermission[] = ["read"];
    const warnings: string[] = [];

    if (String(result.readOnly) === "1") {
      return {
        permissions: ["read"],
        detectedAt: new Date().toISOString(),
        partial: false,
        warnings: [],
      };
    }

    const perms = result.permissions || {};

    if (perms.Spot && perms.Spot.length > 0) permissions.push("spot");
    if (perms.ContractTrade && perms.ContractTrade.length > 0)
      permissions.push("futures");

    const walletPerms = perms.Wallet || [];
    const hasWithdraw = walletPerms.some((p) => {
      const lower = p.toLowerCase();
      return lower.includes("withdraw") || lower.includes("submembertransfer");
    });
    if (hasWithdraw) {
      permissions.push("withdraw");
      warnings.push(
        "This key has wallet/transfer permissions. For better security, consider creating a read-only key.",
      );
    }

    return {
      permissions,
      detectedAt: new Date().toISOString(),
      partial: false,
      warnings,
    };
  } catch (error) {
    console.warn(
      "[detectPermissions] Bybit failed:",
      error instanceof Error ? error.message : error,
    );
    return emptyDetection();
  }
}

async function detectOkxPermissions(
  credentials: { apiKey: string; apiSecret: string; passphrase?: string },
): Promise<DetectedPermissions> {
  const permissions: ApiPermission[] = [];
  const warnings: string[] = [];

  try {
    await okxRequest("/api/v5/account/config", "GET", null, credentials);
    permissions.push("read");
  } catch {
    return emptyDetection(["Could not verify OKX key permissions"]);
  }

  try {
    await okxRequest("/api/v5/account/balance", "GET", null, credentials);
    if (!permissions.includes("spot")) permissions.push("spot");
  } catch {
    // Spot balance not accessible
  }

  try {
    await okxRequest("/api/v5/account/positions", "GET", null, credentials);
    permissions.push("futures");
  } catch {
    // Futures positions not accessible
  }

  return {
    permissions,
    detectedAt: new Date().toISOString(),
    partial: true,
    warnings:
      warnings.length > 0
        ? warnings
        : [
            "OKX does not expose full permission details. Trade/withdraw permissions could not be verified.",
          ],
  };
}

/**
 * Detect API key permissions by querying the exchange.
 * Never throws — always returns a result with `partial: true` on failure.
 */
export async function detectApiKeyPermissions(
  exchange: Exchange,
  credentials: { apiKey: string; apiSecret: string; passphrase?: string },
): Promise<DetectedPermissions> {
  switch (exchange) {
    case "binance":
      return detectBinancePermissions(credentials);
    case "binance-tr":
      return emptyDetection([
        "Automatic permission detection is not available for Binance TR. Permissions are set to defaults.",
      ]);
    case "bybit":
      return detectBybitPermissions(credentials);
    case "okx":
      return detectOkxPermissions(credentials);
    case "hyperliquid":
      return {
        permissions: ["read", "spot", "futures"],
        detectedAt: new Date().toISOString(),
        partial: false,
        warnings: [],
      };
    default:
      return emptyDetection();
  }
}

// ============================================
// Unified Public Interface
// ============================================

/**
 * Get spot balances from any exchange
 */
export async function getSpotBalances(
  userId: string,
  exchange: Exchange,
  label?: string,
): Promise<SpotBalance[]> {
  const credentials = await getDecryptedApiKey(userId, exchange, label);
  if (!credentials) {
    throw new Error(`No API key found for ${exchange}`);
  }

  switch (exchange) {
    case "binance":
      return getBinanceSpotBalances(credentials);
    case "binance-tr":
      return getBinanceTrSpotBalances(credentials);
    case "okx":
      return getOKXSpotBalances(credentials);
    case "bybit":
      return getBybitSpotBalances(credentials);
    case "hyperliquid":
      return getHyperliquidSpotBalances(credentials.apiKey);
    case "coinbase":
      // TODO: Implement Coinbase
      throw new Error("Coinbase not implemented yet");
    default:
      throw new Error(`Unknown exchange: ${exchange}`);
  }
}

/**
 * Get futures positions from any exchange
 */
export async function getFuturesPositions(
  userId: string,
  exchange: Exchange,
  label?: string,
): Promise<FuturesPosition[]> {
  const credentials = await getDecryptedApiKey(userId, exchange, label);
  if (!credentials) {
    throw new Error(`No API key found for ${exchange}`);
  }

  switch (exchange) {
    case "binance":
      return getBinanceFuturesPositions(credentials);
    case "binance-tr":
      // Binance TR does not support futures
      throw new Error("Binance TR does not support futures trading");
    case "okx":
      return getOKXFuturesPositions(credentials);
    case "hyperliquid":
      return getHyperliquidFuturesPositions(credentials.apiKey);
    case "bybit":
      return getBybitFuturesPositions(credentials);
    default:
      throw new Error(`Unknown exchange: ${exchange}`);
  }
}


/**
 * Get futures available balance
 */
export async function getFuturesAvailableBalance(
  userId: string,
  exchange: Exchange,
  label?: string,
) {
  const credentials = await getDecryptedApiKey(userId, exchange, label);
  if (!credentials) {
    throw new Error(`No API key found for ${exchange}`);
  }

  if (exchange !== "binance") {
    throw new Error(`${exchange} futures balance not implemented`);
  }

  return getBinanceFuturesAvailableBalance(credentials, "USDT");
}


/**
 * Check if exchange has valid API key configured
 */
export async function hasApiKey(
  userId: string,
  exchange: Exchange,
): Promise<boolean> {
  const credentials = await getDecryptedApiKey(userId, exchange);
  return credentials !== null;
}

async function getBybitAvgEntryPrice(
  credentials: { apiKey: string; apiSecret: string },
  symbol: string,
): Promise<number | null> {
  try {
    const data = (await bybitRequest(
      "/v5/execution/list",
      "GET",
      { category: "spot", symbol, limit: "100" },
      credentials,
    )) as { list: { execPrice: string; execQty: string; side: string }[] };

    if (!data.list || data.list.length === 0) return null;

    let totalBuyQty = 0;
    let totalBuyCost = 0;

    for (const trade of data.list) {
      if (trade.side === "Buy") {
        const qty = parseFloat(trade.execQty);
        const price = parseFloat(trade.execPrice);
        totalBuyQty += qty;
        totalBuyCost += qty * price;
      }
    }

    if (totalBuyQty <= 0) return null;
    return totalBuyCost / totalBuyQty;
  } catch (error) {
    console.error(`[Bybit] Failed to get avg entry for ${symbol}:`, error);
    return null;
  }
}

async function getOKXAvgEntryPrice(
  credentials: { apiKey: string; apiSecret: string; passphrase?: string },
  symbol: string,
): Promise<number | null> {
  try {
    const instId = symbol.replace(/^(.+)(USDT|USDC)$/, "$1-$2");

    const data = (await okxRequest(
      `/api/v5/trade/fills?instType=SPOT&instId=${instId}&limit=100`,
      "GET",
      null,
      credentials,
    )) as { px: string; sz: string; side: string }[];

    if (!data || data.length === 0) return null;

    let totalBuyQty = 0;
    let totalBuyCost = 0;

    for (const trade of data) {
      if (trade.side === "buy") {
        const qty = parseFloat(trade.sz);
        const price = parseFloat(trade.px);
        totalBuyQty += qty;
        totalBuyCost += qty * price;
      }
    }

    if (totalBuyQty <= 0) return null;
    return totalBuyCost / totalBuyQty;
  } catch (error) {
    console.error(`[OKX] Failed to get avg entry for ${symbol}:`, error);
    return null;
  }
}

async function getBinanceTrAvgEntryPrice(
  credentials: { apiKey: string; apiSecret: string },
  symbol: string,
): Promise<number | null> {
  try {
    const data = (await binanceTrRequest(
      "/open/v1/orders/trades",
      "GET",
      { symbol, limit: 500 },
      credentials,
    )) as { price: string; qty: string; quoteQty: string; isBuyer: boolean }[];

    if (!data || data.length === 0) return null;

    let totalBuyQty = 0;
    let totalBuyCost = 0;

    for (const trade of data) {
      if (trade.isBuyer) {
        totalBuyQty += parseFloat(trade.qty);
        totalBuyCost += parseFloat(trade.quoteQty);
      }
    }

    if (totalBuyQty <= 0) return null;
    return totalBuyCost / totalBuyQty;
  } catch (error) {
    console.error(`[BinanceTR] Failed to get avg entry for ${symbol}:`, error);
    return null;
  }
}

// ============================================
// Realized PnL Implementations
// ============================================

async function getBinanceFuturesRealizedPnl(
  credentials: { apiKey: string; apiSecret: string },
  startTime?: number,
): Promise<number> {
  try {
    const params: Record<string, string | number> = { incomeType: "REALIZED_PNL", limit: 1000 };
    if (startTime) params.startTime = startTime;
    const data = (await binanceRequest(
      "/fapi/v1/income",
      "GET",
      params,
      credentials,
      "https://fapi.binance.com",
    )) as { income: string }[];
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, item) => sum + parseFloat(item.income || "0"), 0);
  } catch (error) {
    console.error("[Binance] Failed to get realized PnL:", error);
    return 0;
  }
}

async function getOKXFuturesRealizedPnl(
  credentials: { apiKey: string; apiSecret: string; passphrase?: string },
): Promise<number> {
  try {
    const data = (await okxRequest(
      "/api/v5/account/positions-history?instType=SWAP&limit=100",
      "GET",
      null,
      credentials,
    )) as { realizedPnl: string }[];
    if (!data || data.length === 0) return 0;
    return data.reduce((sum, item) => sum + parseFloat(item.realizedPnl || "0"), 0);
  } catch (error) {
    console.error("[OKX] Failed to get realized PnL:", error);
    return 0;
  }
}

async function getBybitFuturesRealizedPnl(
  credentials: { apiKey: string; apiSecret: string },
): Promise<number> {
  try {
    const data = (await bybitRequest(
      "/v5/position/closed-pnl",
      "GET",
      { category: "linear", limit: 200 },
      credentials,
    )) as { list: { closedPnl: string }[] };
    if (!data?.list || data.list.length === 0) return 0;
    return data.list.reduce((sum, item) => sum + parseFloat(item.closedPnl || "0"), 0);
  } catch (error) {
    console.error("[Bybit] Failed to get realized PnL:", error);
    return 0;
  }
}

/**
 * Get total realized PnL for futures from exchange
 */
export async function getFuturesRealizedPnl(
  userId: string,
  exchange: Exchange,
  startTime?: number,
  label?: string,
): Promise<number> {
  const credentials = await getDecryptedApiKey(userId, exchange, label);
  if (!credentials) throw new Error(`No API key found for ${exchange}`);

  switch (exchange) {
    case "binance":
      return getBinanceFuturesRealizedPnl(credentials, startTime);
    case "okx":
      return getOKXFuturesRealizedPnl(credentials);
    case "bybit":
      return getBybitFuturesRealizedPnl(credentials);
    default:
      return 0;
  }
}

// ============================================
// Spot Realized PnL Implementations
// ============================================

async function getBinanceSpotRealizedPnl(
  credentials: { apiKey: string; apiSecret: string },
  symbols: string[],
): Promise<number> {
  let total = 0;
  for (const symbol of symbols) {
    try {
      const trades = (await binanceRequest(
        "/api/v3/myTrades",
        "GET",
        { symbol, limit: 500 },
        credentials,
      )) as { price: string; qty: string; quoteQty: string; isBuyer: boolean }[];

      if (!trades || trades.length === 0) continue;

      let totalBuyQty = 0, totalBuyCost = 0;
      let totalSellQty = 0, totalSellValue = 0;

      for (const t of trades) {
        const qty = parseFloat(t.qty);
        const price = parseFloat(t.price);
        if (t.isBuyer) { totalBuyQty += qty; totalBuyCost += qty * price; }
        else { totalSellQty += qty; totalSellValue += qty * price; }
      }

      const avgBuy = totalBuyQty > 0 ? totalBuyCost / totalBuyQty : 0;
      total += totalSellValue - totalSellQty * avgBuy;
    } catch { /* skip symbol */ }
  }
  return total;
}

async function getOKXSpotRealizedPnl(
  credentials: { apiKey: string; apiSecret: string; passphrase?: string },
  symbols: string[],
): Promise<number> {
  let total = 0;
  for (const symbol of symbols) {
    try {
      const instId = symbol.replace(/^(.+)(USDT|USDC)$/, "$1-$2");
      const trades = (await okxRequest(
        `/api/v5/trade/fills?instType=SPOT&instId=${instId}&limit=100`,
        "GET",
        null,
        credentials,
      )) as { px: string; sz: string; side: string }[];

      if (!trades || trades.length === 0) continue;

      let totalBuyQty = 0, totalBuyCost = 0;
      let totalSellQty = 0, totalSellValue = 0;

      for (const t of trades) {
        const qty = parseFloat(t.sz);
        const price = parseFloat(t.px);
        if (t.side === "buy") { totalBuyQty += qty; totalBuyCost += qty * price; }
        else { totalSellQty += qty; totalSellValue += qty * price; }
      }

      const avgBuy = totalBuyQty > 0 ? totalBuyCost / totalBuyQty : 0;
      total += totalSellValue - totalSellQty * avgBuy;
    } catch { /* skip symbol */ }
  }
  return total;
}

async function getBybitSpotRealizedPnl(
  credentials: { apiKey: string; apiSecret: string },
  symbols: string[],
): Promise<number> {
  let total = 0;
  for (const symbol of symbols) {
    try {
      const data = (await bybitRequest(
        "/v5/execution/list",
        "GET",
        { category: "spot", symbol, limit: 100 },
        credentials,
      )) as { list: { execPrice: string; execQty: string; side: string }[] };

      if (!data?.list || data.list.length === 0) continue;

      let totalBuyQty = 0, totalBuyCost = 0;
      let totalSellQty = 0, totalSellValue = 0;

      for (const t of data.list) {
        const qty = parseFloat(t.execQty);
        const price = parseFloat(t.execPrice);
        if (t.side === "Buy") { totalBuyQty += qty; totalBuyCost += qty * price; }
        else { totalSellQty += qty; totalSellValue += qty * price; }
      }

      const avgBuy = totalBuyQty > 0 ? totalBuyCost / totalBuyQty : 0;
      total += totalSellValue - totalSellQty * avgBuy;
    } catch { /* skip symbol */ }
  }
  return total;
}

async function getBinanceTRSpotRealizedPnl(
  credentials: { apiKey: string; apiSecret: string },
  symbols: string[],
): Promise<number> {
  let total = 0;
  for (const symbol of symbols) {
    try {
      const trades = (await binanceTrRequest(
        "/open/v1/orders/trades",
        "GET",
        { symbol, limit: 500 },
        credentials,
      )) as { price: string; qty: string; quoteQty: string; isBuyer: boolean }[];

      if (!trades || trades.length === 0) continue;

      let totalBuyQty = 0, totalBuyCost = 0;
      let totalSellQty = 0, totalSellValue = 0;

      for (const t of trades) {
        const qty = parseFloat(t.qty);
        const price = parseFloat(t.price);
        if (t.isBuyer) { totalBuyQty += qty; totalBuyCost += qty * price; }
        else { totalSellQty += qty; totalSellValue += qty * price; }
      }

      const avgBuy = totalBuyQty > 0 ? totalBuyCost / totalBuyQty : 0;
      total += totalSellValue - totalSellQty * avgBuy;
    } catch { /* skip symbol */ }
  }
  return total;
}

/**
 * Get total realized PnL for spot positions from exchange
 */
export async function getSpotRealizedPnl(
  userId: string,
  exchange: Exchange,
  symbols: string[],
  label?: string,
): Promise<number> {
  if (symbols.length === 0) return 0;
  const credentials = await getDecryptedApiKey(userId, exchange, label);
  if (!credentials) throw new Error(`No API key found for ${exchange}`);

  switch (exchange) {
    case "binance":
      return getBinanceSpotRealizedPnl(credentials, symbols);
    case "okx":
      return getOKXSpotRealizedPnl(credentials, symbols);
    case "bybit":
      return getBybitSpotRealizedPnl(credentials, symbols);
    case "binance-tr":
      return getBinanceTRSpotRealizedPnl(credentials, symbols);
    default:
      return 0;
  }
}

/**
 * Get average entry price for a symbol from trade history
 */
export async function getAvgEntryPrice(
  userId: string,
  exchange: Exchange,
  symbol: string,
  label?: string,
): Promise<number | null> {
  const credentials = await getDecryptedApiKey(userId, exchange, label);
  if (!credentials) return null;

  switch (exchange) {
    case "binance":
      return getBinanceAvgEntryPrice(credentials, symbol);
    case "bybit":
      return getBybitAvgEntryPrice(credentials, symbol);
    case "okx":
      return getOKXAvgEntryPrice(credentials, symbol);
    case "binance-tr":
      return getBinanceTrAvgEntryPrice(credentials, symbol);
    default:
      return null;
  }
}
