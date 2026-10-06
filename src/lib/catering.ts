import { createClient } from "@supabase/supabase-js";
import { DISHDATA_SLUG } from "@/lib/supabase";

// Server-side read of the public catering catalogue. Same sources as the
// DishData catering page: the security-definer function `catering_menu` (which
// already leaves out dishes hidden from catering and tournament items) plus the
// restaurant's own spend-tier discounts and category order from orgs.settings.

export interface CateringDish {
  id: string;
  name: string;
  name_de: string | null;
  description: string | null;
  description_de: string | null;
  category: string;
  category_de: string | null;
  price: number;
  emoji: string | null;
  image_url: string | null;
  diet: "veg" | "vegan" | null;
}

export interface CateringTier {
  minSpend: number;
  discountPct: number;
}

export interface CateringMenu {
  currency: string;
  tiers: CateringTier[];
  categoryOrder: string[];
  dishes: CateringDish[];
}

const DEFAULT_TIERS: CateringTier[] = [
  { minSpend: 150, discountPct: 5 },
  { minSpend: 300, discountPct: 10 },
  { minSpend: 500, discountPct: 15 },
];

function tiersFrom(settings: unknown): CateringTier[] {
  const raw = (settings as { cateringTiers?: unknown } | null)?.cateringTiers;
  if (!Array.isArray(raw)) return DEFAULT_TIERS;
  const valid = raw.filter(
    (t): t is CateringTier => !!t && typeof t.minSpend === "number" && typeof t.discountPct === "number",
  );
  return valid.length ? valid.sort((a, b) => a.minSpend - b.minSpend) : DEFAULT_TIERS;
}

export async function fetchCateringMenu(): Promise<CateringMenu | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !DISHDATA_SLUG) return null;
  try {
    const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: org, error: orgErr } = await sb
      .from("orgs")
      .select("currency, settings")
      .eq("slug", DISHDATA_SLUG)
      .maybeSingle();
    if (orgErr || !org) throw orgErr ?? new Error("restaurant not found");
    const { data, error } = await sb.rpc("catering_menu", { _slug: DISHDATA_SLUG });
    if (error) throw error;
    const order = (org.settings as { categoryOrder?: unknown } | null)?.categoryOrder;
    const dishes = ((data as Record<string, unknown>[] | null) ?? []).map((r) => ({
      id: String(r.id),
      name: String(r.name),
      name_de: (r.name_de as string | null) ?? null,
      description: (r.description as string | null) ?? null,
      description_de: (r.description_de as string | null) ?? null,
      category: String(r.category),
      category_de: (r.category_de as string | null) ?? null,
      price: Number(r.price) || 0,
      emoji: (r.emoji as string | null) ?? null,
      image_url: (r.image_url as string | null) ?? null,
      diet: (r.diet as CateringDish["diet"]) ?? null,
    }));
    return {
      currency: (org.currency as string) || "EUR",
      tiers: tiersFrom(org.settings),
      categoryOrder: Array.isArray(order) ? order.filter((c): c is string => typeof c === "string") : [],
      dishes,
    };
  } catch (e) {
    console.error("[catering] fetch failed", e);
    return null;
  }
}

const LAST_BY_DEFAULT = /beverage|drink|getr(ä|ae)nk/i;

/** The restaurant's own category order first; anything unplaced follows, drinks last. */
export function orderCategories(present: string[], explicit: string[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const c of explicit) {
    if (present.includes(c) && !seen.has(c)) {
      ordered.push(c);
      seen.add(c);
    }
  }
  const rest = present.filter((c) => !seen.has(c));
  return [...ordered, ...rest.filter((c) => !LAST_BY_DEFAULT.test(c)), ...rest.filter((c) => LAST_BY_DEFAULT.test(c))];
}
