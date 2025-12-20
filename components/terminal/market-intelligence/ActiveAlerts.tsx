export default function ActiveAlerts() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#041F20] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold">🔔 Aktif Alertler & İzleme</h3>
        <span className="rounded bg-cyan-400/10 px-2 py-1 text-xs text-cyan-400">
          5 Aktif
        </span>
      </div>

      <div className="space-y-3">
        <Alert
          type="danger"
          title="Funding Spike"
          desc="Funding rate 0.01%’i geçti (Eşik: 0.008%)"
          icon="🚨"
        />
        <Alert
          type="warning"
          title="Spread Anomalisi"
          desc="Spread son 15dk’da %180 arttı"
          icon="⚠️"
        />
        <Alert
          type="info"
          title="Likidite Duvarı Oluşumu"
          desc="$42,450’de 320 BTC bid duvarı tespit edildi"
          icon="💡"
        />
        <Alert
          type="warning"
          title="OI Spike"
          desc="Son 1 saatte OI %8.2 arttı"
          icon="⚠️"
        />
        <Alert
          type="success"
          title="VIP Tier Yaklaşıyor"
          desc="$2.6M daha hacim → VIP 3 upgrade"
          icon="✓"
        />
      </div>

      <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 text-sm font-semibold text-black hover:opacity-90">
        🔔 Yeni Alert Ekle
      </button>
    </div>
  );
}

function Alert({
  type,
  title,
  desc,
  icon,
}: {
  type: "danger" | "warning" | "info" | "success";
  title: string;
  desc: string;
  icon: string;
}) {
  const styles =
    type === "danger"
      ? "border-red-400/30 bg-red-400/10 text-red-300"
      : type === "warning"
      ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300"
      : type === "info"
      ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300"
      : "border-emerald-400/30 bg-emerald-400/10 text-emerald-300";

  return (
    <div className={`flex gap-3 rounded-lg border p-3 ${styles}`}>
      <div className="text-base">{icon}</div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-gray-200">{desc}</p>
      </div>
    </div>
  );
}
