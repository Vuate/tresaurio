export default function TradeHowItWorks() {
  return (
      <section className="mb-20">

      {/* Section Header */}
      <div className="section-header mb-14 text-center">
        <h2 className="section-title text-3xl font-extrabold text-white">
          Nasıl Çalışır?
        </h2>
        <p className="section-description mt-3 text-gray-400 max-w-xl mx-auto">
          Trade &amp; Portföy Yönetimi&apos;ni kullanmaya başlamak için 4 adım
        </p>
      </div>

      {/* Steps */}
      <div className="steps grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {/* STEP 1 */}
        <div className="step rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <div className="step-number mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10 text-lg font-extrabold text-teal-400">
            1
          </div>
          <h3 className="step-title text-lg font-bold text-white">
            Borsa Bağlantısı
          </h3>
          <p className="step-description mt-2 text-sm text-gray-400">
            Kullandığınız borsaları (Binance, OKX, Bybit vs.) API ile bağlayın
            veya manuel olarak pozisyonlarınızı girin.
          </p>
        </div>

        {/* STEP 2 */}
        <div className="step rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <div className="step-number mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10 text-lg font-extrabold text-teal-400">
            2
          </div>
          <h3 className="step-title text-lg font-bold text-white">
            Pozisyon Takibi
          </h3>
          <p className="step-description mt-2 text-sm text-gray-400">
            Tüm spot ve futures pozisyonlarınız otomatik olarak panoya yüklenir.
            Anlık fiyatlar ve PnL hesaplamaları gerçek zamanlı güncellenir.
          </p>
        </div>

        {/* STEP 3 */}
        <div className="step rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <div className="step-number mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10 text-lg font-extrabold text-teal-400">
            3
          </div>
          <h3 className="step-title text-lg font-bold text-white">
            Analiz &amp; İçgörü
          </h3>
          <p className="step-description mt-2 text-sm text-gray-400">
            Portföy performansınızı analiz edin. En karlı / zararlı
            pozisyonlarınızı, risk seviyenizi ve çeşitlendirme durumunuzu görün.
          </p>
        </div>

        {/* STEP 4 */}
        <div className="step rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <div className="step-number mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-400/10 text-lg font-extrabold text-teal-400">
            4
          </div>
          <h3 className="step-title text-lg font-bold text-white">
            Optimizasyon
          </h3>
          <p className="step-description mt-2 text-sm text-gray-400">
            Risk yönetimi önerilerini uygulayın, stop-loss seviyelerini belirleyin
            ve portföy dağılımınızı optimize edin.
          </p>
        </div>
      </div>
    </section>
  );
}
