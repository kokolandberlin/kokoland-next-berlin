import { createClient } from "@supabase/supabase-js";

// Kokoland points at DishData's Supabase project — DishData is the single
// backend (menu, orders, loyalty, delivery zones). Set these in .env.local:
//   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
// The anon/publishable key is safe in the browser — access is gated by RLS,
// and storefront writes go through SECURITY DEFINER RPCs (place_public_order…).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

// This restaurant's org slug inside DishData — resolves menu/recipes and is
// passed to place_public_order/get_public_order_status. Real value is
// "kokoland-berlin" (NOT "kokoland" — see .env.example).
export const DISHDATA_SLUG = process.env.NEXT_PUBLIC_DISHDATA_SLUG || "";

if (!isSupabaseConfigured && process.env.NODE_ENV !== "production") {
  console.warn(
    "[kokoland] Supabase not configured — set NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local. The menu will use the static fallback.",
  );
}

// Falls back to a syntactically-valid placeholder so createClient never throws;
// requests simply fail and the app degrades gracefully (static menu, no offers).
export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  anonKey || "placeholder-anon-key",
  {
    auth: {
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);

/**
 * For anything a visitor can do without being signed in (menu, events, reservations, orders,
 * catering). It never carries a login token: a stale or expired one from a signed-in guest would
 * make these calls fail (the menu fell back to the static list), while the public data does not
 * need it. Account features keep using `supabase` above.
 */
export const supabasePublic = createClient(url || "https://placeholder.supabase.co", anonKey || "placeholder-anon-key", {
  auth: { persistSession: false, autoRefreshToken: false },
});
