"use client";

interface AddWalletModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddWalletModal({
  open,
  onClose,
}: AddWalletModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] rounded-2xl border border-white/10 bg-[#041f20] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="mb-5 text-[18px] font-bold">➕ Cüzdan Ekle</div>

        {/* FORM */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-gray-300">
              Cüzdan Adresi
            </label>
            <input
              type="text"
              placeholder="0x742d35Cc6634C0532925a3b844Bc9e7595f8f3a"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-gray-300">
              Network
            </label>
            <select className="w-full rounded-lg border border-white/10 bg-[#041f20] px-3 py-2 text-sm text-white">
              <option>Bitcoin</option>
              <option>Ethereum</option>
              <option>Tron (TRC20)</option>
              <option>BSC (BEP20)</option>
              <option>Polygon</option>
              <option>Solana</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-gray-300">
              Etiket (Opsiyonel)
            </label>
            <input
              type="text"
              placeholder="Örn: Whale #143, Arkadaşım, vb."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-gray-300">
              Alert Kurulumu
            </label>
            <select className="w-full rounded-lg border border-white/10 bg-[#041f20] px-3 py-2 text-sm text-white">
              <option>Alert Kurma</option>
              <option>&gt; $1,000 USDT transfer</option>
              <option>&gt; $10,000 USDT transfer</option>
              <option>&gt; $100,000 USDT transfer</option>
              <option>&gt; $1M USDT transfer</option>
              <option>Özel tutar</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-gray-300">
              Özel Alert Tutarı (USDT)
            </label>
            <input
              type="number"
              placeholder="50000"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2 text-sm font-semibold hover:bg-white/10"
          >
            İptal
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-gradient-to-br from-teal-400 to-teal-600 py-2 text-sm font-semibold text-white hover:shadow-lg hover:shadow-teal-400/30"
          >
            Cüzdanı Ekle
          </button>
        </div>
      </div>
    </div>
  );
}
