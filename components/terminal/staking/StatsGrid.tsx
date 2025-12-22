import StatCard from "./StatCard";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4 mb-8">
      <StatCard
        label="💰 Toplam Stake Edilen"
        value="$24,580"
        change="+12.5% bu ay"
        positive
      />

      <StatCard
        label="🎁 Toplam Kazanılan"
        value="$1,842"
        change="+$156 bu hafta"
        positive
      />

      <StatCard
        label="📈 Ortalama APR"
        value="8.4%"
        change="+0.3% artış"
        positive
      />

      <StatCard
        label="⏱️ Aktif Stake Sayısı"
        value="7"
        change="3 platform"
      />
    </div>
  );
}
