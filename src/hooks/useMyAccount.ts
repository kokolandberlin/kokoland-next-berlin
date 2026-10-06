"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase, isSupabaseConfigured, DISHDATA_SLUG } from "@/lib/supabase";

export interface MyOrderLine {
  recipe_id?: string;
  name: string;
  qty: number;
  price?: number;
}

export interface MyOrder {
  id: string;
  order_number: string;
  order_type: "dine_in" | "takeaway" | "delivery";
  total: number;
  status: "open" | "paid" | "void" | "refunded";
  payment_state: "awaiting" | "paid" | null;
  created_at: string;
  scheduled_for: string | null;
  items: MyOrderLine[];
  party_size: number | null;
}

export interface MyAccount {
  customer: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    birthday: string | null;
    newsletter_opt_in: boolean;
    points: number;
    status_points: number;
    tier: string;
    tier_id: string | null;
    visits: number;
    total_spend: number;
  };
  program: { enabled: boolean; points_name: string; tier_basis: "lifetime" | "rolling_12mo" | "spend" } | null;
  tiers: { id: string; name: string; threshold: number; color: string | null; sort_order: number }[];
  rewards: { id: string; label: string; description: string | null; cost_points: number; reward_type: string; value: number; min_tier_id: string | null }[];
  earn_rules: { action_type: string; label: string; points: number }[];
  vouchers: { code: string; label: string | null; expires_at: string | null }[];
  orders: MyOrder[];
}

/** The signed-in guest's DishData customer record: points, tier, vouchers and order history. */
export function useMyAccount() {
  const { session } = useAuth();
  const [account, setAccount] = useState<MyAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    if (!session || !isSupabaseConfigured || !DISHDATA_SLUG) {
      setAccount(null);
      return;
    }
    setLoading(true);
    const { data, error: e } = await supabase.rpc("get_my_account", { _slug: DISHDATA_SLUG });
    setLoading(false);
    if (e) {
      setError(e.message);
      return;
    }
    setError("");
    setAccount(data as MyAccount);
  }, [session]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { account, loading, error, reload };
}
