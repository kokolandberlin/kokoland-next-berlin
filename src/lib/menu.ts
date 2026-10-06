import { createClient } from "@supabase/supabase-js";
import { DISHDATA_SLUG } from "@/lib/supabase";
import { dishes as staticDishes } from "@/data/menu";
import { photoForDish, looseDishPhoto } from "@/data/food-photos";

// The public menu as the /menu page and the home glimpse see it: live dishes
// from DishData plus the week's featured dishes (planned in Marketing → This
// week). Reads go through the anon key; RLS decides what is public.

export interface MenuDish {
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
  soldOut: boolean;
}

export interface WeeklyDish {
  startsOn: string;
  dish: MenuDish;
  headline: string | null;
  region: string | null;
  story: string | null;
}

export interface MenuData {
  dishes: MenuDish[];
  categoryOrder: string[];
  /** The dish spotlighted for the week running today, or null when none is planned. */
  weekly: WeeklyDish | null;
  live: boolean;
}

export const RECIPE_COLUMNS = "id,name,name_de,description,description_de,category,category_de,price,emoji,image_url,diet,sold_out_until";

export function mapRecipe(r: Record<string, unknown>): MenuDish {
  const until = r.sold_out_until ? new Date(String(r.sold_out_until)).getTime() : 0;
  return {
    id: String(r.id),
    name: String(r.name),
    name_de: (r.name_de as string | null) ?? null,
    description: (r.description as string | null) ?? null,
    description_de: (r.description_de as string | null) ?? null,
    category: String(r.category),
    category_de: (r.category_de as string | null) ?? null,
    price: Number(r.price) || 0,
    emoji: (r.emoji as string | null) ?? null,
    // Our studio photo of the exact dish first, then the photo held in DishData, then a near match.
    image_url: photoForDish(String(r.name))?.src ?? (r.image_url as string | null) ?? looseDishPhoto(String(r.name))?.src ?? null,
    diet: (r.diet as MenuDish["diet"]) ?? null,
    soldOut: until > Date.now(),
  };
}

const TYPE_LABEL = { starter: "Starters", main: "Mains", side: "Sides", dessert: "Desserts", drink: "Drinks" } as const;

const fallback = (): MenuData => ({
  dishes: staticDishes.map((d) => ({
    id: d.id ?? d.name,
    name: d.name,
    name_de: null,
    description: d.desc,
    description_de: null,
    category: TYPE_LABEL[d.type],
    category_de: null,
    price: d.price,
    emoji: null,
    image_url: null,
    diet: d.vegan ? "vegan" : d.category === "veg" ? "veg" : null,
    soldOut: false,
  })),
  categoryOrder: [],
  weekly: null,
  live: false,
});

/**
 * Preview aid: with NEXT_PUBLIC_SAMPLE_WEEKLY_DISH=1 (set only in a local launch
 * config) a sample dish of the week is shown when none is planned, so the layout
 * can be reviewed before the weekly_dish table exists. Unset everywhere else.
 */
export function sampleWeekly(dishes: MenuDish[]): WeeklyDish | null {
  if (process.env.NEXT_PUBLIC_SAMPLE_WEEKLY_DISH !== "1") return null;
  const dish = dishes.find((d) => d.image_url && /porotta.*beef/i.test(d.name)) ?? dishes.find((d) => d.image_url);
  if (!dish) return null;
  const monday = new Date();
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return {
    startsOn: monday.toLocaleDateString("en-CA"),
    dish,
    headline: "Porotta and beef, Kerala's late-night love story",
    region: "Kerala",
    story:
      "Flip a ball of dough, slap it against the counter until the layers fan out, and cook it on a hot griddle until it turns golden and flaky. That is porotta, and in Kerala it comes with beef: fried dry with coconut slices, black pepper and curry leaves, or simmered into a rich, dark curry.\n\nYou find the pair at the tin-roof thattukada stalls that stay open late, and in tea shops from Kozhikode to Kollam. It is the meal people crave after a film, after a long day, or just because.\n\nTear the porotta by hand, scoop up the beef, and don't be shy with the gravy.",
  };
}

export type WeeklyDishRow = {
  starts_on: string;
  recipe_id: string;
  headline: string | null;
  region: string | null;
  story: string | null;
};

/** The dish of the week from raw rows. It must still be a live dish on the menu. */
export function weeklyFrom(rows: WeeklyDishRow[], byId: Map<string, MenuDish>): WeeklyDish | null {
  const row = [...rows].sort((a, b) => b.starts_on.localeCompare(a.starts_on)).find((r) => byId.has(r.recipe_id));
  if (!row) return null;
  return { startsOn: row.starts_on, dish: byId.get(row.recipe_id)!, headline: row.headline, region: row.region, story: row.story };
}

export async function fetchMenu(): Promise<MenuData> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !DISHDATA_SLUG) return fallback();
  try {
    const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: org, error: orgErr } = await sb.from("orgs").select("id, settings").eq("slug", DISHDATA_SLUG).maybeSingle();
    if (orgErr || !org) throw orgErr ?? new Error("restaurant not found");

    const [recipes, eventItems, specials] = await Promise.all([
      sb.from("recipes").select(RECIPE_COLUMNS).eq("org_id", org.id).eq("is_active", true).not("name", "ilike", "%(Tournament)%").order("category").order("name"),
      sb.from("event_menu_items").select("recipe_id").eq("org_id", org.id),
      sb.from("weekly_dish").select("starts_on, recipe_id, headline, region, story").eq("org_id", org.id),
    ]);
    if (recipes.error) throw recipes.error;
    const eventOnly = new Set((eventItems.data ?? []).map((e) => e.recipe_id as string));
    const dishes = ((recipes.data as Record<string, unknown>[] | null) ?? []).map(mapRecipe).filter((d) => !eventOnly.has(d.id));
    if (dishes.length === 0) return fallback();

    const order = (org.settings as { categoryOrder?: unknown } | null)?.categoryOrder;
    return {
      dishes,
      categoryOrder: Array.isArray(order) ? order.filter((c): c is string => typeof c === "string") : [],
      // A missing table (migration not applied yet) just means no dish of the week.
      weekly: (specials.error ? null : weeklyFrom((specials.data as WeeklyDishRow[] | null) ?? [], new Map(dishes.map((d) => [d.id, d])))) ?? sampleWeekly(dishes),
      live: true,
    };
  } catch (e) {
    console.error("[menu] fetch failed", e);
    return fallback();
  }
}
