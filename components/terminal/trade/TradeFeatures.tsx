export default function TradeFeatures() {
  return (
      <section className="mb-20">

      {/* Section Header */}
      <div className="section-header mb-14 text-center">
        <h2 className="section-title text-3xl font-extrabold text-white">
          Ana Özellikler
        </h2>
        <p className="section-description mt-3 text-gray-400 max-w-xl mx-auto">
          Tüm işlem ve portföy yönetimi araçlarınız tek bir yerde
        </p>
      </div>

      {/* Features Grid */}
      <div className="features-grid grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* CARD */}
        <div className="feature-card rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:border-teal-400/40 hover:bg-white/[0.05]">
          <span className="feature-icon text-3xl">💼</span>
          <h3 className="feature-title mt-4 text-lg font-bold text-white">
            Spot Pozisyonları
          </h3>
          <p className="feature-description mt-2 text-sm text-gray-400">
            Tüm spot holdinglerınızı görüntüleyin. Giriş fiyatları, güncel değer ve
            unrealized PnL&apos;i anlık takip edin.
          </p>
<ul
  className="
    feature-list mt-4 space-y-2 text-sm text-gray-300
    [&>li]:relative
    [&>li]:pl-6
    [&>li]:before:absolute
    [&>li]:before:left-0
    [&>li]:before:top-0
    [&>li]:before:content-['✓']
    [&>li]:before:text-emerald-400
    [&>li]:before:font-bold
    [&>li]:text-gray-300
    [&>li]:before:inline-block
    [&>li]:before:w-4
    [&>li]:before:text-center
  "
>
            <li> Çoklu borsa desteği</li>
            <li> Anlık fiyat güncelleme</li>
            <li> Unrealized PnL hesaplama</li>
            <li> Portföy dağılımı görünümü</li>
          </ul>
        </div>

        <div className="feature-card rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:border-teal-400/40 hover:bg-white/[0.05]">
          <span className="feature-icon text-3xl">⚡</span>
          <h3 className="feature-title mt-4 text-lg font-bold text-white">
            Futures Pozisyonları
          </h3>
          <p className="feature-description mt-2 text-sm text-gray-400">
            Açık futures pozisyonlarınızı izleyin. Kaldıraç, margin ve tasfiye
            seviyelerini görün.
          </p>
<ul
  className="
    feature-list mt-4 space-y-2 text-sm text-gray-300
    [&>li]:relative
    [&>li]:pl-6
    [&>li]:before:absolute
    [&>li]:before:left-0
    [&>li]:before:top-0
    [&>li]:before:content-['✓']
    [&>li]:before:text-emerald-400
    [&>li]:before:font-bold
    [&>li]:text-gray-300
    [&>li]:before:inline-block
    [&>li]:before:w-4
    [&>li]:before:text-center
  "
>
            <li> Long/Short pozisyon takibi</li>
            <li> Kaldıraç ve margin görünümü</li>
            <li> Tasfiye fiyatı hesaplama</li>
            <li> Funding rate etkisi</li>
          </ul>
        </div>

        <div className="feature-card rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:border-teal-400/40 hover:bg-white/[0.05]">
          <span className="feature-icon text-3xl">📈</span>
          <h3 className="feature-title mt-4 text-lg font-bold text-white">
            PnL Analizi
          </h3>
          <p className="feature-description mt-2 text-sm text-gray-400">
            Realized ve unrealized PnL&apos;inizi detaylı görün. Coin bazlı, borsa bazlı veya
            toplam getiri analizi yapın.
          </p>
<ul
  className="
    feature-list mt-4 space-y-2 text-sm text-gray-300
    [&>li]:relative
    [&>li]:pl-6
    [&>li]:before:absolute
    [&>li]:before:left-0
    [&>li]:before:top-0
    [&>li]:before:content-['✓']
    [&>li]:before:text-emerald-400
    [&>li]:before:font-bold
    [&>li]:text-gray-300
    [&>li]:before:inline-block
    [&>li]:before:w-4
    [&>li]:before:text-center
  "
>
            <li> Realized PnL breakdown</li>
            <li> Unrealized PnL tracking</li>
            <li> Coin bazlı performans</li>
            <li> Tarihsel getiri grafiği</li>
          </ul>
        </div>

        <div className="feature-card rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:border-teal-400/40 hover:bg-white/[0.05]">
          <span className="feature-icon text-3xl">🎯</span>
          <h3 className="feature-title mt-4 text-lg font-bold text-white">
            DCA Hesaplama
          </h3>
          <p className="feature-description mt-2 text-sm text-gray-400">
            Farklı zamanlarda yaptığınız alımları birleştirerek ortalama giriş
            fiyatınızı hesaplayın.
          </p>
<ul
  className="
    feature-list mt-4 space-y-2 text-sm text-gray-300
    [&>li]:relative
    [&>li]:pl-6
    [&>li]:before:absolute
    [&>li]:before:left-0
    [&>li]:before:top-0
    [&>li]:before:content-['✓']
    [&>li]:before:text-emerald-400
    [&>li]:before:font-bold
    [&>li]:text-gray-300
    [&>li]:before:inline-block
    [&>li]:before:w-4
    [&>li]:before:text-center
  "
>
            <li> Otomatik DCA hesaplama</li>
            <li> Manuel alım ekleme</li>
            <li> Ortalama fiyat görünümü</li>
            <li> Break-even analizi</li>
          </ul>
        </div>

        <div className="feature-card rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:border-teal-400/40 hover:bg-white/[0.05]">
          <span className="feature-icon text-3xl">⚠️</span>
          <h3 className="feature-title mt-4 text-lg font-bold text-white">
            Risk Yönetimi
          </h3>
          <p className="feature-description mt-2 text-sm text-gray-400">
            Portföy risk seviyenizi ölçün. Stop-loss önerileri alın ve pozisyon
            boyutu optimizasyonu yapın.
          </p>
<ul
  className="
    feature-list mt-4 space-y-2 text-sm text-gray-300
    [&>li]:relative
    [&>li]:pl-6
    [&>li]:before:absolute
    [&>li]:before:left-0
    [&>li]:before:top-0
    [&>li]:before:content-['✓']
    [&>li]:before:text-emerald-400
    [&>li]:before:font-bold
    [&>li]:text-gray-300
    [&>li]:before:inline-block
    [&>li]:before:w-4
    [&>li]:before:text-center
  "
>
            <li> Risk seviyesi skorlama</li>
            <li> Stop-loss önerileri</li>
            <li> Position sizing hesaplama</li>
            <li> Çeşitlendirme analizi</li>
          </ul>
        </div>

        <div className="feature-card rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:border-teal-400/40 hover:bg-white/[0.05]">
          <span className="feature-icon text-3xl">📊</span>
          <h3 className="feature-title mt-4 text-lg font-bold text-white">
            Performans İstatistikleri
          </h3>
          <p className="feature-description mt-2 text-sm text-gray-400">
            Geçmiş işlem performansınızı analiz edin. Win rate, ortalama getiri ve
            en karlı coin&apos;leri görün.
          </p>
<ul
  className="
    feature-list mt-4 space-y-2 text-sm text-gray-300
    [&>li]:relative
    [&>li]:pl-6
    [&>li]:before:absolute
    [&>li]:before:left-0
    [&>li]:before:top-0
    [&>li]:before:content-['✓']
    [&>li]:before:text-emerald-400
    [&>li]:before:font-bold
    [&>li]:text-gray-300
    [&>li]:before:inline-block
    [&>li]:before:w-4
    [&>li]:before:text-center
  "
>
            <li> Win / Loss oranı</li>
            <li> Ortalama kazanç / kayıp</li>
            <li> En karlı / zararlı işlemler</li>
            <li> Aylık performans raporu</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
