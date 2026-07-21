"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Star, Gift, LogOut, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOffers } from "@/hooks/useOffers";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

type CustomerPoints = {
  id: string;
  email: string;
  name: string | null;
  points: number;
  tier: string;
  total_orders: number;
};

type Reward = {
  id: string;
  label: string;
  description: string | null;
  cost_points: number;
  reward_type: string;
  value: number;
  is_active: boolean;
};

type Activity = {
  id: string;
  description: string;
  points: number;
  created_at: string;
};

const TIERS = [
  { name: "Bronze", min: 0, max: 499, next: 500 },
  { name: "Silver", min: 500, max: 999, next: 1000 },
  { name: "Gold", min: 1000, max: 1999, next: 2000 },
  { name: "Platinum", min: 2000, max: Infinity, next: Infinity },
];

const tierColor = (tier: string) => {
  if (tier === "Gold" || tier === "Platinum") return "text-lime";
  if (tier === "Silver") return "text-cream/80";
  return "text-cream/60";
};

const Account = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { session, user, loading: authLoading, signOut } = useAuth();
  const { offers } = useOffers();

  const [customer, setCustomer] = useState<CustomerPoints | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [redeemMsg, setRedeemMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;
    let active = true;

    const load = async () => {
      setLoadingData(true);

      if (!isSupabaseConfigured) {
        if (active) setLoadingData(false);
        return;
      }

      const [{ data: cp }, { data: rw }, { data: ac }] = await Promise.all([
        supabase.from("customer_points").select("*").eq("email", user.email!).maybeSingle(),
        supabase.from("rewards").select("*").eq("is_active", true).order("cost_points"),
        supabase
          .from("points_activity")
          .select("*")
          .eq("email", user.email!)
          .order("created_at", { ascending: false })
          .limit(10),
      ]);

      if (!active) return;
      setCustomer((cp as CustomerPoints) ?? null);
      setRewards((rw as Reward[]) ?? []);
      setActivity((ac as Activity[]) ?? []);
      setLoadingData(false);
    };

    load();
    return () => { active = false; };
  }, [user?.email]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-lime" />
      </div>
    );
  }

  if (!session) {
    if (typeof window !== "undefined") router.replace("/auth?redirect=/account");
    return null;
  }

  const points = customer?.points ?? 0;
  const tier = customer?.tier ?? "Bronze";
  const currentTierDef = TIERS.find((t) => t.name === tier) ?? TIERS[0];
  const nextTierPoints = currentTierDef.next === Infinity ? null : currentTierDef.next;
  const progressPct = nextTierPoints
    ? Math.min(100, Math.round(((points - currentTierDef.min) / (nextTierPoints - currentTierDef.min)) * 100))
    : 100;

  const handleRedeem = (reward: Reward) => {
    if (points < reward.cost_points) return;
    const code = `KOK-${reward.id.slice(0, 6).toUpperCase()}`;
    setRedeemMsg(`${t("account.redeem_confirm") || "Show this code at the counter:"} ${code}`);
    setTimeout(() => setRedeemMsg(null), 8000);
  };

  const earnActions = [
    { label: "Place an order", points: "+10 pts" },
    { label: "Leave a review", points: "+25 pts" },
    { label: "Subscribe to newsletter", points: "+15 pts" },
    { label: "Birthday bonus", points: "+50 pts" },
    { label: "Refer a friend", points: "+100 pts" },
  ];

  return (
    <div className="min-h-screen bg-forest text-cream">
      <div className="max-w-2xl mx-auto px-5 py-12 space-y-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-cream/60 hover:text-lime transition-colors"
        >
          ← Back to menu
        </Link>

        {/* Welcome */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-lime mb-1">
            {t("account.title") || "My Account"}
          </p>
          <h1 className="font-display font-extrabold text-4xl">{user?.email}</h1>
        </div>

        {/* Loyalty card */}
        <div className="rounded-3xl bg-forest border-2 border-lime/30 p-7 space-y-4 soft-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-cream/65 text-sm">{t("account.tier") || "Tier"}</p>
              <p className={`font-display font-extrabold text-3xl ${tierColor(tier)}`}>{tier}</p>
            </div>
            <div className="text-right">
              <p className="text-cream/65 text-sm">{t("account.points") || "points"}</p>
              <p className="font-display font-extrabold text-3xl text-lime">{points.toLocaleString()}</p>
            </div>
          </div>

          {nextTierPoints && (
            <div className="space-y-2">
              <div className="w-full h-2 rounded-full bg-cream/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-lime transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-cream/65">
                {nextTierPoints - points} {t("account.next_tier") || "until next tier"} (
                {TIERS[(TIERS.findIndex((t) => t.name === tier) + 1) % TIERS.length]?.name})
              </p>
            </div>
          )}
        </div>

        {/* Redeem message */}
        {redeemMsg && (
          <div className="rounded-2xl bg-lime/15 border border-lime/40 px-5 py-4 text-lime text-sm font-medium">
            {redeemMsg}
          </div>
        )}

        {/* Rewards */}
        {rewards.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl flex items-center gap-2">
              <Gift className="w-5 h-5 text-lime" /> {t("account.rewards") || "Rewards"}
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {rewards.map((reward) => {
                const canRedeem = points >= reward.cost_points;
                return (
                  <div
                    key={reward.id}
                    className={`rounded-2xl border-2 p-5 flex flex-col gap-2 transition-colors ${
                      canRedeem ? "border-lime/40 bg-lime/5" : "border-cream/10"
                    }`}
                  >
                    <p className="font-display font-bold text-lg">{reward.label}</p>
                    {reward.description && (
                      <p className="text-sm text-cream/65">{reward.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span className="text-lime font-semibold text-sm">
                        {reward.cost_points} pts
                      </span>
                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={!canRedeem}
                        className="text-xs font-semibold rounded-full px-4 py-2 bg-lime text-forest hover:bg-chili hover:text-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {canRedeem
                          ? t("account.redeem") || "Redeem"
                          : t("account.not_enough") || "Not enough points"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* How to earn */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl flex items-center gap-2">
            <Star className="w-5 h-5 text-lime" /> {t("account.how_to_earn") || "How to earn"}
          </h2>
          <div className="rounded-2xl border border-cream/10 divide-y divide-cream/10">
            {earnActions.map((action) => (
              <div key={action.label} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm text-cream/70">{action.label}</span>
                <span className="text-xs font-bold text-lime">{action.points}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Activity */}
        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl">{t("account.activity") || "Recent activity"}</h2>
          {loadingData ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-lime/50" />
            </div>
          ) : activity.length === 0 ? (
            <p className="text-cream/60 text-sm">
              {t("account.no_activity") || "No activity yet — start ordering to earn points!"}
            </p>
          ) : (
            <div className="rounded-2xl border border-cream/10 divide-y divide-cream/10">
              {activity.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm">{a.description}</p>
                    <p className="text-xs text-cream/60">
                      {new Date(a.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold ${a.points >= 0 ? "text-lime" : "text-chili-text"}`}
                  >
                    {a.points >= 0 ? "+" : ""}{a.points} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Offers */}
        {offers.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl">{t("account.offers_title") || "Your Offers"}</h2>
            <div className="space-y-2">
              {offers.map((offer) => (
                <div
                  key={offer.id}
                  className="rounded-2xl border border-cream/15 p-4 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-display font-bold">{offer.title}</p>
                    {offer.discount_label && (
                      <p className="text-chili-text text-sm font-bold">{offer.discount_label}</p>
                    )}
                    {offer.code && (
                      <p className="text-xs font-mono bg-cream/10 rounded px-2 py-0.5 inline-block mt-1">
                        {offer.code}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-cream/30 shrink-0" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sign out */}
        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 text-sm text-cream/65 hover:text-chili-text transition-colors"
        >
          <LogOut className="w-4 h-4" /> {t("account.sign_out") || "Sign out"}
        </button>
      </div>
    </div>
  );
};

export default Account;