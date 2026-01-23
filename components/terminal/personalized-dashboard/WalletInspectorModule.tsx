// components/terminal/personalized-dashboard/WalletInspectorModule.tsx

import { useState } from "react";

interface Props {
  instanceId: string;
}

interface WalletData {
  address: string;
  balance: number;
  tokens: { symbol: string; amount: number; value: number }[];
  nfts: number;
  transactions24h: number;
  label?: string;
}

// 🔥 MOCK DATA
const MOCK_WALLET: WalletData = {
  address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  balance: 12.5,
  tokens: [
    { symbol: "USDC", amount: 25000, value: 25000 },
    { symbol: "UNI", amount: 1500, value: 8250 },
    { symbol: "AAVE", amount: 150, value: 12750 },
  ],
  nfts: 8,
  transactions24h: 5,
};

export default function WalletInspectorModule({ instanceId }: Props) {
  const [address, setAddress] = useState("");
  const [inspecting, setInspecting] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  const handleInspect = () => {
    if (!address) return;
    setInspecting(true);

    // 🔥 MOCK - Simulate API call
    setTimeout(() => {
      setWalletData(MOCK_WALLET);
      setInspecting(false);
    }, 800);
  };

  const totalValue = walletData
    ? walletData.balance * 2500 +
      walletData.tokens.reduce((sum, t) => sum + t.value, 0)
    : 0;

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">🔍</div>
          <h3 className="font-semibold">Wallet Inspector</h3>
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
        {!walletData ? (
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
