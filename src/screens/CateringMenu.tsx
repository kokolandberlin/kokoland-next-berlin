"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFollowActiveChip } from "@/hooks/useFollowActiveChip";
import CategorySheet, { CategoryButton } from "@/components/CategorySheet";
import { isCutout } from "@/components/DishVisual";
import { photoForDish, looseDishPhoto } from "@/data/food-photos";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import { Motif, Symbol } from "@/components/Brand";
import { FriezeDivider, StampField } from "@/components/BrandDecor";
import { supabase, DISHDATA_SLUG } from "@/lib/supabase";
import { orderCategories, type CateringDish, type CateringMenu, type CateringTier } from "@/lib/catering";

const strings = (de: boolean) =>
  de
    ? {
        kicker: "Catering",
        h1a: "Kerala",
        h1b: "Catering.",
        blurb: "Stelle dein Menü zusammen, sieh die Summe live und schick uns die Anfrage. Wir bestätigen Termin, Gästezahl und das endgültige Angebot.",
        browse: "Zur Speisekarte",
        notSure: "Noch unsicher? Erzähl uns von deinem Event",
        dishes: "Gerichte",
        vegOptions: "vegetarische & vegane Optionen",
        savingsUpTo: (n: number) => `bis zu ${n}% Mengenrabatt`,
        savings: "Mengenrabatt",
        unlocked: (n: number) => `${n}% Rabatt freigeschaltet`,
        startSaving: "Je größer die Bestellung, desto größer der Rabatt",
        moreFor: (amount: string, pct: number) => `Noch ${amount} bis ${pct}% Rabatt`,
        best: "Bester Rabatt freigeschaltet",
        off: "Rabatt",
        categories: "Kategorien",
        add: "Hinzufügen",
        less: "Weniger",
        more: "Mehr",
        veg: "Vegetarisch",
        vegan: "Vegan",
        yourSelection: "Deine Auswahl",
        items: (n: number) => (n === 1 ? "1 Position" : `${n} Positionen`),
        subtotal: "Zwischensumme",
        discount: "Rabatt",
        total: "Gesamt",
        request: "Catering anfragen",
        modalTitle: "Catering-Anfrage",
        modalHint: "Wir melden uns telefonisch oder per E-Mail, um alles zu bestätigen.",
        noneYet: "Noch nichts ausgewählt. Du kannst uns trotzdem schreiben und wir stellen gemeinsam ein Menü zusammen.",
        name: "Name",
        phone: "Telefon",
        email: "E-Mail (optional)",
        date: "Datum (optional)",
        guests: "Anzahl Gäste (optional)",
        type: "Art der Feier (optional)",
        typePh: "Hochzeit, Firmenevent, Geburtstag …",
        notes: "Anmerkungen (optional)",
        notesPh: "Ort, Uhrzeit, Allergien …",
        send: "Anfrage senden",
        sending: "Wird gesendet …",
        error: "Das hat leider nicht geklappt. Bitte versuche es erneut oder ruf uns an.",
        sentTitle: "Anfrage gesendet",
        sentBody: "Danke! Wir melden uns in Kürze, um dein Event zu besprechen.",
        done: "Fertig",
        close: "Schließen",
        unavailableTitle: "Die Speisekarte lädt gerade nicht",
        unavailableBody: "Schreib uns einfach, was du planst, dann stellen wir dein Menü persönlich zusammen.",
        contact: "Kontakt aufnehmen",
        legend: "Alle Preise inkl. MwSt.",
      }
    : {
        kicker: "Catering",
        h1a: "Kerala",
        h1b: "Catering.",
        blurb: "Build your menu, watch the total as you go, and send it over. We'll confirm the date, headcount and final quote.",
        browse: "Browse the menu",
        notSure: "Not sure yet? Tell us about your event",
        dishes: "dishes",
        vegOptions: "vegetarian & vegan options",
        savingsUpTo: (n: number) => `up to ${n}% volume savings`,
        savings: "Volume savings",
        unlocked: (n: number) => `${n}% off unlocked`,
        startSaving: "The bigger the order, the bigger the discount",
        moreFor: (amount: string, pct: number) => `${amount} more for ${pct}% off`,
        best: "Best discount unlocked",
        off: "off",
        categories: "Categories",
        add: "Add",
        less: "Less",
        more: "More",
        veg: "Vegetarian",
        vegan: "Vegan",
        yourSelection: "Your selection",
        items: (n: number) => (n === 1 ? "1 item" : `${n} items`),
        subtotal: "Subtotal",
        discount: "Discount",
        total: "Total",
        request: "Request catering",
        modalTitle: "Catering request",
        modalHint: "We'll get back to you by phone or email to confirm everything.",
        noneYet: "Nothing selected yet. You can still write to us and we'll put a menu together with you.",
        name: "Name",
        phone: "Phone",
        email: "Email (optional)",
        date: "Event date (optional)",
        guests: "Number of guests (optional)",
        type: "Event type (optional)",
        typePh: "Wedding, corporate event, birthday…",
        notes: "Notes (optional)",
        notesPh: "Location, timing, allergies…",
        send: "Send request",
        sending: "Sending…",
        error: "Something went wrong. Please try again or give us a call.",
        sentTitle: "Request sent",
        sentBody: "Thank you! We'll be in touch shortly to talk through your event.",
        done: "Done",
        close: "Close",
        unavailableTitle: "The menu isn't loading right now",
        unavailableBody: "Just tell us what you're planning and we'll put your menu together by hand.",
        contact: "Get in touch",
        legend: "All prices include VAT.",
      };

