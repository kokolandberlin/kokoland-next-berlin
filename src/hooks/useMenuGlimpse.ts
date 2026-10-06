"use client";

import { useEffect, useState } from "react";
import { supabasePublic as supabase, DISHDATA_SLUG } from "@/lib/supabase";
import { RECIPE_COLUMNS, mapRecipe, sampleWeekly, weeklyFrom, type MenuDish, type WeeklyDish, type WeeklyDishRow } from "@/lib/menu";
import { dishes as staticDishes } from "@/data/menu";

export interface Glimpse {
  loading: boolean;
  weekly: WeeklyDish | null;
  picks: MenuDish[];
  total: number;
}

const DRINK = /beverage|drink|getr(ä|ae)nk/i;

// A short look at the live menu for the home page: the dish of the week plus a
// few live dishes (with photos first), never drinks.
export const useMenuGlimpse = (): Glimpse => {
  const [state, setState] = useState<Glimpse>({ loading: true, weekly: null, picks: [], total: 0 });

  useEffect(() => {
    let active = true;
    (async () => {
      let dishes: MenuDish[] = [];
      let weekly: WeeklyDish | null = null;

      if (DISHDATA_SLUG) {
        const { data: org } = await supabase.from("orgs").select("id").eq("slug", DISHDATA_SLUG).maybeSingle();
        if (org) {
          const [recipes, eventItems, rows] = await Promise.all([
            supabase.from("recipes").select(RECIPE_COLUMNS).eq("org_id", org.id).eq("is_active", true).not("name", "ilike", "%(Tournament)%").order("category"),
            supabase.from("event_menu_items").select("recipe_id").eq("org_id", org.id),
            supabase.from("weekly_dish").select("starts_on, recipe_id, headline, region, story").eq("org_id", org.id),
          ]);
          const eventOnly = new Set((eventItems.data ?? []).map((e) => e.recipe_id as string));
          dishes = ((recipes.data as Record<string, unknown>[] | null) ?? []).map(mapRecipe).filter((d) => !eventOnly.has(d.id));
          if (!rows.error) weekly = weeklyFrom((rows.data as WeeklyDishRow[] | null) ?? [], new Map(dishes.map((d) => [d.id, d])));
        }
      }
      if (dishes.length === 0) {
        dishes = staticDishes.slice(0, 8).map((d) => ({
          id: d.id ?? d.name, name: d.name, name_de: null, description: d.desc, description_de: null,
          category: d.type, category_de: null, price: d.price, emoji: null, image_url: null,
          diet: d.vegan ? "vegan" : d.category === "veg" ? "veg" : null, soldOut: false,
        }));
      }

      weekly = weekly ?? sampleWeekly(dishes);
      const food = dishes.filter((d) => !DRINK.test(d.category) && !d.soldOut && d.id !== weekly?.dish.id);
      const picks = [...food].sort((a, b) => Number(!!b.image_url) - Number(!!a.image_url)).slice(0, 4);
      if (active) setState({ loading: false, weekly, picks, total: dishes.length });
    })();
    return () => {
      active = false;
    };
  }, []);

  return state;
};
