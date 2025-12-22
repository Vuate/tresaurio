"use client";

import RewardCalendarHeader from "./RewardCalendarHeader";
import RewardInfoAlert from "./RewardInfoAlert";
import RewardCalendarBox from "./RewardCalendarBox";

export default function RewardCalendarSection() {
  return (
    <div className="space-y-6">
      <RewardCalendarHeader />
      <RewardInfoAlert />
      <RewardCalendarBox />
    </div>
  );
}
