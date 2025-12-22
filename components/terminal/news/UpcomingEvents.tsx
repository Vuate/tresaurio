export default function UpcomingEvents() {
  return (
    <div className="mt-6">
      <div className="mb-3 text-sm font-semibold">📅 Yaklaşan Etkinlikler</div>

      <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-4 text-xs text-gray-300">
        <div className="border-b border-white/10 pb-3">
          <div className="font-semibold text-white">FED Faiz Kararı</div>
          <div>18 Aralık • 21:00</div>
        </div>

        <div className="border-b border-white/10 pb-3">
          <div className="font-semibold text-white">BTC Opsiyonlar Vade</div>
          <div>22 Aralık • 09:00</div>
        </div>

        <div>
          <div className="font-semibold text-white">
            Ethereum Dencun Upgrade
          </div>
          <div>25 Aralık (tahmini)</div>
        </div>
      </div>
    </div>
  );
}
