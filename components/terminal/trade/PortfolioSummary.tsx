'use client';

export default function PortfolioSummary() {
  return (
    <div id="portfoy-ozeti" className="bg-gradient-to-br from-emerald-500/8 to-cyan-500/8 border border-slate-800/50 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-800/30">
        <span className="text-2xl">📊</span>
        <h2 className="text-xl font-bold text-white">Genel Portföy Özeti</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30 text-center hover:bg-slate-800/40 transition-colors">
          <div className="text-3xl font-bold text-cyan-400 mb-2">$245,680</div>
          <div className="text-sm text-slate-400 font-medium">Toplam Portföy Değeri</div>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30 text-center hover:bg-slate-800/40 transition-colors">
          <div className="text-3xl font-bold text-white mb-2">$198,450</div>
          <div className="text-sm text-slate-400 font-medium">Toplam Maliyet</div>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30 text-center hover:bg-slate-800/40 transition-colors">
          <div className="text-3xl font-bold text-emerald-400 mb-2">+$47,230</div>
          <div className="text-sm text-slate-400 font-medium">Toplam Kâr / Zarar</div>
        </div>
        <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30 text-center hover:bg-slate-800/40 transition-colors">
          <div className="text-3xl font-bold text-emerald-400 mb-2">+23.8%</div>
          <div className="text-sm text-slate-400 font-medium">ROI</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-800/20 rounded-xl p-5 border border-slate-700/30 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
          <span className="text-slate-400 text-sm font-medium">Realized PnL</span>
          <span className="text-emerald-400 font-bold text-lg">+$28,450</span>
        </div>
        <div className="bg-slate-800/20 rounded-xl p-5 border border-slate-700/30 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
          <span className="text-slate-400 text-sm font-medium">Unrealized PnL</span>
          <span className="text-emerald-400 font-bold text-lg">+$18,780</span>
        </div>
        <div className="bg-slate-800/20 rounded-xl p-5 border border-slate-700/30 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
          <span className="text-slate-400 text-sm font-medium">Günlük Değişim</span>
          <span className="text-emerald-400 font-bold text-lg">+$3,240 (+1.3%)</span>
        </div>
      </div>
    </div>
  );
}