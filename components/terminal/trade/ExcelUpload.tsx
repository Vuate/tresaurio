'use client';

import { useState, useEffect } from 'react';

export default function ExcelUpload() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    title: '',
    message: '',
    icon: ''
  });
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

  const showToast = (title: string, message: string, icon: string) => {
    setNotificationData({ title, message, icon });
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 4000);
  };

  const downloadExcelTemplate = () => {
    showToast(
      'Şablon İndiriliyor 📥',
      'Excel şablonu indirmeye başladı. Portföy bilgilerinizi doldurup yükleyebilirsiniz.',
      '📊'
    );
    // Şablon indirme fonksiyonu buraya
  };

  const uploadExcelFile = () => {
    // Dosya seçme dialogunu aç
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx, .xls';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) {
        showToast(
          'Dosya Yükleniyor 📤',
          `"${file.name}" yükleniyor. Portföy verileriniz işleniyor...`,
          '✅'
        );
      }
    };
    input.click();
  };

  return (
    <>
      {/* Bildirim Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/50 rounded-xl p-4 backdrop-blur-md shadow-lg min-w-[350px] max-w-[450px]">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{notificationData.icon}</span>
              <div className="flex-1">
                <h3 className="text-emerald-400 font-bold text-sm mb-1">
                  {notificationData.title}
                </h3>
                <p className="text-white text-xs leading-relaxed">
                  {notificationData.message}
                </p>
                <p className="text-slate-400 text-xs mt-2">{currentTime}</p>
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="text-slate-400 hover:text-white transition-colors text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-orange-500/8 to-orange-500/2 border-2 border-orange-500/20 rounded-xl p-6">
        <div className="flex justify-between items-center gap-5 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">📊</span>
              <h3 className="text-xl font-extrabold text-white">Excel ile Portföy Yükle</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-3">
              API kullanmak istemiyorsanız, portföy verilerinizi Excel dosyası olarak yükleyebilirsiniz.
            </p>
<div className="p-3 bg-orange-500/12 border-l-4 border-orange-500 rounded-lg">
  <div className="flex items-start gap-2">
    <span className="text-lg flex-shrink-0">ℹ️</span>
    <div className="text-sm text-slate-300 leading-relaxed">
      <strong className="text-orange-400">Not:</strong> Excel yükleme ile sadece portföyünüzü görüntüleyebilirsiniz. Gerçek zamanlı trade yapabilmek için API bağlantısı kurmanız gerekmektedir.
    </div>
  </div>
</div>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={downloadExcelTemplate}
              className="px-6 py-3 bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-500 rounded-xl text-purple-400 font-bold text-sm whitespace-nowrap hover:from-purple-500/30 hover:to-purple-500/15 transition-all cursor-pointer"
            >
              📥 Şablon İndir
            </button>
            <button
              onClick={uploadExcelFile}
              className="px-6 py-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl text-white font-extrabold text-sm uppercase shadow-lg shadow-orange-500/30 whitespace-nowrap hover:from-orange-400 hover:to-orange-500 transition-all cursor-pointer"
            >
              📤 Excel Yükle
            </button>
          </div>
        </div>
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
    </>
  );
}