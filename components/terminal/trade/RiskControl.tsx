'use client';

import { useState } from 'react';
import RiskCalculationModal from './RiskCalculationModal';

export default function RiskControl() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div id="risk-kontrol" className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800/30">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <h2 className="text-xl font-bold text-white">Risk & Kontrol</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-10 h-10 bg-cyan-500/20 cursor-pointer hover:bg-cyan-500/30 text-cyan-400 rounded-xl transition-colors flex items-center justify-center border border-cyan-500/30"
            title="Hesaplama Detayları"
          >
            <span className="text-lg font-black">?</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-slate-800/20 rounded-xl p-5 border border-slate-700/30 flex flex-col gap-2">
            <span className="text-slate-400 text-sm font-medium">Pozisyon Risk Skoru</span>
            <span className="text-emerald-400 font-bold text-lg">7.2 / 10</span>
          </div>
          
          <div className="bg-slate-800/20 rounded-xl p-5 border border-slate-700/30 flex flex-col gap-2">
            <span className="text-slate-400 text-sm font-medium">Kaldıraç Uyarıları</span>
            <span className="text-white font-bold text-lg">0</span>
          </div>
          
          <div className="bg-slate-800/20 rounded-xl p-5 border border-slate-700/30 flex flex-col gap-2">
            <span className="text-slate-400 text-sm font-medium">Likidasyon Yakınlığı</span>
            <span className="text-emerald-400 font-bold text-lg">Düşük</span>
          </div>
          
          <div className="bg-slate-800/20 rounded-xl p-5 border border-slate-700/30 flex flex-col gap-2">
            <span className="text-slate-400 text-sm font-medium">Margin Kullanımı</span>
            <span className="text-white font-bold text-lg">42% / $28,450</span>
          </div>
        </div>

   

        {/* Detaylı Risk Analizi */}
        <div className="mt-8 p-6 bg-orange-500/5 border-l-4 border-orange-500 rounded-2xl">
          <h4 className="text-base font-extrabold text-orange-400 mb-5">📊 Detaylı Risk Analizi</h4>
          
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-white/5">
              <div>
                <div className="text-sm text-slate-400 mb-1">Portföy Çeşitlendirmesi</div>
                <div className="text-xs text-slate-500">8 farklı varlıkta pozisyon</div>
              </div>
              <span className="font-mono text-base font-extrabold text-emerald-400">İyi</span>
            </div>

            <div className="flex justify-between py-3 border-b border-white/5">
              <div>
                <div className="text-sm text-slate-400 mb-1">Ortalama Kaldıraç</div>
                <div className="text-xs text-slate-500">Futures pozisyonları</div>
              </div>
              <span className="font-mono text-base font-extrabold text-orange-400">11.7x</span>
            </div>

            <div className="flex justify-between py-3 border-b border-white/5">
              <div>
                <div className="text-sm text-slate-400 mb-1">En Yakın Likidasyon</div>
                <div className="text-xs text-slate-500">BTC Long pozisyonu</div>
              </div>
              <span className="font-mono text-base font-extrabold text-emerald-400">-10.9%</span>
            </div>

            <div className="flex justify-between py-3 border-b border-white/5">
              <div>
                <div className="text-sm text-slate-400 mb-1">Maksimum Kayıp Riski</div>
                <div className="text-xs text-slate-500">Tüm pozisyonlar için</div>
              </div>
              <span className="font-mono text-base font-extrabold text-white">$28,450</span>
            </div>

            <div className="flex justify-between py-3">
              <div>
                <div className="text-sm text-slate-400 mb-1">Günlük Volatilite Riski</div>
                <div className="text-xs text-slate-500">%95 güven aralığı</div>
              </div>
              <span className="font-mono text-base font-extrabold text-orange-400">±$12,340</span>
            </div>
          </div>

          {/* Risk Önerileri */}
          <div className="mt-5 p-4 bg-white/[0.03] rounded-xl">
            <div className="text-sm font-bold text-emerald-400 mb-2">✅ Güçlü Yönler:</div>
            <ul className="text-xs text-slate-400 leading-relaxed pl-5 list-disc space-y-1">
              <li>İyi çeşitlendirilmiş portföy</li>
              <li>Düşük likidasyon riski</li>
              <li>Stop-loss emirleri aktif</li>
            </ul>
          </div>

          <div className="mt-3 p-4 bg-white/[0.03] rounded-xl">
            <div className="text-sm font-bold text-orange-400 mb-2">⚠️ Dikkat Edilmesi Gerekenler:</div>
            <ul className="text-xs text-slate-400 leading-relaxed pl-5 list-disc space-y-1">
              <li>SOL pozisyonunda 20x kaldıraç yüksek risk taşıyor</li>
              <li>Margin kullanım oranınızı %50&apos;nin altında tutun</li>
              <li>Volatilite artışında stop-loss seviyelerini güncelleyin</li>
            </ul>
          </div>
        </div>
      </div>

      <RiskCalculationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}