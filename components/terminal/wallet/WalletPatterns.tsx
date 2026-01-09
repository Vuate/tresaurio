const patterns = [
  { icon: "📈", name: "Accumulation" },
  { icon: "📉", name: "Distribution" },
  { icon: "🎯", name: "Whale Buy" },
  { icon: "💰", name: "Whale Sell" },
  { icon: "🏦", name: "Exchange Dump" },
  { icon: "🔄", name: "CEX↔DEX Flow" },
  { icon: "⚡", name: "Flash Accumulation" },
  { icon: "🎪", name: "Pump Setup" },
  { icon: "📊", name: "Smart Money Entry" },
  { icon: "🚪", name: "Smart Money Exit" },
  { icon: "🔮", name: "Insider Trading" },
  { icon: "🌊", name: "Whale Wash Trade" },
  { icon: "🎲", name: "Manipulation" },
  { icon: "🎭", name: "Fake Volume" },
  { icon: "💎", name: "Diamond Hands" },
  { icon: "🧠", name: "Strategic Hold" },
];

export default function WalletPatterns() {
  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-3">16 Smart Money Pattern</h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Otomatik tespit edilen smart money davranış pattern'leri
        </p>
      </div>

      {/* Patterns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
        {patterns.map((pattern, index) => (
          <div
            key={index}
            className="bg-[#041F20] border border-white/10 rounded-xl p-5 text-center transition-all duration-300 hover:border-teal-400 hover:-translate-y-0.5"
          >
            {/* Icon */}
            <span className="text-[32px] block mb-3">{pattern.icon}</span>

            {/* Pattern Name */}
            <div className="text-sm font-semibold text-white">
              {pattern.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}