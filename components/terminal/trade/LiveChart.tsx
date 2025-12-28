'use client';

import { useState } from 'react';

export default function LiveChart() {
  const [selectedCoin, setSelectedCoin] = useState('BTCUSDT');
  const [activeTimeframe, setActiveTimeframe] = useState('15');

  const updateChart = (coin: string) => {
    setSelectedCoin(coin);
    console.log('Grafik güncelleniyor:', coin);
  };

  const handleTimeframe = (timeframe: string) => {
    setActiveTimeframe(timeframe);
    console.log('Timeframe değiştirildi:', timeframe);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl overflow-hidden">
      <div className="px-8 py-6 bg-white/[0.02] border-b-2 border-slate-800">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📈</span>
            <h3 className="text-xl font-extrabold text-white">Canlı Grafik</h3>
          </div>
          
          <div className="flex gap-3 items-center">
            <select
              value={selectedCoin}
              onChange={(e) => updateChart(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-sm font-bold focus:outline-none focus:border-cyan-500 transition-colors [&>option]:bg-slate-800 [&>option]:text-white cursor-pointer"
            >
              <option value="BTCUSDT">BTC/USDT</option>
              <option value="ETHUSDT">ETH/USDT</option>
              <option value="SOLUSDT">SOL/USDT</option>
              <option value="XRPUSDT">XRP/USDT</option>
            </select>
            
            <div className="flex gap-1 bg-white/[0.03] p-1 rounded-lg ">
              <button
                onClick={() => handleTimeframe('15')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  activeTimeframe === '15'
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 '
                }`}
              >
                15m
              </button>
              <button
                onClick={() => handleTimeframe('60')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  activeTimeframe === '60'
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                1h
              </button>
              <button
                onClick={() => handleTimeframe('240')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  activeTimeframe === '240'
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                4h
              </button>
              <button
                onClick={() => handleTimeframe('D')}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  activeTimeframe === 'D'
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                1D
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-[500px] bg-[#0a0b0f] relative">
        {/* TradingView Widget */}
        <div id="tradingview_chart" className="h-full w-full">
          <div className="flex items-center justify-center h-full text-slate-500">
            TradingView Widget buraya gelecek
          </div>
        </div>
      </div>
    </div>
  );
}