"use client";

import { useState, useEffect, useRef } from "react";
import { AlertTriangle } from "lucide-react";

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
  { id: "ethereum" as Chain, name: "Ethereum", short: "ETH", explorer: "Etherscan" },
  { id: "bsc" as Chain, name: "BSC", short: "BNB", explorer: "BSCScan" },
  { id: "tron" as Chain, name: "Tron", short: "TRX", explorer: "Tronscan" },
  { id: "solana" as Chain, name: "Solana", short: "SOL", explorer: "Solscan" },
];

// Validate address based on chain
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

//  Fetch wallet data via server-side API (avoids CORS issues)
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
  const [chainDropdownOpen, setChainDropdownOpen] = useState(false);

  const chainDropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    if (!chainDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        chainDropdownRef.current &&
        !chainDropdownRef.current.contains(e.target as Node)
      ) {
        setChainDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chainDropdownOpen]);

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

  const selectedChainData = CHAINS.find(c => c.id === selectedChain);

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2 flex-shrink-0">
        <span className="font-semibold text-white/90 text-xs">
          Wallet Inspector
        </span>
        
        <span className="text-white/40 text-xs">•</span>
        
        <span className="flex items-center gap-1.5 text-xs whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400">LIVE</span>
        </span>

        <div className="flex-1 min-w-[20px]"></div>

<div ref={chainDropdownRef} className="relative">
  <button
    onClick={() => setChainDropdownOpen((v) => !v)}
    className="
      h-7 px-3 rounded-md
      bg-[#0b1f1f]
      border border-white/10
      text-white text-xs
      flex items-center gap-1.5
      cursor-pointer
      hover:bg-white/5
      transition-all
      whitespace-nowrap
    "
  >
    <span>{selectedChainData?.name}</span>
    <span
      className={`
        text-white/50 text-[10px]
        transition-transform duration-200
        ${chainDropdownOpen ? "rotate-180" : ""}
      `}
    >
      ▾
    </span>
  </button>

  {chainDropdownOpen && (() => {
    const buttonRect = chainDropdownRef.current?.getBoundingClientRect();
    const shouldOpenLeft = buttonRect ? buttonRect.left > window.innerWidth / 2 : false;

    return (
      <div
        onWheel={(e) => e.stopPropagation()}
        className={`
          absolute mt-1 z-50
          w-[140px]
          max-h-[200px]
          overflow-y-auto
          bg-[#0b1f1f]
          border border-emerald-500/20
          rounded-md
          shadow-lg
          animate-in fade-in slide-in-from-top-2 duration-200

          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-thumb]:bg-emerald-500/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-track]:bg-transparent

          ${shouldOpenLeft ? 'right-0' : 'left-0'}
        `}
      >
        {CHAINS.map((chain) => (
          <button
            key={chain.id}
            onClick={() => {
              setSelectedChain(chain.id);
              setChainDropdownOpen(false);
            }}
            className="
              w-full px-3 py-2
              text-left text-xs
              bg-transparent cursor-pointer
              text-white
              transition-colors
              hover:bg-emerald-500/10
              hover:text-emerald-400
            "
          >
            <div className="font-medium">{chain.name}</div>
            <div className="text-[9px] text-white/60">{chain.explorer}</div>
          </button>
        ))}
      </div>
    );
  })()}
</div>
      </div>

      <div className="flex flex-col gap-2 px-3 pb-2 flex-shrink-0">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleInspect()}
          placeholder={
            selectedChain === "ethereum" || selectedChain === "bsc"
              ? "Enter address (0x...)"
              : selectedChain === "tron"
              ? "Enter address (T...)"
              : "Enter address"
          }
          className="w-full bg-white/5 border border-white/10 rounded-md px-2.5 py-1.5 text-white text-xs outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/40"
        />
        <button
          onClick={handleInspect}
          disabled={!address || inspecting}
          className="w-full py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed text-white font-semibold transition-all cursor-pointer text-xs"
        >
          {inspecting ? "Inspecting..." : "Inspect Wallet"}
        </button>
      </div>

      <div
        ref={contentRef}
        className="
          flex-1 min-h-0 px-3 pb-3
          overflow-y-auto

          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-teal-400/40
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb:hover]:bg-teal-400/70

          scrollbar-thin
          scrollbar-thumb-teal-400/40
          scrollbar-track-transparent
        "
      >
        {error ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
<div className="mb-2 flex justify-center"><AlertTriangle className="w-8 h-8 text-red-400" /></div>
            <div className="text-sm text-red-400 px-4 break-words">{error}</div>
          </div>
        ) : !walletData ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="text-4xl mb-2">👛</div>
            <div className="text-sm text-white/40 px-4">
              Enter a wallet address to inspect
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="px-3 py-2 rounded-md bg-white/5 border border-white/10">
              <div className="text-[10px] text-white/60 mb-1">Address</div>
              <div className="text-xs font-mono text-white break-all leading-relaxed">
                {walletData.address}
              </div>
            </div>

            <div className="px-3 py-2 rounded-md bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20">
              <div className="text-[10px] text-white/60 mb-1">Total Value</div>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono break-words">
                ${totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </div>
            </div>

            <div className="px-3 py-2 rounded-md bg-white/5 border border-white/10">
              <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1">
                <span className="text-xs text-white/60 whitespace-nowrap">
                  {walletData.label || selectedChainData?.short} Balance
                </span>
                <span className="text-xs font-bold text-white font-mono whitespace-nowrap">
                  {walletData.balance.toFixed(4)} {walletData.label || selectedChainData?.short}
                </span>
              </div>
            </div>

            {walletData.tokens.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-white/90 mb-1.5 px-1">
                  Token Holdings
                </div>
                <div className="space-y-1.5">
                  {walletData.tokens.map((token) => (
                    <div
                      key={token.symbol}
                      className="px-3 py-2 rounded-md bg-white/5 border border-white/10 hover:bg-white/8 transition-all"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1 mb-1">
                        <div className="font-semibold text-white text-xs whitespace-nowrap">
                          {token.symbol}
                        </div>
                        <div className="text-xs font-bold text-white font-mono whitespace-nowrap">
                          ${token.value.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-[10px] text-white/60 break-words">
                        {token.amount.toLocaleString()} tokens
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div className="px-3 py-2 rounded-md bg-white/5 border border-white/10">
                <div className="text-[10px] text-white/60 mb-1">NFTs</div>
                <div className="text-base sm:text-lg font-bold text-white break-words">
                  {walletData.nfts}
                </div>
              </div>
              <div className="px-3 py-2 rounded-md bg-white/5 border border-white/10">
                <div className="text-[10px] text-white/60 mb-1">TX (24h)</div>
                <div className="text-base sm:text-lg font-bold text-white break-words">
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