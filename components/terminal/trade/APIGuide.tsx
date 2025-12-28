'use client';

interface APIGuideProps {
  onOpenGuideModal: () => void;
}

export default function APIGuide({ onOpenGuideModal }: APIGuideProps) {
  return (
    <div className="bg-gradient-to-br from-cyan-500/8 to-purple-500/5 border-2 border-cyan-500/15 rounded-xl p-6">
      <div className="flex justify-between items-center gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📚</span>
            <h3 className="text-xl font-extrabold text-white">API'yi Nasıl Kullanırım?</h3>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Borsalarınızı bağlamak için API key oluşturma ve güvenli kullanım rehberini görüntüleyin.
          </p>
        </div>
        <button
          onClick={onOpenGuideModal}
          className="px-7 py-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl text-white font-extrabold text-sm uppercase shadow-lg shadow-cyan-500/30 whitespace-nowrap hover:from-cyan-400 hover:to-blue-400 transition-all cursor-pointer"
        >
          📖 Rehberi Aç
        </button>
      </div>
    </div>
  );
}