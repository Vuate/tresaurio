export default function NewsCard() {
  return (
    <div className="p-5 rounded-xl border border-white/10 bg-[#041F20] hover:border-teal-400/40 transition cursor-pointer">
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-lg bg-teal-400 flex items-center justify-center">
          🔥
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
            <span>Reuters</span>
            <span>•</span>
            <span>5 dk önce</span>
            <Badge text="Yüksek Etki" />
          </div>

          <h3 className="font-semibold mb-2">
            SEC Bitcoin ETF Başvurularını Onayladı
          </h3>

          <p className="text-sm text-white/70 mb-3">
            ABD SEC, spot Bitcoin ETF başvurularını onayladı. Piyasalar sert
            tepki verdi.
          </p>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Tag>BTC</Tag>
              <Tag>📈 Bullish</Tag>
            </div>

            <div className="flex gap-2">
              <IconBtn>⭐</IconBtn>
              <IconBtn>🔔</IconBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="px-2 py-0.5 rounded text-xs border border-red-500/30 text-red-400">
      {text}
    </span>
  );
}

function Tag({ children }: any) {
  return (
    <span className="px-2 py-1 text-xs rounded border border-teal-400/30 text-teal-300">
      {children}
    </span>
  );
}

function IconBtn({ children }: any) {
  return (
    <button className="w-8 h-8 rounded border border-white/10 hover:border-teal-400/50">
      {children}
    </button>
  );
}
