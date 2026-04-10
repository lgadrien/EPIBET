"use client";

import { Trophy } from "lucide-react";
import { Profile } from "./RankingTable";

interface RankingPodiumProps {
  topThree: Profile[];
  unit: string;
}

const PODIUM_CONFIG = [
  {
    rank: 2,
    label: "Silver",
    blockHeight: "h-20",
    avatarSize: "w-14 h-14",
    ringGradient:
      "bg-[conic-gradient(from_0deg,#9CA3AF,#E5E7EB,#6B7280,#9CA3AF)]",
    border: "border-gray-400/40",
    badgeBg: "bg-gray-400 text-gray-900",
    blockBorder: "border-gray-400/40",
    blockTopBar: "bg-gray-400",
    scoreColor: "text-gray-400",
    order: "order-1",
  },
  {
    rank: 1,
    label: "Gold",
    blockHeight: "h-32",
    avatarSize: "w-20 h-20",
    ringGradient:
      "bg-[conic-gradient(from_0deg,#FACC15,#FDE68A,#CA8A04,#FACC15)]",
    border: "border-yellow-400/50",
    badgeBg: "bg-yellow-400 text-yellow-900",
    blockBorder: "border-yellow-400/40",
    blockTopBar: "bg-yellow-400",
    scoreColor: "text-yellow-400",
    order: "order-2",
  },
  {
    rank: 3,
    label: "Bronze",
    blockHeight: "h-14",
    avatarSize: "w-12 h-12",
    ringGradient:
      "bg-[conic-gradient(from_0deg,#B45309,#FCD34D,#92400E,#B45309)]",
    border: "border-amber-700/40",
    badgeBg: "bg-amber-700 text-amber-100",
    blockBorder: "border-amber-700/40",
    blockTopBar: "bg-amber-700",
    scoreColor: "text-amber-600",
    order: "order-3",
  },
];

export default function RankingPodium({ topThree, unit }: RankingPodiumProps) {
  if (topThree.length === 0) return null;

  // Map: config index 0 = silver (topThree[1]), 1 = gold (topThree[0]), 2 = bronze (topThree[2])
  const players = [
    topThree[1] ?? null,
    topThree[0] ?? null,
    topThree[2] ?? null,
  ];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-0 py-10 px-4">
      {/* Players row */}
      <div className="flex items-end justify-center gap-3 w-full">
        {players.map((player, idx) => {
          const cfg = PODIUM_CONFIG[idx];

          if (!player) {
            return <div key={idx} className={`flex-1 ${cfg.order}`} />;
          }

          const avatar =
            player.avatar_url ||
            `https://api.dicebear.com/7.x/notionists/svg?seed=${player.pseudo}`;

          return (
            <div
              key={player.id}
              className={`flex-1 flex flex-col items-center ${cfg.order}`}
            >
              {/* Trophy icon for gold only */}
              {cfg.rank === 1 && (
                <Trophy className="w-5 h-5 text-yellow-400 mb-2 shrink-0" />
              )}

              {/* Avatar with spinning ring */}
              <div className="relative mb-3">
                <div
                  className={`absolute -inset-[3px] rounded-full ${cfg.ringGradient} animate-spin [animation-duration:4s] opacity-80`}
                />
                <div
                  className={`relative rounded-full overflow-hidden bg-zinc-900 border ${cfg.border} ${cfg.avatarSize}`}
                >
                  <img
                    src={avatar}
                    alt={player.pseudo}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Rank badge */}
                <span
                  className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap z-10 ${cfg.badgeBg}`}
                >
                  #{cfg.rank}
                </span>
              </div>

              {/* Name & score */}
              <p className="mt-3 text-xs font-semibold text-white text-center truncate max-w-[90px]">
                {player.pseudo}
              </p>
              <p className={`text-sm font-black ${cfg.scoreColor}`}>
                {player.rank_value.toLocaleString()}
              </p>
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                {unit}
              </p>
            </div>
          );
        })}
      </div>

      {/* Podium blocks */}
      <div className="flex items-end justify-center gap-3 w-full mt-4">
        {PODIUM_CONFIG.map((cfg) => (
          <div
            key={cfg.rank}
            className={`flex-1 ${cfg.order} ${cfg.blockHeight} relative rounded-t-xl border-t border-x ${cfg.blockBorder} bg-zinc-800/60 flex items-center justify-center overflow-hidden`}
          >
            <div
              className={`absolute top-0 inset-x-0 h-[3px] ${cfg.blockTopBar}`}
            />
            <span className={`text-xl font-black ${cfg.scoreColor} opacity-40`}>
              {cfg.rank}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
