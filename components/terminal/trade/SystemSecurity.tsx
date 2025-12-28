'use client';

export default function SystemSecurity() {
  return (
    <div className="bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-sm border border-slate-700/40 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-700/40">
        <span className="text-2xl">🛡️</span>
        <h2 className="text-xl font-bold text-white">Sistem & Güvenlik</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/40 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
          <span className="text-slate-400 text-sm font-medium">API Sağlık Durumu</span>
          <span className="text-emerald-400 font-bold text-lg">100%</span>
        </div>
        
        <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/40 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
          <span className="text-slate-400 text-sm font-medium">Veri Güncelliği</span>
          <span className="text-white font-bold text-lg">0.8s</span>
        </div>
        
        <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/40 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
          <span className="text-slate-400 text-sm font-medium">Senkronizasyon</span>
          <span className="text-emerald-400 font-bold text-lg">OK</span>
        </div>
        
        <div className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/40 flex items-center justify-between hover:bg-slate-800/40 transition-colors">
          <span className="text-slate-400 text-sm font-medium">Son Bildirim</span>
          <span className="text-white font-bold text-lg">2 dk önce</span>
        </div>
      </div>
    </div>
  );
}