type Tx = ReturnType<typeof strings>;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "x";

function tierProgress(subtotal: number, tiers: CateringTier[]) {
  let active: CateringTier | null = null;
  let next: CateringTier | null = null;
  for (const t of tiers) {
    if (subtotal >= t.minSpend) active = t;
    else if (!next) next = t;
  }
  return { active, next };
}

/** Segment-by-segment fill, so a €500 / €2000 ladder doesn't crush the first node against the edge. */
function ladderFill(subtotal: number, tiers: CateringTier[]): number {
  if (!tiers.length) return 0;
  const seg = 100 / tiers.length;
  for (let i = 0; i < tiers.length; i++) {
    if (subtotal < tiers[i].minSpend) {
      const floor = i === 0 ? 0 : tiers[i - 1].minSpend;
      const span = tiers[i].minSpend - floor;
      return (i + Math.max(0, Math.min(1, span > 0 ? (subtotal - floor) / span : 0))) * seg;
    }
  }
  return 100;
}

const CateringMenuScreen = ({ menu }: { menu: CateringMenu | null }) => {
  const { i18n } = useTranslation();
  const de = (i18n.language || "en").startsWith("de");
  const t = strings(de);
  const pick = (d: string | null, e: string | null) => (de && d ? d : e ?? "");
  const money = useMemo(
    () =>
      (n: number, digits = 2) =>
        new Intl.NumberFormat(de ? "de-DE" : "en-GB", {
          style: "currency",
          currency: menu?.currency ?? "EUR",
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        }).format(n),
    [de, menu?.currency],
  );

  const [qty, setQty] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [activeCat, setActiveCat] = useState<string>("");
  const chipBar = useRef<HTMLElement>(null);
  const [catsOpen, setCatsOpen] = useState(false);
  useFollowActiveChip(chipBar, activeCat);

  // Our studio photo of the exact dish first, then DishData's photo, then a near match.
  const dishes = useMemo(
    () => (menu?.dishes ?? []).map((d) => ({ ...d, image_url: photoForDish(d.name)?.src ?? d.image_url ?? looseDishPhoto(d.name)?.src ?? null })),
    [menu],
  );
  const tiers = useMemo(() => menu?.tiers ?? [], [menu]);

  const groups = useMemo(() => {
    const byCat = new Map<string, CateringDish[]>();
    for (const d of dishes) byCat.set(d.category, [...(byCat.get(d.category) ?? []), d]);
    return orderCategories([...byCat.keys()], menu?.categoryOrder ?? []).map((c) => {
      const list = byCat.get(c)!;
      return { key: c, label: pick(list.find((d) => d.category_de)?.category_de ?? null, c), dishes: list };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dishes, menu?.categoryOrder, de]);

  const lines = useMemo(
    () => dishes.filter((d) => (qty[d.id] ?? 0) > 0).map((d) => ({ dish: d, qty: qty[d.id] })),
    [dishes, qty],
  );
  const itemCount = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.dish.price * l.qty, 0);
  const { active, next } = tierProgress(subtotal, tiers);
  const discountPct = active?.discountPct ?? 0;
  const discount = subtotal * (discountPct / 100);
  const total = subtotal - discount;
  const fill = ladderFill(subtotal, tiers);
  const maxPct = tiers.reduce((m, x) => Math.max(m, x.discountPct), 0);
  const vegCount = dishes.filter((d) => d.diet).length;

  const setDishQty = (id: string, n: number) => setQty((q) => ({ ...q, [id]: Math.max(0, Math.min(99, n)) }));

  useEffect(() => {
    if (!groups.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActiveCat(top.target.getAttribute("data-cat") ?? "");
      },
      { rootMargin: "-140px 0px -65% 0px" },
    );
    document.querySelectorAll("[data-cat]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [groups]);

  return (
    <div className="grain relative">
      <Navbar />
      <CartDrawer />
      <main>
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="relative overflow-hidden bg-forest pb-16 pt-32 text-cream lg:pt-40">
          <Motif name="palm-tree" className="pointer-events-none absolute -left-10 top-24 w-48 origin-bottom animate-sway text-lime/15 lg:w-72" />
          <Motif name="elephants" className="pointer-events-none absolute right-10 top-28 w-32 text-lime/15 lg:w-44" />
          <StampField variant="catering" />
          <div className="relative z-10 mx-auto max-w-7xl px-5">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full bg-lime/15 px-4 py-1.5 text-sm font-semibold text-lime"
            >
              {t.kicker}
            </motion.span>
            <h1 className="mt-6 font-display text-[clamp(3rem,11vw,7.5rem)] font-extrabold leading-[0.92] tracking-tight">
              <span className="block">{t.h1a}</span>
              <span className="block text-lime">{t.h1b}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-cream/75">{t.blurb}</p>

            {menu && (
              <div className="mt-8 flex flex-wrap gap-3">
                {[`${dishes.length} ${t.dishes}`, vegCount ? `${vegCount} ${t.vegOptions}` : null, maxPct ? t.savingsUpTo(maxPct) : null]
                  .filter(Boolean)
                  .map((chip) => (
                    <span key={chip} className="rounded-full border-2 border-cream/15 px-4 py-2 text-sm font-medium text-cream/85">
                      {chip}
                    </span>
                  ))}
              </div>
            )}

            <div className="mt-9 flex flex-wrap gap-4">
              {menu && (
                <Magnetic>
                  <a href="#menu" className="soft-shadow inline-flex items-center gap-2 rounded-full bg-lime px-8 py-4 text-lg font-semibold text-forest transition-colors hover:bg-cream">
                    {t.browse} <ArrowRight className="h-5 w-5" />
                  </a>
                </Magnetic>
              )}
              <Magnetic>
                <button
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-cream/40 px-8 py-4 text-lg font-semibold text-cream transition-colors hover:border-lime hover:text-lime"
                >
                  {t.notSure}
                </button>
              </Magnetic>
            </div>
          </div>
        </section>

        <FriezeDivider />

        {!menu || dishes.length === 0 ? (
          <section className="bg-cream py-24 text-forest">
            <div className="mx-auto max-w-2xl px-5 text-center">
              <h2 className="font-display text-4xl font-extrabold">{t.unavailableTitle}</h2>
              <p className="mt-4 text-forest/75">{t.unavailableBody}</p>
              <Link href="/#contact" className="mt-8 inline-flex rounded-full bg-forest px-8 py-4 text-lg font-semibold text-lime transition-colors hover:bg-chili hover:text-cream">
                {t.contact}
              </Link>
            </div>
          </section>
        ) : (
          <>
            {/* ------------------------- Savings ladder ------------------------ */}
            {tiers.length > 0 && (
              <section className="bg-cream py-14 text-forest">
                <div className="mx-auto max-w-5xl px-5">
                  <Reveal>
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <h2 className="font-display text-3xl font-extrabold lg:text-4xl">{t.savings}</h2>
                      <p aria-live="polite" className="text-sm font-semibold text-chili">
                        {active ? (next ? t.moreFor(money(Math.max(0, next.minSpend - subtotal), 0), next.discountPct) : t.best) : t.startSaving}
                      </p>
                    </div>
                    <div className="relative mt-8">
                      <div className="h-3 overflow-hidden rounded-full bg-forest/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-lime to-leaf transition-all duration-500" style={{ width: `${fill}%` }} />
                      </div>
                      <div className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${tiers.length}, minmax(0, 1fr))` }}>
                        {tiers.map((tier) => {
                          const unlocked = subtotal >= tier.minSpend;
                          return (
                            <div key={tier.minSpend} className="text-right">
                              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-colors ${unlocked ? "bg-forest text-lime" : "bg-forest/10 text-forest/60"}`}>
                                {unlocked && <Check className="h-3 w-3" />}
                                {money(tier.minSpend, 0)}+ → {tier.discountPct}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Reveal>
                </div>
              </section>
            )}

            {/* ------------------------------ Menu ----------------------------- */}
            <section id="menu" className="relative bg-forest-700 pb-40 text-cream">
              <div className="sticky top-[68px] z-30 border-b border-lime/15 bg-forest-700/95 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center gap-2 px-5 py-3">
                <CategoryButton onClick={() => setCatsOpen(true)} />
                <nav ref={chipBar} aria-label={t.categories} className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none]">
                  {groups.map((g) => (
                    <a
                      key={g.key}
                      href={`#cat-${slug(g.key)}`}
                      data-active={activeCat === g.key}
                      className={`shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition-colors ${
                        activeCat === g.key ? "border-lime bg-lime text-forest" : "border-cream/15 text-cream/80 hover:border-lime hover:text-lime"
                      }`}
                    >
                      {g.label}
                    </a>
                  ))}
                </nav>
                </div>
              </div>

              <CategorySheet
                open={catsOpen}
                onClose={() => setCatsOpen(false)}
                activeKey={activeCat}
                items={groups.map((g) => ({ key: g.key, label: g.label, count: g.dishes.length, image: g.dishes.find((d) => d.image_url)?.image_url ?? null, emoji: g.dishes.find((d) => d.emoji)?.emoji ?? null }))}
                onPick={(k) => document.getElementById(`cat-${slug(k)}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              />

              <div className="mx-auto max-w-7xl px-5 pt-12">
                {groups.map((g) => (
                  <div key={g.key} id={`cat-${slug(g.key)}`} data-cat={g.key} className="scroll-mt-40 pb-14">
                    <h2 className="mb-6 font-display text-3xl font-extrabold text-lime lg:text-4xl">{g.label}</h2>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                      {g.dishes.map((d) => (
                        <DishCard key={d.id} dish={d} qty={qty[d.id] ?? 0} setQty={(n) => setDishQty(d.id, n)} name={pick(d.name_de, d.name)} desc={pick(d.description_de, d.description)} price={money(d.price)} t={t} />
                      ))}
                    </div>
                  </div>
                ))}
                <p className="text-center text-xs text-cream/50">{t.legend}</p>
              </div>
            </section>
          </>
        )}
      </main>

      {/* ---------------------------- Summary bar ---------------------------- */}
      <AnimatePresence>
        {itemCount > 0 && !open && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-5"
          >
            <div className="soft-shadow mx-auto flex max-w-xl items-center gap-3 rounded-full border-2 border-lime bg-forest px-4 py-2 text-cream">
              <ShoppingBag className="h-5 w-5 shrink-0 text-lime" />
              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-xs text-cream/65">
                  {t.items(itemCount)}
                  {discountPct > 0 ? ` · ${discountPct}% ${t.off}` : ""}
                </div>
                <div className="font-display text-lg font-extrabold text-lime">
                  {discountPct > 0 && <span className="mr-2 text-sm font-semibold text-cream/50 line-through">{money(subtotal)}</span>}
                  {money(total)}
                </div>
              </div>
              <button onClick={() => setOpen(true)} className="shrink-0 rounded-full bg-lime px-4 py-1.5 text-sm font-bold text-forest transition-colors hover:bg-cream">
                {t.request}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <RequestModal
        open={open}
        onClose={() => setOpen(false)}
        t={t}
        de={de}
        money={money}
        lines={lines}
        setDishQty={setDishQty}
        pick={pick}
        subtotal={subtotal}
        discountPct={discountPct}
        discount={discount}
        total={total}
        onSent={() => setQty({})}
      />

      <FriezeDivider ornate />
      <Footer />
    </div>
  );
};

const DishCard = ({
  dish, qty, setQty, name, desc, price, t,
}: {
  dish: CateringDish; qty: number; setQty: (n: number) => void; name: string; desc: string; price: string; t: Tx;
}) => (
  <div className={`flex flex-col overflow-hidden rounded-3xl border-2 transition-colors ${qty > 0 ? "border-lime bg-forest" : "border-cream/10 bg-forest/40"}`}>
    {dish.image_url ? (
      // eslint-disable-next-line @next/next/no-img-element
      isCutout(dish.image_url) ? (
        <div className="flex aspect-[16/10] w-full items-center justify-center bg-[#F8B5A0]/90 p-2">
          <img src={dish.image_url} alt="" loading="lazy" className="h-full w-full object-contain drop-shadow-[0_8px_10px_rgba(19,64,51,0.25)]" />
        </div>
      ) : (
        <img src={dish.image_url} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
      )
    ) : (
      <div className="flex aspect-[16/10] w-full items-center justify-center bg-lime/10 text-5xl" aria-hidden>
        {dish.emoji || <Symbol name="greens" className="h-12 w-12 text-lime/60" />}
      </div>
    )}
    <div className="flex flex-1 flex-col p-3 sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-sm font-bold leading-snug sm:text-base">{name}</h3>
        <span className="shrink-0 font-display text-sm font-extrabold text-lime sm:text-base">{price}</span>
      </div>
      {dish.diet && (
        <span className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-full bg-lime/15 px-2 py-0.5 text-[10px] font-semibold text-lime">
          {dish.diet === "vegan" ? "🌱 " + t.vegan : "🟢 " + t.veg}
        </span>
      )}
      {desc && <p className="mt-1.5 line-clamp-2 text-xs text-cream/65 sm:text-[13px]">{desc}</p>}
      <div className="mt-auto pt-3">
        {qty === 0 ? (
          <button onClick={() => setQty(1)} className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-lime px-3 py-1 text-xs font-bold text-lime transition-colors hover:bg-lime hover:text-forest sm:text-sm">
            <Plus className="h-3.5 w-3.5" /> {t.add}
          </button>
        ) : (
          <div className="flex items-center justify-between rounded-full bg-lime px-1.5 py-0.5 text-forest">
            <button onClick={() => setQty(qty - 1)} aria-label={`${t.less}: ${name}`} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-forest hover:text-lime">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="font-display text-base font-extrabold" aria-live="polite">{qty}</span>
            <button onClick={() => setQty(qty + 1)} aria-label={`${t.more}: ${name}`} className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-forest hover:text-lime">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

const RequestModal = ({
  open, onClose, t, money, lines, setDishQty, pick, subtotal, discountPct, discount, total, onSent,
}: {
  open: boolean; onClose: () => void; t: Tx; de: boolean; money: (n: number, d?: number) => string;
  lines: { dish: CateringDish; qty: number }[]; setDishQty: (id: string, n: number) => void;
  pick: (d: string | null, e: string | null) => string; subtotal: number; discountPct: number; discount: number; total: number;
  onSent: () => void;
}) => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", guests: "", type: "", notes: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Berlin" });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending" || !form.name.trim() || !form.phone.trim()) return;
    setState("sending");
    const notes = [form.type.trim() && `Event type: ${form.type.trim()}`, form.notes.trim(), "Sent from the website"].filter(Boolean).join(" | ");
    const { error } = await supabase.rpc("place_catering_inquiry", {
      _slug: DISHDATA_SLUG,
      _guest_name: form.name.trim(),
      _phone: form.phone.trim(),
      _email: form.email.trim() || null,
      _event_date: form.date || null,
      _headcount: form.guests ? Math.max(1, parseInt(form.guests, 10) || 0) || null : null,
      _notes: notes,
      _items: lines.map((l) => ({ recipe_id: l.dish.id, name: l.dish.name, qty: l.qty, unit_price: l.dish.price })),
      _subtotal: subtotal,
      _discount_pct: discountPct,
    });
    if (error) {
      setState("error");
      return;
    }
    setState("sent");
    onSent();
    setForm({ name: "", phone: "", email: "", date: "", guests: "", type: "", notes: "" });
  };

  const close = () => {
    onClose();
    setTimeout(() => setState("idle"), 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-[80] bg-forest-900/80 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label={t.modalTitle}
            className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center p-4"
          >
            <div className="soft-shadow pointer-events-auto max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-cream p-7 text-forest sm:p-8">
              <div className="mb-5 flex items-start justify-between">
                <h3 className="font-display text-3xl font-extrabold">{state === "sent" ? t.sentTitle : t.modalTitle}</h3>
                <button onClick={close} className="text-forest/50 transition-colors hover:text-chili" aria-label={t.close}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              {state === "sent" ? (
                <div className="py-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime text-forest">
                    <Check className="h-8 w-8" />
                  </div>
                  <p className="mt-5 text-lg text-forest/80">{t.sentBody}</p>
                  <button onClick={close} className="mt-7 rounded-full bg-forest px-8 py-3 font-semibold text-lime transition-colors hover:bg-chili hover:text-cream">
                    {t.done}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
                  <p className="text-sm text-forest/65">{t.modalHint}</p>

                  {lines.length === 0 ? (
                    <p className="rounded-2xl bg-forest/5 p-4 text-sm text-forest/70">{t.noneYet}</p>
                  ) : (
                    <div className="rounded-2xl bg-forest/5 p-4">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-chili">{t.yourSelection}</div>
                      <ul className="space-y-2">
                        {lines.map(({ dish, qty }) => (
                          <li key={dish.id} className="flex items-center gap-3 text-sm">
                            <span className="min-w-0 flex-1 truncate font-medium">{pick(dish.name_de, dish.name)}</span>
                            <span className="flex items-center gap-1">
                              <button type="button" onClick={() => setDishQty(dish.id, qty - 1)} aria-label={`${t.less}: ${dish.name}`} className="flex h-6 w-6 items-center justify-center rounded-full bg-forest/10 hover:bg-forest hover:text-lime">
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center font-bold">{qty}</span>
                              <button type="button" onClick={() => setDishQty(dish.id, qty + 1)} aria-label={`${t.more}: ${dish.name}`} className="flex h-6 w-6 items-center justify-center rounded-full bg-forest/10 hover:bg-forest hover:text-lime">
                                <Plus className="h-3 w-3" />
                              </button>
                            </span>
                            <span className="w-20 text-right font-semibold">{money(dish.price * qty)}</span>
                          </li>
                        ))}
                      </ul>
                      <dl className="mt-3 space-y-1 border-t border-forest/10 pt-3 text-sm">
                        <div className="flex justify-between"><dt className="text-forest/65">{t.subtotal}</dt><dd>{money(subtotal)}</dd></div>
                        {discountPct > 0 && (
                          <div className="flex justify-between text-chili"><dt>{t.discount} ({discountPct}%)</dt><dd>−{money(discount)}</dd></div>
                        )}
                        <div className="flex justify-between font-display text-lg font-extrabold"><dt>{t.total}</dt><dd>{money(total)}</dd></div>
                      </dl>
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <F label={t.name} required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                    <F label={t.phone} type="tel" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                  </div>
                  <F label={t.email} type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <F label={t.date} type="date" min={today} value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
                    <F label={t.guests} type="number" min="1" value={form.guests} onChange={(v) => setForm({ ...form, guests: v })} />
                  </div>
                  <F label={t.type} value={form.type} placeholder={t.typePh} onChange={(v) => setForm({ ...form, type: v })} />
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-chili">{t.notes}</label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      placeholder={t.notesPh}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="w-full resize-none rounded-xl border-2 border-forest/15 bg-bone px-4 py-3 outline-none transition-colors focus:border-lime"
                    />
                  </div>
                  {state === "error" && (
                    <p role="alert" className="text-center text-sm font-medium text-chili">{t.error}</p>
                  )}
                  <button type="submit" disabled={state === "sending"} className="w-full rounded-full bg-forest py-4 text-lg font-semibold text-cream transition-colors hover:bg-chili disabled:opacity-60">
                    {state === "sending" ? t.sending : t.send}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const F = ({
  label, value, onChange, type = "text", placeholder, required, min,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean; min?: string;
}) => (
  <div>
    <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-chili">{label}</label>
    <input
      type={type}
      value={value}
      min={min}
      required={required}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border-2 border-forest/15 bg-bone px-4 py-3 outline-none transition-colors focus:border-lime"
    />
  </div>
);

export default CateringMenuScreen;
