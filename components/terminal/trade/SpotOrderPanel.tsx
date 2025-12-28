'use client';

import { useState } from 'react';

export default function SpotOrderPanel() {
  const [selectedExchange, setSelectedExchange] = useState('binance');
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [orderType, setOrderType] = useState('market');
  const [showTPSL, setShowTPSL] = useState(false);

  const selectSpotOrderType = (type: string) => {
    setOrderType(type);
  };

  const setSpotAmount = (percentage: number) => {
    console.log('Spot miktar:', percentage);
  };

  // Fiyat inputu gösterilecek mi?
  const showPriceInput = orderType === 'limit' || orderType === 'stop-limit';

  return (
    <div className="bg-gradient-to-br from-emerald-500/8 to-emerald-500/2 border-2 border-emerald-500/20 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💎</span>
          <h2 className="text-xl font-semibold text-white">Spot Emir Paneli</h2>
        </div>
      </div>

      {/* Mevcut Bakiye */}
      <div className="mb-5 p-4 bg-emerald-500/8 border border-emerald-500/20 rounded-xl">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400 font-bold">💰 Mevcut Bakiye (USDT)</span>
          <span className="font-mono text-xl font-black text-emerald-400" style={{ textShadow: '0 0 15px rgb(16 185 129)' }}>$52,450.00</span>
        </div>
      </div>

      <div className="space-y-5">
        {/* Borsa ve Coin Seçimi */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Borsa</label>
            <select 
              id="spotExchange"
              value={selectedExchange}
              onChange={(e) => setSelectedExchange(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm font-bold cursor-pointer focus:outline-none focus:border-cyan-500 transition-colors [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="binance">BINANCE</option>
              <option value="okx">OKX</option>
              <option value="coinbase">COINBASE</option>
              <option value="kucoin">KUCOIN</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Coin</label>
            <select 
              id="spotCoin"
              value={selectedCoin}
              onChange={(e) => setSelectedCoin(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono text-sm font-bold cursor-pointer focus:outline-none focus:border-cyan-500 transition-colors [&>option]:bg-slate-800 [&>option]:text-white"
            >
              <option value="BTC">BTC/USDT</option>
              <option value="ETH">ETH/USDT</option>
              <option value="SOL">SOL/USDT</option>
              <option value="XRP">XRP/USDT</option>
              <option value="BNB">BNB/USDT</option>
              <option value="DOGE">DOGE/USDT</option>
              <option value="DOT">DOT/USDT</option>
            </select>
          </div>
        </div>

        {/* Emir Tipi */}
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Emir Tipi</label>
          <div className="grid grid-cols-4 gap-2">
            <button
              className={`px-3 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                orderType === 'market' ? 'bg-cyan-500 text-white border-2 border-cyan-400' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
              onClick={() => selectSpotOrderType('market')}
            >
              MARKET
            </button>
            <button
              className={`px-3 py-2.5 rounded-lg text-sm font-bold transition-colors cursor-pointer ${
                orderType === 'limit' ? 'bg-cyan-500 text-white border-2 border-cyan-400' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
              onClick={() => selectSpotOrderType('limit')}
            >
              LİMİT
            </button>
            <button
              className={`px-3 py-2.5 rounded-lg text-sm font-bold transition-colors  cursor-pointer ${
                orderType === 'stop-limit' ? 'bg-cyan-500 text-white border-2 border-cyan-400' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
              onClick={() => selectSpotOrderType('stop-limit')}
            >
              STOP-LİMİT
            </button>
            <button
              className={`px-3 py-2.5 rounded-lg text-sm font-bold transition-colors  cursor-pointer ${
                orderType === 'stop-market' ? 'bg-cyan-500 text-white border-2 border-cyan-400' : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
              onClick={() => selectSpotOrderType('stop-market')}
            >
              STOP-MARKET
            </button>
          </div>
        </div>

        {/* Fiyat (Sadece Limit ve Stop-Limit için) */}
        {showPriceInput && (
          <div id="spotPriceInput">
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
          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Miktar</label>
          <input
            type="number"
            placeholder="0.5000"
            className="w-full px-4 py-3.5 bg-white/5 border border-slate-800 rounded-xl text-white font-mono text-base font-bold"
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => setSpotAmount(0.25)} className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">25%</button>
            <button onClick={() => setSpotAmount(0.5)} className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">50%</button>
            <button onClick={() => setSpotAmount(0.75)} className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">75%</button>
            <button onClick={() => setSpotAmount(1)} className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-sm font-bold transition-colors cursor-pointer">100%</button>
          </div>
        </div>

        {/* TP/SL */}
        <div>
          <label className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider cursor-pointer">
            <input
              type="checkbox"
              id="spotTPSL"
              checked={showTPSL}
              onChange={(e) => setShowTPSL(e.target.checked)}
              className="w-4 h-4 cursor-pointer accent-cyan-500"
            />
            TAKE PROFİT / STOP LOSS
          </label>
          {showTPSL && (
            <div id="spotTPSLInputs" className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="TP: 48,000"
                className="w-full px-3.5 py-3 bg-emerald-500/8 border border-emerald-500/20 rounded-lg text-emerald-400 font-mono text-sm font-bold"
              />
              <input
                type="number"
                placeholder="SL: 40,000"
                className="w-full px-3.5 py-3 bg-red-500/8 border border-red-500/20 rounded-lg text-red-400 font-mono text-sm font-bold"
              />
            </div>
          )}
        </div>

        {/* Total */}
        <div className="p-4 bg-white/[0.03] border border-slate-800 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400 font-semibold">Toplam Tutar</span>
            <span className="font-mono text-lg font-extrabold text-white">~$21,628.39</span>
          </div>
        </div>

        {/* Buy/Sell Buttons */}
        <div className="grid grid-cols-2 gap-3 ">
          <button className="py-4 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl transition-all shadow-lg shadow-emerald-500/30 flex flex-col items-center justify-center cursor-pointer ">
            <span className="text-xl font-black text-white">SATIN AL</span>
            <span className="text-xs text-white/80">SPOT BUY</span>
          </button>
          <button className="py-4 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 rounded-xl transition-all shadow-lg shadow-red-500/30 flex flex-col items-center justify-center cursor-pointer ">
            <span className="text-xl font-black text-white">SAT</span>
            <span className="text-xs text-white/80">SPOT SELL</span>
          </button>
        </div>
      </div>
    </div>
  );
}