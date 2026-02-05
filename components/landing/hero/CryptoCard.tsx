export default function CryptoCard({ coin }: { coin: any }) {
  const positive = coin.change >= 0;

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white/5 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20">
        <img
          src={coin.icon}
          alt={coin.symbol}
          className="h-6 w-6"
        />
      </div>

      <div className="flex flex-col">
        <span className="text-sm font-semibold text-white">
          {coin.symbol}
        </span>

        <span className="text-sm text-slate-300">
          ${coin.price}
        </span>

        <span
          className={`mt-1 text-xs font-semibold ${
            positive ?  "text-green-400" : "text-red-400"
          }`} 
        >
          {positive ? "▲" : "▼"} {coin.change}%
        </span>
      </div>
    </div>
  );
}
