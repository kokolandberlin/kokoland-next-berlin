"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Gift, Loader2, RotateCcw, Download, Trash2, CalendarClock, Percent, Euro, Ticket, LogOut, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { plates } from "@/data/food-photos";
import { DELIVERY_LIVE } from "@/lib/site";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useMyAccount, type MyOrder } from "@/hooks/useMyAccount";
import { supabase, DISHDATA_SLUG } from "@/lib/supabase";
import { formatEur } from "@/data/menu";

const strings = (de: boolean) =>
  de
    ? {
        back: "← Zur Startseite",
        hi: (n: string) => `Hallo, ${n}`,
        member: "kokoland Mitglied",
        visits: "Besuche",
        spent: "Ausgegeben",
        vouchersN: "Gutscheine",
        pointsToGo: (n: number) => `Noch ${n} Punkte`,
        ready: "Einlösbar",
        yourPoints: "Deine Punkte",
        title: "Mein Konto",
        signOut: "Abmelden",
        tier: "Stufe",
        points: "Punkte",
        toNext: (n: number, t: string) => `Noch ${n} bis ${t}`,
        topTier: "Höchste Stufe erreicht",
        rewards: "Prämien",
        redeem: "Einlösen",
        needMore: "Zu wenige Punkte",
        tierLocked: "Höhere Stufe nötig",
        voucherNote: "Gib diesen Code beim Bestellen im Feld „Rabattcode“ ein:",
        vouchers: "Meine Gutscheine",
        validUntil: "gültig bis",
        earn: "So sammelst du Punkte",
        upcoming: "Bevorstehend",
        history: "Meine Bestellungen",
        none: "Noch keine Bestellungen. Bestell etwas Leckeres und sammle Punkte.",
        reorder: "Nochmal bestellen",
        reorderMissing: "Einige Gerichte sind gerade nicht verfügbar.",
        guests: "Personen",
        profile: "Meine Daten",
        name: "Name",
        phone: "Telefon",
        birthday: "Geburtstag (für ein Geschenk)",
        newsletter: "Neuigkeiten und Aktionen per E-Mail erhalten",
        save: "Speichern",
        saved: "Gespeichert",
        privacy: "Datenschutz",
        exportData: "Meine Daten herunterladen",
        deleteAccount: "Konto löschen",
        deleteConfirm: "Konto wirklich löschen? Deine Daten werden entfernt, Punkte und Gutscheine verfallen. Das kann nicht rückgängig gemacht werden.",
        error: "Das hat nicht geklappt. Bitte versuche es nochmal.",
        loadError: "Dein Konto konnte nicht geladen werden.",
      }
    : {
        back: "← Back to home",
        hi: (n: string) => `Hi, ${n}`,
        member: "kokoland member",
        visits: "Visits",
        spent: "Spent",
        vouchersN: "Vouchers",
        pointsToGo: (n: number) => `${n} points to go`,
        ready: "Ready to redeem",
        yourPoints: "Your points",
        title: "My account",
        signOut: "Sign out",
        tier: "Tier",
        points: "points",
        toNext: (n: number, t: string) => `${n} to go until ${t}`,
        topTier: "Top tier reached",
        rewards: "Rewards",
        redeem: "Redeem",
        needMore: "Not enough points",
        tierLocked: "Needs a higher tier",
        voucherNote: "Enter this code in the \"Discount code\" field when you order:",
        vouchers: "My vouchers",
        validUntil: "valid until",
        earn: "How to earn points",
        upcoming: "Coming up",
        history: "My orders",
        none: "No orders yet. Order something delicious and start collecting points.",
        reorder: "Order again",
        reorderMissing: "Some dishes are not available right now.",
        guests: "guests",
        profile: "My details",
        name: "Name",
        phone: "Phone",
        birthday: "Birthday (for a treat)",
        newsletter: "Send me news and offers by email",
        save: "Save",
        saved: "Saved",
        privacy: "Privacy",
        exportData: "Download my data",
        deleteAccount: "Delete my account",
        deleteConfirm: "Really delete your account? Your details are removed and points and vouchers are lost. This cannot be undone.",
        error: "That did not work. Please try again.",
        loadError: "We could not load your account.",
      };

