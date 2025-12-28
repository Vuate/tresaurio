'use client';

import { useState } from 'react';

export default function ScenarioAnalysis() {
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [action, setAction] = useState('AL');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [showNotif, setShowNotif] = useState(false);


  const calculateScenario = () => {
    console.log('Senario hesaplanıyor...');
  };

const saveCurrentScenario = () => {
  setShowNotif(true);

  setTimeout(() => {
    setShowNotif(false);
  }, 4000);
};


  return (
    <div id="senario-analizi" className="bg-gradient-to-br from-cyan-500/8 to-purple-500/8 border-2 border-cyan-500/20 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤔</span>
          <h2 className="text-xl font-semibold text-white">Eğer... Senario Analizi</h2>
        </div>
      </div>

      <div className="space-y-6">
        {/* Senario Girişi */}
        <div className="p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
          <div className="text-base font-extrabold text-cyan-400 mb-4">📊 Yeni İşlem Simüle Et</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Coin</label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800  cursor-pointer border border-slate-700 rounded-lg text-white font-mono text-sm font-bold focus:outline-none focus:border-cyan-500 transition-colors [&>option]:bg-slate-800 [&>option]:text-white"
              >
                <option>BTC</option>
                <option>ETH</option>
                <option>SOL</option>
                <option>XRP</option>
                <option>BNB</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase  ">İşlem</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg cursor-pointer  text-white font-mono text-sm font-bold focus:outline-none focus:border-cyan-500 transition-colors [&>option]:bg-slate-800 [&>option]:text-white"
              >
                <option>AL</option>
                <option>SAT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Miktar</label>
              <input
                type="number"
                placeholder="0.5"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-slate-800 rounded-lg text-white font-mono text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase">Fiyat</label>
              <input
                type="number"
                placeholder="42,000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2.5 bg-white/5 border border-slate-800 rounded-lg text-white font-mono text-sm font-bold"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={calculateScenario}
                className="w-full px-3 py-2.5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg text-white font-extrabold text-sm uppercase hover:from-cyan-400 hover:to-blue-400 transition-all cursor-pointer"
              >
                Hesapla
              </button>
            </div>
          </div>
        </div>

        {/* Senario Sonuçları */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Mevcut Durum */}
          <div className="p-5 bg-white/[0.03] border border-slate-800 rounded-2xl">
            <div className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">📌 Mevcut Durum</div>
            <div className="space-y-3">
              <div className="flex justify-between py-2.5 border-b border-white/5">
                <span className="text-xs text-slate-500">BTC Miktarı</span>
                <span className="font-mono text-sm font-extrabold text-white">2.1450</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-white/5">
                <span className="text-xs text-slate-500">Ortalama Maliyet</span>
                <span className="font-mono text-sm font-extrabold text-white">$38,420</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-white/5">
                <span className="text-xs text-slate-500">Toplam Maliyet</span>
                <span className="font-mono text-sm font-extrabold text-white">$82,411.90</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-xs text-slate-500">Güncel Değer</span>
                <span className="font-mono text-sm font-extrabold text-emerald-400">$92,785.79</span>
              </div>
            </div>
          </div>

          {/* Yeni Durum */}
          <div className="p-5 bg-gradient-to-br from-cyan-500/8 to-purple-500/5 border-2 border-cyan-500/30 rounded-2xl">
            <div className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wider">✨ Eğer 0.5 BTC @ $42,000 ALIRSAM</div>
            <div className="space-y-3">
              <div className="flex justify-between py-2.5 border-b border-white/5">
                <span className="text-xs text-slate-500">Yeni BTC Miktarı</span>
                <span className="font-mono text-sm font-extrabold text-cyan-400">2.6450 (+0.5)</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-white/5">
                <span className="text-xs text-slate-500">Yeni Ort. Maliyet</span>
                <span className="font-mono text-sm font-extrabold text-cyan-400">$39,087.96</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-white/5">
                <span className="text-xs text-slate-500">Yeni Toplam Maliyet</span>
                <span className="font-mono text-sm font-extrabold text-white">$103,411.90</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-white/5">
                <span className="text-xs text-slate-500">Yeni Güncel Değer</span>
                <span className="font-mono text-sm font-extrabold text-cyan-400">$114,414.42</span>
              </div>
              <div className="mt-2 p-3 bg-cyan-500/12 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400">Beklenen Etki</span>
                  <span className="font-mono text-base font-black text-cyan-400" style={{ textShadow: '0 0 15px rgb(6 182 212)' }}>
                    Ort. Maliyet +1.7% ⬆️
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hızlı Senariolar */}
        <div className="p-5 bg-white/[0.02] border border-dashed border-slate-800 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-bold text-slate-400">⚡ Hızlı Senariolar</div>
            <button
              onClick={saveCurrentScenario}
              className="px-4 py-2 bg-gradient-to-br  cursor-pointer from-cyan-500 to-blue-500 rounded-lg text-white font-bold text-xs uppercase hover:from-cyan-400 hover:to-blue-400 transition-all"
            >
              💾 Kaydet
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button className="p-4 bg-white/5 hover:bg-white/10 border border-slate-800 rounded-xl transition-all text-left">
              <div className="text-xs text-slate-500 mb-1">Eğer</div>
              <div className="text-sm font-extrabold text-emerald-400 mb-1">0.5 BTC @ $40,000 ALIRSAM</div>
              <div className="text-xs text-slate-500">Maliyet: $37,953 (-1.2%)</div>
            </button>
            <button className="p-4 bg-white/5 hover:bg-white/10 border border-slate-800 rounded-xl transition-all text-left">
              <div className="text-xs text-slate-500 mb-1">Eğer</div>
              <div className="text-sm font-extrabold text-red-400 mb-1">1.0 BTC @ $43,500 SATARSAM</div>
              <div className="text-xs text-slate-500">Kâr: +$5,080 (Realize)</div>
            </button>
            <button className="p-4 bg-white/5 hover:bg-white/10 border border-slate-800 rounded-xl transition-all text-left">
              <div className="text-xs text-slate-500 mb-1">Eğer</div>
              <div className="text-sm font-extrabold text-orange-400 mb-1">Tümünü @ $43,256 SATARSAM</div>
              <div className="text-xs text-slate-500">Kâr: +$10,374 (Realize)</div>
            </button>
          </div>
        </div>
      </div>

{showNotif && (
  <div className="fixed top-6 right-6 z-[9999] animate-slide-in">
    <div className="relative w-[360px] rounded-2xl border border-emerald-400/30 
      bg-gradient-to-br from-[#0f172a]/90 to-[#020617]/90 
      backdrop-blur-xl p-5 shadow-2xl">

      {/* Close */}
      <button
        onClick={() => setShowNotif(false)}
        className="absolute top-3 right-3 text-white/50 hover:text-white cursor-pointer"
      >
        ✕
      </button>

      <div className="flex items-start gap-4">
        <div className="text-3xl">💾</div>

        <div>
          <h4 className="text-emerald-400 font-bold text-lg">
            Senaryo Kaydedildi!
          </h4>
          <p className="text-sm text-slate-300 mt-1">
            Mevcut senaryo hızlı erişim butonlarına eklendi.
            Artık tek tıkla çalıştırabilirsin.
          </p>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}