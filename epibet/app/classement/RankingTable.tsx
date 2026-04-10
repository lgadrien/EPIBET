"use client";

import { memo } from "react";
import { 
  Trophy, 
  Medal, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown,
  User
} from "lucide-react";
import { RankingCategory } from "./RankingTabs";

export type SortColumn = "rank" | "pseudo" | "score";
export type SortDirection = "asc" | "desc";

export interface Profile {
  id: string;
  pseudo: string;
  avatar_url?: string;
  streak: number;
  epicoins: number;
  rank_value: number; 
  original_rank: number;
}

interface RankingTableProps {
  data: Profile[];
  category: RankingCategory;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
}

const getUnit = (cat: RankingCategory) => {
  switch (cat) {
    case "wealth":
      return " Epicoins";
    case "streak":
      return " Jours";
    default:
      return " Pts";
  }
};

const getHeaderLabel = (cat: RankingCategory) => {
  switch (cat) {
    case "wealth":
      return "Fortune";
    case "streak":
      return "Série";
    case "global":
      return "Points";
    default:
      return "Score";
  }
};

function RankingTable({
  data,
  category,
  sortColumn,
  sortDirection,
  onSort,
}: RankingTableProps) {
  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column)
      return <ArrowUpDown className="w-4 h-4 ml-1 opacity-20" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1 text-epitech-blue" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1 text-epitech-blue" />
    );
  };

  return (
    <div className="w-full max-w-4xl mt-8 overflow-x-auto rounded-2xl border border-epitech-border bg-epitech-gray/30 backdrop-blur-sm">
      <table className="w-full text-left min-w-[320px]">
        <thead>
          <tr className="border-b border-epitech-border bg-white/[0.02]">
            <th className="px-4 py-3 sm:px-6 sm:py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <button
                onClick={() => onSort("rank")}
                className="flex items-center hover:text-white transition-colors"
              >
                Rang {getSortIcon("rank")}
              </button>
            </th>
            <th className="px-4 py-3 sm:px-6 sm:py-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <button
                onClick={() => onSort("pseudo")}
                className="flex items-center hover:text-white transition-colors"
              >
                Joueur {getSortIcon("pseudo")}
              </button>
            </th>
            <th className="px-4 py-3 sm:px-6 sm:py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
              <button
                onClick={() => onSort("score")}
                className="flex items-center justify-end w-full hover:text-white transition-colors"
              >
                {getHeaderLabel(category)} {getSortIcon("score")}
              </button>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-epitech-border/50">
          {data.length > 0 ? (
            data.map((player) => {
              const rank = player.original_rank;
              const isTopThree = rank <= 3;

              return (
                <tr
                  key={player.id}
                  className={`group transition-all duration-300 hover:bg-white/[0.05] border-b border-white/[0.02] last:border-0 ${
                    rank === 1 ? "bg-yellow-500/[0.02]" : ""
                  }`}
                >
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 font-mono text-xs font-bold text-gray-500 group-hover:text-white transition-colors">
                      #{rank}
                    </div>
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0">
                        <img 
                          src={player.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${player.pseudo}`} 
                          alt={player.pseudo} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-white group-hover:text-epitech-blue transition-colors text-sm sm:text-base">
                          {player.pseudo}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 sm:px-6 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-black text-white text-base sm:text-lg tracking-tight">
                        {player.rank_value.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 opacity-60">
                        {getUnit(category)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={3} className="px-6 py-20 text-center text-gray-500">
                Aucun joueur trouvé pour cette catégorie.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default memo(RankingTable);
