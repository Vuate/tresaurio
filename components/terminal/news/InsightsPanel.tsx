import SentimentCard from "./SentimentCard";
import TrendingTopics from "./TrendingTopics";
import UpcomingEvents from "./UpcomingEvents";
import QuickActions from "./QuickActions";

export default function InsightsPanel() {
  return (
    <div className="h-full overflow-y-auto border-l border-white/10 bg-[#041F20] p-6">
      <div className="text-sm font-bold text-gray-300">📊 Insights</div>

      <SentimentCard />
      <QuickActions />
      <TrendingTopics />
      <UpcomingEvents />
    </div>
  );
}
