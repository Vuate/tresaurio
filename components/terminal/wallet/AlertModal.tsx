"use client";

interface AlertModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AlertModal({ open, onClose }: AlertModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[400px] rounded-2xl border border-white/10 bg-[#041f20] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 text-[18px] font-bold">🔔 Alert Oluştur</div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-gray-300">
              Alert Türü
            </label>
            <select className="w-full rounded-lg border border-white/10 bg-[#041f20] px-3 py-2 text-sm text-white appearance-none">
              <option className="bg-[#041f20] text-white">Tutar Bazlı</option>
              <option className="bg-[#041f20] text-white">Token Bazlı</option>
              <option className="bg-[#041f20] text-white">Exchange Bazlı</option>
              <option className="bg-[#041f20] text-white">Cüzdan Bazlı</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-gray-300">
              Minimum Tutar (BTC)
            </label>
            <input
              type="number"
              defaultValue={100}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] font-semibold text-gray-300">
              Bildirim Kanalı
            </label>
            <select className="w-full rounded-lg border border-white/10 bg-[#041f20] px-3 py-2 text-sm text-white appearance-none">
              <option className="bg-[#041f20] text-white">Email</option>
              <option className="bg-[#041f20] text-white">Telegram</option>
              <option className="bg-[#041f20] text-white">Push Notification</option>
              <option className="bg-[#041f20] text-white">SMS</option>
            </select>
          </div>
        </div>

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
            Oluştur
          </button>
        </div>
      </div>
    </div>
  );
}
