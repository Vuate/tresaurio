"use client";

export default function LimitedOffersSection() {
  return (
    <section className="space-y-5">
      <SectionHeader
        title="⏰ Sınırlı Süreli Kampanyalar"
        desc="Yakında sona erecek özel teklifler"
      />

      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-5 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-300 to-teal-600 flex items-center justify-center text-lg">
                💰
              </div>
              <div>
                <div className="font-bold">USDT Megadrop</div>
                <div className="text-xs text-gray-400">
                  Binance Launchpool
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-400 uppercase">APR</div>
              <div className="text-xl font-mono font-bold text-emerald-400">
                15.2%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-xs text-yellow-300">
            <span>⏰</span>
            <span>3 gün 14 saat kaldı</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10 text-sm">
            <Detail label="Min. Miktar" value="100 USDT" />
            <Detail label="Max. Miktar" value="10,000 USDT" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* LOCAL */

function SectionHeader({ title, desc }: any) {
  return (
    <div>
      <div className="text-lg font-bold">{title}</div>
      <div className="text-xs text-gray-400">{desc}</div>
    </div>
  );
}

function Detail({ label, value }: any) {
  return (
    <div>
      <div className="text-xs text-gray-400">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
