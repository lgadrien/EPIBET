import Link from "next/link";

// Mock tickets data
const TICKETS = [
  { id: 1, match: "PARIS SG vs OM", winner: "PSG", odds: 1.85, amount: 100 },
  { id: 2, match: "REAL MADRID vs BARCA", winner: "NUL", odds: 3.2, amount: 50 },
  { id: 3, match: "BAYERN vs TEK", winner: "BAYERN", odds: 1.45, amount: 200 },
  { id: 4, match: "ARSENAL vs CHELSEA", winner: "ARSENAL", odds: 2.1, amount: 75 },
  { id: 5, match: "JUVENTUS vs MILAN", winner: "MILAN", odds: 2.8, amount: 20 },
  { id: 6, match: "LIVERPOOL vs CITY", winner: "CITY", odds: 1.95, amount: 150 },
  { id: 7, match: "DORTMUND vs LEIPZIG", winner: "DORTMUND", odds: 2.3, amount: 80 },
  { id: 8, match: "MAN UTD vs SPURS", winner: "MAN UTD", odds: 2.5, amount: 120 },
  { id: 9, match: "INTER vs ROMA", winner: "INTER", odds: 1.7, amount: 300 },
  { id: 10, match: "ATLETICO vs SEVILLA", winner: "NUL", odds: 3.1, amount: 40 },
  { id: 11, match: "LYON vs MONACO", winner: "MONACO", odds: 2.4, amount: 90 },
  { id: 12, match: "NAPOLI vs LAZIO", winner: "NAPOLI", odds: 1.9, amount: 110 },
  { id: 13, match: "BENFICA vs PORTO", winner: "PORTO", odds: 2.6, amount: 60 },
  { id: 14, match: "AJAX vs PSV", winner: "AJAX", odds: 2.2, amount: 100 },
  { id: 15, match: "LEVERKUSEN vs STUTTGART", winner: "LEVERKUSEN", odds: 1.6, amount: 250 },
  { id: 16, match: "CITY vs REAL MADRID", winner: "CITY", odds: 2.05, amount: 500 },
  { id: 17, match: "PSG vs BAYERN", winner: "NUL", odds: 3.5, amount: 80 },
  { id: 18, match: "ASTON VILLA vs NEWCASTLE", winner: "VILLA", odds: 2.7, amount: 45 },
  { id: 19, match: "LILLE vs LENS", winner: "LILLE", odds: 2.15, amount: 130 },
  { id: 20, match: "SPORTING vs BRAGA", winner: "SPORTING", odds: 1.55, amount: 210 },
  { id: 21, match: "BOCA JUNIORS vs RIVER", winner: "BOCA", odds: 2.8, amount: 70 },
  { id: 22, match: "FLAMENGO vs FLUMINENSE", winner: "FLAMENGO", odds: 1.8, amount: 160 },
  { id: 23, match: "GALATASARAY vs FENERBAHCE", winner: "NUL", odds: 3.0, amount: 55 },
  { id: 24, match: "CELTIC vs RANGERS", winner: "CELTIC", odds: 2.1, amount: 140 },
];

function BetTicket({
  ticket,
  index,
}: {
  ticket: (typeof TICKETS)[0];
  index: number;
}) {
  // Deterministic fake ID generated from index to avoid hydration issues
  const fakeId = ticket.id * 1000 + ((index * 42) % 999);

  return (
    <div className="w-56 rounded-xl border border-epitech-border bg-epitech-gray/80 p-4 shadow-xl backdrop-blur-sm flex-shrink-0">
      <div className="mb-2 flex items-center justify-between border-b border-epitech-border pb-2">
        <span className="text-xs font-bold text-epitech-blue">
          BET #{fakeId}
        </span>
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
          Live
        </span>
      </div>
      <div className="mb-3 flex flex-col">
        <span className="truncate text-sm font-bold text-white">
          {ticket.match}
        </span>
        <span className="text-xs text-gray-400">Prono: {ticket.winner}</span>
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-gray-500">{ticket.amount} Pts</span>
        <span className="rounded bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 text-xs font-bold text-green-400">
          x{ticket.odds.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

function TicketColumn({
  direction,
  speed = 20,
  delay = 0,
  className = "",
}: {
  direction: "up" | "down";
  speed?: number;
  delay?: number;
  className?: string;
}) {
  // Duplicate tickets to create a seamless loop
  const loopTickets = [...TICKETS, ...TICKETS, ...TICKETS, ...TICKETS];

  // Adjust base speed relative to the original 7 tickets to keep scrolling velocity constant
  const adjustedSpeed = speed * (TICKETS.length / 7);

  return (
    <div className={`relative flex flex-col gap-4 w-56 ${className}`}>
      <div
        className={`flex flex-col gap-4 ${direction === "up" ? "animate-slide-up" : "animate-slide-down"}`}
        style={{
          animationDuration: `${adjustedSpeed}s`,
          animationDelay: `${delay}s`,
        }}
      >
        {loopTickets.map((ticket, i) => (
          <BetTicket key={`${ticket.id}-${i}`} ticket={ticket} index={i} />
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <div className="relative flex min-h-[calc(100vh-144px)] flex-col items-center justify-center overflow-hidden w-full h-full">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 flex justify-center items-center overflow-hidden select-none pointer-events-none perspective-[1000px]">
        {/* We use a wrapper with a slight 3D rotation / inclination to give depth */}
        <div className="flex w-[150vw] h-[200vh] items-center justify-center gap-4 sm:gap-8 md:gap-16 rotate-[-15deg] scale-[1.2]">
          <TicketColumn
            direction="down"
            speed={100}
            className="hidden lg:flex opacity-20"
          />
          <TicketColumn
            direction="up"
            speed={80}
            delay={-5}
            className="hidden sm:flex opacity-40"
          />
          <TicketColumn
            direction="down"
            speed={60}
            delay={-12}
            className="opacity-80"
          />
          <TicketColumn
            direction="up"
            speed={70}
            delay={-18}
            className="opacity-80"
          />
          <TicketColumn
            direction="down"
            speed={90}
            delay={-7}
            className="hidden sm:flex opacity-40"
          />
          <TicketColumn
            direction="up"
            speed={110}
            delay={-2}
            className="hidden lg:flex opacity-20"
          />
        </div>

        {/* Soft radial mask to fade edges and focus on text */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, var(--color-epitech-black) 80%)",
          }}
        />
        {/* Top/bottom gradient for smooth transition to real background */}
        <div className="absolute inset-0 bg-gradient-to-b from-epitech-black via-transparent to-epitech-black" />
      </div>

      {/* Main Content */}
      <div className="container relative z-10 mx-auto flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="mb-6 text-6xl font-extrabold tracking-tight md:text-8xl drop-shadow-2xl">
          EPI<span className="text-epitech-blue">BET</span>
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-gray-300 md:text-xl drop-shadow-md">
          La plateforme de paris exclusive pour les étudiants d'EPITECH. Gagnez
          des points, grimpez le classement et prouvez votre talent.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className="rounded-xl bg-epitech-blue px-8 py-4 text-lg font-bold text-white transition-all hover:bg-epitech-blue-hover hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(0,173,238,0.3)] hover:shadow-[0_0_40px_rgba(0,173,238,0.5)]">
            <Link href="/login">Tentez de rentrer dans la légende</Link>
          </button>
          <button className="rounded-xl border border-epitech-border bg-epitech-gray/80 backdrop-blur-md px-8 py-4 text-lg font-bold text-white transition-all hover:bg-epitech-border hover:scale-105 active:scale-95">
            <Link href="/classement">Voir le classement</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
