"use client";

import { Calendar, Clock, Trophy, Loader2, Wand2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export interface Odd {
  id: string;
  option_name: string;
  multiplier: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  start_time: string;
  status: string;
  odds: Odd[];
}

interface EventCardProps {
  event: Event;
  onSelectOdd: (event: Event, odd: Odd) => void;
  selectedOddId?: string;
}

export default function EventCard({ event, onSelectOdd, selectedOddId }: EventCardProps) {
  const supabase = createClient();
  const [isResolving, setIsResolving] = useState<string | null>(null);

  const startTime = new Date(event.start_time).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [team1, team2] = event.title.split(" vs ");

  const handleSimulateWin = async (winningOddId: string) => {
    try {
      setIsResolving(winningOddId);
      const { error } = await supabase.rpc("resolve_event", {
        p_event_id: event.id,
        p_winning_odd_id: winningOddId
      });
      if (error) throw error;
    } catch (error: any) {
      alert(`Erreur Simu: ${error.message}`);
    } finally {
      setIsResolving(null);
    }
  };

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all duration-300 group">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-epitech-blue">
                {event.category}
              </span>
            </div>
            {event.status === "in_progress" && (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 animate-pulse">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
                  LIVE
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <Clock className="w-3 h-3" />
            <span className="text-xs font-medium">
              {event.status === "in_progress" ? "En cours" : startTime}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex flex-col items-center flex-1 text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="text-lg font-bold text-white">{team1?.[0]}</span>
            </div>
            <span className="text-sm font-bold text-white line-clamp-1">{team1}</span>
          </div>

          <div className="flex flex-col items-center">
             <span className="text-xs font-black text-gray-700">VS</span>
          </div>

          <div className="flex flex-col items-center flex-1 text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <span className="text-lg font-bold text-white">{team2?.[0]}</span>
            </div>
            <span className="text-sm font-bold text-white line-clamp-1">{team2}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {event.odds.map((odd) => (
            <div key={odd.id} className="space-y-2">
              <button
                onClick={() => onSelectOdd(event, odd)}
                className={`w-full flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all active:scale-95 ${
                  selectedOddId === odd.id
                    ? "bg-epitech-blue border-epitech-blue text-white shadow-lg shadow-epitech-blue/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white"
                }`}
              >
                <span className="text-[10px] font-bold uppercase mb-0.5 opacity-60">
                  {odd.option_name}
                </span>
                <span className="text-sm font-black tracking-tight">
                  {Number(odd.multiplier).toFixed(2)}
                </span>
              </button>

              {/* SIMULATION BUTTON */}
              {event.status === "in_progress" && (
                <button
                  onClick={() => handleSimulateWin(odd.id)}
                  disabled={isResolving !== null}
                  title="Simuler victoire"
                  className="w-full py-1.5 rounded-lg border border-dashed border-white/10 text-[9px] font-bold text-gray-500 hover:text-epitech-blue hover:border-epitech-blue/30 transition-all flex items-center justify-center gap-1 uppercase tracking-tighter"
                >
                  {isResolving === odd.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <Wand2 className="w-3 h-3" />
                      Terminer
                    </>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
