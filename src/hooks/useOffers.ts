"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Offer } from "@/lib/types";

// Public offers. RLS already restricts anon reads to active, in-window offers,
// so we just select all the caller is allowed to see.
export const useOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("offers")
        .select("*")
        .order("created_at", { ascending: false });
      if (!active) return;
      setOffers(error || !data ? [] : (data as Offer[]));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { offers, loading };
};