"use client";

import { memo } from "react";
import { Crown, Coins, Zap } from "lucide-react";

export type RankingCategory = "global" | "wealth" | "streak";

interface RankingTabsProps {
  activeTab: RankingCategory;
  onTabChange: (tab: RankingCategory) => void;
}

const tabs: { id: RankingCategory; label: string; icon: any }[] = [
  { id: "global", label: "Global", icon: Crown },
  { id: "wealth", label: "Fortune", icon: Coins },
  { id: "streak", label: "Streak", icon: Zap },
];

function RankingTabs({ activeTab, onTabChange }: RankingTabsProps) {
  return (
    <div className="flex w-full flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl text-white">
        Classement des <span className="text-yellow-400">100</span> meilleurs
        <span className="text-epitech-blue"> joueurs</span>
      </h1>

      <div className="inline-flex h-12 items-center justify-center rounded-xl bg-epitech-gray/50 p-1 backdrop-blur-sm border border-epitech-border w-full max-w-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex flex-1 items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200
                ${isActive ? "text-white" : "text-gray-400 hover:text-gray-200"}
              `}
            >
              {isActive && (
                <div className="absolute inset-0 rounded-lg bg-epitech-blue shadow-[0_0_15px_rgba(0,112,243,0.4)] transition-all" />
              )}
              <Icon
                className={`relative z-10 w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`}
              />
              <span className="relative z-10 hidden sm:inline">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(RankingTabs);
