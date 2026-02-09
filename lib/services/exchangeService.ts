// lib/services/exchangeService.ts
// Unified exchange API service for authenticated requests

import crypto from "crypto";
import { getDecryptedApiKey, Exchange } from "./apiKeyService";

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
  const response = await fetch("https://api.binance.com/api/v3/time");
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

  const response = await fetch(url, {
    method,
    headers: {
      "X-MBX-APIKEY": credentials.apiKey,
    },
  });

  const responseText = await response.text();
  console.log("[Binance] Response status:", response.status);
  console.log("[Binance] Response body:", responseText.substring(0, 500));

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

  const response = await fetch(`https://www.okx.com${endpoint}`, {
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
  console.log("[OKX] Response status:", response.status);
  console.log("[OKX] Response body:", responseText.substring(0, 500));

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

  const response = await fetch(url, {
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
  console.log("[Bybit] Response status:", response.status);
  console.log("[Bybit] Response body:", responseText.substring(0, 500));

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

// ============================================
// Binance TR Implementation
// ============================================

async function getBinanceTrServerTime(): Promise<number> {
  const response = await fetch("https://www.binance.tr/open/v1/common/time");
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

  const response = await fetch(url, {
    method,
    headers: {
      "X-MBX-APIKEY": credentials.apiKey,
    },
  });

  const responseText = await response.text();
  console.log("[BinanceTR] Response status:", response.status);
  console.log("[BinanceTR] Response body:", responseText.substring(0, 500));

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
  const response = await fetch("https://api.hyperliquid.xyz/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "spotClearinghouseState",
      user: walletAddress,
    }),
  });
  const responseText = await response.text();
  console.log("[Hyperliquid] Response status:", response.status);

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
      // TODO: Implement OKX futures
      throw new Error("OKX futures not implemented yet");
    case "hyperliquid":
      throw new Error("Hyperliquid futures not implemented yet");
    case "bybit":
      // TODO: Implement Bybit futures
      throw new Error("Bybit futures not implemented yet");
    default:
      throw new Error(`Unknown exchange: ${exchange}`);
  }
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
