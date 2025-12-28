'use client';

import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const togglePageNav = () => {
    setIsNavOpen(!isNavOpen);
  };

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerHeight = 100; // Header'ın yüksekliği (px cinsinden)
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    setIsNavOpen(false);
  }
};

  
  // Dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNavOpen(false);
      }
    };

    if (isNavOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavOpen]);

  return (
    <div className="border-b border-slate-800/50 px-6 py-8 sticky top-0 z-40 bg-black/95 backdrop-blur-md">
      <div className="flex justify-between items-center flex-wrap gap-6">
        <div>
          <h1 className="text-5xl font-bold text-cyan-400 mb-9 flex items-center gap-3">
            <span>💼</span>
            Trade & Portföy Yönetimi
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-[800px]">
            Spot ve Futures pozisyonlarınızı tek bir ekrandan yönetin. Çoklu borsa desteği ile tüm varlıklarınızı gerçek zamanlı takip edin, detaylı risk analizi yapın ve senario simülasyonları ile stratejik kararlar alın. API bağlantısı veya manuel Excel yükleme seçenekleriyle portföyünüzü anında senkronize edin. Profesyonel trading araçları, otomatik alert sistemi ve kapsamlı performans raporlarıyla yatırımlarınızı bir üst seviyeye taşıyın.
          </p>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button 
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-800/60 to-slate-700/60 hover:from-slate-700/70 hover:to-slate-600/70 text-white rounded-xl border border-slate-600/50 transition-all duration-200 shadow-lg"
            onClick={togglePageNav}
          >
            <span className="text-cyan-400 font-semibold cursor-pointer">📑 Hızlı Erişim</span>
            <span className={`text-xs ml-2 transition-transform duration-200 ${isNavOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          {isNavOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-black/98 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden z-50 animate-slideDown">
              <div className="p-2">
                <a href="#hesap-baglanti" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 rounded-lg transition-all duration-150 group" onClick={(e) => { e.preventDefault(); scrollToSection('hesap-baglanti'); }}>
                  <span className="text-lg group-hover:scale-110 transition-transform">🔌</span>
                  <span className="font-medium">Hesap & Bağlantı</span>
                </a>
                <a href="#portfoy-ozeti" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 rounded-lg transition-all duration-150 group" onClick={(e) => { e.preventDefault(); scrollToSection('portfoy-ozeti'); }}>
                  <span className="text-lg group-hover:scale-110 transition-transform">📊</span>
                  <span className="font-medium">Portföy Özeti</span>
                </a>
                <a href="#emir-panelleri" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 rounded-lg transition-all duration-150 group" onClick={(e) => { e.preventDefault(); scrollToSection('emir-panelleri'); }}>
                  <span className="text-lg group-hover:scale-110 transition-transform">💎</span>
                  <span className="font-medium">Emir Panelleri</span>
                </a>
                <a href="#son-emirler" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 rounded-lg transition-all duration-150 group" onClick={(e) => { e.preventDefault(); scrollToSection('son-emirler'); }}>
                  <span className="text-lg group-hover:scale-110 transition-transform">✅</span>
                  <span className="font-medium">Son Emirler</span>
                </a>
                <a href="#spot-pozisyonlar" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 rounded-lg transition-all duration-150 group" onClick={(e) => { e.preventDefault(); scrollToSection('spot-pozisyonlar'); }}>
                  <span className="text-lg group-hover:scale-110 transition-transform">💰</span>
                  <span className="font-medium">Spot Pozisyonlar</span>
                </a>
                <a href="#senario-analizi" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 rounded-lg transition-all duration-150 group" onClick={(e) => { e.preventDefault(); scrollToSection('senario-analizi'); }}>
                  <span className="text-lg group-hover:scale-110 transition-transform">🤔</span>
                  <span className="font-medium">Senario Analizi</span>
                </a>
                <a href="#futures-pozisyonlar" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 rounded-lg transition-all duration-150 group" onClick={(e) => { e.preventDefault(); scrollToSection('futures-pozisyonlar'); }}>
                  <span className="text-lg group-hover:scale-110 transition-transform">⚡</span>
                  <span className="font-medium">Futures Pozisyonlar</span>
                </a>
                <a href="#risk-kontrol" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 rounded-lg transition-all duration-150 group" onClick={(e) => { e.preventDefault(); scrollToSection('risk-kontrol'); }}>
                  <span className="text-lg group-hover:scale-110 transition-transform">⚠️</span>
                  <span className="font-medium">Risk & Kontrol</span>
                </a>
                <a href="#acik-emirler" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 rounded-lg transition-all duration-150 group" onClick={(e) => { e.preventDefault(); scrollToSection('acik-emirler'); }}>
                  <span className="text-lg group-hover:scale-110 transition-transform">📋</span>
                  <span className="font-medium">Açık Emirler</span>
                </a>
                <a href="#alert-otomasyon" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 rounded-lg transition-all duration-150 group" onClick={(e) => { e.preventDefault(); scrollToSection('alert-otomasyon'); }}>
                  <span className="text-lg group-hover:scale-110 transition-transform">🔔</span>
                  <span className="font-medium">Alert & Otomasyon</span>
                </a>
                <a href="#performans" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800/60 hover:text-cyan-400 rounded-lg transition-all duration-150 group" onClick={(e) => { e.preventDefault(); scrollToSection('performans'); }}>
                  <span className="text-lg group-hover:scale-110 transition-transform">📊</span>
                  <span className="font-medium">Performans Analizi</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}