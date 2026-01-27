import { Icon } from "@iconify/react";

const useCases = [
  {
    icon: "mdi:account-tie",
    title: "Profesyonel Trader'lar",
    desc: "Multi-exchange operasyonları yöneten, maliyet optimizasyonu yapan, whale hareketlerini takip eden profesyoneller için ideal.",
  },
  {
    icon: "mdi:office-building",
    title: "Kurumsal Yatırımcılar",
    desc: "Büyük hacimli işlemler yapan, likidite yönetimi gerektiren, compliance için detaylı raporlama ihtiyacı olan kurumlar.",
  },
  {
    icon: "mdi:chart-multiple",
    title: "Quant & Algo Trader'lar",
    desc: "Market microstructure analizi, execution cost hesaplama, orderbook depth tracking ihtiyacı olan quant ekipleri.",
  },
  {
    icon: "mdi:bank",
    title: "Kripto Borsalar",
    desc: "Kendi exchange'leri için wallet balance yönetimi, liquidity optimization, risk monitoring ihtiyacı olan platformlar.",
  },
  {
    icon: "mdi:microscope",
    title: "Analistler & Araştırmacılar",
    desc: "Piyasa yapısını inceleyen, smart money davranışlarını araştıran, on-chain data analizi yapan profesyoneller.",
  },
  {
    icon: "mdi:shield-check",
    title: "Ciddi Yatırımcılar",
    desc: "Exchange arayüzlerinin ötesine geçmek isteyen, derinlemesine analiz yapan, bilinçli kararlar alan yatırımcılar.",
  },
];

export default function UseCaseList() {
  return (
    <>
      {useCases.map((item) => (
        <div
          key={item.title}
          className="rounded-2xl border border-white/10 bg-[#041F20]/95 p-7 transition hover:-translate-y-1 hover:border-teal-400/50 hover:shadow-[0_8px_32px_rgba(25,216,208,0.15)]"
        >
<div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-400/10 text-2xl text-teal-400">
  <Icon icon={item.icon} />
</div>

          <div className="text-lg font-bold">{item.title}</div>
          <div className="mt-2 text-sm text-gray-400">{item.desc}</div>
        </div>
      ))}
    </>
  );
}
