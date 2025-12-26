export default function KeyBenefitsList() {
  const benefits = [
    {
      icon: "💰",
      title: "Maliyet Tasarrufu",
      desc: "En ucuz exchange'i bulun, gizli maliyetleri görün, yıllık binlerce dolar tasarruf edin",
    },
    {
      icon: "⏱️",
      title: "Zaman Tasarrufu",
      desc: "Otomatik raporlar, auto-balancing, tek dashboard'da tüm veriler - saatler kazanın",
    },
    {
      icon: "📊",
      title: "Daha İyi Kararlar",
      desc: "AI insights, smart money tracking, comprehensive data - bilinçli trading yapın",
    },
    {
      icon: "🛡️",
      title: "Risk Yönetimi",
      desc: "Multi-level alerts, risk monitoring, wallet band controls - korunmada kalın",
    },
    {
      icon: "🔄",
      title: "Otomasyon",
      desc: "Auto-balancer, scheduled reports, alert system - manual işi minimize edin",
    },
    {
      icon: "🎯",
      title: "Profesyonellik",
      desc: "Kurumsal seviye araçlar, detailed analytics, comprehensive reporting - pro gibi çalışın",
    },
  ];

  return (
    <div className="space-y-4">
      {benefits.map((b) => (
        <div
          key={b.title}
          className="flex items-center gap-5 rounded-xl border border-white/10 bg-white/5 px-6 py-5 transition hover:border-teal-400/40 hover:bg-white/10"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal-400/30 bg-teal-400/10 text-lg">
            {b.icon}
          </div>

          <div>
            <div className="font-bold">{b.title}</div>
            <div className="text-sm text-gray-400">{b.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
