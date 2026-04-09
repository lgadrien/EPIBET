"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";


export async function signUpAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;
  const nom = formData.get("nom") as string;
  const prenom = formData.get("prenom") as string;
  const pseudo = formData.get("pseudo") as string;
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password || !nom || !prenom || !pseudo) {
    return { error: "Tous les champs sont obligatoires." };
  }

  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  // 1. Sign up user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        nom,
        prenom,
        pseudo,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  redirect("/login?message=Check your email to continue registration");
}

export async function signInAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rememberMe = formData.get("remember-me") === "on";

  // Sauvegarde le choix de l'utilisateur dans un cookie
  const cookieStore = await cookies();
  cookieStore.set("eb_remember", rememberMe ? "true" : "false", { path: "/", maxAge: 60 * 60 * 24 * 30 }); // Valable 30 jours

  const supabase = await createClient();


  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/home");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
