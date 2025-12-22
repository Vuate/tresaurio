
import ComparisonInfoAlert from "./ComparisonInfoAlert";
import ComparisonTable from "./ComparisonTable";

export default function ComparisonSection() {
  return (
    <div className="space-y-6">

            {/* INFO ALERT */}
      <ComparisonInfoAlert />


      {/* FILTER SECTION */}
      <div className="rounded-2xl border border-white/10 bg-[#041f20]/95 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              🎯 Filtreler
            </h3>
            <p className="text-xs text-gray-400">
              Karşılaştırmayı özelleştirin
            </p>
          </div>

          <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs hover:border-teal-300">
            🔄 Filtreleri Sıfırla
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Token */}
          <FilterSelect label="Token" options={["Tüm Tokenlar", "BTC", "ETH", "USDT", "BNB", "SOL", "MATIC"]} />

          {/* Stake Type */}
          <FilterSelect label="Stake Türü" options={["Tüm Türler", "Flexible", "Locked", "DeFi", "Launchpool"]} />

          {/* Lock Period */}
          <FilterSelect label="Kilit Süresi" options={["Tüm Süreler", "0 gün", "7 gün", "30 gün", "90 gün", "1 yıl"]} />

          {/* APR */}
          <FilterSelect label="Minimum APR" options={["Tüm Oranlar", ">5%", ">10%", ">15%", ">20%"]} />
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <ComparisonTable />
    </div>
  );
}

/* SMALL HELPER */
function FilterSelect({
  label,
  options,
}: {
  label: string;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-2">
        {label}
      </label>

      <select
        className="
          w-full rounded-lg
          border border-white/10
          bg-[#041f20]
          px-4 py-2
          text-sm text-white
          focus:border-teal-300
          focus:outline-none
          focus:ring-0
        "
      >
        {options.map(o => (
          <option
            key={o}
            className="bg-[#041f20] text-white"
          >
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}