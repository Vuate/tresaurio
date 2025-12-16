"use client";

export default function ActiveAlerts() {
  const alerts = [
    {
      asset: "BTC",
      condition: "Spread >",
      value: "0.10%",
      triggered: false,
      time: "—",
    },
    {
      asset: "DOGE",
      condition: "Volatilite",
      value: "Spike",
      triggered: true,
      time: "2s önce",
    },
    {
      asset: "ENS",
      condition: "Likidite",
      value: "Düşük",
      triggered: false,
      time: "8d önce",
    },
  ];

  return (
    <div className="rounded-2xl border border-rose-400/40 bg-gradient-to-br from-rose-500/15 to-slate-950/80 p-6 shadow-[0_0_30px_rgba(255,50,80,0.15)]">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔔</span>
          <h3 className="text-sm font-semibold tracking-tight">
            Aktif Uyarılar
          </h3>
        </div>

        <span className="text-[10px] text-rose-200 font-semibold">
          {alerts.length} aktif
        </span>
      </div>

      {/* ALERT LIST */}
      <div className="space-y-3">
        {alerts.map((a, i) => (
          <div
            key={i}
            className="
              w-full 
              flex items-center justify-between 
              px-4 py-3 
              rounded-xl 
              bg-white/5 
              border border-white/10 
              hover:bg-white/10 
              transition
            "
          >
            {/* LEFT */}
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                <span
                  className={`font-mono font-extrabold mr-1 ${
                    a.triggered ? "text-rose-300" : "text-slate-200"
                  }`}
                >
                  {a.asset}
                </span>
                <span className="text-white/60">
                  {a.condition} {a.value}
                </span>
              </span>

              {a.triggered && (
                <span className="text-xs text-rose-400 mt-1">
                  🔥 {a.time} tetiklendi
                </span>
              )}

              {!a.triggered && (
                <span className="text-xs text-slate-400 mt-1">
                  Son kontrol: {a.time}
                </span>
              )}
            </div>

            {/* STATUS BADGE */}
            <div>
              {a.triggered ? (
                <span
                  className="
                    px-3 py-1 
                    rounded-lg 
                    bg-rose-500/20 
                    text-rose-300 
                    text-xs font-semibold
                    border border-rose-400/40
                  "
                >
                  TETİKLENDİ
                </span>
              ) : (
                <span
                  className="
                    px-3 py-1 
                    rounded-lg 
                    bg-amber-500/20 
                    text-amber-300 
                    text-xs font-medium
                    border border-amber-400/40
                  "
                >
                  AKTİF
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
