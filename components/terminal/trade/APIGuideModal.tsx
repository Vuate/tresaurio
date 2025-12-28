'use client';

import { useEffect } from 'react';

interface APIGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAPIModal: () => void;
}

export default function APIGuideModal({ isOpen, onClose, onOpenAPIModal }: APIGuideModalProps) {
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

  const handleOpenAPIModal = () => {
    // Body scroll'u açmadan kapat (çünkü APIModal açılacak)
    document.body.style.overflow = 'hidden';
    onClose();
    onOpenAPIModal();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="bg-slate-950 border border-slate-800/50 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto my-8 custom-scrollbar">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            📚 API&apos;yi Nasıl Kullanırım?
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-3xl leading-none transition-colors cursor-pointer" 
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="p-5 bg-white/[0.03] border-l-4 border-cyan-500 rounded-2xl">
            <h4 className="text-lg font-extrabold text-cyan-400 mb-3">
              1️⃣ Borsadan API Key Oluşturun
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              Borsa hesabınızın ayarlar bölümünden &quot;API Management&quot; veya &quot;API Keys&quot; sekmesine gidin. Yeni bir API key oluşturun.
            </p>
            <div className="p-3 bg-black/30 rounded-lg font-mono text-xs text-cyan-400">
              ⚠️ &quot;Read&quot; ve &quot;Trade&quot; yetkilerini aktif edin, &quot;Withdraw&quot; yetkisini ASLA vermeyin!
            </div>
          </div>

          <div className="p-5 bg-white/[0.03] border-l-4 border-emerald-500 rounded-2xl">
            <h4 className="text-lg font-extrabold text-emerald-400 mb-3">
              2️⃣ IP Kısıtlaması Ekleyin (Önerilen)
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              API key&apos;inizi oluştururken &quot;IP Whitelist&quot; özelliğini kullanarak sadece güvenilir IP adreslerinden erişime izin verin.
            </p>
            <div className="p-3 bg-black/30 rounded-lg font-mono text-xs text-emerald-400">
              ✅ Bu özellik, API key&apos;inizin çalınması durumunda bile güvenliğinizi artırır.
            </div>
          </div>

          <div className="p-5 bg-white/[0.03] border-l-4 border-purple-500 rounded-2xl">
            <h4 className="text-lg font-extrabold text-purple-400 mb-3">
              3️⃣ API Key ve Secret&apos;i Kopyalayın
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Oluşturulan API Key ve API Secret değerlerini güvenli bir yere kaydedin. API Secret sadece bir kez gösterilir!
            </p>
          </div>

          <div className="p-5 bg-white/[0.03] border-l-4 border-orange-500 rounded-2xl">
            <h4 className="text-lg font-extrabold text-orange-400 mb-3">
              4️⃣ Treasurio&apos;ya Ekleyin
            </h4>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              <strong>Hesap & Bağlantı</strong> widget&apos;ındaki <strong>+</strong> butonuna tıklayın. Borsa seçin, API Key ve Secret&apos;i yapıştırın. Güvenlik sözleşmesini onaylayın.
            </p>
            <button
              onClick={handleOpenAPIModal}
              className="px-6 py-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl text-white font-extrabold text-sm uppercase shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-400 transition-all cursor-pointer"
            >
              🔌 Borsa Ekle
            </button>
          </div>

          <div className="p-5 bg-red-500/8 border border-red-500/20 rounded-xl">
            <div className="flex gap-3 items-start">
              <span className="text-3xl">🛡️</span>
              <div>
                <div className="text-base font-extrabold text-red-400 mb-2">
                  Güvenlik Uyarısı
                </div>
                <div className="text-sm text-slate-400 leading-relaxed">
                  API key&apos;leriniz <strong>end-to-end şifrelenerek</strong> saklanır. Asla üçüncü taraflarla paylaşılmaz. API Secret&apos;inizi kimseyle paylaşmayın ve düzenli olarak yenilemeyi unutmayın.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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