// Names that come from DishData's loyalty program are stored in English there. For German visitors
// the standard ones are translated here; anything a restaurant renamed is shown as written.
const DE_LOYALTY: Record<string, string> = {
  "€5 off": "5 € Rabatt",
  "Take €5 off your next order": "5 € Rabatt auf deine nächste Bestellung",
  "10% off": "10 % Rabatt",
  "10% off your whole order": "10 % Rabatt auf deine ganze Bestellung",
  "Free delivery": "Gratis-Lieferung",
  "We cover delivery on your next order": "Wir übernehmen die Lieferung deiner nächsten Bestellung",
  "Make a purchase": "Einkauf",
  "Earn points on every order": "Punkte bei jeder Bestellung",
  "Create an account": "Konto erstellen",
  "Welcome bonus for joining": "Willkommensbonus",
  "Birthday treat": "Geburtstagsgeschenk",
  "Bonus points every birthday": "Bonuspunkte zu jedem Geburtstag",
  "Subscribe to the newsletter": "Newsletter abonnieren",
  "One-time bonus for opting in": "Einmaliger Bonus fürs Anmelden",
  "Follow on Instagram": "Auf Instagram folgen",
  "One-time bonus for following": "Einmaliger Bonus fürs Folgen",
  "Leave a review": "Bewertung schreiben",
  "Thank-you points for feedback": "Dankeschön-Punkte für dein Feedback",
  Silver: "Silber",
  Platinum: "Platin",
};

