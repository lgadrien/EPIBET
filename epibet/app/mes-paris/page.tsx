import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BetsHistory from "./BetsHistory";

export default async function MyBetsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch bets with joined odds and events
  const { data: bets } = await supabase
    .from("bets")
    .select(`
      id,
      amount_wagered,
      locked_multiplier,
      status,
      placed_at,
      odd:odds (
        option_name,
        event:events (
          title,
          category
        )
      )
    `)
    .eq("user_id", user.id)
    .order("placed_at", { ascending: false });

  return (
    <div className="min-h-screen bg-black pt-20">
      <BetsHistory initialBets={bets || []} />
    </div>
  );
}
