'use client';

export default function PerformanceAnalysis() {
  // Fake data - Token Bazlı
  const tokenPerformance = [
    { name: 'BTC', value: '+$10,927.71', percent: '(+12.4%)', isPositive: true },
    { name: 'ETH', value: '+$3,307.19', percent: '(+8.6%)', isPositive: true },
    { name: 'SOL', value: '+$2,560.33', percent: '(+11.2%)', isPositive: true },
    { name: 'XRP', value: '+$1,674.50', percent: '(+6.7%)', isPositive: true },
  ];

  // Fake data - Borsa Bazlı
  const exchangePerformance = [
    { name: 'Binance', value: '+$32,450', percent: '(+18.4%)', isPositive: true },
    { name: 'OKX', value: '+$8,920', percent: '(+12.8%)', isPositive: true },
    { name: 'Coinbase', value: '+$5,860', percent: '(+24.2%)', isPositive: true },
    { name: 'KuCoin', value: '+$610', percent: '(+6.1%)', isPositive: true },
  ];

  return (
    <div id="performans" className="bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800/30">
        <span className="text-2xl">📊</span>
        <h2 className="text-xl font-bold text-white">Performans Analizi</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Token Bazlı Performans */}
        <div>
          <h4 className="text-base font-medium text-slate-400 mb-6">Token Bazlı Performans</h4>
          <div className="space-y-6">
            {tokenPerformance.map((token, index) => (
              <div key={index} className="bg-slate-800/20 rounded-xl p-5 border border-slate-700/30 flex items-center justify-between">
                <span className="text-slate-300 text-base font-medium">{token.name}</span>
                <span className={`font-bold text-lg ${token.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {token.value} {token.percent}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Borsa Bazlı Performans */}
        <div>
          <h4 className="text-base font-medium text-slate-400 mb-6">Borsa Bazlı Performans</h4>
          <div className="space-y-6">
            {exchangePerformance.map((exchange, index) => (
              <div key={index} className="bg-slate-800/20 rounded-xl p-5 border border-slate-700/30 flex items-center justify-between">
                <span className="text-slate-300 text-base font-medium">{exchange.name}</span>
                <span className={`font-bold text-lg ${exchange.isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {exchange.value} {exchange.percent}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}