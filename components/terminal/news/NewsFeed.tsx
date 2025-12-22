import NewsCard from "./NewsCard";

const MOCK = [1, 2, 3, 4, 5];

export default function NewsFeed() {
  return (
    <main className="p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold">Son Haberler</h2>
        <p className="text-xs text-white/50">248 haber • 2 dk önce</p>
      </div>

      <div className="space-y-4">
        {MOCK.map((i) => (
          <NewsCard key={i} />
        ))}
      </div>
    </main>
  );
}
