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

type Chain = "ethereum" | "bsc" | "tron" | "solana";

const CHAINS = [
  { id: "ethereum" as Chain, name: "Ethereum (ERC-20)", explorer: "Etherscan" },
  { id: "bsc" as Chain, name: "Binance Smart Chain", explorer: "BSCScan" },
  { id: "tron" as Chain, name: "Tron (TRC-20)", explorer: "Tronscan" },
  { id: "solana" as Chain, name: "Solana", explorer: "Solscan" },
];

// 🔥 Validate address based on chain
const validateAddress = (address: string, chain: Chain): boolean => {
  switch (chain) {
    case "ethereum":
    case "bsc":
      // EVM addresses (0x...)
      return /^0x[a-fA-F0-9]{40}$/.test(address);
    case "tron":
      // Tron addresses (T...)
      return /^T[a-zA-Z0-9]{33}$/.test(address);
    case "solana":
      // Solana addresses (base58, 32-44 chars)
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
    default:
      return false;
  }
};

// 🔥 Fetch wallet data via server-side API (avoids CORS issues)
const fetchWalletData = async (address: string, chain: Chain): Promise<WalletData> => {
  // Validate address based on chain
  if (!validateAddress(address, chain)) {
    throw new Error(`Invalid ${chain} address format`);
  }

  const nativeSymbols: Record<Chain, string> = {
    ethereum: "ETH",
    bsc: "BNB",
    tron: "TRX",
    solana: "SOL",
  };

  try {
    // Call our server-side API to fetch balance (avoids CORS)
    const res = await fetch(`/api/wallet/balance?address=${encodeURIComponent(address)}&chain=${chain}`);
    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || `Failed to fetch ${chain} balance`);
    }

    return {
      address,
      balance: data.data.balance || 0,
      tokens: [],
      nfts: 0,
      transactions24h: data.data.transactions24h || 0,
      label: nativeSymbols[chain],
    };
  } catch (err) {
    console.error("[WalletInspector] Fetch error:", err);
    throw err;
  }
};

export default function WalletInspectorModule({ instanceId }: Props) {
  const storageKey = `wallet-inspector-${instanceId}`;
  const [address, setAddress] = useState("");
  const [selectedChain, setSelectedChain] = useState<Chain>("ethereum");
  const [inspecting, setInspecting] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nativePrice, setNativePrice] = useState(0);

  // Load last inspected address and chain
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const settings = JSON.parse(saved);
          if (settings.lastAddress) setAddress(settings.lastAddress);
          if (settings.chain) setSelectedChain(settings.chain);
        } catch (err) {
          console.error("[WalletInspector] Failed to load settings:", err);
        }
      }
    }
  }, [storageKey]);

  // Fetch native token price based on selected chain
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const symbols: Record<Chain, string> = {
          ethereum: "ETHUSDT",
          bsc: "BNBUSDT",
          tron: "TRXUSDT",
          solana: "SOLUSDT",
        };
        const symbol = symbols[selectedChain];
        const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        const data = await res.json();
        setNativePrice(parseFloat(data.price) || 0);
      } catch (err) {
        console.error("[WalletInspector] Price fetch error:", err);
      }
    };
    fetchPrice();
  }, [selectedChain]);

  const handleInspect = async () => {
    if (!address) return;
    setInspecting(true);
    setError(null);

    try {
      const data = await fetchWalletData(address, selectedChain);
      setWalletData(data);

      // Save last inspected address and chain
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, JSON.stringify({
          lastAddress: address,
          chain: selectedChain
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch wallet data");
      setWalletData(null);
    } finally {
      setInspecting(false);
    }
  };

  const totalValue = walletData
    ? walletData.balance * nativePrice +
      walletData.tokens.reduce((sum, t) => sum + t.value, 0)
    : 0;

  const nativeSymbol = CHAINS.find(c => c.id === selectedChain)?.name.split(" ")[0] || "Token";

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

      {/* Chain Selector */}
      <div className="p-3 border-b border-white/10">
        <label className="text-xs text-white/60 mb-2 block">Blockchain</label>
        <select
          value={selectedChain}
          onChange={(e) => setSelectedChain(e.target.value as Chain)}
          className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm text-white outline-none cursor-pointer"
        >
          {CHAINS.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name} - {chain.explorer}
            </option>
          ))}
        </select>
      </div>

      {/* Input */}
      <div className="p-3 border-b border-white/10 space-y-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={
            selectedChain === "ethereum" || selectedChain === "bsc"
              ? "Enter wallet address (0x...)"
              : selectedChain === "tron"
              ? "Enter wallet address (T...)"
              : "Enter wallet address"
          }
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

            {/* Native Balance */}
            <div className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between">
                <span className="text-sm text-white/60">{walletData.label || nativeSymbol} Balance</span>
                <span className="text-sm font-bold text-white">
                  {walletData.balance.toFixed(4)} {walletData.label || nativeSymbol}
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
