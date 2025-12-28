'use client';

import { useState } from 'react';
import AlertModal from './AlertModal';

export default function AlertAutomation() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fake data
  const alerts = [
    {
      type: 'success',
      icon: '✅',
      title: 'Fiyat Hedefi',
      message: "BTC $45,000'a ulaştığında bildirim gönder",
      titleColor: 'text-emerald-400',
      borderColor: 'border-l-emerald-500',
    },
    {
      type: 'danger',
      icon: '🚨',
      title: 'Likidasyon Uyarısı',
      message: 'ETH pozisyonu likidasyon fiyatına 5% yaklaştığında uyar',
      titleColor: 'text-rose-400',
      borderColor: 'border-l-rose-500',
    },
    {
      type: 'info',
      icon: '💰',
      title: 'Kâr Al',
      message: 'SOL +10% kâra ulaştığında %50 pozisyon kapat',
      titleColor: 'text-cyan-400',
      borderColor: 'border-l-cyan-500',
    },
  ];

  return (
    <>
      <div id="alert-otomasyon" className="bg-gradient-to-br from-slate-800/40 via-slate-900/40 to-slate-800/40 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700/40">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔔</span>
            <h2 className="text-xl font-bold text-white">Alert & Otomasyon (3 Aktif)</h2>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-12 h-12 bg-cyan-500 hover:bg-cyan-400 text-white rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-cyan-500/30 cursor-pointer"
            title="Alert Ekle"
          >
            <span className="text-2xl font-black leading-none">+</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`bg-slate-800/30 border-l-4 ${alert.borderColor} rounded-xl p-5 border border-slate-700/40 hover:bg-slate-800/40 transition-colors`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`flex items-center gap-2 font-bold text-sm ${alert.titleColor}`}>
                  <span className="text-lg">{alert.icon}</span>
                  <span>{alert.title}</span>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">AKTİF</span>
              </div>
              <div className="text-sm text-slate-300 leading-relaxed">
                {alert.message}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}