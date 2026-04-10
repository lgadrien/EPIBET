"use client";

import { Calendar, CheckCircle2, XCircle, Clock, TrendingUp } from "lucide-react";

export interface Bet {
  id: string;
  amount_wagered: number;
  locked_multiplier: number;
  status: "pending" | "won" | "lost" | "refunded";
  placed_at: string;
  odd: {
    option_name: string;
    event: {
      title: string;
      category: string;
    };
  };
}

export default function BetTicket({ bet }: { bet: Bet }) {
  const date = new Date(bet.placed_at).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const time = new Date(bet.placed_at).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const potentialWin = (bet.amount_wagered * bet.locked_multiplier).toFixed(2);

  const getStatusStyles = () => {
    switch (bet.status) {
      case "won":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/20",
          text: "text-green-500",
          icon: <CheckCircle2 className="w-4 h-4" />,
          label: "Gagné",
        };
      case "lost":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/20",
          text: "text-red-400",
          icon: <XCircle className="w-4 h-4" />,
          label: "Perdu",
        };
      default:
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/20",
          text: "text-yellow-500",
          icon: <Clock className="w-4 h-4" />,
          label: "En attente",
        };
    }
  };

  const status = getStatusStyles();

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all group">
      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full border ${status.bg} ${status.border} ${status.text} flex items-center gap-2 text-[10px] font-black uppercase tracking-widest`}>
              {status.icon}
              {status.label}
            </div>
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
              ID: {bet.id.slice(0, 8)}
            </span>
          </div>
          <div className="text-right">
            <div className="text-xs text-white font-bold">{date}</div>
            <div className="text-[10px] text-gray-500 font-medium">{time}</div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 mb-4">
           <div className="text-[10px] font-bold text-epitech-blue uppercase tracking-widest mb-1">
             {bet.odd.event.category}
           </div>
           <div className="text-sm font-bold text-white mb-1">
             {bet.odd.event.title}
           </div>
           <div className="flex justify-between items-center">
             <span className="text-xs text-gray-400 font-medium">Pronostic : <span className="text-white font-bold">{bet.odd.option_name}</span></span>
             <span className="text-xs font-black text-epitech-blue">x{Number(bet.locked_multiplier).toFixed(2)}</span>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Mise</div>
            <div className="text-sm font-black text-white">{bet.amount_wagered} <span className="text-[10px] text-gray-500 uppercase">Epicoins</span></div>
          </div>
          <div className={`p-3 rounded-xl border ${bet.status === 'won' ? 'bg-green-500/10 border-green-500/20' : 'bg-white/5 border-white/5'}`}>
            <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              {bet.status === 'won' ? 'Gains' : 'Gain Potentiel'}
            </div>
            <div className={`text-sm font-black flex items-center gap-1.5 ${bet.status === 'won' ? 'text-green-500' : 'text-white'}`}>
              <TrendingUp className="w-3.5 h-3.5" />
              {potentialWin}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
