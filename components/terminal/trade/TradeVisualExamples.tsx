export default function TradeVisualExamples() {
  return (
      <section className="mb-20">

      {/* Section Header */}
      <div className="section-header mb-14 text-center">
        <h2 className="section-title text-3xl font-extrabold text-white">
          Örnek Pano Görünümü
        </h2>
        <p className="section-description mt-3 text-gray-400 max-w-xl mx-auto">
          Portföy araçlarınızı nasıl görüntüleyeceğinize dair örnekler
        </p>
      </div>

      {/* Spot Portfolio */}
      <div className="visual-example">
        <h3 className="mb-6 text-xl font-bold text-white">
          Spot Portföy Özeti
        </h3>

        <div className="example-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="example-card rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="example-label text-sm text-gray-400">
              Toplam Değer
            </div>
            <div className="example-value mt-2 text-2xl font-extrabold text-white">
              $124,567
            </div>
            <div className="example-subvalue mt-1 text-sm text-gray-500">
              ≈ 2.83 BTC
            </div>
          </div>

          <div className="example-card rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="example-label text-sm text-gray-400">
              Unrealized PnL
            </div>
            <div className="example-value mt-2 text-2xl font-extrabold text-emerald-400">
              +$12,890
            </div>
            <div className="example-subvalue mt-1 text-sm text-gray-500">
              +11.5% getiri
            </div>
          </div>

          <div className="example-card rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="example-label text-sm text-gray-400">
              En İyi Performans
            </div>
            <div className="example-value mt-2 text-2xl font-extrabold text-white">
              SOL
            </div>
            <div className="example-subvalue mt-1 text-sm text-gray-500">
              +42.3% getiri
            </div>
          </div>

          <div className="example-card rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="example-label text-sm text-gray-400">
              Toplam Coin
            </div>
            <div className="example-value mt-2 text-2xl font-extrabold text-white">
              12
            </div>
            <div className="example-subvalue mt-1 text-sm text-gray-500">
              5 borsada
            </div>
          </div>
        </div>
      </div>

      {/* Futures */}
      <div className="visual-example mt-6">
        <h3 className="mb-6 text-xl font-bold text-white">
          Futures Pozisyonları
        </h3>

        <div className="example-grid grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="example-card rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="example-label text-sm text-gray-400">
              Açık Pozisyon
            </div>
            <div className="example-value mt-2 text-2xl font-extrabold text-white">
              3
            </div>
            <div className="example-subvalue mt-1 text-sm text-gray-500">
              2 Long, 1 Short
            </div>
          </div>

          <div className="example-card rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="example-label text-sm text-gray-400">
              Toplam Margin
            </div>
            <div className="example-value mt-2 text-2xl font-extrabold text-white">
              $8,450
            </div>
            <div className="example-subvalue mt-1 text-sm text-gray-500">
              Ortalama 5x kaldıraç
            </div>
          </div>

          <div className="example-card rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="example-label text-sm text-gray-400">
              Unrealized PnL
            </div>
            <div className="example-value mt-2 text-2xl font-extrabold text-emerald-400">
              +$1,234
            </div>
            <div className="example-subvalue mt-1 text-sm text-gray-500">
              +14.6% kazanç
            </div>
          </div>

          <div className="example-card rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <div className="example-label text-sm text-gray-400">
              Tasfiye Riski
            </div>
            <div className="example-value mt-2 text-2xl font-extrabold text-emerald-400">
              Düşük
            </div>
            <div className="example-subvalue mt-1 text-sm text-gray-500">
              En yakın: -18%
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
