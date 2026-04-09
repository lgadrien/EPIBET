"use client";

import { useEffect, useState, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import RankingTabs, { RankingCategory } from "./RankingTabs";
import RankingTable, {
  Profile,
  SortColumn,
  SortDirection,
} from "./RankingTable";

export default function Classement() {
  const [activeTab, setActiveTab] = useState<RankingCategory>("global");
  const [rawUsers, setRawUsers] = useState<
    Omit<Profile, "rank_value" | "original_rank">[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Search & Sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<SortColumn>("rank");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const supabase = createClient();

  useEffect(() => {
    async function fetchRankings() {
      setLoading(true);

      const { data: users, error } = await supabase
        .from("public_profiles")
        .select("id, pseudo, epicoins, streak");

      if (error) {
        console.error("Error fetching rankings:", error);
        setLoading(false);
        return;
      }

      setRawUsers(users || []);
      setLoading(false);
    }

    fetchRankings();
  }, [supabase]);

  // Reset sort when tab changes
  useEffect(() => {
    setSortColumn("rank");
    setSortDirection("asc");
    setSearchQuery("");
  }, [activeTab]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection(column === "pseudo" ? "asc" : "desc"); // Text defaults desc->asc, nums asc->desc usually. For rank we already deal with numbers but lower rank is better (asc). Let's say pseudo defaults asc.
    }
  };

  const data = useMemo(() => {
    // 1. Transform and calculate base score
    const scoredData = rawUsers.map((user) => {
      let rankValue = 0;
      if (activeTab === "global") {
        rankValue = user.epicoins + user.streak * 100;
      } else if (activeTab === "wealth") {
        rankValue = user.epicoins;
      } else if (activeTab === "streak") {
        rankValue = user.streak;
      }

      return {
        ...user,
        rank_value: rankValue,
      };
    });

    // 2. Determine absolute ranking (descending score)
    scoredData.sort((a, b) => b.rank_value - a.rank_value);

    // Assign original_rank based on true score ranking
    const rankedData = scoredData.map((user, index) => ({
      ...user,
      original_rank: index + 1,
    })) as Profile[];

    // 3. Filter by Search Query
    let filteredData = rankedData;
    if (searchQuery.trim() !== "") {
      const lowerQuery = searchQuery.toLowerCase();
      filteredData = filteredData.filter((u) =>
        u.pseudo.toLowerCase().includes(lowerQuery),
      );
    }

    // 4. Sort by requested column
    filteredData.sort((a, b) => {
      let comparison = 0;
      if (sortColumn === "rank") {
        comparison = a.original_rank - b.original_rank;
      } else if (sortColumn === "pseudo") {
        comparison = a.pseudo.localeCompare(b.pseudo);
      } else if (sortColumn === "score") {
        comparison = a.rank_value - b.rank_value;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filteredData.slice(0, 100);
  }, [rawUsers, activeTab, searchQuery, sortColumn, sortDirection]);

  return (
    <main className="container mx-auto px-4 py-12 flex flex-col items-center">
      <RankingTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Search Bar */}
      <div className="w-full max-w-2xl mt-8 relative">
        <label htmlFor="search" className="sr-only">
          Rechercher un joueur
        </label>
        <div className="relative group">
          <input
            type="text"
            id="search"
            className="w-full h-12 pl-12 pr-4 rounded-xl border border-epitech-border bg-epitech-gray/50 backdrop-blur-sm text-white placeholder-gray-500 outline-none transition-all focus:border-epitech-blue focus:ring-1 focus:ring-epitech-blue shadow-sm"
            placeholder="Rechercher un joueur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10 text-gray-300 group-focus-within:text-epitech-blue transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="mt-20 flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-epitech-blue border-t-transparent"></div>
          <p className="text-gray-400 font-medium">
            Récupération des joueurs...
          </p>
        </div>
      ) : (
        <RankingTable
          data={data}
          category={activeTab}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}

      {activeTab === "global" && (
        <p className="mt-8 text-sm text-gray-500 italic">
          * Le score Global est calculé ainsi : Epicoins + (Série × 100)
        </p>
      )}
    </main>
  );
}
