import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-epitech-border bg-epitech-black py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tighter text-white"
        >
          EPI<span className="text-epitech-blue">BET</span>
        </Link>

        <p className="text-xs text-gray-500">
          &copy; {new Date().getFullYear()} EPIBET. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
