'use client';

import { useState, useEffect } from 'react';

export default function RecentOrders() {
  const [timeframe, setTimeframe] = useState('24h');
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Canlı saat için
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeframeLabels: { [key: string]: string } = {
    '24h': 'Son 24 Saat',
    '3d': 'Son 3 Gün',
    '1w': 'Son 1 Hafta',
    '1m': 'Son 1 Ay',
    'custom': 'Özel Tarih'
  };

  const filterOrders = (value: string) => {
    setTimeframe(value);
    setShowCustomDate(value === 'custom');
    
    setNotificationText(`Emirler "${timeframeLabels[value]}" için filtrelendi.`);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // Fake data
  const orders = [
    {
      time: '08:45:23',
      exchange: 'Binance',
      pair: 'BTC/USDT',
      type: 'Spot',
      direction: 'BUY',
      amount: '0.2500',
      price: '$42,850',
      total: '$10,712.50',
      pnl: '+$101.70',
      isPnlPositive: true,
      isBuy: true,
    },
    {
      time: '07:22:15',
      exchange: 'OKX',
      pair: 'ETH/USDT',
      type: 'Futures',
      direction: 'SHORT',
      amount: '2.0000',
      price: '$2,320',
      total: '$4,640',
      pnl: '+$65.10',
      isPnlPositive: true,
      isBuy: false,
    },
    {
      time: '06:10:42',
      exchange: 'Coinbase',
      pair: 'SOL/USDT',
      type: 'Spot',
      direction: 'BUY',
      amount: '50.0000',
      price: '$94.20',
      total: '$4,710.00',
      pnl: '+$207.00',
      isPnlPositive: true,
      isBuy: true,
    },
    {
      time: '05:33:18',
      exchange: 'Binance',
      pair: 'XRP/USDT',
      type: 'Spot',
      direction: 'SELL',
      amount: '10,000',
      price: '$0.6150',
      total: '$6,150.00',
      pnl: '-$45.00',
      isPnlPositive: false,
      isBuy: false,
    },
    {
      time: '03:15:55',
      exchange: 'KuCoin',
      pair: 'BNB/USDT',
      type: 'Spot',
      direction: 'BUY',
      amount: '25.0000',
      price: '$305.80',
      total: '$7,645.00',
      pnl: '+$166.25',
      isPnlPositive: true,
      isBuy: true,
    },
  ];

  return (
    <>
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/50 rounded-xl p-4 backdrop-blur-md shadow-lg min-w-[300px]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔍</span>
              <div className="flex-1">
                <h3 className="text-emerald-400 font-bold text-sm mb-1">Filtre Uygulandı</h3>
                <p className="text-white text-xs">{notificationText}</p>
                <p className="text-slate-400 text-xs mt-1">{currentTime}</p>
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div id="son-emirler" className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 rounded-2xl p-8">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-800/30 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <h2 className="text-xl font-bold text-white">Son Gerçekleşen Emirler</h2>
          </div>
          
          <div className="flex gap-3 items-center flex-wrap">
            <select
              id="ordersTimeframe"
              value={timeframe}
              onChange={(e) => filterOrders(e.target.value)}
              className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm font-bold focus:outline-none focus:border-cyan-500 transition-colors [&>option]:bg-slate-800 [&>option]:text-white cursor-pointer"
            >
              <option value="24h">Son 24 Saat</option>
              <option value="3d">Son 3 Gün</option>
              <option value="1w">Son 1 Hafta</option>
              <option value="1m">Son 1 Ay</option>
              <option value="custom">Özel Tarih</option>
            </select>
            
            {showCustomDate && (
              <div id="customDateRange" className="flex gap-2 items-center">
                <input
                  type="date"
                  id="startDate"
                  className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-xs font-bold"
                />
                <span className="text-slate-500">→</span>
                <input
                  type="date"
                  id="endDate"
                  className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-xs font-bold"
                />
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800/50">
                <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Zaman</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Borsa</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pair</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tip</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Yön</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Miktar</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fiyat</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Toplam</th>
                <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">PnL</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                  <td className="py-5 px-4 text-sm text-slate-400 font-mono">{order.time}</td>
                  <td className="py-5 px-4 text-sm text-white font-medium">{order.exchange}</td>
                  <td className="py-5 px-4 text-sm text-white font-bold">{order.pair}</td>
                  <td className="py-5 px-4 text-sm text-slate-300">{order.type}</td>
                  <td className="py-5 px-4">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      order.isBuy 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {order.direction}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-sm text-white font-mono">{order.amount}</td>
                  <td className="py-5 px-4 text-sm text-white font-mono">{order.price}</td>
                  <td className="py-5 px-4 text-sm text-white font-mono font-semibold">{order.total}</td>
                  <td className={`py-5 px-4 text-sm font-bold font-mono ${
                    order.isPnlPositive ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {order.pnl}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <style jsx>{`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        `}</style>
      </div>
    </>
  );
}