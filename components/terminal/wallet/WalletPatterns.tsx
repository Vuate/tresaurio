import { Icon } from "@iconify/react";

const patterns = [
  // === CORE MARKET STRUCTURE ===
  { icon: "material-symbols:trending-up-rounded", name: "Accumulation" },
{ icon: "material-symbols:trending-down-rounded", name: "Distribution" },

  // === WHALE ACTIONS ===
  { icon: "lucide:crosshair", name: "Whale Buy" },
  { icon: "lucide:circle-dollar-sign", name: "Whale Sell" },

  // === EXCHANGE FLOWS ===
  { icon: "lucide:building-2", name: "Exchange Dump" },
  { icon: "material-symbols:swap-horiz-rounded", name: "CEX↔DEX Flow" },

  // === MOMENTUM EVENTS ===
  { icon: "lucide:zap", name: "Flash Accumulation" },
  { icon: "lucide:rocket", name: "Pump Setup" },

  // === SMART MONEY ===
  { icon: "lucide:line-chart", name: "Smart Money Entry" },
  { icon: "lucide:log-out", name: "Smart Money Exit" },

  // === RISK / MANIPULATION ===
  { icon: "lucide:eye", name: "Insider Trading" },
  { icon: "lucide:waves", name: "Whale Wash Trade" },

  { icon: "lucide:shuffle", name: "Manipulation" },
{ icon: "lucide:repeat", name: "Fake Volume" },

  // === PSYCHOLOGY ===
  { icon: "lucide:gem", name: "Diamond Hands" },
  { icon: "lucide:brain-circuit", name: "Strategic Hold" },
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
            <Icon
              icon={pattern.icon}
              className="text-[32px] mb-3 text-teal-400 mx-auto"
            />
            
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