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

      {/* Main Container - Fully Responsive */}
      <div className="
        w-full 
        max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl xl:max-w-screen-2xl 
        mx-auto 
        px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12
        py-6 sm:py-8 lg:py-10 xl:py-12 2xl:py-14
      ">
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
