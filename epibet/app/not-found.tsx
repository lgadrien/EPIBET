"use client";

import Link from "next/link";
import { Ghost, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[calc(100vh-144px)] items-center justify-center overflow-hidden px-4">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none">
        <div className="absolute -left-24 -top-24 h-[500px] w-[500px] rounded-full bg-epitech-blue/10 blur-[120px] animate-move-bg" />
        <div className="absolute -right-24 -bottom-24 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[120px] animate-move-bg [animation-delay:-5s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[150px] animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Premium Animated Icon Container */}
        <div className="relative mx-auto mb-12 h-48 w-48 flex items-center justify-center">
          {/* Floating Ghost */}
          <div className="animate-float relative z-10">
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white/5 backdrop-blur-3xl ring-1 ring-white/10 shadow-2xl">
              <Ghost
                size={72}
                className="text-epitech-blue drop-shadow-[0_0_15px_rgba(0,173,238,0.5)]"
                strokeWidth={1}
              />
            </div>
          </div>
          
          {/* Dynamic Shadow */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 h-4 w-16 bg-epitech-blue/20 blur-xl rounded-[100%] animate-pulse-shadow" />
          
          {/* Background Ring */}
          <div className="absolute inset-0 rounded-full border border-white/5 scale-150 opacity-20" />
          <div className="absolute inset-0 rounded-full border border-white/5 scale-125 opacity-40 animate-pulse" />
        </div>

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-epitech-blue/20 bg-epitech-blue/5 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-epitech-blue uppercase backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-epitech-blue opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-epitech-blue"></span>
          </span>
          Erreur 404 • Page Introuvable
        </div>

        <h1 className="mb-6 bg-gradient-to-b from-white to-white/60 bg-clip-text text-7xl font-black tracking-tighter text-transparent sm:text-8xl">
          Perdu ?
        </h1>

        <p className="mx-auto mb-12 max-w-md text-lg leading-relaxed text-gray-400 font-medium">
          Même les meilleurs parieurs perdent parfois leur chemin. Cette page semble avoir été retirée du marché des cotes.
        </p>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link
            href="/"
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-epitech-blue px-10 py-5 text-sm font-black text-white transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,173,238,0.4)] active:scale-95 sm:w-auto"
          >
            <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-[100%]" />
            <Home size={20} className="transition-transform group-hover:-translate-y-0.5" />
            <span>Retourner au Salon</span>
          </Link>
          
          <Link
            href="/search"
            className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-sm font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 sm:w-auto"
          >
            <Search size={20} className="text-gray-400 transition-colors group-hover:text-white" />
            <span>Rechercher un Match</span>
          </Link>
        </div>

        {/* Decorative Grid */}
        <div className="absolute left-1/2 top-1/2 -z-10 h-full w-full -translate-x-1/2 -translate-y-1/2 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]">
          <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
      </div>
    </div>
  );
}
