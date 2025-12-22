"use client";

export default function TokenTable({
  onAddTokenClick,
}: {
  onAddTokenClick?: () => void;
}) {
  return (
    <section className="mb-6 rounded-xl border border-white/10 bg-[#041f20]/95 p-5">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[16px] font-bold">🪙 Token Bazlı Hareketler</div>

        <button
          onClick={onAddTokenClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm transition hover:border-teal-400 hover:bg-teal-400/10"
        >
          ➕
        </button>
      </div>

      {/* TABLE HEADER */}
      <div className="grid grid-cols-[120px_150px_150px_150px_150px_80px] gap-3 border-b border-white/10 px-3 pb-3 text-[11px] font-bold uppercase tracking-wide text-gray-400">
        <div>Token</div>
        <div>Net In / Out</div>
        <div>Whale Activity</div>
        <div>Exchange Flow</div>
        <div>Trend</div>
        <div>Alert</div>
      </div>

      {/* ROWS */}
      <div className="divide-y divide-white/10">
        <TokenRow
          icon="₿"
          token="BTC"
          net="+2,450 BTC"
          netType="positive"
          whale="🔥 Yüksek"
          whaleColor="text-emerald-400"
          exchange="→ CEX"
          exchangeColor="text-red-400"
          trendType="positive"
        />

        <TokenRow
          icon="Ξ"
          token="ETH"
          net="-1,850 ETH"
          netType="negative"
          whale="⚡ Orta"
          whaleColor="text-yellow-400"
          exchange="← Wallet"
          exchangeColor="text-emerald-400"
          trendType="negative"
        />

        <TokenRow
          icon="🟡"
          token="BNB"
          net="+58,000 BNB"
          netType="positive"
          whale="🔥 Yüksek"
          whaleColor="text-emerald-400"
          exchange="↔️ Mixed"
          exchangeColor="text-gray-400"
          trendType="positive"
        />
      </div>
    </section>
  );
}

/* ================= ROW ================= */

function TokenRow({
  icon,
  token,
  net,
  netType,
  whale,
  whaleColor,
  exchange,
  exchangeColor,
  trendType,
}: {
  icon: string;
  token: string;
  net: string;
  netType: "positive" | "negative";
  whale: string;
  whaleColor: string;
  exchange: string;
  exchangeColor: string;
  trendType: "positive" | "negative";
}) {
  return (
    <div className="grid cursor-pointer grid-cols-[120px_150px_150px_150px_150px_80px] items-center gap-3 px-3 py-4 transition hover:bg-white/5">
      {/* TOKEN */}
      <div className="flex items-center gap-2 font-semibold">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-[12px]">
          {icon}
        </div>
        {token}
      </div>

      {/* NET */}
      <div
        className={`font-mono font-bold ${
          netType === "positive" ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {net}
      </div>

      {/* WHALE */}
      <div className={whaleColor}>{whale}</div>

      {/* EXCHANGE */}
      <div className={exchangeColor}>{exchange}</div>

      {/* TREND */}
      <Sparkline type={trendType} />

      {/* ALERT */}
      <div className="text-center text-gray-400 transition hover:scale-110 hover:text-yellow-400">
        🔔
      </div>
    </div>
  );
}

/* ================= SPARKLINE ================= */

function Sparkline({ type }: { type: "positive" | "negative" }) {
  const bars =
    type === "positive"
      ? [40, 60, 80, 70, 90, 100]
      : [80, 60, 70, 50, 40, 30];

  return (
    <div className="flex h-10 items-end gap-1">
      {bars.map((h, i) => (
        <div
          key={i}
          style={{ height: `${h}%` }}
          className={`w-full rounded-sm ${
            type === "positive"
              ? "bg-emerald-400/50"
              : "bg-red-400/50"
          }`}
        />
      ))}
    </div>
  );
}
