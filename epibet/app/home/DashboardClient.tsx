"use client";

import { useState, useEffect } from "react";
import SportsSidebar from "../components/Dashboard/SportsSidebar";
import EventCard, { Event, Odd } from "../components/Dashboard/EventCard";
import BetSlip from "../components/Dashboard/BetSlip";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import useConfetti from "../hooks/useConfetti";

interface DashboardClientProps {
  initialEvents: Event[];
  userEpicoins: number;
}

export default function DashboardClient({ initialEvents, userEpicoins }: DashboardClientProps) {
  const supabase = createClient();
  const router = useRouter();
  const { fire } = useConfetti();
  
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selection, setSelection] = useState<{ event: Event; odd: Odd } | null>(null);

  // Sync state with initialEvents when they change (props update)
  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  useEffect(() => {
    // 1. Abonnement aux changements de matchs (Scores, Statuts)
    const eventChannel = supabase
      .channel("realtime-events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          // On rafraîchit les données du serveur pour avoir les cotes liées
          router.refresh();
        }
      )
      .subscribe();

    // 2. Abonnement aux paris pour les confettis
    const betChannel = supabase
      .channel("realtime-bets")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bets" },
        (payload) => {
          if (payload.new.status === "won") {
            fire(); // BOOM! Confettis
            router.refresh(); // Update coins in header
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventChannel);
      supabase.removeChannel(betChannel);
    };
  }, [supabase, router, fire]);

  const filteredEvents = activeCategory === "all" 
    ? events 
    : events.filter(e => e.category === activeCategory);

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 flex gap-8">
      {/* Sidebar - Desktop Only */}
      <SportsSidebar 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory} 
      />

      {/* Main Content */}
      <main className="flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">DASHBOARD</h1>
            <p className="text-sm text-gray-500 font-medium">Pariez sur les meilleurs événements en direct.</p>
          </div>
          
          {/* Mobile Filter Pill (Simplified for now) */}
          <div className="lg:hidden">
             {/* Component would go here */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onSelectOdd={(e, o) => setSelection({ event: e, odd: o })}
              selectedOddId={selection?.odd.id}
            />
          ))}

          {filteredEvents.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🏟️</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Aucun match disponible</h3>
              <p className="text-sm text-gray-500">Revenez plus tard pour de nouveaux paris.</p>
            </div>
          )}
        </div>
      </main>

      {/* Betting Slip */}
      <BetSlip 
        selection={selection} 
        onClose={() => setSelection(null)}
        userEpicoins={userEpicoins}
      />
    </div>
  );
}
