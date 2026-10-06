"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Gift, Loader2, RotateCcw, Download, Trash2, CalendarClock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useMyAccount, type MyOrder } from "@/hooks/useMyAccount";
import { supabase, DISHDATA_SLUG } from "@/lib/supabase";
import { formatEur } from "@/data/menu";

const strings = (de: boolean) =>
  de
    ? {
        back: "← Zur Startseite",
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

const Account = () => {
  const { i18n } = useTranslation();
  const de = (i18n.language || "en").startsWith("de");
  const x = strings(de);
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

  return (
    <div className="min-h-screen bg-forest text-cream">
      <div className="max-w-2xl mx-auto px-5 py-12 space-y-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-cream/60 hover:text-lime transition-colors">{x.back}</Link>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-lime mb-1">{x.title}</p>
            <h1 className="font-display font-extrabold text-4xl">{c.name}</h1>
            <p className="text-sm text-cream/55">{c.email}</p>
          </div>
          <button onClick={() => signOut().then(() => router.replace("/"))} className="shrink-0 rounded-full border-2 border-cream/20 px-4 py-2 text-sm font-medium hover:border-lime hover:text-lime">{x.signOut}</button>
        </div>

        {msg && <p role="status" className="rounded-xl bg-lime/10 px-4 py-3 text-sm text-lime">{msg}</p>}

        {account.program?.enabled !== false && (
          <>
            <div className="rounded-3xl border-2 border-lime/30 p-7 space-y-4 soft-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-cream/65 text-sm">{x.tier}</p>
                  <p className="font-display font-extrabold text-3xl text-lime">{c.tier}</p>
                </div>
                <div className="text-right">
                  <p className="text-cream/65 text-sm">{account.program?.points_name ?? x.points}</p>
                  <p className="font-display font-extrabold text-3xl text-lime">{c.points.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-2 rounded-full bg-cream/10 overflow-hidden"><div className="h-full rounded-full bg-lime transition-all" style={{ width: `${pct}%` }} /></div>
                <p className="text-xs text-cream/65">{nextTier ? x.toNext(Math.max(0, Math.ceil(nextTier.threshold - metric)), nextTier.name) : x.topTier}</p>
              </div>
            </div>

            {code && (
              <div className="rounded-2xl border border-lime/40 bg-lime/15 px-5 py-4 text-sm">
                <p className="text-lime">{x.voucherNote}</p>
                <p className="mt-1 font-mono text-xl font-bold text-lime">{code}</p>
              </div>
            )}

            {account.rewards.length > 0 && (
              <section className="space-y-3">
                <h2 className="font-display font-bold text-xl flex items-center gap-2"><Gift className="w-5 h-5 text-lime" /> {x.rewards}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {account.rewards.map((r) => {
                    const locked = r.min_tier_id ? tierOrderOf(r.min_tier_id) > myTierOrder : false;
                    const poor = c.points < r.cost_points;
                    return (
                      <div key={r.id} className={`rounded-2xl border-2 p-5 flex flex-col gap-2 ${poor || locked ? "border-cream/10 opacity-70" : "border-lime/40"}`}>
                        <p className="font-display font-bold">{r.label}</p>
                        {r.description && <p className="text-sm text-cream/60">{r.description}</p>}
                        <p className="text-sm text-lime font-semibold">{r.cost_points} {x.points}</p>
                        <button
                          disabled={poor || locked || busy === r.id}
                          onClick={() => redeem(r.id)}
                          className="mt-1 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-forest transition-colors hover:bg-chili hover:text-cream disabled:cursor-not-allowed disabled:bg-cream/10 disabled:text-cream/50"
                        >
                          {locked ? x.tierLocked : poor ? x.needMore : x.redeem}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {account.vouchers.length > 0 && (
              <section className="space-y-3">
                <h2 className="font-display font-bold text-xl">{x.vouchers}</h2>
                <ul className="space-y-2">
                  {account.vouchers.map((v) => (
                    <li key={v.code} className="flex items-center justify-between rounded-2xl border border-cream/15 px-5 py-3 text-sm">
                      <span><span className="font-semibold">{v.label}</span>{v.expires_at ? <span className="text-cream/50"> · {x.validUntil} {fmt(v.expires_at)}</span> : null}</span>
                      <span className="font-mono font-bold text-lime">{v.code}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {account.earn_rules.length > 0 && (
              <section className="space-y-3">
                <h2 className="font-display font-bold text-xl">{x.earn}</h2>
                <ul className="space-y-1.5 text-sm">
                  {account.earn_rules.map((e) => (
                    <li key={e.action_type} className="flex justify-between border-b border-cream/10 py-1.5"><span className="text-cream/75">{e.label}</span><span className="font-semibold text-lime">+{e.points}</span></li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}

        {upcoming.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl flex items-center gap-2"><CalendarClock className="w-5 h-5 text-lime" /> {x.upcoming}</h2>
            {upcoming.map((o) => (
              <Link key={o.id} href={`/order/${o.id}`} className="flex items-center justify-between rounded-2xl border-2 border-lime/30 px-5 py-4 transition-colors hover:border-lime">
                <span>
                  <span className="block font-semibold">{fmt(o.scheduled_for!, true)}</span>
                  <span className="text-sm text-cream/60">{o.order_number}{o.party_size ? ` · ${o.party_size} ${x.guests}` : ""}</span>
                </span>
                <span className="font-display font-bold text-lime">{formatEur(o.total)}</span>
              </Link>
            ))}
          </section>
        )}

        <section className="space-y-3">
          <h2 className="font-display font-bold text-xl">{x.history}</h2>
          {account.orders.length === 0 ? (
            <p className="text-sm text-cream/60">{x.none}</p>
          ) : (
            <ul className="space-y-3">
              {account.orders.map((o) => (
                <li key={o.id} className="rounded-2xl border border-cream/15 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-mono text-cream/60">{o.order_number} · {fmt(o.created_at)}</span>
                    <span className="font-display font-bold text-lime">{formatEur(o.total)}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-cream/80">{o.items.map((l) => `${l.qty}× ${l.name}`).join(", ")}</p>
                  <button onClick={() => reorder(o)} disabled={busy === o.id} className="mt-3 inline-flex items-center gap-1.5 rounded-full border-2 border-lime px-4 py-1.5 text-sm font-semibold text-lime transition-colors hover:bg-lime hover:text-forest disabled:opacity-50">
                    <RotateCcw className="h-3.5 w-3.5" /> {x.reorder}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {form && (
          <section className="space-y-4">
            <h2 className="font-display font-bold text-xl">{x.profile}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={x.name} value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label={x.phone} type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            </div>
            <Field label={x.birthday} type="date" value={form.birthday} onChange={(v) => setForm({ ...form, birthday: v })} />
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={form.newsletter} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} className="h-4 w-4 accent-[#C0F252]" />
              {x.newsletter}
            </label>
            <button onClick={saveProfile} disabled={busy === "profile" || !form.name.trim()} className="rounded-full bg-lime px-8 py-3 font-semibold text-forest transition-colors hover:bg-chili hover:text-cream disabled:opacity-50">{x.save}</button>
          </section>
        )}

        <section className="space-y-3 border-t border-cream/10 pt-6">
          <h2 className="font-display font-bold text-xl">{x.privacy}</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={exportData} disabled={busy === "export"} className="inline-flex items-center gap-2 rounded-full border-2 border-cream/20 px-5 py-2.5 text-sm font-medium hover:border-lime hover:text-lime"><Download className="h-4 w-4" /> {x.exportData}</button>
            <button onClick={deleteAccount} disabled={busy === "delete"} className="inline-flex items-center gap-2 rounded-full border-2 border-chili/50 px-5 py-2.5 text-sm font-medium text-chili-text hover:bg-chili/10"><Trash2 className="h-4 w-4" /> {x.deleteAccount}</button>
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
