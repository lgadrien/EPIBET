import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Flame, Coins, Calendar, Mail, Settings } from "lucide-react";
import AvatarUpload from "./AvatarUpload";
import EditableField from "./EditableField";

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch complete profile from public.users table
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return (
      <div className="flex min-h-[calc(100vh-144px)] items-center justify-center">
        <p className="text-xl text-gray-400">Profil introuvable.</p>
      </div>
    );
  }

  const joinDate = new Date(profile.registration_date).toLocaleDateString(
    "fr-FR",
    {
      month: "long",
      year: "numeric",
    },
  );

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl flex flex-col items-center text-center">
        {/* Avatar & Identité */}
        <div className="mb-8 flex flex-col items-center">
          <AvatarUpload uid={profile.id} url={profile.avatar_url} pseudo={profile.pseudo} />
          
          <div className="mt-6 h-[40px] flex items-center justify-center">
            <EditableField 
              uid={profile.id} 
              field="pseudo" 
              initialValue={profile.pseudo} 
              isAuthField={true}
              className="justify-center"
              textClass="text-4xl font-semibold tracking-tight text-white"
            />
          </div>
          
          <div className="mt-3 flex items-center justify-center gap-1 text-lg text-gray-400 capitalize">
            <EditableField 
              uid={profile.id} 
              field="prénom" 
              initialValue={profile.prénom} 
              isAuthField={true}
            />
            <EditableField 
              uid={profile.id} 
              field="nom" 
              initialValue={profile.nom} 
              isAuthField={true}
            />
          </div>
        </div>

        {/* Statistiques Minimalistes */}
        <div className="flex items-center gap-12 border-y border-white/10 py-6 mb-12 w-full justify-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium uppercase tracking-wider text-gray-400">
                Épicoins
              </span>
            </div>
            <span className="text-3xl font-bold text-white">
              {profile.epicoins.toLocaleString()}
            </span>
          </div>

          <div className="h-12 w-px bg-white/10"></div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium uppercase tracking-wider text-gray-400">
                Série Active
              </span>
            </div>
            <span className="text-3xl font-bold text-white">
              {profile.streak}{" "}
              <span className="text-lg font-normal text-gray-500">jours</span>
            </span>
          </div>
        </div>

        {/* Informations */}
        <div className="w-full max-w-md space-y-6 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-400">
              <Mail className="h-5 w-5" />
              <span className="text-sm font-medium">Adresse email</span>
            </div>
            <EditableField 
              uid={profile.id} 
              field="email" 
              type="email"
              initialValue={profile.email} 
              isAuthField={true}
              className="justify-end"
              textClass="text-sm text-gray-200"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-400">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Membre depuis</span>
            </div>
            <span className="text-sm text-gray-200 capitalize">{joinDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
