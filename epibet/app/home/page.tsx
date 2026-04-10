import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch events with their odds
  const { data: events } = await supabase
    .from("events")
    .select(`
      *,
      odds (*)
    `)
    .eq("status", "scheduled")
    .order("start_time", { ascending: true });

  // Fetch user profile for epicoins
  const { data: profile } = await supabase
    .from("users")
    .select("epicoins")
    .eq("id", user.id)
    .single();

  return (
    <DashboardClient 
      initialEvents={events || []} 
      userEpicoins={profile?.epicoins ?? 0}
    />
  );
}
