// components/terminal/personalized-dashboard/RewardCalendarModule.tsx

import { useState } from "react";

interface Props {
  instanceId: string;
}

interface RewardEvent {
  id: string;
  date: string;
  token: string;
  amount: number;
  type: "staking" | "airdrop" | "farming";
  apr: number;
}

// 🔥 MOCK DATA
const MOCK_REWARDS: RewardEvent[] = [
  {
    id: "1",
    date: "2026-01-20",
    token: "ETH",
    amount: 0.025,
    type: "staking",
    apr: 4.5,
  },
  {
    id: "2",
    date: "2026-01-22",
    token: "SOL",
    amount: 2.5,
    type: "staking",
    apr: 7.2,
  },
  {
    id: "3",
    date: "2026-01-25",
    token: "USDC",
    amount: 125,
    type: "farming",
    apr: 12.5,
  },
  {
    id: "4",
    date: "2026-01-27",
    token: "ARB",
    amount: 500,
    type: "airdrop",
    apr: 0,
  },
  {
    id: "5",
    date: "2026-02-01",
    token: "MATIC",
    amount: 45,
    type: "staking",
    apr: 5.8,
  },
];

export default function RewardCalendarModule({ instanceId }: Props) {
  const [filter, setFilter] = useState<
    "all" | "staking" | "airdrop" | "farming"
  >("all");

  const filteredRewards = MOCK_REWARDS.filter(
    (r) => filter === "all" || r.type === filter,
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "staking":
        return "text-blue-400 bg-blue-500/10";
      case "airdrop":
        return "text-purple-400 bg-purple-500/10";
      case "farming":
        return "text-emerald-400 bg-emerald-500/10";
      default:
        return "text-white/60 bg-white/5";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "staking":
        return "🔒";
      case "airdrop":
        return "🎁";
      case "farming":
        return "🌾";
      default:
        return "💰";
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0b0f] rounded-lg border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="text-xl">📅</div>
          <h3 className="font-semibold">Reward Calendar</h3>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-2 border-b border-white/10">
        {(["all", "staking", "airdrop", "farming"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              filter === f
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {filteredRewards.length === 0 ? (
          <div className="p-8 text-center text-white/40">
            <div className="text-4xl mb-2">📭</div>
            <div className="text-sm">No rewards scheduled</div>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {filteredRewards.map((reward) => (
              <div
                key={reward.id}
                className="p-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getTypeIcon(reward.type)}</span>
                    <div>
                      <div className="font-medium text-white">
                        {reward.token}
                      </div>
                      <div className="text-xs text-white/60">
                        {new Date(reward.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${getTypeColor(reward.type)}`}
                  >
                    {reward.type}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white/60">Amount</div>
                    <div className="text-lg font-bold text-emerald-400">
                      +{reward.amount} {reward.token}
                    </div>
                  </div>
                  {reward.apr > 0 && (
                    <div className="text-right">
                      <div className="text-xs text-white/60">APR</div>
                      <div className="text-sm font-medium text-blue-400">
                        {reward.apr}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="text-xs text-white/60 mb-1">Total Upcoming</div>
        <div className="text-sm font-medium text-white">
          {filteredRewards.length} rewards scheduled
        </div>
      </div>
    </div>
  );
}