const Account = () => {
  const { i18n } = useTranslation();
  const de = (i18n.language || "en").startsWith("de");
  const x = strings(de);
  // Translate a loyalty name for German visitors (falls back to the text as stored).
  const tr = (text: string | null | undefined) => (text ? (de ? DE_LOYALTY[text] ?? text : text) : text ?? "");
  const router = useRouter();
  const { session, loading: authLoading, signOut } = useAuth();
  const { account, loading, error, reload } = useMyAccount();
  const { addItem, setQty, setOpen } = useCart();

  const [msg, setMsg] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState("");
  const [form, setForm] = useState<{ name: string; phone: string; birthday: string; newsletter: boolean } | null>(null);
  const [seeded, setSeeded] = useState<string | null>(null);

  if (authLoading) return <Spinner />;
  if (!session) {
    if (typeof window !== "undefined") router.replace("/auth?redirect=/account");
    return null;
  }
  if (!account) {
    return (
      <div className="min-h-screen bg-forest text-cream flex flex-col items-center justify-center gap-4 px-5 text-center">
        {loading ? <Loader2 className="w-8 h-8 animate-spin text-lime" /> : <p>{error ? x.loadError : ""}</p>}
        {error && <p className="text-xs text-cream/50">{error}</p>}
      </div>
    );
  }

  const c = account.customer;
  // Seed the profile form once per loaded customer.
  if (seeded !== c.id) {
    setSeeded(c.id);
    setForm({ name: c.name, phone: c.phone ?? "", birthday: c.birthday ?? "", newsletter: c.newsletter_opt_in });
  }

  const basis = account.program?.tier_basis ?? "lifetime";
  const metric = basis === "spend" ? c.total_spend : c.status_points;
  const sortedTiers = [...account.tiers].sort((a, b) => a.threshold - b.threshold);
  const nextTier = sortedTiers.find((t) => t.threshold > metric);
  const currentTier = [...sortedTiers].reverse().find((t) => t.threshold <= metric) ?? sortedTiers[0];
  const pct = nextTier && currentTier ? Math.min(100, Math.round(((metric - currentTier.threshold) / (nextTier.threshold - currentTier.threshold)) * 100)) : 100;
  const myTierOrder = account.tiers.find((t) => t.id === c.tier_id)?.sort_order ?? -1;
  const tierOrderOf = (id: string | null) => account.tiers.find((t) => t.id === id)?.sort_order ?? 0;

  const now = Date.now();
  const upcoming = account.orders.filter((o) => o.scheduled_for && new Date(o.scheduled_for).getTime() > now - 3 * 3600000 && (o.status === "open" || o.status === "paid"));
  const fmt = (iso: string, withTime = false) =>
    new Date(iso).toLocaleString(de ? "de-DE" : "en-GB", withTime ? { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" } : { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Berlin" });

  const redeem = async (id: string) => {
    setBusy(id);
    setMsg("");
    const { data, error: e } = await supabase.rpc("redeem_my_reward", { _slug: DISHDATA_SLUG, _reward: id });
    setBusy("");
    if (e) return setMsg(e.message);
    setCode((data as { code: string }).code);
    reload();
  };

  const reorder = async (o: MyOrder) => {
    setBusy(o.id);
    setMsg("");
    const ids = o.items.map((l) => l.recipe_id).filter((v): v is string => !!v);
    const { data } = await supabase.from("recipes").select("id,name,price").in("id", ids).eq("is_active", true);
    const live = new Map((data ?? []).map((r) => [r.id as string, r as { id: string; name: string; price: number }]));
    let missing = false;
    for (const l of o.items) {
      const r = l.recipe_id ? live.get(l.recipe_id) : undefined;
      if (!r) { missing = true; continue; }
      addItem(r.id, r.name, Number(r.price));
      setQty(r.name, l.qty);
    }
    setBusy("");
    if (missing) setMsg(x.reorderMissing);
    setOpen(true);
  };

  const saveProfile = async () => {
    if (!form) return;
    setBusy("profile");
    setMsg("");
    const { error: e } = await supabase.rpc("update_my_account", {
      _slug: DISHDATA_SLUG, _name: form.name, _phone: form.phone, _birthday: form.birthday || null, _newsletter: form.newsletter,
    });
    setBusy("");
    if (e) return setMsg(e.message);
    setMsg(x.saved);
    reload();
  };

  const exportData = async () => {
    setBusy("export");
    const { data, error: e } = await supabase.rpc("export_my_data", { _slug: DISHDATA_SLUG });
    setBusy("");
    if (e) return setMsg(x.error);
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "kokoland-my-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = async () => {
    if (!window.confirm(x.deleteConfirm)) return;
    setBusy("delete");
    const { error: e } = await supabase.rpc("delete_my_account");
    if (e) {
      setBusy("");
      return setMsg(e.message);
    }
    await signOut();
    router.replace("/");
  };

  const first = c.name.trim().split(/\s+/)[0] || c.name;
  // Free delivery and free-item rewards are not applied by the order system yet: do not offer them.
  const redeemable = account.rewards.filter((r) => r.reward_type !== "free_item" && (r.reward_type !== "free_delivery" || DELIVERY_LIVE));
  const sortedRewards = [...redeemable].sort((a, b) => Number(c.points >= b.cost_points) - Number(c.points >= a.cost_points) || a.cost_points - b.cost_points);
  const tierColor = currentTier?.color ?? "#C0F252";
  const rewardIcon = (t: string) => (t === "percent_discount" ? Percent : t === "amount_discount" ? Euro : Gift);

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest to-[#0B2F27] text-cream">
      <div className="mx-auto max-w-3xl space-y-10 px-5 py-8 sm:py-12">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="kokoland">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/brand/kokoland-logo-wide.png" alt="kokoland" className="h-8 object-contain" />
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/menu" className="rounded-full bg-lime px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-cream">{de ? "Bestellen" : "Order"}</Link>
            <button onClick={() => signOut().then(() => router.replace("/"))} aria-label={x.signOut} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-cream/20 transition-colors hover:border-lime hover:text-lime"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Greeting */}
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-lime font-display text-3xl font-extrabold text-forest">{first.charAt(0).toUpperCase()}</span>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">{x.member}</p>
              <h1 className="truncate font-display text-3xl font-extrabold leading-tight sm:text-4xl">{x.hi(first)}</h1>
              <p className="truncate text-sm text-cream/55">{c.email}</p>
            </div>
          </div>
        </Reveal>

        {msg && <p role="status" className="rounded-xl bg-lime/10 px-4 py-3 text-sm text-lime">{msg}</p>}

        {account.program?.enabled !== false && (
          <>
            {/* Membership card */}
            <Reveal delay={0.05}>
              <div className="relative overflow-hidden rounded-[2rem] border-2 border-lime/30 bg-gradient-to-br from-[#134033] via-[#0F4A3A] to-[#02664C] p-6 sm:p-8 soft-shadow">
                <motion.img
                  src={plates.kappaFish.src}
                  alt=""
                  aria-hidden
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="pointer-events-none absolute -right-12 -top-12 w-44 opacity-90 drop-shadow-[0_14px_16px_rgba(0,0,0,0.35)] sm:w-56"
                />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-sm font-bold text-forest" style={{ background: tierColor }}>
                    <span className="h-2 w-2 rounded-full bg-forest/70" /> {tr(c.tier)}
                  </span>
                  <p className="mt-6 text-sm text-cream/65">{x.yourPoints}</p>
                  <p className="font-display text-6xl font-extrabold leading-none text-lime sm:text-7xl">{c.points.toLocaleString()}</p>
                  <div className="mt-6 max-w-sm">
                    <div className="h-2.5 overflow-hidden rounded-full bg-cream/15">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: "easeOut" }} className="h-full rounded-full bg-lime" />
                    </div>
                    <p className="mt-2 text-xs text-cream/70">{nextTier ? x.toNext(Math.max(0, Math.ceil(nextTier.threshold - metric)), tr(nextTier.name)) : x.topTier}</p>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3 border-t border-cream/10 pt-5 text-center">
                    {[
                      { v: String(c.visits), l: x.visits },
                      { v: formatEur(c.total_spend), l: x.spent },
                      { v: String(account.vouchers.length), l: x.vouchersN },
                    ].map((t) => (
                      <div key={t.l}>
                        <p className="font-display text-xl font-extrabold">{t.v}</p>
                        <p className="text-[11px] uppercase tracking-widest text-cream/55">{t.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {code && (
              <div className="rounded-2xl border border-lime/40 bg-lime/15 px-5 py-4 text-sm">
                <p className="text-lime">{x.voucherNote}</p>
                <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-lime">{code}</p>
              </div>
            )}

            {/* Rewards */}
            {sortedRewards.length > 0 && (
              <section className="space-y-4">
                <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><Gift className="h-5 w-5 text-lime" /> {x.rewards}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {sortedRewards.map((r, i) => {
                    const locked = r.min_tier_id ? tierOrderOf(r.min_tier_id) > myTierOrder : false;
                    const can = c.points >= r.cost_points && !locked;
                    const Icon = rewardIcon(r.reward_type);
                    return (
                      <Reveal key={r.id} delay={i * 0.05}>
                        <div className={`flex h-full flex-col gap-3 rounded-3xl border-2 p-5 transition-colors ${can ? "border-lime/60 bg-lime/10" : "border-cream/10 bg-cream/[0.03]"}`}>
                          <div className="flex items-start justify-between gap-3">
                            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${can ? "bg-lime text-forest" : "bg-cream/10 text-cream/60"}`}><Icon className="h-5 w-5" /></span>
                            <span className="rounded-full bg-forest/60 px-3 py-1 text-xs font-bold text-lime">{r.cost_points} {x.points}</span>
                          </div>
                          <div>
                            <p className="font-display text-xl font-extrabold">{tr(r.label)}</p>
                            {r.description && <p className="mt-0.5 text-sm text-cream/60">{tr(r.description)}</p>}
                          </div>
                          {!can && !locked && (
                            <div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-cream/10"><div className="h-full rounded-full bg-lime/70" style={{ width: `${Math.min(100, Math.round((c.points / r.cost_points) * 100))}%` }} /></div>
                              <p className="mt-1.5 text-xs text-cream/55">{x.pointsToGo(r.cost_points - c.points)}</p>
                            </div>
                          )}
                          <button
                            disabled={!can || busy === r.id}
                            onClick={() => redeem(r.id)}
                            className="mt-auto rounded-full bg-lime px-4 py-2.5 text-sm font-bold text-forest transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:bg-cream/10 disabled:text-cream/40"
                          >
                            {locked ? x.tierLocked : can ? x.redeem : x.needMore}
                          </button>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Vouchers */}
            {account.vouchers.length > 0 && (
              <section className="space-y-3">
                <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><Ticket className="h-5 w-5 text-lime" /> {x.vouchers}</h2>
                <ul className="space-y-2">
                  {account.vouchers.map((v) => (
                    <li key={v.code} className="flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-lime/40 bg-lime/5 px-5 py-4">
                      <span className="min-w-0">
                        <span className="block font-semibold">{tr(v.label)}</span>
                        {v.expires_at && <span className="text-xs text-cream/55">{x.validUntil} {fmt(v.expires_at)}</span>}
                      </span>
                      <span className="shrink-0 rounded-lg bg-forest px-3 py-1.5 font-mono text-lg font-bold tracking-widest text-lime">{v.code}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-cream/50">{x.voucherNote}</p>
              </section>
            )}
          </>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><CalendarClock className="h-5 w-5 text-lime" /> {x.upcoming}</h2>
            {upcoming.map((o) => (
              <Link key={o.id} href={`/order/${o.id}`} className="flex items-center justify-between rounded-2xl border-2 border-lime/30 bg-lime/5 px-5 py-4 transition-colors hover:border-lime">
                <span>
                  <span className="block font-semibold">{fmt(o.scheduled_for!, true)}</span>
                  <span className="text-sm text-cream/60">{o.order_number}{o.party_size ? ` · ${o.party_size} ${x.guests}` : ""}</span>
                </span>
                <span className="font-display text-lg font-bold text-lime">{formatEur(o.total)}</span>
              </Link>
            ))}
          </section>
        )}

        {/* Orders */}
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold"><Receipt className="h-5 w-5 text-lime" /> {x.history}</h2>
          {account.orders.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-cream/15 px-6 py-10 text-center">
              <p className="text-cream/60">{x.none}</p>
              <Link href="/menu" className="mt-4 inline-block rounded-full bg-lime px-6 py-2.5 text-sm font-semibold text-forest transition-colors hover:bg-cream">{de ? "Zur Speisekarte" : "See the menu"}</Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {account.orders.map((o) => (
                <li key={o.id} className="rounded-3xl border border-cream/12 bg-cream/[0.03] p-5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-cream/55">{o.order_number} · {fmt(o.created_at)}</span>
                    <span className="font-display text-lg font-extrabold text-lime">{formatEur(o.total)}</span>
                  </div>
                  <p className="mt-2 text-[15px] leading-relaxed">{o.items.map((l) => `${l.qty}× ${l.name}`).join(", ")}</p>
                  <button onClick={() => reorder(o)} disabled={busy === o.id} className="mt-4 inline-flex items-center gap-1.5 rounded-full border-2 border-lime px-4 py-1.5 text-sm font-semibold text-lime transition-colors hover:bg-lime hover:text-forest disabled:opacity-50">
                    <RotateCcw className="h-3.5 w-3.5" /> {x.reorder}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* How to earn */}
        {account.program?.enabled !== false && account.earn_rules.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-display text-2xl font-extrabold">{x.earn}</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {account.earn_rules.map((e) => (
                <div key={e.action_type} className="flex items-center justify-between rounded-2xl bg-cream/[0.04] px-4 py-3 text-sm">
                  <span className="text-cream/80">{tr(e.label)}</span>
                  <span className="rounded-full bg-lime/15 px-2.5 py-0.5 font-bold text-lime">+{e.points}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Profile */}
        {form && (
          <section className="space-y-4 rounded-3xl border border-cream/12 bg-cream/[0.03] p-6">
            <h2 className="font-display text-2xl font-extrabold">{x.profile}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={x.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label={x.phone} type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            </div>
            <Field label={x.birthday} type="date" value={form.birthday} onChange={(v) => setForm({ ...form, birthday: v })} />
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={form.newsletter} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} className="h-4 w-4 accent-[#C0F252]" />
              {x.newsletter}
            </label>
            <button onClick={saveProfile} disabled={busy === "profile" || !form.name.trim()} className="rounded-full bg-lime px-8 py-3 font-semibold text-forest transition-colors hover:bg-cream disabled:opacity-50">{x.save}</button>
          </section>
        )}

        {/* Privacy */}
        <section className="flex flex-wrap items-center justify-between gap-3 border-t border-cream/10 pt-6 text-sm">
          <span className="text-cream/50">{x.privacy}</span>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportData} disabled={busy === "export"} className="inline-flex items-center gap-2 rounded-full border-2 border-cream/20 px-4 py-2 font-medium transition-colors hover:border-lime hover:text-lime"><Download className="h-4 w-4" /> {x.exportData}</button>
            <button onClick={deleteAccount} disabled={busy === "delete"} className="inline-flex items-center gap-2 rounded-full border-2 border-chili/40 px-4 py-2 font-medium text-chili-text transition-colors hover:bg-chili/10"><Trash2 className="h-4 w-4" /> {x.deleteAccount}</button>
          </div>
        </section>
      </div>
    </div>
  );
};

const Spinner = () => (
  <div className="min-h-screen bg-forest flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-lime" /></div>
);

const Field = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => {
  const id = `account-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-widest mb-2 text-cream/60">{label}</label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border-2 border-cream/15 bg-cream/5 px-4 py-3 outline-none transition-colors focus:border-lime [color-scheme:dark]" />
    </div>
  );
};

export default Account;
