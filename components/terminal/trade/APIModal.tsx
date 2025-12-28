'use client';

import { useState, useEffect } from 'react';

interface APIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function APIModal({ isOpen, onClose }: APIModalProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  // Modal açıkken body scroll'u kilitle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup: component unmount olduğunda scroll'u geri aç
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    
    // 3 saniye sonra modal'ı kapat
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 3000);
  };

  const handleClose = () => {
    setShowSuccess(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Sadece backdrop'a tıklandığında kapat (içerik alanına değil)
    if (e.target === e.currentTarget) {
      handleClose();
    }
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
            API bağlantısı başarıyla kaydedildi! Borsa verileri senkronize ediliyor...
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
        <div className="bg-slate-950 border border-slate-800/50 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-8 custom-scrollbar">
          <div className="flex justify-between items-center p-6 border-b border-slate-800">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              🔌 Borsa API Bağlantısı Ekle
            </h2>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white text-3xl leading-none transition-colors cursor-pointer"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300 ">
                Borsa Seçin
              </label>
              <select className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors [&>option]:bg-slate-900 [&>option]:text-white cursor-pointer" required>
                <option value="">Borsa seçiniz...</option>
                <option value="binance">Binance</option>
                <option value="okx">OKX</option>
                <option value="upbit">Upbit</option>
                <option value="coinbase">Coinbase</option>
                <option value="gate">Gate.io</option>
                <option value="mexc">MEXC</option>
                <option value="kucoin">KuCoin</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                API Key
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="API Key'inizi buraya yapıştırın..."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                API Secret
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="API Secret'inizi buraya yapıştırın..."
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="apiSecurity"
                  className="mt-1 w-4 h-4 accent-cyan-500 cursor-pointer"
                  required
                />
                <label htmlFor="apiSecurity" className="text-sm text-slate-300 leading-relaxed cursor-pointer ">
                  <strong className="text-white ">Güvenlik Sözleşmesi:</strong> API key&apos;lerimin Treasurio tarafından güvenli bir şekilde şifrelenerek saklanacağını, sadece seçtiğim borsalara bağlantı kurmak için kullanılacağını ve asla üçüncü taraflarla paylaşılmayacağını kabul ediyorum. API&apos;lerimde &quot;Withdraw&quot; yetkisi olmadığını ve sadece &quot;Read&quot; ve &quot;Trade&quot; yetkilerinin aktif olduğunu onaylıyorum.
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              🔐 Bağlantıyı Kaydet ve Aktif Et
            </button>
          </form>

          <div className="mx-6 mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <div className="text-sm font-bold text-cyan-400 mb-2">
              💡 Önemli Notlar:
            </div>
            <ul className="text-xs text-slate-400 leading-relaxed space-y-1 pl-5 list-disc">
              <li>API key&apos;leriniz AES-256 şifrelemesi ile korunur</li>
              <li>Hiçbir zaman &quot;Withdraw&quot; yetkisi vermeyin</li>
              <li>IP whitelist kullanmanızı öneririz</li>
              <li>API key&apos;lerinizi düzenli olarak yenileyin</li>
            </ul>
          </div>
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