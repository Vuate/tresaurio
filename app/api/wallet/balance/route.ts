// app/api/wallet/balance/route.ts
// Server-side proxy for wallet balance lookups (avoids CORS issues)

import { NextRequest, NextResponse } from "next/server";

type Chain = "ethereum" | "bsc" | "tron" | "solana";

interface BalanceResult {
  balance: number;
  transactions24h: number;
}

async function getEthereumBalance(address: string): Promise<BalanceResult> {
  // Try multiple RPCs
  const ETH_RPCS = [
    "https://rpc.ankr.com/eth",
    "https://eth.llamarpc.com",
    "https://cloudflare-eth.com",
  ];

  for (const rpcUrl of ETH_RPCS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const rpcRes = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBalance",
          params: [address, "latest"],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const rpcData = await rpcRes.json();
      if (rpcData.result !== undefined) {
        const balance = parseInt(rpcData.result, 16) / 1e18;
        console.log(`[Wallet API] ETH balance from ${rpcUrl}: ${balance}`);
        return { balance, transactions24h: 0 };
      }
    } catch (err) {
      console.warn(`[Wallet API] Ethereum RPC ${rpcUrl} failed:`, err);
      continue;
    }
  }

  // All RPCs failed - return 0 balance instead of error (better UX)
  console.error("[Wallet API] All Ethereum RPCs failed");
  return { balance: 0, transactions24h: 0 };
}

async function getBscBalance(address: string): Promise<BalanceResult> {
  // Try multiple RPCs
  const BSC_RPCS = [
    "https://rpc.ankr.com/bsc",
    "https://bsc-dataseed1.binance.org",
    "https://bsc-dataseed2.binance.org",
  ];

  for (const rpcUrl of BSC_RPCS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const rpcRes = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBalance",
          params: [address, "latest"],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const rpcData = await rpcRes.json();
      if (rpcData.result !== undefined) {
        const balance = parseInt(rpcData.result, 16) / 1e18;
        console.log(`[Wallet API] BSC balance from ${rpcUrl}: ${balance}`);
        return { balance, transactions24h: 0 };
      }
    } catch (err) {
      console.warn(`[Wallet API] BSC RPC ${rpcUrl} failed:`, err);
      continue;
    }
  }

  // All RPCs failed - return 0 balance instead of error
  console.error("[Wallet API] All BSC RPCs failed");
  return { balance: 0, transactions24h: 0 };
}

async function getTronBalance(address: string): Promise<BalanceResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`https://apilist.tronscan.org/api/account?address=${address}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    const balance = data.balance ? data.balance / 1e6 : 0;
    console.log(`[Wallet API] TRX balance: ${balance}`);
    return {
      balance,
      transactions24h: data.transactions || 0,
    };
  } catch (err) {
    console.error("[Wallet API] Tron failed:", err);
    return { balance: 0, transactions24h: 0 };
  }
}

async function getSolanaBalance(address: string): Promise<BalanceResult> {
  const SOLANA_RPCS = [
    "https://rpc.ankr.com/solana",
    "https://solana-mainnet.rpc.extrnode.com",
    "https://api.mainnet-beta.solana.com",
  ];

  for (const rpcUrl of SOLANA_RPCS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const rpcRes = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getBalance",
          params: [address],
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const rpcData = await rpcRes.json();
      if (rpcData.result?.value !== undefined) {
        const balance = rpcData.result.value / 1e9;
        console.log(`[Wallet API] SOL balance from ${rpcUrl}: ${balance}`);
        return { balance, transactions24h: 0 };
      }
    } catch (err) {
      console.warn(`[Wallet API] Solana RPC ${rpcUrl} failed:`, err);
      continue;
    }
  }

  // All RPCs failed - return 0 balance instead of error
  console.error("[Wallet API] All Solana RPCs failed");
  return { balance: 0, transactions24h: 0 };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");
  const chain = searchParams.get("chain") as Chain;

  if (!address || !chain) {
    return NextResponse.json(
      { success: false, error: "Missing address or chain parameter" },
      { status: 400 }
    );
  }

  let result: BalanceResult;

  switch (chain) {
    case "ethereum":
      result = await getEthereumBalance(address);
      break;
    case "bsc":
      result = await getBscBalance(address);
      break;
    case "tron":
      result = await getTronBalance(address);
      break;
    case "solana":
      result = await getSolanaBalance(address);
      break;
    default:
      return NextResponse.json(
        { success: false, error: "Unsupported chain" },
        { status: 400 }
      );
  }

  return NextResponse.json({
    success: true,
    data: {
      balance: result.balance,
      transactions24h: result.transactions24h,
    },
  });
}
