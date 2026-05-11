import NewsHero from "@/components/terminal/news/NewsHero";
import NewsFeatures from "@/components/terminal/news/NewsFeatures";
import NewsFeed from "@/components/terminal/news/NewsFeed";
import NewsSentiment from "@/components/terminal/news/NewsSentiment";
import NewsHowItWorks from "@/components/terminal/news/NewsHowItWorks";
import NewsCTA from "@/components/terminal/news/NewsCTA";

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NewsHero />

      <div className="w-full mx-auto px-6 py-8">
        <NewsFeatures />
        <NewsFeed />
        <NewsSentiment />
        <NewsHowItWorks />
        <NewsCTA />
      </div>
    </div>
  );
}
