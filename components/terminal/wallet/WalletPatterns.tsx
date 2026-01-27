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
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      {/* Section Header */}
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          16 Smart Money Pattern
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Otomatik tespit edilen smart money davranış pattern'leri
        </p>
      </div>

      {/* Patterns Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {patterns.map((pattern, index) => (
          <div
            key={index}
            className="bg-[#041F20] border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 text-center transition-all duration-300 hover:border-teal-400 hover:-translate-y-0.5"
          >
            {/* Icon */}
            <Icon
              icon={pattern.icon}
              className="text-2xl sm:text-3xl lg:text-[32px] mb-2 sm:mb-3 text-teal-400 mx-auto"
            />
            
            {/* Pattern Name */}
            <div className="text-xs sm:text-sm font-semibold text-white">
              {pattern.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
