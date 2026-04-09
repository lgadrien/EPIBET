"use client";

import Link from "next/link";
import { AlertCircle, Home, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // On pourrait logguer l'erreur ici (ex: Sentry)
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-[calc(100vh-144px)] items-center justify-center overflow-hidden px-4">
      {/* Background Decorative Elements */}
      <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-epitech-blue/10 blur-[100px]" />
      <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-blue-600/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-red-500/10 text-red-500 ring-1 ring-red-500/20">
          <AlertCircle size={48} strokeWidth={1.5} />
        </div>

        <h1 className="mb-4 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
          Oups ! <br />
          <span className="text-epitech-blue">Erreur Interne</span>
        </h1>

        <p className="mb-10 text-lg leading-relaxed text-gray-400">
          Désolé, quelque chose s'est cassé dans les rouages d'EPIBET. Nos techniciens (et nos parieurs pros) sont sur le coup.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => reset()}
            className="group flex items-center justify-center gap-2 rounded-xl bg-epitech-blue px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-epitech-blue-hover hover:shadow-[0_0_20px_rgba(0,112,243,0.3)] active:scale-[0.98]"
          >
            <RefreshCcw size={18} className="transition-transform group-hover:rotate-180" />
            Réessayer
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
          >
            <Home size={18} />
            Retour à l'accueil
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs font-mono text-gray-600">
            ID Erreur : {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
