import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            const rememberMe = cookieStore.get("eb_remember")?.value;
            cookiesToSet.forEach(({ name, value, options }) => {
              const opts = { ...options };
              // Si la case "Se souvenir de moi" n'était pas cochée, on en fait un cookie de session
              if (rememberMe === "false" && name.startsWith("sb-")) {
                delete opts.maxAge;
                delete (opts as any).expires;
              }
              cookieStore.set(name, value, opts);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
