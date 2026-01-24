// components/terminal/personalized-dashboard/WalletInspectorModule.tsx
"use client";

import { useState, useEffect } from "react";

interface Props {
  instanceId: string;
}

interface TokenBalance {
  symbol: string;
  amount: number;
  value: number;
  contractAddress?: string;
}

interface WalletData {
  address: string;
  balance: number;
  tokens: TokenBalance[];
  nfts: number;
  transactions24h: number;
  label?: string;
}

// 🔥 Fetch wallet data from multiple APIs
const fetchWalletData = async (address: string): Promise<WalletData> => {
  // Validate Ethereum address
  if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error("Invalid Ethereum address");
  }

  try {
    // Fetch ETH balance and transactions from Etherscan (free API)
    const [balanceRes, txRes] = await Promise.all([
      fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest`),
      fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc`),
    ]);

    const balanceData = await balanceRes.json();
    const txData = await txRes.json();

    // Calculate ETH balance (wei to ETH)
    const ethBalance = balanceData.status === "1"
      ? parseFloat(balanceData.result) / 1e18
      : 0;

    // Count transactions in last 24h
    const now = Date.now() / 1000;
    const oneDayAgo = now - 86400;
    const recentTxs = txData.status === "1"
      ? txData.result.filter((tx: any) => parseInt(tx.timeStamp) > oneDayAgo).length
      : 0;

    // Fetch token balances from Etherscan
    const tokenRes = await fetch(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&page=1&offset=100&sort=desc`
    );
    const tokenData = await tokenRes.json();

    // Aggregate token balances
    const tokenMap = new Map<string, TokenBalance>();
    if (tokenData.status === "1" && Array.isArray(tokenData.result)) {
      for (const tx of tokenData.result) {
        const symbol = tx.tokenSymbol;
        const decimals = parseInt(tx.tokenDecimal) || 18;
        const amount = parseFloat(tx.value) / Math.pow(10, decimals);

        if (!tokenMap.has(symbol)) {
          tokenMap.set(symbol, {
            symbol,
            amount: 0,
            value: 0,
            contractAddress: tx.contractAddress,
          });
        }

        const token = tokenMap.get(symbol)!;
        // Approximate: if received add, if sent subtract
        if (tx.to.toLowerCase() === address.toLowerCase()) {
          token.amount += amount;
        } else {
          token.amount -= amount;
        }
      }
    }

    // Filter positive balances and limit to top 10
    const tokens = Array.from(tokenMap.values())
      .filter(t => t.amount > 0)
      .slice(0, 10);

    // Fetch current ETH price for value calculation
    const priceRes = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");
    const priceData = await priceRes.json();
    const ethPrice = parseFloat(priceData.price) || 0;

    return {
      address,
      balance: ethBalance,
      tokens,
      nfts: 0, // NFT count requires separate API
      transactions24h: recentTxs,
    };
  } catch (err) {
    console.error("[WalletInspector] Fetch error:", err);
    throw err;
  }
};

export default function WalletInspectorModule({ instanceId }: Props) {
  const storageKey = `wallet-inspector-${instanceId}`;
  const [address, setAddress] = useState("");
  const [inspecting, setInspecting] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ethPrice, setEthPrice] = useState(0);

  // Load last inspected address
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.lastAddress) setAddress(settings.lastAddress);
        } catch (err) {
          console.error("[WalletInspector] Failed to load settings:", err);
        }
      }
    }
  }, [storageKey]);

  // Fetch ETH price on mount
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");
        const data = await res.json();
        setEthPrice(parseFloat(data.price) || 0);
      } catch (err) {
        console.error("[WalletInspector] Price fetch error:", err);
      }
    };
    fetchPrice();
  }, []);

  const handleInspect = async () => {
    if (!address) return;
    setInspecting(true);
    setError(null);

    try {
      const data = await fetchWalletData(address);
      setWalletData(data);

      // Save last inspected address
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify({ lastAddress: address }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch wallet data");
      setWalletData(null);
    } finally {
      setInspecting(false);
    }
  };

  const totalValue = walletData
    ? walletData.balance * ethPrice +
      walletData.tokens.reduce((sum, t) => sum + t.value, 0)
    : 0;

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">🔍</div>
          <h3 className="font-semibold">Wallet Inspector</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
            LIVE
          </span>
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-b border-white/10 space-y-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter wallet address (0x...)"
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleInspect}
          disabled={!address || inspecting}
          className="w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/40 text-white rounded font-medium transition-colors"
        >
          {inspecting ? "Inspecting..." : "Inspect Wallet"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {error ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-2">⚠️</div>
            <div className="text-sm text-red-400">{error}</div>
          </div>
        ) : !walletData ? (
          <div className="text-center py-12 text-white/40">
            <div className="text-4xl mb-2">👛</div>
            <div className="text-sm">Enter a wallet address to inspect</div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Address */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-xs text-white/60 mb-1">Address</div>
              <div className="text-xs font-mono text-white break-all">
                {walletData.address}
              </div>
            </div>

            {/* Total Value */}
            <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-lg p-4">
              <div className="text-xs text-white/60 mb-1">Total Value</div>
              <div className="text-3xl font-bold text-white">
                ${totalValue.toLocaleString()}
              </div>
            </div>

            {/* ETH Balance */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between">
                <span className="text-sm text-white/60">ETH Balance</span>
                <span className="text-sm font-bold text-white">
                  {walletData.balance} ETH
                </span>
              </div>
            </div>

            {/* Tokens */}
            <div>
              <div className="text-sm font-medium text-white mb-2">
                Token Holdings
              </div>
              <div className="space-y-2">
                {walletData.tokens.map((token) => (
                  <div
                    key={token.symbol}
                    className="bg-white/5 rounded-lg p-3 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-medium text-white">
                        {token.symbol}
                      </div>
                      <div className="text-xs text-white/60">
                        {token.amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-white">
                      ${token.value.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-xs text-white/60 mb-1">NFTs</div>
                <div className="text-lg font-bold text-white">
                  {walletData.nfts}
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3">
                <div className="text-xs text-white/60 mb-1">TX (24h)</div>
                <div className="text-lg font-bold text-white">
                  {walletData.transactions24h}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
