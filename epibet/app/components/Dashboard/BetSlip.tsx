"use client";

import { useState } from "react";
import { X, Wallet, TrendingUp, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Event, Odd } from "./EventCard";

interface BetSlipProps {
  selection: { event: Event; odd: Odd } | null;
  onClose: () => void;
  userEpicoins: number;
}

export default function BetSlip({ selection, onClose, userEpicoins }: BetSlipProps) {
  const supabase = createClient();
  const router = useRouter();
  const [amount, setAmount] = useState<string>("100");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!selection && !success) return null;

  const multiplier = selection ? Number(selection.odd.multiplier) : 0;
  const stake = parseInt(amount) || 0;
  const potentialWin = (stake * multiplier).toFixed(2);
  const canPlaceBet = stake > 0 && stake <= userEpicoins;

  const handlePlaceBet = async () => {
    if (!selection || !canPlaceBet) return;

    try {
      setIsSubmitting(true);
      
      const { data, error } = await supabase.rpc("place_bet", {
        p_odd_id: selection.odd.id,
        p_amount: stake
      });

      if (error) throw error;

      setSuccess(true);
      router.refresh(); // Update coins in header
      
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);
      
    } catch (error: any) {
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60] w-full max-w-[360px] animate-in slide-in-from-bottom-8 duration-300">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden shadow-black/50">
        {success ? (
          <div className="p-8 flex flex-col items-center text-center bg-green-500/5">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">Pari placé !</h3>
            <p className="text-sm text-gray-400">Bonne chance pour votre pronostic.</p>
          </div>
        ) : (
          <>
            <div className="bg-white/5 px-5 py-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-epitech-blue" />
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  Votre Ticket
                </span>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-6">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
                  Sélection
                </div>
                <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                  <div className="text-xs text-gray-400 mb-1">{selection?.event.title}</div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">{selection?.odd.option_name}</span>
                    <span className="text-sm font-black text-epitech-blue">x{multiplier.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-1.5">
                   <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Mise (Epicoins)
                  </div>
                  <div className="text-[10px] font-medium text-gray-500">
                    Solde: {userEpicoins.toLocaleString()}
                  </div>
                </div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:border-epitech-blue focus:ring-1 focus:ring-epitech-blue transition-all"
                />
              </div>

              <div className="bg-epitech-blue/10 border border-epitech-blue/20 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-epitech-blue">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Gain Potentiel</span>
                  </div>
                  <span className="text-lg font-black text-white">{potentialWin}</span>
                </div>
              </div>

              <button
                disabled={!canPlaceBet || isSubmitting}
                onClick={handlePlaceBet}
                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  canPlaceBet && !isSubmitting
                    ? "bg-epitech-blue hover:bg-epitech-blue-hover text-white shadow-lg shadow-epitech-blue/40"
                    : "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "PLACER LE PARI"}
              </button>
              
              {!canPlaceBet && stake > userEpicoins && (
                <p className="text-center text-[10px] text-red-500 mt-3 font-bold uppercase tracking-widest">
                  Solde d'Epicoins insuffisant
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
