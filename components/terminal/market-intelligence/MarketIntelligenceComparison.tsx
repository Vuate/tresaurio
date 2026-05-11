const exchangeData = [
  { name: "Binance", badge: "BEST", badgeType: "best" as const, fee: "$40", spread: "$15", slippage: "$7", total: "$62" },
  { name: "OKX", fee: "$45", spread: "$18", slippage: "$9", total: "$72" },
  { name: "Bybit", fee: "$42", spread: "$22", slippage: "$11", total: "$75" },
  { name: "Kraken", badge: "WORST", badgeType: "worst" as const, fee: "$50", spread: "$35", slippage: "$19", total: "$104" },
];

export default function MarketIntelligenceComparison() {
  return (
    <section className="mb-12 lg:mb-16">
      <div className="text-center mb-10">
        <span
          className="font-bold uppercase text-[#2563EB]"
          style={{ fontSize: "0.68rem", letterSpacing: "0.16em" }}
        >
          Comparison
        </span>
        <h2
          className="font-extrabold text-foreground mt-2 mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.8vw, 2.7rem)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
        >
          Exchange Comparison
        </h2>
        <p className="text-[#71717A] max-w-xl mx-auto text-[0.875rem] leading-[1.7]">
          Cost comparison across different exchanges for a $100,000 BTC trade
        </p>
      </div>

      <div className="rounded-xl border border-border-sub bg-card p-6 lg:p-8">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b border-border-sub">
          <span className="w-1 h-5 bg-[#2563EB] rounded-full inline-block shrink-0" />
          <span className="text-[0.95rem] font-bold text-foreground">BTC/USDT — $100,000 Trade</span>
        </div>

        {/* Mobile: stacked cards */}
        <div className="sm:hidden space-y-2">
          {exchangeData.map((ex, i) => (
            <div
              key={i}
              className={[
                "rounded-xl border p-4 transition-colors",
                ex.badgeType === "best"
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : ex.badgeType === "worst"
                  ? "bg-red-500/5 border-red-500/20"
                  : "bg-card-alt border-border-sub",
              ].join(" ")}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[0.9rem] font-semibold text-foreground">{ex.name}</span>
                {ex.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold border ${
                      ex.badgeType === "best"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/15 text-red-400 border-red-500/20"
                    }`}
                    style={{ fontSize: "0.6rem", letterSpacing: "0.04em" }}
                  >
                    {ex.badge}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Fee", value: ex.fee, bold: false },
                  { label: "Spread", value: ex.spread, bold: false },
                  { label: "Slippage", value: ex.slippage, bold: false },
                  { label: "Total Cost", value: ex.total, bold: true },
                ].map((m) => (
                  <div key={m.label} className="flex items-center justify-between gap-1">
                    <span className="font-bold uppercase text-[#71717A]" style={{ fontSize: "0.6rem", letterSpacing: "0.08em" }}>
                      {m.label}
                    </span>
                    <span className={`text-[0.78rem] ${m.bold ? "font-bold text-foreground" : "text-[#71717A]"}`}>
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden sm:block rounded-xl overflow-hidden border border-border-sub">
          {/* Table header */}
          <div
            className="grid px-5 py-3 border-b border-border-sub"
            style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", background: "rgba(37,99,235,0.08)" }}
          >
            {["Exchange", "Fee", "Spread", "Slippage", "Total Cost"].map((h) => (
              <div
                key={h}
                className={`font-bold uppercase text-[#71717A] ${h !== "Exchange" ? "text-center" : ""}`}
                style={{ fontSize: "0.72rem", letterSpacing: "0.08em" }}
              >
                {h}
              </div>
            ))}
          </div>

          {exchangeData.map((ex, i) => (
            <div
              key={i}
              className={[
                "grid px-5 py-3.5 items-center transition-colors",
                i < exchangeData.length - 1 ? "border-b border-border-sub" : "",
                ex.badgeType === "best"
                  ? "bg-emerald-500/5"
                  : ex.badgeType === "worst"
                  ? "bg-red-500/5"
                  : "hover:bg-foreground/3",
              ].join(" ")}
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr" }}
            >
              <div className="flex items-center gap-2 text-[0.875rem] font-semibold text-foreground">
                {ex.name}
                {ex.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold border ${
                      ex.badgeType === "best"
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                        : "bg-red-500/15 text-red-400 border-red-500/20"
                    }`}
                    style={{ fontSize: "0.6rem", letterSpacing: "0.04em" }}
                  >
                    {ex.badge}
                  </span>
                )}
              </div>
              <div className="text-[0.875rem] text-[#71717A] text-center">{ex.fee}</div>
              <div className="text-[0.875rem] text-[#71717A] text-center">{ex.spread}</div>
              <div className="text-[0.875rem] text-[#71717A] text-center">{ex.slippage}</div>
              <div className="text-[0.875rem] font-bold text-foreground text-center">{ex.total}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
