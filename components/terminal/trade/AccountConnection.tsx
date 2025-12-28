'use client';

import { useState, useEffect } from 'react';

interface AccountConnectionProps {
  onOpenAPIModal: () => void;
}

export default function AccountConnection({ onOpenAPIModal }: AccountConnectionProps) {
  const [currentTime, setCurrentTime] = useState('');

  // Canlı saat
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="hesap-baglanti" className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 rounded-2xl p-8">
      <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800/30">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🔌</span>
          <h2 className="text-xl font-bold text-white">Hesap & Bağlantı</h2>
        </div>
        <button 
          className="w-12 h-12 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-cyan-500/30"
          onClick={onOpenAPIModal}
          title="Borsa Ekle"
        >
          <span className="text-2xl font-black leading-none cursor-pointer">+</span>
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-x-8 gap-y-8">
        {/* İlk satır */}
        <div className="flex items-center justify-between bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
          <span className="text-slate-400 text-sm font-medium">BINANCE</span>
          <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 text-emerald-400 rounded-xl border border-emerald-500/30 text-xs font-bold">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            BAĞLI
          </span>
        </div>
        
        <div className="flex items-center justify-between bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
          <span className="text-slate-400 text-sm font-medium">OKX</span>
          <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 text-emerald-400 rounded-xl border border-emerald-500/30 text-xs font-bold">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            BAĞLI
          </span>
        </div>
        
        <div className="flex items-center justify-between bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
          <span className="text-slate-400 text-sm font-medium">UPBIT</span>
          <span className="px-4 py-2 bg-rose-500/15 text-rose-400 rounded-xl border border-rose-500/30 text-xs font-bold">
            BAĞLI DEĞİL
          </span>
        </div>
        
        <div className="flex items-center justify-between bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
          <span className="text-slate-400 text-sm font-medium">COINBASE</span>
          <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 text-emerald-400 rounded-xl border border-emerald-500/30 text-xs font-bold">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            BAĞLI
          </span>
        </div>
        
        {/* İkinci satır */}
        <div className="flex items-center justify-between bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
          <span className="text-slate-400 text-sm font-medium">GATE.IO</span>
          <span className="px-4 py-2 bg-rose-500/15 text-rose-400 rounded-xl border border-rose-500/30 text-xs font-bold">
            BAĞLI DEĞİL
          </span>
        </div>
        
        <div className="flex items-center justify-between bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
          <span className="text-slate-400 text-sm font-medium">MEXC</span>
          <span className="px-4 py-2 bg-rose-500/15 text-rose-400 rounded-xl border border-rose-500/30 text-xs font-bold">
            BAĞLI DEĞİL
          </span>
        </div>
        
        <div className="flex items-center justify-between bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
          <span className="text-slate-400 text-sm font-medium">KUCOIN</span>
          <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 text-emerald-400 rounded-xl border border-emerald-500/30 text-xs font-bold">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            BAĞLI
          </span>
        </div>
        
        <div className="flex items-center justify-between bg-slate-800/20 rounded-xl p-4 border border-slate-700/30">
          <span className="text-slate-400 text-sm font-medium">Son Güncelleme</span>
          <span className="text-white font-bold text-lg">{currentTime}</span>
        </div>
      </div>
    </div>
  );
}