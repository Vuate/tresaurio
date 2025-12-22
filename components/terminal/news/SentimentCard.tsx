export default function SentimentCard() {
  return (
    <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4">
      <div className="text-sm font-semibold mb-3">📊 Piyasa Sentiment’i</div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded bg-white/10">
          <div className="h-full w-[68%] rounded bg-gradient-to-r from-red-500 via-yellow-400 to-green-500" />
        </div>
        <div className="text-lg font-bold">68</div>
      </div>

      <div className="mt-3 text-xs text-gray-400">Pozitif</div>
    </div>
  );
}
