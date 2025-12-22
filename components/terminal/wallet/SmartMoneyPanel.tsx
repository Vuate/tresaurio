"use client";

export default function SmartMoneyPanel() {
  return (
    <section className="mb-6 rounded-xl border border-white/10 bg-[#041f20]/95 p-5">

      {/* HEADER */}
      <div className="mb-4 text-[16px] font-bold">
        🧠 Smart Money Davranış Analizi
      </div>

      {/* ITEMS */}
      <div className="space-y-3">
        <BehaviorItem
          icon="💎"
          title="Uzun Vadeli Holder'lar"
          desc="180+ gündür tutan 1,245 cüzdan pozisyon büyütüyor"
          value="+$458M"
          type="positive"
        />

        <BehaviorItem
          icon="📥"
          title="Yeni Pozisyon Açanlar"
          desc="Son 7 günde 342 whale yeni BTC pozisyonu aldı"
          value="+$234M"
          type="info"
        />

        <BehaviorItem
          icon="📤"
          title="Eski Cüzdan Satışları"
          desc="2021'den beri tutan 89 cüzdan sat pozisyona geçti"
          value="-$156M"
          type="negative"
        />
      </div>
    </section>
  );
}

/* ================= ITEM ================= */

function BehaviorItem({
  icon,
  title,
  desc,
  value,
  type,
}: {
  icon: string;
  title: string;
  desc: string;
  value: string;
  type: "positive" | "negative" | "info";
}) {
  const iconStyle = {
    positive: "border-emerald-400/30 bg-emerald-400/10",
    negative: "border-red-400/30 bg-red-400/10",
    info: "border-blue-400/30 bg-blue-400/10",
  };

  const valueColor = {
    positive: "text-emerald-400",
    negative: "text-red-400",
    info: "text-blue-400",
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3 transition hover:border-teal-400/40 hover:bg-white/10">
      {/* ICON */}
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg border text-[18px] ${iconStyle[type]}`}
      >
        {icon}
      </div>

      {/* CONTENT */}
      <div className="flex-1">
        <div className="mb-0.5 text-[13px] font-bold text-white">
          {title}
        </div>
        <div className="text-[11px] text-gray-400">{desc}</div>
      </div>

      {/* VALUE */}
      <div
        className={`font-mono text-[14px] font-bold ${valueColor[type]}`}
      >
        {value}
      </div>
    </div>
  );
}
