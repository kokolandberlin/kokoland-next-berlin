"use client";

import { useEffect, useState } from "react";
import { supabase, DISHDATA_SLUG } from "@/lib/supabase";
import { Dish, DishDataRecipe, recipeToDish } from "@/lib/types";
import { dishes as rawStaticDishes } from "@/data/menu";

const staticDishes: Dish[] = rawStaticDishes.map((d) => ({ ...d, id: d.id ?? d.name }));

type UseMenu = {
  dishes: Dish[];
  loading: boolean;
  // "live" when served from DishData, "fallback" when the static list is used
  source: "live" | "fallback";
  /** Name of the event menu currently driving the site, when one is public. */
  eventMenuName: string | null;
};

// Public menu — reads active recipes from DishData (the actual POS menu
// table, not a separate "menu_items" table). Falls back to the bundled
// static menu if the org slug isn't configured, the org has no active
// recipes yet (e.g. a freshly onboarded client hasn't entered a menu), or
// the request fails — so the site never shows an empty page.
export const useMenu = (): UseMenu => {
  const [dishes, setDishes] = useState<Dish[]>(staticDishes);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"live" | "fallback">("fallback");
  const [eventMenuName, setEventMenuName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!DISHDATA_SLUG) {
        if (active) {
          setDishes(staticDishes);
          setSource("fallback");
          setLoading(false);
        }
        return;
      }

      const { data: org } = await supabase
        .from("orgs")
        .select("id")
        .eq("slug", DISHDATA_SLUG)
        .maybeSingle();

      if (!active) return;
      if (!org) {
        setDishes(staticDishes);
        setSource("fallback");
        setLoading(false);
        return;
      }

      // An event menu marked "show on website" takes over the public menu while
      // it's active (e.g. a popup or tournament). RLS only exposes active+public
      // ones to anon, so this returns nothing for staff-only event menus.
      const { data: eventMenus } = await supabase
        .from("event_menus")
        .select("name, event_menu_items(recipe_id)")
        .eq("org_id", org.id)
        .eq("is_active", true)
        .eq("show_on_website", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!active) return;
      const eventMenu = eventMenus?.[0] as
        | { name: string; event_menu_items: { recipe_id: string }[] }
        | undefined;
      const eventRecipeIds = (eventMenu?.event_menu_items ?? []).map((i) => i.recipe_id);

      let recipesQuery = supabase
        .from("recipes")
        .select("id, name, category, price, emoji, image_url")
        .eq("org_id", org.id)
        .eq("is_active", true);

      // Only narrow to the event menu if it actually has dishes — an empty one
      // would otherwise blank the whole menu.
      if (eventRecipeIds.length > 0) {
        recipesQuery = recipesQuery.in("id", eventRecipeIds);
      }

      const { data, error } = await recipesQuery.order("category");

      if (!active) return;
      if (error || !data || data.length === 0) {
        setDishes(staticDishes);
        setSource("fallback");
        setEventMenuName(null);
      } else {
        setDishes((data as DishDataRecipe[]).map(recipeToDish));
        setSource("live");
        setEventMenuName(eventRecipeIds.length > 0 ? (eventMenu?.name ?? null) : null);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { dishes, loading, source, eventMenuName };
};
