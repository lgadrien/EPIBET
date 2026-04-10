import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signOutAction } from "@/app/actions/auth";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-epitech-black/80 backdrop-blur-md">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between px-4 lg:px-8 md:grid md:grid-cols-3">
          {/* Left: Logo */}
          <div className="flex justify-start">
            <Link
              href={user ? "/home" : "/"}
              className="flex items-center space-x-2 transition-opacity hover:opacity-80"
            >
              <span className="text-xl font-bold tracking-tighter text-white">
                EPI<span className="text-epitech-blue">BET</span>
              </span>
            </Link>
          </div>

          {/* Center: Navigation (Desktop) */}
          <nav className="hidden justify-center space-x-8 text-sm font-medium md:flex">
            {user && (
              <Link
                href="/classement"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Classement
              </Link>
            )}
            {user && (
              <Link
                href="/mes-paris"
                className="text-gray-400 transition-colors hover:text-white"
              >
                Mes Paris
              </Link>
            )}
          </nav>

          {/* Right: Actions */}
          <div className="flex justify-end items-center space-x-3 md:space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 md:space-x-4">
                <span className="text-sm text-gray-400 hidden sm:inline">
                  {user.user_metadata.pseudo}
                </span>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
                  >
                    Déconnexion
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link href="/login">
                  <button className="rounded-lg bg-epitech-blue px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white transition-all hover:bg-epitech-blue-hover active:scale-95 shadow-[0_0_10px_rgba(0,112,243,0.3)]">
                    Connexion
                  </button>
                </Link>
                <Link href="/register">
                  <button className="rounded-lg border border-white/20 bg-transparent px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95 hidden sm:block">
                    S'inscrire
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation (Logged in) */}
        {user && (
          <div className="md:hidden flex justify-center space-x-6 pb-3 border-t border-white/5 pt-3 mx-4">
            <Link
              href="/classement"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Classement
            </Link>
            <Link
              href="/mes-paris"
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Mes Paris
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
