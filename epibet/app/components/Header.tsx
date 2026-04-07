import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-epitech-border bg-epitech-black/80 backdrop-blur-md">
      <div className="container mx-auto grid h-16 grid-cols-3 items-center px-4 lg:px-8">
        {/* Left: Logo */}
        <div className="flex justify-start">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tighter text-white transition-opacity hover:opacity-80">
              EPI<span className="text-epitech-blue">BET</span>
            </span>
          </Link>
        </div>

        {/* Center: Navigation */}
        <nav className="hidden justify-center space-x-8 text-sm font-medium md:flex">
          <Link
            href="/classement"
            className="text-gray-400 transition-colors hover:text-epitech-blue"
          >
            Classement
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex justify-end space-x-4">
          <Link href="/login">
            <button className="rounded-lg bg-epitech-blue px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-epitech-blue-hover active:scale-95">
              Se connecter
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
