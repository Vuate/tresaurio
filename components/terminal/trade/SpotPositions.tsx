'use client';

export default function SpotPositions() {
  // Fake data
  const positions = [
    {
      asset: 'BTC',
      exchange: 'Binance',
      amount: '2.1450',
      avgCost: '$38,420',
      currentPrice: '$43,256.78',
      positionValue: '$92,785.79',
      unrealizedPnL: '+$10,374.32',
      roi: '+12.6%',
      isPositive: true,
    },
    {
      asset: 'ETH',
      exchange: 'Binance',
      amount: '18.7650',
      avgCost: '$2,120',
      currentPrice: '$2,287.45',
      positionValue: '$42,924.85',
      unrealizedPnL: '+$3,144.44',
      roi: '+7.9%',
      isPositive: true,
    },
    {
      asset: 'XRP',
      exchange: 'OKX',
      amount: '42,500',
      avgCost: '$0.5840',
      currentPrice: '$0.6234',
      positionValue: '$26,494.50',
      unrealizedPnL: '+$1,674.50',
      roi: '+6.7%',
      isPositive: true,
    },
    {
      asset: 'BNB',
      exchange: 'Binance',
      amount: '105.00',
      avgCost: '$298',
      currentPrice: '$312.45',
      positionValue: '$32,807.25',
      unrealizedPnL: '+$1,517.25',
      roi: '+4.9%',
      isPositive: true,
    },
    {
      asset: 'SOL',
      exchange: 'Coinbase',
      amount: '245.80',
      avgCost: '$89.20',
      currentPrice: '$98.34',
      positionValue: '$24,166.33',
      unrealizedPnL: '+$2,246.33',
      roi: '+10.2%',
      isPositive: true,
    },
    {
      asset: 'DOGE',
      exchange: 'OKX',
      amount: '125,000',
      avgCost: '$0.0820',
      currentPrice: '$0.0876',
      positionValue: '$10,950.00',
      unrealizedPnL: '+$700.00',
      roi: '+6.8%',
      isPositive: true,
    },
    {
      asset: 'DOT',
      exchange: 'KuCoin',
      amount: '1,850',
      avgCost: '$5.45',
      currentPrice: '$5.78',
      positionValue: '$10,693.00',
      unrealizedPnL: '+$610.50',
      roi: '+6.1%',
      isPositive: true,
    },
    {
      asset: 'USDT',
      exchange: 'Binance',
      amount: '15,250',
      avgCost: '$1.00',
      currentPrice: '$1.00',
      positionValue: '$15,250.00',
      unrealizedPnL: '$0.00',
      roi: '0.0%',
      isPositive: null,
    },
  ];

  return (
    <div id="spot-pozisyonlar" className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800/30">
        <span className="text-2xl">💰</span>
        <h2 className="text-xl font-bold text-white">Spot Pozisyonlar</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800/50">
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Varlık</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Borsa</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Miktar</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ort. Maliyet</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Güncel Fiyat</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pozisyon Değeri</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Unrealized PnL</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ROI %</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr key={index} className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors">
                <td className="py-5 px-4 text-sm text-white font-bold">{position.asset}</td>
                <td className="py-5 px-4 text-sm text-slate-300 font-medium">{position.exchange}</td>
                <td className="py-5 px-4 text-sm text-white font-mono">{position.amount}</td>
                <td className="py-5 px-4 text-sm text-white font-mono">{position.avgCost}</td>
                <td className="py-5 px-4 text-sm text-white font-mono">{position.currentPrice}</td>
                <td className="py-5 px-4 text-sm text-white font-mono font-semibold">{position.positionValue}</td>
                <td className={`py-5 px-4 text-sm font-bold font-mono ${
                  position.isPositive === true 
                    ? 'text-emerald-400' 
                    : position.isPositive === false 
                    ? 'text-red-400' 
                    : 'text-slate-400'
                }`}>
                  {position.unrealizedPnL}
                </td>
                <td className={`py-5 px-4 text-sm font-bold font-mono ${
                  position.isPositive === true 
                    ? 'text-emerald-400' 
                    : position.isPositive === false 
                    ? 'text-red-400' 
                    : 'text-slate-400'
                }`}>
                  {position.roi}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}