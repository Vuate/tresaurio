const metrics = [
  { label: "Total Portfolio", value: "$124,567", color: "text-teal-400" },
  { label: "24h Change", value: "+$3,245", color: "text-green-500" },
  { label: "Unrealized PnL", value: "+$12,890", color: "text-teal-400" },
  { label: "Total Fees (24h)", value: "$89", color: "text-teal-400" },
  { label: "Best Performer", value: "SOL +12.4%", color: "text-teal-400" },
  { label: "Market Sentiment", value: "Bullish", color: "text-green-500" },
];

export default function ReportingExample() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">Örnek Rapor Görünümü</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Daily Performance Report örneği
        </p>
      </div>

      {/* Visual Example Container */}
      <div className="bg-[#041F20] rounded-[20px] p-12 border border-white/10 mt-12">
        <div className="bg-[#041F20]/95 rounded-xl p-8 border border-white/10">
          {/* Report Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <div>
              <div className="text-xl font-bold">Daily Performance Report</div>
              <div className="text-xs text-gray-400 mt-1">
                28 Aralık 2024 - 10:30 AM
              </div>
            </div>
          </div>

          {/* Report Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-[#041F20] p-5 rounded-xl border border-white/10"
              >
                <div className="text-[11px] uppercase text-gray-400 tracking-wider mb-2">
                  {metric.label}
                </div>
                <div className={`text-2xl font-extrabold ${metric.color}`}>
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          {/* AI Insight Box */}
          <div className="mt-6 p-4 bg-teal-500/10 rounded-lg border-l-4 border-teal-400">
            <div className="text-xs text-gray-400 mb-1">AI INSIGHT</div>
            <div className="text-sm text-white">
              Portfolio showing strong momentum. SOL accumulation detected.
              Consider taking partial profits above $130 resistance level.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}