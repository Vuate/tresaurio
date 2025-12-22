const trends = [
  { rank: 1, title: "Bitcoin ETF", count: "1,842 mention" },
  { rank: 2, title: "Ethereum Upgrade", count: "956 mention" },
  { rank: 3, title: "MiCA Regulation", count: "734 mention" },
  { rank: 4, title: "Solana TVL", count: "512 mention" },
  { rank: 5, title: "DeFi Hack", count: "428 mention" },
];

export default function TrendingTopics() {
  return (
    <div className="mt-6">
      <div className="mb-3 text-sm font-semibold">🔥 Trend Konular</div>

      <div className="space-y-2">
        {trends.map((item) => (
          <div
            key={item.rank}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 hover:bg-white/10 transition"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-teal-400/30 bg-teal-400/10 text-xs font-bold text-teal-300">
              {item.rank}
            </div>

            <div className="flex-1">
              <div className="text-sm font-medium">{item.title}</div>
              <div className="text-xs text-gray-400">{item.count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
