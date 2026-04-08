"use client";
import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";
import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [state, formAction, isPending] = useActionState(signUpAction, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-144px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 p-4">
        <div>
          <h2 className="mt-6 text-center text-4xl font-extrabold tracking-tight text-white">
            EPI<span className="text-epitech-blue">BET</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Créez votre compte pour commencer à parier
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-6">
          {state?.error && (
            <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-500">
              {state.error}
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="nom" className="sr-only">
                Nom
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                className="relative block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-epitech-blue focus:outline-none focus:ring-2 focus:ring-epitech-blue/50 sm:text-sm"
                placeholder="Nom"
              />
            </div>
            <div>
              <label htmlFor="prenom" className="sr-only">
                Prénom
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                className="relative block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-epitech-blue focus:outline-none focus:ring-2 focus:ring-epitech-blue/50 sm:text-sm"
                placeholder="Prénom"
              />
            </div>

            <div>
              <label htmlFor="pseudo" className="sr-only">
                Pseudo
              </label>
              <input
                id="pseudo"
                name="pseudo"
                type="text"
                required
                className="relative block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-epitech-blue focus:outline-none focus:ring-2 focus:ring-epitech-blue/50 sm:text-sm"
                placeholder="Pseudo"
              />
            </div>

            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-epitech-blue focus:outline-none focus:ring-2 focus:ring-epitech-blue/50 sm:text-sm"
                placeholder="Adresse email"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="relative block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-epitech-blue focus:outline-none focus:ring-2 focus:ring-epitech-blue/50 sm:text-sm"
                placeholder="Mot de passe"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
            <div className="relative">
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="relative block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-500 transition-all focus:border-epitech-blue focus:outline-none focus:ring-2 focus:ring-epitech-blue/50 sm:text-sm"
                placeholder="Confirmez votre mot de passe"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-xl bg-epitech-blue px-4 py-3 text-sm font-bold text-white transition-all hover:bg-epitech-blue-hover focus:outline-none focus:ring-2 focus:ring-epitech-blue/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Inscription..." : "Sign up"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-medium text-epitech-blue hover:text-epitech-blue-hover transition-colors"
            >
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
