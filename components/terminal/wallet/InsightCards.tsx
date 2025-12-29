"use client";

export default function InsightCards() {
  return (
    <section className="mb-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <InsightCard
        label="Exchange Net Inflow"
        value="+$124M"
        change="+18% son 24s"
        type="positive"
      />

      <InsightCard
        label="Exchange Net Outflow"
        value="-$89M"
        change="-12% son 24s"
        type="negative"
      />

      <InsightCard
        label="Whale Accumulation"
        value="+$245M"
        change="+34% son 24s"
        type="positive"
      />

      <InsightCard
        label="Market Signal"
        value="Bullish"
        change="🟢 Accumulation Phase"
        type="neutral"
      />
    </section>
  );
}


/* ================= CARD ================= */

function InsightCard({
  label,
  value,
  change,
  type,
}: {
  label: string;
  value: string;
  change: string;
  type: "positive" | "negative" | "neutral";
}) {
  const valueColor = {
    positive: "text-emerald-400",
    negative: "text-red-400",
    neutral: "text-white",
  };

  const changeColor = {
    positive: "text-emerald-400",
    negative: "text-red-400",
    neutral: "text-gray-300",
  };

  return (
    <div className="rounded-xl border border-white/10 bg-[#041f20]/95 p-5 transition hover:-translate-y-0.5 hover:border-teal-400/40 min-w-0">
      {/* LABEL */}
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-gray-400 truncate">
        {label}
      </div>

      {/* VALUE */}
      <div
        className={`mb-1 font-mono text-[24px] font-extrabold ${valueColor[type]} truncate`}
      >
        {value}
      </div>

      {/* CHANGE */}
      <div
        className={`flex items-center gap-1 text-[11px] font-semibold ${changeColor[type]} truncate`}
      >
        {change}
      </div>
    </div>
  );
}