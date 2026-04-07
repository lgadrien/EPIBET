export default function Page() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-144px)] flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
        EPI<span className="text-epitech-blue">BET</span>
      </h1>
      <p className="mb-10 max-w-2xl text-lg text-gray-400 md:text-xl">
        La plateforme de paris exclusive pour les étudiants d'EPITECH. Gagnez
        des points, grimpez le classement et prouvez votre talent.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button className="rounded-xl bg-epitech-blue px-8 py-4 text-lg font-bold text-white transition-all hover:bg-epitech-blue-hover active:scale-95">
          Commencer à parier
        </button>
        <button className="rounded-xl border border-epitech-border bg-epitech-gray px-8 py-4 text-lg font-bold text-white transition-all hover:bg-epitech-border active:scale-95">
          Voir les matchs
        </button>
      </div>
    </div>
  );
}
