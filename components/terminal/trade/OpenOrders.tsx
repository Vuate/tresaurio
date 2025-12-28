'use client';

export default function OpenOrders() {
  // Fake data
  const orders = [
    {
      exchange: 'Binance',
      pair: 'BTC/USDT',
      type: 'Limit',
      direction: 'BUY',
      amount: '0.1250 BTC',
      price: '$42,000',
      filled: '0%',
      status: 'BEKLİYOR',
      isBuy: true,
      statusType: 'pending',
    },
    {
      exchange: 'OKX',
      pair: 'ETH/USDT',
      type: 'Stop-Limit',
      direction: 'SELL',
      amount: '2.5000 ETH',
      price: '$2,250',
      filled: '0%',
      status: 'BEKLİYOR',
      isBuy: false,
      statusType: 'pending',
    },
    {
      exchange: 'Binance',
      pair: 'XRP/USDT',
      type: 'Limit',
      direction: 'BUY',
      amount: '5,000 XRP',
      price: '$0.6000',
      filled: '42%',
      status: 'KISMİ DOLDU',
      isBuy: true,
      statusType: 'partial',
    },
    {
      exchange: 'Coinbase',
      pair: 'SOL/USDT',
      type: 'Market',
      direction: 'BUY',
      amount: '50 SOL',
      price: 'Market',
      filled: '100%',
      status: 'TAMAMLANDI',
      isBuy: true,
      statusType: 'completed',
    },
  ];

  return (
    <div id="acik-emirler" className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800/30">
        <span className="text-2xl">📋</span>
        <h2 className="text-xl font-bold text-white">Açık Emirler</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800/50">
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Borsa</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pair</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tip</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Yön</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Miktar</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fiyat</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dolum</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Durum</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
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
                <td className="py-5 px-4 text-sm text-white font-semibold">{order.filled}</td>
                <td className="py-5 px-4">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                    order.statusType === 'pending' 
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                      : order.statusType === 'partial'
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}