export default function LongShort() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
      <h3 className="mb-4 text-sm font-bold">⚖️ Long / Short Dinamikleri</h3>

      <p className="text-xs text-gray-400">Global Long / Short Ratio</p>
      <p className="mt-1 text-3xl font-extrabold text-yellow-400">1.42</p>
      <p className="mt-1 text-xs text-gray-400">58.7% Long • 41.3% Short</p>

      <div className="mt-5 space-y-3 text-sm">
        <Row label="🟡 Binance" value="1.38 (58% Long)" />
        <Row label="🟢 OKX" value="1.52 (60% Long)" />
        <Row label="🔵 Bybit" value="1.28 (56% Long)" />
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <Row label="Perpetual" value="1.45 (59% Long)" />
        <Row label="Quarterly Futures" value="1.32 (57% Long)" />
      </div>

      <div className="mt-4 rounded-lg border border-purple-400/30 bg-purple-400/10 p-4">
        <p className="text-sm font-semibold text-purple-400">🧠 AI Insight</p>
        <p className="mt-1 text-xs text-gray-300">
          Yüksek long ratio + yükselen funding = short squeeze riski. OI artışı
          devam ederse long’lar tetiklenebilir.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2 text-xs">
      <span className="text-gray-400">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}
