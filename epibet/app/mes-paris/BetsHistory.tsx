"use client";

import { useState } from "react";
import BetTicket, { Bet } from "../components/Dashboard/BetTicket";
import { ListFilter, Trophy, CheckCircle2, History } from "lucide-react";

interface BetsHistoryProps {
  initialBets: Bet[];
}

type FilterType = "all" | "won" | "finished";

export default function BetsHistory({ initialBets }: BetsHistoryProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredBets = initialBets.filter((bet) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "won") return bet.status === "won";
    if (activeFilter === "finished") return bet.status === "won" || bet.status === "lost";
    return true;
  });

  const filters = [
    { id: "all", label: "Tous", icon: History },
    { id: "won", label: "Gagnés", icon: Trophy },
    { id: "finished", label: "Terminés", icon: CheckCircle2 },
  ];

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">MES PARIS</h1>
          <p className="text-sm text-gray-500 font-medium">Historique de vos pronostics et gains.</p>
        </div>

        {/* Barre de filtrage horizontale Premium */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5 backdrop-blur-md">
          {filters.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as FilterType)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 text-sm font-bold ${
                  isActive
                    ? "bg-epitech-blue text-white shadow-lg shadow-epitech-blue/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredBets.map((bet) => (
          <BetTicket key={bet.id} bet={bet} />
        ))}

        {filteredBets.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <ListFilter className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Aucun pari trouvé</h3>
            <p className="text-sm text-gray-500">
              {activeFilter === "all" 
                ? "Vous n'avez pas encore placé de paris." 
                : "Aucun pari ne correspond à ce filtre."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
