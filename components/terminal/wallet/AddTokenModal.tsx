"use client";

interface AddTokenModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddTokenModal({ open, onClose }: AddTokenModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#041f20] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="mb-5 text-[18px] font-bold">➕ Token Ekle</div>

        {/* FORM */}
        <div className="space-y-4">
          {/* TOKEN */}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-gray-300">
              Token
            </label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-white/10 bg-[#041f20] px-3 py-2 pr-10 text-sm text-white">
                <option className="bg-[#041f20]">Bitcoin (BTC)</option>
                <option className="bg-[#041f20]">Ethereum (ETH)</option>
                <option className="bg-[#041f20]">BNB</option>
                <option className="bg-[#041f20]">Solana (SOL)</option>
                <option className="bg-[#041f20]">XRP</option>
                <option className="bg-[#041f20]">Cardano (ADA)</option>
                <option className="bg-[#041f20]">Polygon (MATIC)</option>
                <option className="bg-[#041f20]">Avalanche (AVAX)</option>
                <option className="bg-[#041f20]">Polkadot (DOT)</option>
                <option className="bg-[#041f20]">Chainlink (LINK)</option>
              </select>

              {/* CHEVRON */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* NETWORK */}
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-gray-300">
              Network
            </label>
            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-white/10 bg-[#041f20] px-3 py-2 pr-10 text-sm text-white">
                <option className="bg-[#041f20]">Native</option>
                <option className="bg-[#041f20]">Ethereum (ERC20)</option>
                <option className="bg-[#041f20]">Tron (TRC20)</option>
                <option className="bg-[#041f20]">BSC (BEP20)</option>
                <option className="bg-[#041f20]">Polygon</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 text-sm font-semibold hover:bg-white/10 cursor-pointer"
          >
            İptal
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 py-2 text-sm font-semibold text-white hover:shadow-lg hover:shadow-teal-400/30 cursor-pointer"
          >
            Token Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
