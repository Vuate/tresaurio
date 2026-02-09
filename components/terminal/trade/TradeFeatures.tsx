import { Icon } from "@iconify/react";

export default function TradeFeatures() {
  return (
    <section className="mb-10 sm:mb-12 lg:mb-14 xl:mb-16 2xl:mb-18">
      <div className="section-header mb-6 sm:mb-7 lg:mb-8 xl:mb-9 2xl:mb-10 text-center">
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-white">
          Ana Özellikler
        </h2>
        <p className="section-description mt-1.5 sm:mt-2 lg:mt-2.5 xl:mt-3 text-gray-400 max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto text-xs sm:text-sm lg:text-base xl:text-lg px-4">
          Tüm işlem ve portföy yönetimi araçlarınız tek bir yerde
        </p>
      </div>

      <div className="features-grid grid gap-3 sm:gap-4 lg:gap-5 xl:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
        {/* CARD 1 */}
<div className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:p-6 xl:p-7 backdrop-blur transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1 hover:bg-white/[0.05]">          <span className="feature-icon text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-teal-400">
            <Icon icon="mdi:briefcase-variant-outline" />
          </span>
          <h3 className="feature-title mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            Spot Pozisyonları
          </h3>
          <p className="feature-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            Tüm spot holdinglerınızı görüntüleyin. Giriş fiyatları, güncel değer ve
            unrealized PnL&apos;i anlık takip edin.
          </p>
          <ul className="feature-list mt-2.5 sm:mt-3 lg:mt-4 space-y-1 sm:space-y-1.5 lg:space-y-2 text-xs sm:text-sm lg:text-base text-gray-300
            [&>li]:relative [&>li]:pl-4 sm:[&>li]:pl-5 lg:[&>li]:pl-6
            [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0
            [&>li]:before:content-['✓'] [&>li]:before:text-emerald-400
            [&>li]:before:font-bold [&>li]:before:inline-block
            [&>li]:before:w-3 sm:[&>li]:before:w-4 lg:[&>li]:before:w-5 [&>li]:before:text-center">
            <li>Çoklu borsa desteği</li>
            <li>Anlık fiyat güncelleme</li>
            <li>Unrealized PnL hesaplama</li>
            <li>Portföy dağılımı görünümü</li>
          </ul>
        </div>

        {/* CARD 2 */}
<div className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:p-6 xl:p-7 backdrop-blur transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1 hover:bg-white/[0.05]">          <span className="feature-icon text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-teal-400">
            <Icon icon="mdi:flash-outline" />
          </span>
          <h3 className="feature-title mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            Futures Pozisyonları
          </h3>
          <p className="feature-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            Açık futures pozisyonlarınızı izleyin. Kaldıraç, margin ve tasfiye
            seviyelerini görün.
          </p>
          <ul className="feature-list mt-2.5 sm:mt-3 lg:mt-4 space-y-1 sm:space-y-1.5 lg:space-y-2 text-xs sm:text-sm lg:text-base text-gray-300
            [&>li]:relative [&>li]:pl-4 sm:[&>li]:pl-5 lg:[&>li]:pl-6
            [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0
            [&>li]:before:content-['✓'] [&>li]:before:text-emerald-400
            [&>li]:before:font-bold [&>li]:before:inline-block
            [&>li]:before:w-3 sm:[&>li]:before:w-4 lg:[&>li]:before:w-5 [&>li]:before:text-center">
            <li>Long/Short pozisyon takibi</li>
            <li>Kaldıraç ve margin görünümü</li>
            <li>Tasfiye fiyatı hesaplama</li>
            <li>Funding rate etkisi</li>
          </ul>
        </div>

        {/* CARD 3 */}
<div className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:p-6 xl:p-7 backdrop-blur transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1 hover:bg-white/[0.05]">          <span className="feature-icon text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-teal-400">
            <Icon icon="mdi:cash-multiple" />
          </span>
          <h3 className="feature-title mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            PnL Analizi
          </h3>
          <p className="feature-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            Realized ve unrealized PnL&apos;inizi detaylı görün. Coin bazlı, borsa bazlı veya
            toplam getiri analizi yapın.
          </p>
          <ul className="feature-list mt-2.5 sm:mt-3 lg:mt-4 space-y-1 sm:space-y-1.5 lg:space-y-2 text-xs sm:text-sm lg:text-base text-gray-300
            [&>li]:relative [&>li]:pl-4 sm:[&>li]:pl-5 lg:[&>li]:pl-6
            [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0
            [&>li]:before:content-['✓'] [&>li]:before:text-emerald-400
            [&>li]:before:font-bold [&>li]:before:inline-block
            [&>li]:before:w-3 sm:[&>li]:before:w-4 lg:[&>li]:before:w-5 [&>li]:before:text-center">
            <li>Realized PnL breakdown</li>
            <li>Unrealized PnL tracking</li>
            <li>Coin bazlı performans</li>
            <li>Tarihsel getiri grafiği</li>
          </ul>
        </div>

        {/* CARD 4 */}
<div className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:p-6 xl:p-7 backdrop-blur transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1 hover:bg-white/[0.05]">          <span className="feature-icon text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-teal-400">
            <Icon icon="mdi:target-account" />
          </span>
          <h3 className="feature-title mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            DCA Hesaplama
          </h3>
          <p className="feature-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            Farklı zamanlarda yaptığınız alımları birleştirerek ortalama giriş
            fiyatınızı hesaplayın.
          </p>
          <ul className="feature-list mt-2.5 sm:mt-3 lg:mt-4 space-y-1 sm:space-y-1.5 lg:space-y-2 text-xs sm:text-sm lg:text-base text-gray-300
            [&>li]:relative [&>li]:pl-4 sm:[&>li]:pl-5 lg:[&>li]:pl-6
            [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0
            [&>li]:before:content-['✓'] [&>li]:before:text-emerald-400
            [&>li]:before:font-bold [&>li]:before:inline-block
            [&>li]:before:w-3 sm:[&>li]:before:w-4 lg:[&>li]:before:w-5 [&>li]:before:text-center">
            <li>Otomatik DCA hesaplama</li>
            <li>Manuel alım ekleme</li>
            <li>Ortalama fiyat görünümü</li>
            <li>Break-even analizi</li>
          </ul>
        </div>

        {/* CARD 5 */}
<div className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:p-6 xl:p-7 backdrop-blur transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1 hover:bg-white/[0.05]">          <span className="feature-icon text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-teal-400">
            <Icon icon="mdi:shield-alert-outline" />
          </span>
          <h3 className="feature-title mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            Risk Yönetimi
          </h3>
          <p className="feature-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            Portföy risk seviyenizi ölçün. Stop-loss önerileri alın ve pozisyon
            boyutu optimizasyonu yapın. 
          </p>
          <ul className="feature-list mt-2.5 sm:mt-3 lg:mt-4 space-y-1 sm:space-y-1.5 lg:space-y-2 text-xs sm:text-sm lg:text-base text-gray-300
            [&>li]:relative [&>li]:pl-4 sm:[&>li]:pl-5 lg:[&>li]:pl-6
            [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0
            [&>li]:before:content-['✓'] [&>li]:before:text-emerald-400
            [&>li]:before:font-bold [&>li]:before:inline-block
            [&>li]:before:w-3 sm:[&>li]:before:w-4 lg:[&>li]:before:w-5 [&>li]:before:text-center">
            <li>Risk seviyesi skorlama</li>
            <li>Stop-loss önerileri</li>
            <li>Position sizing hesaplama</li>
            <li>Çeşitlendirme analizi</li>
          </ul>
        </div>

        {/* CARD 6 */}
<div className="feature-card rounded-lg sm:rounded-xl lg:rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 lg:p-6 xl:p-7 backdrop-blur transition-all duration-300 hover:border-teal-400 hover:shadow-[0_8px_32px_rgba(25,216,208,0.2)] hover:-translate-y-1 hover:bg-white/[0.05]">          <span className="feature-icon text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-teal-400">
            <Icon icon="mdi:chart-line-variant" />
          </span>
          <h3 className="feature-title mt-2 sm:mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-white">
            Performans İstatistikleri
          </h3>
          <p className="feature-description mt-1.5 sm:mt-2 lg:mt-2.5 text-xs sm:text-sm lg:text-base text-gray-400 leading-relaxed">
            Geçmiş işlem performansınızı analiz edin. Win rate, ortalama getiri ve
            en karlı coin&apos;leri görün.
          </p>
          <ul className="feature-list mt-2.5 sm:mt-3 lg:mt-4 space-y-1 sm:space-y-1.5 lg:space-y-2 text-xs sm:text-sm lg:text-base text-gray-300
            [&>li]:relative [&>li]:pl-4 sm:[&>li]:pl-5 lg:[&>li]:pl-6
            [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0
            [&>li]:before:content-['✓'] [&>li]:before:text-emerald-400
            [&>li]:before:font-bold [&>li]:before:inline-block
            [&>li]:before:w-3 sm:[&>li]:before:w-4 lg:[&>li]:before:w-5 [&>li]:before:text-center">
            <li>Win / Loss oranı</li>
            <li>Ortalama kazanç / kayıp</li>
            <li>En karlı / zararlı işlemler</li>
            <li>Aylık performans raporu</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
