'use client';

import { useEffect } from 'react';

interface RiskCalculationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RiskCalculationModal({ isOpen, onClose }: RiskCalculationModalProps) {
  // Modal açıkken body scroll'u kilitle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-950 border border-slate-800/50 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8 custom-scrollbar">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            📊 Risk Hesaplama Detayları
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-3xl leading-none transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Pozisyon Risk Skoru */}
          <div className="p-5 bg-emerald-500/5 border-l-4 border-emerald-500 rounded-2xl">
            <h4 className="text-base font-extrabold text-emerald-400 mb-3">
              Pozisyon Risk Skoru (7.2/10)
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Portföyünüzdeki tüm pozisyonların risk seviyelerinin ağırlıklı ortalamasıdır. Yüksek kaldıraçlı pozisyonlar, düşük skorlarla cezalandırılır.
            </p>
            <div className="p-3 bg-black/30 rounded-lg font-mono text-xs text-emerald-400">
              Hesaplama: (Spot_Ağırlık × 8.5) + (Futures_Ağırlık × 5.8) = 7.2
            </div>
          </div>

          {/* Ortalama Kaldıraç */}
          <div className="p-5 bg-orange-500/5 border-l-4 border-orange-500 rounded-2xl">
            <h4 className="text-base font-extrabold text-orange-400 mb-3">
              Ortalama Kaldıraç (11.7x)
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Tüm futures pozisyonlarınızın kaldıraç değerlerinin pozisyon büyüklüğüne göre ağırlıklı ortalamasıdır.
            </p>
            <div className="p-3 bg-black/30 rounded-lg font-mono text-xs text-orange-400">
              Hesaplama: (BTC_10x × 0.5) + (ETH_5x × 5) + (SOL_20x × 100) / Toplam_Kontrat = 11.7x
            </div>
          </div>

          {/* Günlük Volatilite Riski */}
          <div className="p-5 bg-cyan-500/5 border-l-4 border-cyan-500 rounded-2xl">
            <h4 className="text-base font-extrabold text-cyan-400 mb-3">
              Günlük Volatilite Riski (±$12,340)
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Geçmiş 30 günlük fiyat hareketlerine ve pozisyon büyüklüklerine göre portföyünüzün bir günde alabileceği maksimum değer değişimi (%95 güven aralığı).
            </p>
            <div className="p-3 bg-black/30 rounded-lg font-mono text-xs text-cyan-400">
              VaR (95%): Σ(Pozisyon_Değeri × Volatilite × 1.65) = $12,340
            </div>
          </div>

          {/* Likidasyon Yakınlığı */}
          <div className="p-5 bg-purple-500/5 border-l-4 border-purple-500 rounded-2xl">
            <h4 className="text-base font-extrabold text-purple-400 mb-3">
              Likidasyon Yakınlığı (Düşük)
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              En yakın likidasyon fiyatına olan uzaklığın yüzdesel ifadesidir. BTC Long pozisyonunuz -10.9% mesafede olup &quot;Düşük Risk&quot; kategorisindedir.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.8);
        }
      `}</style>
    </div>
  );
}