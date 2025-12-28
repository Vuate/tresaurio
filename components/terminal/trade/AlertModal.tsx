'use client';

import { useState, useEffect } from 'react';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AlertModal({ isOpen, onClose }: AlertModalProps) {
  const [alertType, setAlertType] = useState('');
  const [selectedCoin, setSelectedCoin] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Modal açıkken body scroll'u kilitle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setAlertType('');
      setSelectedCoin('');
      onClose();
    }, 3000);
  };

  const handleClose = () => {
    setShowSuccess(false);
    setAlertType('');
    setSelectedCoin('');
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const updateAlertForm = (type: string) => {
    setAlertType(type);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      {showSuccess ? (
        // Success Message
        <div className="bg-slate-950 border border-slate-800/50 rounded-xl p-8 max-w-md w-full text-center">
          <div className="mb-4 text-6xl">✅</div>
          <h3 className="text-xl font-semibold text-white mb-2">Bu sayfanın mesajı</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Alert başarıyla kuruldu! Koşullar gerçekleştiğinde bildirim alacaksınız.
          </p>
          <button
            onClick={handleClose}
            className="mt-6 px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-medium rounded-lg transition-colors"
          >
            Tamam
          </button>
        </div>
      ) : (
        // Form
        <div className="bg-slate-950 border border-slate-800/50 rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto my-8 custom-scrollbar">
          <div className="flex justify-between items-center p-6 border-b border-slate-800">
            <h2 className="text-xl font-semibold text-cyan-400 flex items-center gap-2">
              🔔 Yeni Alert Kur
            </h2>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white text-3xl leading-none transition-colors"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Alert Tipi */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-400 uppercase">Alert Tipi</label>
              <select
                value={alertType}
                onChange={(e) => updateAlertForm(e.target.value)}
                className="w-full px-4 py-3  cursor-pointer bg-slate-900 border-2 border-cyan-500/50 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors [&>option]:bg-slate-900 [&>option]:text-white"
                required
              >
                <option value="">Alert tipi seçiniz...</option>
                <option value="price">Fiyat Hedefi</option>
                <option value="pnl">PnL Hedefi</option>
                <option value="liquidation">Likidasyon Uyarısı</option>
                <option value="tpsl">TP/SL Otomasyonu</option>
              </select>
            </div>

            {/* Coin */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-400 uppercase">Coin</label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full px-4 py-3 cursor-pointer bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors [&>option]:bg-slate-900 [&>option]:text-white"
                required
              >
                <option value="">Coin seçiniz...</option>
                <option value="BTC">BTC/USDT</option>
                <option value="ETH">ETH/USDT</option>
                <option value="SOL">SOL/USDT</option>
                <option value="XRP">XRP/USDT</option>
                <option value="BNB">BNB/USDT</option>
              </select>
            </div>

            {/* Fiyat Alert Fields */}
            {alertType === 'price' && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-400 uppercase">Hedef Fiyat (USDT)</label>
                  <input
                    type="number"
                    placeholder="45000"
                    step="0.01"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-400 uppercase">Koşul</label>
                  <select className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors [&>option]:bg-slate-900 [&>option]:text-white cursor-pointer">
                    <option value="above">Fiyat üstüne çıktığında</option>
                    <option value="below">Fiyat altına indiğinde</option>
                  </select>
                </div>
              </>
            )}

            {/* PnL Alert Fields (hem pnl hem de tpsl için) */}
            {(alertType === 'pnl' || alertType === 'tpsl') && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-400 uppercase">PnL Hedefi (%)</label>
                  <input
                    type="number"
                    placeholder="33,2"
                    step="0.1"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-400 uppercase">Aksiyon</label>
                  <select className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors [&>option]:bg-slate-900 [&>option]:text-white cursor-pointer">
                    <option value="notify">Sadece Bildirim Gönder</option>
                    <option value="close_50">%50 Pozisyon Kapat</option>
                    <option value="close_100">Tüm Pozisyonu Kapat</option>
                  </select>
                </div>
              </>
            )}

            {/* Bildirim Kanalı */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-400 uppercase">Bildirim Kanalı</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-500" />
                  <span className="text-sm font-semibold text-white">📧 Email</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-500" />
                  <span className="text-sm font-semibold text-white">📱 Push Notification</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                  <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
                  <span className="text-sm font-semibold text-white">💬 Telegram</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-extrabold rounded-lg transition-all shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-400 uppercase cursor-pointer"
            >
              ✅ Alert&apos;i Aktif Et
            </button>
          </form>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.8);
        }
      `}</style>
    </div>
  );
}