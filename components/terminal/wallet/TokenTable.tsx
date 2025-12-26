"use client";

export default function TokenTable({
  onAddTokenClick,
  onAlertClick,
}: {
  onAddTokenClick?: () => void;
  onAlertClick?: () => void;
}) {
  return (
      <section className="mb-6 w-full max-w-none rounded-xl border border-white/10 bg-[#041f20]/95 p-5">

      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[16px] font-bold">🪙 Token Bazlı Hareketler</div>

        <button
          onClick={onAddTokenClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm transition hover:border-teal-400 hover:bg-teal-400/10 cursor-pointer"
        >
          ➕
        </button>
      </div>

      {/* TABLE WRAPPER */}
        <div className="max-h-[260px] overflow-y-auto overflow-x-auto local-scrollbar">

        {/* TABLE HEADER */}
        <div className="grid min-w-max grid-cols-[120px_150px_150px_150px_150px_80px] gap-3 border-b border-white/10 px-3 pb-3 text-[11px] font-bold uppercase tracking-wide text-gray-400">
          <div>Token</div>
          <div>Net In / Out</div>
          <div>Whale Activity</div>
          <div>Exchange Flow</div>
          <div>Trend</div>
          <div className="pl-6">Alert</div>
        </div>
  
        {/* ROWS */}
        <div className="divide-y divide-white/10">
          <TokenRow {...ROW_BTC} onAlertClick={onAlertClick} />
          <TokenRow {...ROW_ETH} onAlertClick={onAlertClick} />
          <TokenRow {...ROW_BNB} onAlertClick={onAlertClick} />
        </div>
      </div>

      {/* LOCAL SCROLLBAR STYLE */}
      <style jsx>{`
        .local-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .local-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .local-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(45, 212, 191, 0.35);
          border-radius: 9999px;
        }
        .local-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(45, 212, 191, 0.6);
        }
        .local-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(45, 212, 191, 0.4) transparent;
        }
      `}</style>
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
  trendValues,
  onAlertClick,
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
  trendValues: number[];
  onAlertClick?: () => void;
}) {
  return (
    <div className="grid min-w-max cursor-pointer grid-cols-[120px_150px_150px_150px_150px_80px] items-center gap-3 px-3 py-4 transition hover:bg-white/5">
      <div className="flex items-center gap-2 font-semibold">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-teal-600 text-[12px]">
          {icon}
        </div>
        {token}
      </div>

      <div
        className={`font-mono font-bold ${
          netType === "positive" ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {net}
      </div>

      <div className={whaleColor}>{whale}</div>
      <div className={exchangeColor}>{exchange}</div>

      <Sparkline type={trendType} values={trendValues} />

      <button
        onClick={onAlertClick}
        className="text-center text-gray-400 transition hover:scale-110 hover:text-yellow-400 cursor-pointer"
      >
        🔔
      </button>
    </div>
  );
}

/* ================= DATA ================= */

const ROW_BTC = {
  icon: "₿",
  token: "BTC",
  net: "+2,450 BTC",
  netType: "positive" as const,
  whale: "🔥 Yüksek",
  whaleColor: "text-emerald-400",
  exchange: "→ CEX",
  exchangeColor: "text-red-400",
  trendType: "positive" as const,
  trendValues: [40, 60, 80, 70, 90, 100],
};

const ROW_ETH = {
  icon: "Ξ",
  token: "ETH",
  net: "-1,850 ETH",
  netType: "negative" as const,
  whale: "⚡ Orta",
  whaleColor: "text-yellow-400",
  exchange: "← Wallet",
  exchangeColor: "text-emerald-400",
  trendType: "negative" as const,
  trendValues: [80, 60, 70, 50, 40, 30],
};

const ROW_BNB = {
  icon: "🟡",
  token: "BNB",
  net: "+58,000 BNB",
  netType: "positive" as const,
  whale: "🔥 Yüksek",
  whaleColor: "text-emerald-400",
  exchange: "↔️ Mixed",
  exchangeColor: "text-gray-400",
  trendType: "positive" as const,
  trendValues: [50, 55, 60, 65, 70, 75],
};

/* ================= SPARKLINE ================= */
function Sparkline({
  values,
  type,
}: {
  values: number[];
  type: "positive" | "negative";
}) {
  return (
    <div className="flex h-10 items-end gap-1">
      {values.map((h, i) => (
        <div
          key={i}
          className={`spark-bar ${
            type === "positive"
              ? "bg-emerald-400/60"
              : "bg-red-400/60"
          }`}
          style={{
            "--base": `${h}%`,
            "--amp": `${6 + i * 2}%`, // her bar farklı oynar
            animationDuration: `${2.8 + i * 0.6}s`,
          } as React.CSSProperties}
        />
      ))}

      <style jsx>{`
        .spark-bar {
          width: 100%;
          height: var(--base);
          border-radius: 2px;
          transform-origin: bottom;
          animation-name: breathe;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        @keyframes breathe {
          0% {
            height: var(--base);
          }
          50% {
            height: calc(var(--base) + var(--amp));
          }
          100% {
            height: var(--base);
          }
        }
      `}</style>
    </div>
  );
}
