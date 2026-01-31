import NewsHero from "@/components/terminal/news/NewsHero";
import NewsFeatures from "@/components/terminal/news/NewsFeatures";
import NewsFeed from "@/components/terminal/news/NewsFeed";
import NewsSentiment from "@/components/terminal/news/NewsSentiment";
import NewsHowItWorks from "@/components/terminal/news/NewsHowItWorks";
import NewsCTA from "@/components/terminal/news/NewsCTA";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-[#031A1C] text-white">
      {/* Hero Section */}
      <NewsHero />

      <div className="w-full mx-auto px-6 py-8">
        {/* Ana Özellikler */}
        <NewsFeatures />

        {/* Haber Feed Örneği */}
        <NewsFeed />

        {/* Market Sentiment Pano */}
        <NewsSentiment />

        {/* Nasıl Çalışır */}
        <NewsHowItWorks />

        {/* CTA */}
        <NewsCTA />
      </div>
    </div>
  );
}
