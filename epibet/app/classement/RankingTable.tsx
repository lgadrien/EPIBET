"use client";

import { memo } from "react";
import { RankingCategory } from "../components/UI/RankingTabs";
import {
  Trophy,
  Medal,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

export type SortColumn = "rank" | "pseudo" | "score";
export type SortDirection = "asc" | "desc";

export interface Profile {
  id: string;
  pseudo: string;
  streak: number;
  epicoins: number;
  rank_value: number; // The value used for sorting in this category
  original_rank: number; // The rank position when sorted strictly by score
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
                  className={`group transition-colors hover:bg-white/[0.03] ${rank === 1 ? "bg-epitech-blue/5" : ""}`}
                >
                  <td className="px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-2">
                      {rank === 1 && (
                        <Trophy className="w-5 h-5 text-yellow-500" />
                      )}
                      {rank === 2 && (
                        <Medal className="w-5 h-5 text-gray-300" />
                      )}
                      {rank === 3 && (
                        <Medal className="w-5 h-5 text-amber-600" />
                      )}
                      {!isTopThree && (
                        <span className="text-gray-500 font-mono">#{rank}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-epitech-blue transition-colors">
                        {player.pseudo}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 text-right">
                    <span className="font-mono font-bold text-epitech-blue">
                      {player.rank_value.toLocaleString()}
                      <span className="text-[10px] ml-1 opacity-50">
                        {getUnit(category)}
                      </span>
                    </span>
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
