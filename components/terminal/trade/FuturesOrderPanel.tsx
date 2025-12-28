'use client';

import { useState } from 'react';

export default function FuturesOrderPanel() {
  const [selectedExchange, setSelectedExchange] = useState('binance');
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [orderType, setOrderType] = useState('market');
  const [showTPSL, setShowTPSL] = useState(false);
  const [leverage, setLeverage] = useState(10);

  const selectFuturesOrderType = (type: string) => {
    setOrderType(type);
  };

  const setFuturesAmount = (percentage: number) => {
    console.log('Futures miktar:', percentage);
  };

  const updateLeverage = (value: number) => {
    setLeverage(value);
  };

  // Fiyat inputu gösterilecek mi?
  const showPriceInput = orderType === 'limit' || orderType === 'stop-limit';

  return (
    <div className="bg-gradient-to-br from-red-500/8 to-purple-500/8 border-2 border-red-500/20 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <h2 className="text-xl font-semibold text-white">Futures Emir Paneli</h2>
        </div>
      </div>

      {/* Mevcut Margin */}
      <div className="mb-5 p-4 bg-red-500/8 border border-red-500/20 rounded-xl">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400 font-bold">💰 Kullanılabilir Margin</span>
            <span className="font-mono text-xl font-black text-orange-400" style={{ textShadow: '0 0 15px rgb(251 146 60)' }}>$39,250.00</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-white/8">
            <span className="text-xs text-slate-500 font-semibold">Toplam Margin</span>
            <span className="font-mono text-sm font-bold text-white">$67,700.00</span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {/* Borsa ve Coin Seçimi */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Borsa</label>
            <select
              id="futuresExchange"
              value={selectedExchange}
              onChange={(e) => setSelectedExchange(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm font-bold cursor-pointer focus:outline-none focus:border-cyan-500 transition-colors [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="binance">BINANCE</option>
              <option value="okx">OKX</option>
              <option value="kucoin">KUCOIN</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Coin</label>
            <select
              id="futuresCoin"
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm font-bold cursor-pointer focus:outline-none focus:border-cyan-500 transition-colors [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="BTC">BTC/USDT Perpetual</option>
              <option value="ETH">ETH/USDT Perpetual</option>
              <option value="SOL">SOL/USDT Perpetual</option>
              <option value="XRP">XRP/USDT Perpetual</option>
            </select>
          </div>
        </div>

        {/* Kaldıraç Slider */}
        <div>
          <label className="flex justify-between items-center text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
            <span>Kaldıraç</span>
            <span id="leverageValue" className="text-2xl font-mono text-orange-400" style={{ textShadow: '0 0 15px rgb(251 146 60)' }}>{leverage}x</span>
          </label>
          <input
            type="range"
            id="leverageSlider"
            min="1"
            max="125"
            value={leverage}
            onChange={(e) => updateLeverage(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-slate-500 font-semibold">1x</span>
            <span className="text-xs text-slate-500 font-semibold">25x</span>
            <span className="text-xs text-slate-500 font-semibold">50x</span>
            <span className="text-xs text-slate-500 font-semibold">100x</span>
            <span className="text-xs text-slate-500 font-semibold">125x</span>
          </div>
        </div>

        {/* Emir Tipi */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Emir Tipi</label>
          <div className="grid grid-cols-4 gap-2">
            <button
              className={`px-3 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                orderType === 'market' ? 'bg-cyan-500 text-white border-2 border-cyan-400' : 'bg-white/5 text-slate-400 hover:text-white '
              }`}
              onClick={() => selectFuturesOrderType('market')}
            >
              MARKET
            </button>
            <button
              className={`px-3 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                orderType === 'limit' ? 'bg-cyan-500 text-white border-2 border-cyan-400' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
              onClick={() => selectFuturesOrderType('limit')}
            >
              LİMİT
            </button>
            <button
              className={`px-3 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                orderType === 'stop-limit' ? 'bg-cyan-500 text-white border-2 border-cyan-400' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
              onClick={() => selectFuturesOrderType('stop-limit')}
            >
              STOP-LİMİT
            </button>
            <button
              className={`px-3 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                orderType === 'stop-market' ? 'bg-cyan-500 text-white border-2 border-cyan-400' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
              onClick={() => selectFuturesOrderType('stop-market')}
            >
              STOP-MARKET
            </button>
          </div>
        </div>

        {/* Fiyat (Sadece Limit ve Stop-Limit için) */}
        {showPriceInput && (
          <div id="futuresPriceInput">
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Fiyat (USDT)</label>
            <input
              type="number"
              placeholder="43,256.78"
              className="w-full px-4 py-3.5 bg-white/5 border border-slate-800 rounded-xl text-white font-mono text-base font-bold"
            />
          </div>
        )}

        {/* Miktar */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Miktar (Kontrat)</label>
          <input
            type="number"
            placeholder="0.5000"
            className="w-full px-4 py-3.5 bg-white/5 border border-slate-800 rounded-xl text-white font-mono text-base font-bold"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => setFuturesAmount(0.25)} className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">25%</button>
            <button onClick={() => setFuturesAmount(0.5)} className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">50%</button>
            <button onClick={() => setFuturesAmount(0.75)} className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">75%</button>
            <button onClick={() => setFuturesAmount(1)} className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">100%</button>
          </div>
        </div>

        {/* TP/SL */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider cursor-pointer">
            <input
              type="checkbox"
              id="futuresTPSL"
              checked={showTPSL}
              onChange={(e) => setShowTPSL(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-cyan-500"
            />
            TAKE PROFİT / STOP LOSS
          </label>
          {showTPSL && (
            <div id="futuresTPSLInputs" className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="TP: 46,000"
                className="w-full px-3.5 py-3 bg-emerald-500/8 border border-emerald-500/20 rounded-lg text-emerald-400 font-mono text-sm font-bold"
              />
              <input
                type="number"
                placeholder="SL: 41,000"
                className="w-full px-3.5 py-3 bg-red-500/8 border border-red-500/20 rounded-lg text-red-400 font-mono text-sm font-bold"
              />
            </div>
          )}
        </div>

        {/* Margin & Liquidation Info */}
        <div className="p-4 bg-white/[0.03] border border-slate-800 rounded-xl">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Gerekli Margin</span>
              <span className="font-mono text-sm font-bold text-white">~$2,162.84</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-slate-400">Likidasyon Fiyatı</span>
              <span className="font-mono text-sm font-bold text-red-400">~$38,631.11</span>
            </div>
          </div>
        </div>

        {/* Long/Short Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="py-4 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex flex-col items-center justify-center cursor-pointer ">
            <span className="text-xl font-black text-white">LONG</span>
            <span className="text-xs text-white/80">AL / YÜKSELİŞ</span>
          </button>
          <button className="py-4 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 rounded-xl transition-all shadow-lg shadow-red-500/30 flex flex-col items-center justify-center cursor-pointer ">
            <span className="text-xl font-black text-white">SHORT</span>
            <span className="text-xs text-white/80">SAT / DÜŞÜŞ</span>
          </button>
        </div>
      </div>
    </div>
  );
}