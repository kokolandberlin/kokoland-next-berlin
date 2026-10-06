"use client";

import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured, DISHDATA_SLUG } from "@/lib/supabase";

/**
 * True once the restaurant has finished connecting Stripe in DishData
 * (orgs.settings.payments.charges_enabled). Until then the checkout offers
 * pay-at-restaurant only, exactly as before.
 */
export function usePaymentsEnabled(active: boolean) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!active || !isSupabaseConfigured || !DISHDATA_SLUG) return;
    let cancelled = false;
    supabase
      .from("orgs")
      .select("settings")
      .eq("slug", DISHDATA_SLUG)
      .maybeSingle()
      .then(({ data }) => {
        const p = (data?.settings as { payments?: { charges_enabled?: boolean } } | null)?.payments;
        if (!cancelled) setEnabled(!!p?.charges_enabled);
      });
    return () => {
      cancelled = true;
    };
  }, [active]);

  return enabled;
}
