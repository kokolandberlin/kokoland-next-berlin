"use client";

import { useEffect, useState } from "react";
import { supabasePublic as supabase, DISHDATA_SLUG } from "@/lib/supabase";
import { Dish, DishDataRecipe, recipeToDish } from "@/lib/types";
import { dishes as rawStaticDishes } from "@/data/menu";

const staticDishes: Dish[] = rawStaticDishes.map((d) => ({ ...d, id: d.id ?? d.name }));

type UseMenu = {
  dishes: Dish[];
  loading: boolean;
  // "live" when served from DishData, "fallback" when the static list is used
  source: "live" | "fallback";
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

      const { data, error } = await supabase
        .from("recipes")
        .select("id, name, category, price, emoji, image_url")
        .eq("org_id", org.id)
        .eq("is_active", true)
        .order("category");

      if (!active) return;
      if (error || !data || data.length === 0) {
        setDishes(staticDishes);
        setSource("fallback");
      } else {
        setDishes((data as DishDataRecipe[]).map(recipeToDish));
        setSource("live");
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { dishes, loading, source };
};
