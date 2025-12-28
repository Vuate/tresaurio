'use client';

export default function FuturesPositions() {
  // Fake data
  const positions = [
    {
      contract: 'BTC/USDT',
      direction: 'LONG',
      entryPrice: '$42,150',
      currentPrice: '$43,256.78',
      size: '0.5000 BTC',
      leverage: '10x',
      liquidation: '$38,535',
      unrealizedPnL: '+$553.39',
      roi: '+2.6%',
      isLong: true,
      isPositive: true,
    },
    {
      contract: 'ETH/USDT',
      direction: 'SHORT',
      entryPrice: '$2,320',
      currentPrice: '$2,287.45',
      size: '5.0000 ETH',
      leverage: '5x',
      liquidation: '$2,552',
      unrealizedPnL: '+$162.75',
      roi: '+1.4%',
      isLong: false,
      isPositive: true,
    },
    {
      contract: 'SOL/USDT',
      direction: 'LONG',
      entryPrice: '$95.20',
      currentPrice: '$98.34',
      size: '100 SOL',
      leverage: '20x',
      liquidation: '$90.44',
      unrealizedPnL: '+$314.00',
      roi: '+3.3%',
      isLong: true,
      isPositive: true,
    },
  ];

  return (
    <div id="futures-pozisyonlar" className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800/30">
        <span className="text-2xl">📈</span>
        <h2 className="text-xl font-bold text-white">Futures Pozisyonlar</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800/50">
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sözleşme</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Yön</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Giriş Fiyatı</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mevcut Fiyat</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Büyüklük</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kaldıraç</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Likidasyon</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Unrealized PnL</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ROI %</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr 
                key={index} 
                className={`border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors ${
                  position.isLong ? 'bg-emerald-500/5' : 'bg-rose-500/5'
                }`}
              >
                <td className="py-5 px-4 text-sm text-white font-bold">{position.contract}</td>
                <td className="py-5 px-4">
                  <span className={`px-4 py-2 rounded-lg text-xs font-bold ${
                    position.isLong 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {position.direction}
                  </span>
                </td>
                <td className="py-5 px-4 text-sm text-white font-mono">{position.entryPrice}</td>
                <td className="py-5 px-4 text-sm text-white font-mono">{position.currentPrice}</td>
                <td className="py-5 px-4 text-sm text-white font-mono">{position.size}</td>
                <td className="py-5 px-4 text-sm text-white font-bold">{position.leverage}</td>
                <td className="py-5 px-4 text-sm text-white font-mono">{position.liquidation}</td>
                <td className={`py-5 px-4 text-sm font-bold font-mono ${
                  position.isPositive ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {position.unrealizedPnL}
                </td>
                <td className={`py-5 px-4 text-sm font-bold font-mono ${
                  position.isPositive ? 'text-emerald-400' : 'text-red-400'
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