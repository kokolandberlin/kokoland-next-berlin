"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type DeliveryZone = {
  id: string;
  postcode: string;
  min_order: number;
  delivery_fee: number;
  is_active: boolean;
};

export const useDeliveryZones = () => {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    let active = true;
    supabase
      .from("delivery_zones")
      .select("*")
      .eq("is_active", true)
      .order("postcode")
      .then(({ data }) => {
        if (active) setZones((data as DeliveryZone[]) ?? []);
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const findZone = (postcode: string) =>
    zones.find((z) => z.postcode.replace(/\s/g, "").toLowerCase() === postcode.replace(/\s/g, "").toLowerCase());

  return { zones, loading, findZone };
};