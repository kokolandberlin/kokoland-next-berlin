"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFollowActiveChip } from "@/hooks/useFollowActiveChip";
import CategorySheet, { CategoryButton } from "@/components/CategorySheet";
import {
  AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform,
} from "framer-motion";
import { ArrowRight, Check, ChevronDown, Minus, Plus, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import Magnetic from "@/components/Magnetic";
import DishVisual from "@/components/DishVisual";
import FloatingPlates, { type PlateSpot } from "@/components/FloatingPlates";
import { plates } from "@/data/food-photos";
import { Motif, Symbol } from "@/components/Brand";
import { FriezeDivider, StampField } from "@/components/BrandDecor";
import { useCart } from "@/context/CartContext";
import { orderCategories } from "@/lib/catering";
import { categoryThemes, type CategoryTheme } from "@/lib/category-theme";
import type { MenuData, MenuDish, WeeklyDish } from "@/lib/menu";

const strings = (de: boolean) =>
  de
    ? {
        kicker: "Die Speisekarte",
        h1a: "Eine wechselnde",
        h1b: "Karte.",
        story:
          "Bei kokoland wechselt die Karte immer wieder. Neue Gerichte kommen aufs Brett, alte Lieblinge machen Platz. Kerala hat so viel zu erzählen, dass wir immer wieder ein neues Kapitel aufschlagen.",
        dishesNow: (n: number) => `${n} Gerichte gerade jetzt`,
        browse: "Alles ansehen",
        seeWeek: "Gericht der Woche",
        scroll: "Scrollen",
        weekKicker: "Gericht der Woche",
        weekOf: (r: string) => `Woche vom ${r}`,
        stamp: (r: string) => `Gericht der Woche · ${r} ·`,
        theStory: "Die Geschichte",
        from: "Aus",
        noWeekTitle: "Ein Gericht im Rampenlicht",
        noWeekBody: "Wir stellen ein Gericht vor und erzählen seine Geschichte. Schau bald wieder vorbei.",
        journeyKicker: "Eine Küche, viele Regionen",
        journeyTitle: "Von Malabar bis Travancore",
        journeyIntro: "Kerala ist ein schmaler Streifen Küste mit sehr vielen Küchen. Von Norden nach Süden ändern sich Gewürze, Fette und Geschmack. Wir kochen uns durch alle.",
        north: "Norden",
        south: "Süden",
        malabar: "Malabar",
        malabarBody: "Die Hafenküche des Nordens: Gewürzhandel, Mappila-Tradition und Mut zur Schärfe. Dum-Biryani, Pathiri, schwarzer Pfeffer, Kokos und Meeresfrüchte in kräftigen Masalas.",
        travancore: "Travancore",
        travancoreBody: "Der Süden ist weicher und cremiger: Kokosmilch, Appam mit Stew, Fisch-Molee, Kappa mit Fischcurry und das Sadya-Festmahl auf dem Bananenblatt.",
        between: "Dazwischen: Kochi, die Hügel und die Backwaters. Neue Gerichte können von überall auf dem Weg kommen.",
        allKicker: "Alle Gerichte",
        allTitle: "Die ganze Karte",
        search: "Gericht suchen …",
        all: "Alle",
        veg: "Vegetarisch",
        vegan: "Vegan",
        noMatch: "Nichts gefunden. Probier einen anderen Suchbegriff.",
        reset: "Filter zurücksetzen",
        add: "Hinzufügen",
        added: "Hinzugefügt!",
        soldOut: "Ausverkauft",
        less: "Weniger",
        more: "Mehr",
        items: (n: number) => (n === 1 ? "1 Gericht" : `${n} Gerichte`),
        viewOrder: "Bestellung ansehen",
        ctaTitle: "Hunger bekommen?",
        ctaBody: "Bestell direkt online oder reserviere einen Tisch.",
        order: "Jetzt bestellen",
        reserve: "Tisch reservieren",
        vat: "Alle Preise inkl. MwSt.",
        explore: "Nach Kategorie entdecken",
        atlasKicker: "Eine Küste, viele Küchen",
        atlasTitle: "Von Malabar bis Travancore",
        atlasBody: "Acht Küchen und viele Kulturen: Woher unsere Gerichte kommen.",
        atlasCta: "Keralas Küchen entdecken",
        streetTitle: "Indo-Chinesisches Streetfood",
        streetBody: "Gobi Manchurian, Chilli Gobi, Chilli Paneer und mehr",
        streetOn: "Gefiltert: Indo-Chinesisch",
        dishesN: (n: number) => (n === 1 ? "1 Gericht" : `${n} Gerichte`),
        close: "Schließen",
      }
    : {
        kicker: "The menu",
        h1a: "A rotating",
        h1b: "menu.",
        story:
          "At kokoland the menu rotates. New dishes land on the board and old favourites make room. Kerala has so many stories to tell that we keep opening a new chapter.",
        dishesNow: (n: number) => `${n} dishes right now`,
        browse: "Browse everything",
        seeWeek: "Dish of the week",
        scroll: "Scroll",
        weekKicker: "Dish of the week",
        weekOf: (r: string) => `Week of ${r}`,
        stamp: (r: string) => `Dish of the week · ${r} ·`,
        theStory: "The story",
        from: "From",
        noWeekTitle: "One dish in the spotlight",
        noWeekBody: "We put one dish in the spotlight and tell its story. Check back soon.",
        journeyKicker: "One coast, many kitchens",
        journeyTitle: "From Malabar to Travancore",
        journeyIntro: "Kerala is a narrow strip of coast with a surprising number of cuisines. From north to south the spices, fats and flavours change. We cook our way through all of them.",
        north: "North",
        south: "South",
        malabar: "Malabar",
        malabarBody: "The port cooking of the north: spice-trade history, Mappila tradition and a taste for heat. Dum biryani, pathiri, black pepper, coconut and seafood in bold masalas.",
        travancore: "Travancore",
        travancoreBody: "The south is softer and creamier: coconut milk, appam with stew, fish molee, kappa with fish curry and the festive sadya on a banana leaf.",
        between: "In between: Kochi, the hills and the backwaters. New dishes can come from anywhere along the way.",
        allKicker: "Every dish",
        allTitle: "The full menu",
        search: "Search dishes…",
        all: "All",
        veg: "Vegetarian",
        vegan: "Vegan",
        noMatch: "Nothing found. Try a different search.",
        reset: "Reset filters",
        add: "Add",
        added: "Added!",
        soldOut: "Sold out",
        less: "Less",
        more: "More",
        items: (n: number) => (n === 1 ? "1 item" : `${n} items`),
        viewOrder: "View order",
        ctaTitle: "Hungry yet?",
        ctaBody: "Order online right now, or reserve a table.",
        order: "Order now",
        reserve: "Reserve a table",
        vat: "All prices include VAT.",
        explore: "Explore by category",
        atlasKicker: "One coast, many kitchens",
        atlasTitle: "From Malabar to Travancore",
        atlasBody: "Eight kitchens and many cultures: where our dishes come from.",
        atlasCta: "Explore Kerala's kitchens",
        streetTitle: "Indo-Chinese street food",
        streetBody: "Gobi Manchurian, Chilli Gobi, Chilli Paneer and more",
        streetOn: "Showing: Indo-Chinese",
        dishesN: (n: number) => (n === 1 ? "1 dish" : `${n} dishes`),
        close: "Close",
      };

type Tx = ReturnType<typeof strings>;

// Indo-Chinese street-food dishes are not a recipe category, so they are found by name.
const INDO_CHINESE = /manchurian|chilli|chilly|schezwan|szechuan|noodle|fried rice/i;

// Plates on the hero's right edge; they drift and turn as the hero scrolls away.
const HERO_PLATES: PlateSpot[] = [
  { photo: plates.kappaFish, left: "66%", top: "10%", vw: 25, min: 150, max: 380, drift: 80, spin: 45, tilt: 8 },
  { photo: plates.porottaBeef, left: "78%", top: "46%", vw: 20, min: 130, max: 320, drift: 110, spin: -55, tilt: -10 },
  { photo: plates.biriyani, left: "58%", top: "62%", vw: 14, min: 96, max: 230, drift: 60, spin: 70, tilt: 0, desktopOnly: true },
  { photo: plates.samosa, left: "88%", top: "6%", vw: 11, min: 80, max: 190, drift: 50, spin: -40, tilt: 14, desktopOnly: true },
];

// The colourful category tiles are parked until they are reworked; the sticky chip bar below still jumps between categories.
const SHOW_CATEGORY_TILES = false;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "x";

// ---------------------------------------------------------------------------
// A card that tilts toward the cursor, with a light that follows it.
// ---------------------------------------------------------------------------
const TiltCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const rx = useSpring(useTransform(y, [0, 1], [7, -7]), { stiffness: 220, damping: 20 });
  const ry = useSpring(useTransform(x, [0, 1], [-7, 7]), { stiffness: 220, damping: 20 });
  const glare = useMotionTemplate`radial-gradient(240px circle at ${useTransform(x, (v) => v * 100)}% ${useTransform(y, (v) => v * 100)}%, rgba(192,242,82,0.18), transparent 70%)`;
  const [canTilt, setCanTilt] = useState(false);
  useEffect(() => {
    setCanTilt(window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches);
  }, []);

  return (
    <motion.div
      style={canTilt ? { rotateX: rx, rotateY: ry, transformPerspective: 900 } : undefined}
      onMouseMove={(e) => {
        if (!canTilt) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width);
        y.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        x.set(0.5);
        y.set(0.5);
      }}
      className={`relative ${className}`}
    >
      {children}
      {canTilt && <motion.div aria-hidden style={{ background: glare }} className="pointer-events-none absolute inset-0 rounded-[inherit]" />}
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// Add-to-order control shared by every card.
// ---------------------------------------------------------------------------
const BURST = ["#C0F252", "#FFCA40", "#F21B07", "#FF7008", "#F9F1E4", "#7BD348"];

// A small colourful pop each time a dish is added to the order.
const Burst = ({ id }: { id: number }) => (
  <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
    {Array.from({ length: 9 }).map((_, i) => {
      const a = (i / 9) * Math.PI * 2;
      return (
        <motion.span
          key={`${id}-${i}`}
          className="absolute h-2 w-2 rounded-full"
          style={{ background: BURST[i % BURST.length] }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: Math.cos(a) * 52, y: Math.sin(a) * 34, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        />
      );
    })}
  </span>
);

const AddControl = ({ dish, name, t, compact = false }: { dish: MenuDish; name: string; t: Tx; compact?: boolean }) => {
  const { items, addItem, setQty } = useCart();
  const inCart = items.find((i) => i.id === dish.id)?.qty ?? 0;
  const [burst, setBurst] = useState(0);
  const prev = useRef(inCart);
  useEffect(() => {
    if (inCart > prev.current) setBurst((b) => b + 1);
    prev.current = inCart;
  }, [inCart]);

  if (dish.soldOut) {
    return <span className="inline-flex w-full items-center justify-center rounded-full border border-cream/15 px-4 py-2 text-xs font-semibold text-cream/45">{t.soldOut}</span>;
  }
  return (
    <div className="relative w-full">
      {inCart > 0 ? (
        <div className="flex w-full items-center justify-between rounded-full bg-lime px-1.5 py-1 text-forest">
          <button onClick={() => setQty(dish.name, inCart - 1)} aria-label={`${t.less}: ${name}`} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-forest hover:text-lime">
            <Minus className="h-4 w-4" />
          </button>
          <motion.span key={inCart} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="font-display text-base font-extrabold">{inCart}</motion.span>
          <button onClick={() => setQty(dish.name, inCart + 1)} aria-label={`${t.more}: ${name}`} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-forest hover:text-lime">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => addItem(dish.id, dish.name, dish.price)}
          className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full border-2 border-lime font-bold text-lime transition-colors hover:bg-lime hover:text-forest ${compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
        >
          <Plus className="h-4 w-4" /> {t.add}
        </motion.button>
      )}
      {burst > 0 && <Burst id={burst} />}
    </div>
  );
};

// ---------------------------------------------------------------------------
// The one dish in the spotlight this week, with its story.
// ---------------------------------------------------------------------------
const WeekFeature = ({
  weekly, weekRange, t, money, pick,
}: {
  weekly: WeeklyDish; weekRange: string; t: Tx; money: (n: number) => string; pick: (d: string | null, e: string | null) => string;
}) => {
  const { dish, headline, region, story } = weekly;
  const name = pick(dish.name_de, dish.name);
  const paragraphs = (story ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const body = paragraphs.length ? paragraphs : [pick(dish.description_de, dish.description)].filter(Boolean);

  return (
    <div className="grid items-center gap-12 lg:grid-cols-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto w-full max-w-[460px] lg:col-span-5 [perspective:1000px]"
      >
        <TiltCard className="group overflow-hidden arch-top rounded-b-[2.5rem] border-4 border-lime bg-forest shadow-[0_30px_80px_-30px_rgba(192,242,82,0.45)]">
          <div className="aspect-[4/5] w-full">
            <DishVisual dish={dish} />
          </div>
        </TiltCard>

        <div className="absolute -right-4 -top-8 h-32 w-32 lg:-right-8 lg:h-36 lg:w-36" aria-hidden>
          <div className="h-full w-full animate-spin-slow motion-reduce:animate-none">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <defs>
                <path id="weekStamp" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
              </defs>
              <text className="fill-lime text-[9px] font-semibold uppercase tracking-[0.18em]">
                <textPath href="#weekStamp" textLength="226" lengthAdjust="spacing">{t.stamp(weekRange)}</textPath>
              </text>
            </svg>
          </div>
          <Symbol name="star" className="absolute inset-0 m-auto h-10 w-10 text-lime" />
        </div>

        <motion.span
          initial={{ rotate: -8, scale: 0 }}
          whileInView={{ rotate: -6, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", delay: 0.5 }}
          className="absolute -bottom-5 left-4 rounded-full bg-chili px-5 py-2 font-display text-xl font-extrabold text-cream shadow-lg"
        >
          {money(dish.price)}
        </motion.span>
      </motion.div>

      <div className="lg:col-span-7">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-lime">{t.weekKicker}</span>
            {region && <span className="rounded-full border-2 border-lime/60 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-lime">{t.from} {region}</span>}
          </div>
        </Reveal>

        <motion.h2
          className="mt-4 font-display text-5xl font-extrabold leading-[0.95] lg:text-7xl"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
        >
          {name.split(" ").map((w, i) => (
            <span key={i} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block"
                variants={{ hidden: { y: "110%" }, show: { y: 0, transition: { duration: 0.7, ease: [0.21, 0.7, 0.25, 1] } } }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {headline && (
          <Reveal delay={0.2}>
            <p className="mt-5 font-display text-2xl font-bold text-lime lg:text-3xl">{headline}</p>
          </Reveal>
        )}

        {body.length > 0 && (
          <div className="mt-7 max-w-2xl space-y-4">
            {story && <Reveal delay={0.25}><span className="text-xs font-semibold uppercase tracking-[0.25em] text-cream/50">{t.theStory}</span></Reveal>}
            {body.map((p, i) => (
              <Reveal key={i} delay={0.3 + i * 0.12}>
                <p className="text-lg leading-relaxed text-cream/80">{p}</p>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal delay={0.4}>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <div className="w-full max-w-[260px]"><AddControl dish={dish} name={name} t={t} /></div>
            {dish.diet && (
              <span className="rounded-full bg-lime/15 px-3 py-1 text-xs font-semibold text-lime">{dish.diet === "vegan" ? "🌱 " + t.vegan : "🟢 " + t.veg}</span>
            )}
            <span className="text-sm text-cream/50">{t.weekOf(weekRange)}</span>
          </div>
        </Reveal>
      </div>
    </div>
  );
};

const MenuPage = ({ menu }: { menu: MenuData }) => {
  const { i18n } = useTranslation();
  const de = (i18n.language || "en").startsWith("de");
  const t = strings(de);
  const { count, total, setOpen } = useCart();
  const pick = (d: string | null, e: string | null) => (de && d ? d : e ?? "");
  const money = useMemo(
    () => (n: number) => new Intl.NumberFormat(de ? "de-DE" : "en-GB", { style: "currency", currency: "EUR" }).format(n),
    [de],
  );

  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState<"all" | "veg" | "vegan">("all");
  const [street, setStreet] = useState(false);
  const [activeCat, setActiveCat] = useState("");
  const chipBar = useRef<HTMLElement>(null);
  const [catsOpen, setCatsOpen] = useState(false);
  useFollowActiveChip(chipBar, activeCat);
  const [quick, setQuick] = useState<MenuDish | null>(null);

  // ---- hero scroll effect
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroP, [0, 1], ["0%", "30%"]);
  const heroFade = useTransform(heroP, [0, 0.8], [1, 0]);

  const weekRange = useMemo(() => {
    if (!menu.weekly) return "";
    const start = new Date(`${menu.weekly.startsOn}T12:00:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const f = (d: Date) => d.toLocaleDateString(de ? "de-DE" : "en-GB", { day: "numeric", month: "short" });
    return `${f(start)} – ${f(end)}`;
  }, [menu.weekly, de]);

  // ---- filtering + grouping
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menu.dishes.filter((d) => {
      if (diet === "vegan" && d.diet !== "vegan") return false;
      if (diet === "veg" && !d.diet) return false;
      if (street && !INDO_CHINESE.test(d.name)) return false;
      if (!q) return true;
      return [d.name, d.name_de, d.description, d.description_de, d.category].some((s) => s?.toLowerCase().includes(q));
    });
  }, [menu.dishes, query, diet, street]);

  const groups = useMemo(() => {
    const byCat = new Map<string, MenuDish[]>();
    for (const d of filtered) byCat.set(d.category, [...(byCat.get(d.category) ?? []), d]);
    return orderCategories([...byCat.keys()], menu.categoryOrder).map((c) => {
      const list = byCat.get(c)!;
      return { key: c, label: pick(list.find((d) => d.category_de)?.category_de ?? null, c), dishes: list };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, menu.categoryOrder, de]);

  const allCats = useMemo(
    () => orderCategories([...new Set(menu.dishes.map((d) => d.category))], menu.categoryOrder),
    [menu.dishes, menu.categoryOrder],
  );
  const themes = useMemo(() => categoryThemes(allCats, menu.dishes), [allCats, menu.dishes]);
  const labelOf = (cat: string) => pick(menu.dishes.find((d) => d.category === cat && d.category_de)?.category_de ?? null, cat);
  const shortLabel = (cat: string) => labelOf(cat).replace(/\s*\([^)]*\)\s*/g, " ").trim();
  const countOf = (cat: string) => menu.dishes.filter((d) => d.category === cat).length;

  const streetCount = useMemo(() => menu.dishes.filter((d) => INDO_CHINESE.test(d.name)).length, [menu.dishes]);
  const showStreet = () => {
    setQuery("");
    setDiet("all");
    setStreet(true);
    window.setTimeout(() => document.querySelector("#all [data-cat]")?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  };

  const jump = (cat: string) => {
    setStreet(false);
    setQuery("");
    setDiet("all");
    window.setTimeout(() => document.getElementById(`cat-${slug(cat)}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 90);
  };

  // /menu?q=beef opens the menu already filtered (used by the Kerala page's dish chips).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q");
    if (!q) return;
    setQuery(q);
    window.setTimeout(() => document.getElementById("all")?.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
  }, []);

  useEffect(() => {
    if (!quick) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setQuick(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [quick]);

  useEffect(() => {
    if (!groups.length || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setActiveCat(top.target.getAttribute("data-cat") ?? "");
      },
      { rootMargin: "-170px 0px -65% 0px" },
    );
    document.querySelectorAll("[data-cat]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [groups]);

  // Ticker: food only (never drinks), one dish per category in turn for variety.
  const marqueeNames = useMemo(() => {
    const byCat = new Map<string, string[]>();
    for (const d of menu.dishes) {
      if (d.soldOut || /beverage|drink|getr(ä|ae)nk/i.test(d.category)) continue;
      byCat.set(d.category, [...(byCat.get(d.category) ?? []), pick(d.name_de, d.name).toUpperCase()]);
    }
    const lists = [...byCat.values()];
    const out: string[] = [];
    for (let i = 0; out.length < 14 && lists.some((l) => l[i]); i++) for (const l of lists) if (l[i] && out.length < 14) out.push(l[i]);
    while (out.length > 0 && out.length < 10) out.push(...out.slice(0, 10 - out.length));
    return out;
  }, [menu.dishes, de]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="grain relative">
      <Navbar />
      <CartDrawer />
      <main>
        {/* ------------------------------ Hero ------------------------------ */}
        <section ref={heroRef} className="relative min-h-[88vh] overflow-hidden bg-forest pb-20 pt-36 text-cream">
          <Motif name="palm-tree" className="pointer-events-none absolute -left-10 top-24 w-48 origin-bottom animate-sway text-lime/15 lg:w-72" />
          <Motif name="palm-tree" className="pointer-events-none absolute -right-12 bottom-20 w-56 origin-bottom -scale-x-100 animate-sway text-lime/10 lg:w-80" />
          <Motif name="waves" className="pointer-events-none absolute bottom-0 left-1/2 w-[120%] -translate-x-1/2 text-lime/10" />
          <StampField variant="menu" />
          <div className="absolute inset-0 opacity-70 lg:opacity-100">
            <FloatingPlates spots={HERO_PLATES} progress={heroP} ringClassName="border-lime/15" />
          </div>

          <motion.div style={{ y: heroY, opacity: heroFade }} className="relative z-10 mx-auto max-w-7xl px-5">
            <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full bg-lime/15 px-4 py-1.5 text-sm font-semibold text-lime">
              <Sparkles className="h-4 w-4" /> {t.kicker}
            </motion.span>
            <h1 className="mt-6 font-display text-[clamp(3rem,10.5vw,8.5rem)] font-extrabold leading-[0.92] tracking-tight">
              {[t.h1a, t.h1b].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span
                    className={`block ${i === 1 ? "text-lime" : ""}`}
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3 + i * 0.15, ease: [0.21, 0.7, 0.25, 1] }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-7 max-w-2xl text-lg text-cream/75">
              {t.story}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }} className="mt-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full border-2 border-cream/15 px-4 py-2 text-sm font-medium text-cream/85">{t.dishesNow(menu.dishes.length)}</span>
              <span className="rounded-full border-2 border-cream/15 px-4 py-2 text-sm font-medium text-cream/85">{t.malabar} → {t.travancore}</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }} className="mt-9 flex flex-wrap gap-4">
              {menu.weekly && (
                <Magnetic>
                  <a href="#week" className="soft-shadow inline-flex items-center gap-2 rounded-full bg-lime px-8 py-4 text-lg font-semibold text-forest transition-colors hover:bg-cream">
                    {t.seeWeek} <ArrowRight className="h-5 w-5" />
                  </a>
                </Magnetic>
              )}
              <Magnetic>
                <a href="#all" className={`inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold transition-colors ${menu.weekly ? "border-2 border-cream/40 text-cream hover:border-lime hover:text-lime" : "soft-shadow bg-lime text-forest hover:bg-cream"}`}>
                  {t.browse}
                </a>
              </Magnetic>
            </motion.div>
          </motion.div>

          <motion.a
            href={menu.weekly ? "#week" : "#all"}
            aria-label={t.scroll}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ opacity: { delay: 1.6 }, y: { repeat: Infinity, duration: 1.8, delay: 1.6 } }}
            className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs font-semibold uppercase tracking-[0.25em] text-lime/80 sm:flex"
          >
            {t.scroll}
            <ChevronDown className="h-5 w-5" />
          </motion.a>
        </section>

        {/* ------------------------- Dish-name ticker ------------------------ */}
        <div className="border-y-2 border-forest bg-lime py-4 text-forest" aria-hidden>
          <Marquee duration={Math.max(90, marqueeNames.length * 9)} pauseOnHover>
            {marqueeNames.map((n, i) => (
              <span key={i} className="mx-6 inline-flex items-center gap-6 font-display text-2xl font-extrabold lg:text-3xl">
                {n}
                <Symbol name="star" className="h-6 w-6" />
              </span>
            ))}
          </Marquee>
        </div>

        {/* ------------------------- Dish of the week ------------------------ */}
        <section id="week" className="relative scroll-mt-20 overflow-hidden bg-forest-700 py-24 text-cream">
          <Motif name="palm-fronds" className="pointer-events-none absolute right-8 top-8 w-28 text-lime/20" />
          <div className="relative z-10 mx-auto max-w-7xl px-5">
            {menu.weekly ? (
              <WeekFeature weekly={menu.weekly} weekRange={weekRange} t={t} money={money} pick={pick} />
            ) : (
              <Reveal>
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-lime">{t.weekKicker}</span>
                <div className="mt-5 flex items-center gap-5 rounded-3xl border-2 border-dashed border-cream/20 p-7">
                  <Sparkles className="h-10 w-10 shrink-0 text-lime" />
                  <div>
                    <h2 className="font-display text-2xl font-bold">{t.noWeekTitle}</h2>
                    <p className="mt-1 text-cream/65">{t.noWeekBody}</p>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        <FriezeDivider />

        {/* ----------------------------- Kerala teaser ------------------------ */}
        <section className="bg-cream py-12 text-forest">
          <div className="mx-auto max-w-6xl px-5">
            <Link
              href="/kerala"
              className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9"
              style={{ background: "linear-gradient(120deg, #134033 0%, #02664C 100%)", color: "#F9F1E4" }}
            >
              <Symbol name="sunring" className="pointer-events-none absolute -right-8 -top-10 h-56 w-56 rotate-12 text-lime opacity-15 transition-transform duration-700 group-hover:rotate-[40deg]" />
              <div className="relative">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-lime">{t.atlasKicker}</span>
                <h3 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{t.atlasTitle}</h3>
                <p className="mt-2 max-w-xl text-cream/75">{t.atlasBody}</p>
              </div>
              <span className="relative inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-lime px-6 py-3 font-semibold text-forest transition-colors group-hover:bg-cream sm:self-center">
                {t.atlasCta} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </section>

        {/* ----------------------------- Full menu --------------------------- */}
        <section id="all" className="relative scroll-mt-20 bg-forest text-cream">
          <div className="mx-auto max-w-7xl px-5 pb-6 pt-24">
            <Reveal>
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-lime">{t.allKicker}</span>
              <h2 className="mt-3 font-display text-5xl font-extrabold leading-[0.95] text-lime lg:text-7xl">{t.allTitle}</h2>
            </Reveal>

            {SHOW_CATEGORY_TILES && <>
            <p className="mb-4 mt-12 text-sm font-semibold uppercase tracking-[0.25em] text-cream/55">{t.explore}</p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {streetCount > 0 && (
                <motion.button
                  type="button"
                  onClick={showStreet}
                  initial={{ opacity: 0, y: 30, scale: 0.94 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -6, rotate: -1 }}
                  whileTap={{ scale: 0.96 }}
                  className="group relative col-span-2 overflow-hidden rounded-3xl p-5 text-left shadow-lg sm:p-6 lg:aspect-[5/4] lg:col-span-1"
                  style={{ background: "linear-gradient(135deg, #F21B07 0%, #FF7008 55%, #FFCA40 100%)", color: "#F9F1E4" }}
                >
                  <Symbol name="shakers" className="absolute -bottom-6 -right-4 h-36 w-36 opacity-25 transition-transform duration-700 group-hover:rotate-[24deg] group-hover:scale-125" />
                  <span className="relative z-10 inline-block rounded-full bg-forest px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-lime">{menu.dishes.length ? streetCount : 0}</span>
                  <div className="relative z-10 mt-6 flex flex-col lg:mt-10">
                    <span className="font-display text-xl font-extrabold leading-tight sm:text-2xl">{t.streetTitle}</span>
                    <span className="mt-1 text-xs font-semibold opacity-85">{t.streetBody}</span>
                  </div>
                </motion.button>
              )}
              {allCats.map((c, i) => {
                const th = themes[c];
                return (
                  <motion.button
                    key={c}
                    type="button"
                    onClick={() => jump(c)}
                    initial={{ opacity: 0, y: 30, scale: 0.94 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
                    whileHover={{ y: -6, rotate: i % 2 ? -1.5 : 1.5 }}
                    whileTap={{ scale: 0.96 }}
                    className="group relative aspect-[5/4] overflow-hidden rounded-3xl p-4 text-left shadow-lg sm:p-5"
                    style={{ background: th.bg, color: th.fg }}
                  >
                    <Symbol name={th.symbol} className="absolute -bottom-6 -right-6 h-32 w-32 opacity-25 transition-transform duration-700 group-hover:rotate-[24deg] group-hover:scale-125 sm:h-36 sm:w-36" />
                    {th.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={th.image}
                        alt=""
                        loading="lazy"
                        className="absolute right-3 top-3 h-16 w-16 rotate-6 rounded-full border-4 object-cover shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:h-20 sm:w-20"
                        style={{ borderColor: th.fg === "#F9F1E4" ? th.bg : "#F9F1E4" }}
                      />
                    )}
                    {!th.image && <Symbol name={th.symbol} className="absolute right-3 top-3 h-12 w-12 transition-transform duration-500 group-hover:scale-125 sm:h-14 sm:w-14" />}
                    <div className="relative z-10 flex h-full flex-col justify-end">
                      <span className="font-display text-lg font-extrabold leading-tight sm:text-xl">{shortLabel(c)}</span>
                      <span className="mt-0.5 text-xs font-semibold opacity-70">{t.dishesN(countOf(c))}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            </>}
          </div>

          <div className="sticky top-[68px] z-30 border-y border-lime/15 bg-forest/95 backdrop-blur-md">
            <div className="mx-auto max-w-7xl space-y-3 px-5 py-3">
              <div className="flex flex-wrap items-center gap-3">
                <label className="relative min-w-[200px] flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/50" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.search}
                    aria-label={t.search}
                    className="w-full rounded-full border-2 border-cream/15 bg-forest-700 py-2.5 pl-11 pr-10 text-sm outline-none transition-colors focus:border-lime"
                  />
                  {query && (
                    <button onClick={() => setQuery("")} aria-label={t.reset} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/50 hover:text-lime"><X className="h-4 w-4" /></button>
                  )}
                </label>
                <div className="flex gap-1 rounded-full bg-forest-700 p-1" role="group">
                  {(["all", "veg", "vegan"] as const).map((k) => (
                    <button key={k} onClick={() => setDiet(k)} aria-pressed={diet === k} className="relative rounded-full px-4 py-1.5 text-sm font-semibold">
                      {diet === k && <motion.span layoutId="diet-pill" className="absolute inset-0 rounded-full bg-lime" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                      <span className={`relative z-10 ${diet === k ? "text-forest" : "text-cream/75"}`}>{k === "all" ? t.all : k === "veg" ? t.veg : t.vegan}</span>
                    </button>
                  ))}
                </div>
              </div>
              {street && (
                <button onClick={() => setStreet(false)} className="inline-flex items-center gap-2 rounded-full bg-chili px-4 py-1.5 text-sm font-bold text-cream">
                  {t.streetOn} <X className="h-4 w-4" />
                </button>
              )}
              <div className="flex items-center gap-2">
              <CategoryButton onClick={() => setCatsOpen(true)} />
              <nav ref={chipBar} aria-label="Categories" className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                {groups.map((g) => (
                  <a key={g.key} href={`#cat-${slug(g.key)}`} data-active={activeCat === g.key} className="relative flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold">
                    {activeCat === g.key && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full" style={{ background: themes[g.key]?.bg }} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                    <span className="relative z-10 h-2.5 w-2.5 rounded-full" style={{ background: activeCat === g.key ? themes[g.key]?.fg : themes[g.key]?.bg }} />
                    <span className={`relative z-10 ${activeCat === g.key ? "" : "text-cream/75 hover:text-cream"}`} style={activeCat === g.key ? { color: themes[g.key]?.fg } : undefined}>{shortLabel(g.key)}</span>
                  </a>
                ))}
              </nav>
              </div>
            </div>
            <CategorySheet
              open={catsOpen}
              onClose={() => setCatsOpen(false)}
              activeKey={activeCat}
              items={allCats.map((c) => ({ key: c, label: shortLabel(c), count: countOf(c), image: menu.dishes.find((d) => d.category === c && d.image_url)?.image_url ?? null, emoji: menu.dishes.find((d) => d.category === c && d.emoji)?.emoji ?? null }))}
              onPick={jump}
            />
          </div>

          <div className="mx-auto max-w-7xl px-5 pb-40 pt-12">
            {groups.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-lg text-cream/70">{t.noMatch}</p>
                <button onClick={() => { setQuery(""); setDiet("all"); setStreet(false); }} className="mt-5 rounded-full border-2 border-lime px-6 py-2.5 font-semibold text-lime transition-colors hover:bg-lime hover:text-forest">{t.reset}</button>
              </div>
            )}
            {groups.map((g) => {
              const th = themes[g.key];
              return (
                <div key={g.key} id={`cat-${slug(g.key)}`} data-cat={g.key} className="scroll-mt-44 pb-14">
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: [0.21, 0.7, 0.25, 1] }}
                    className="relative mb-6 flex items-center gap-4 overflow-hidden rounded-3xl px-5 py-4 sm:px-7 sm:py-5"
                    style={{ background: th.bg, color: th.fg }}
                  >
                    <Symbol name={th.symbol} className="absolute -right-4 -top-6 h-36 w-36 rotate-12 opacity-20" />
                    <Symbol name={th.symbol} className="relative h-11 w-11 shrink-0 sm:h-14 sm:w-14" />
                    <h3 className="relative font-display text-2xl font-extrabold leading-tight sm:text-4xl">{g.label}</h3>
                    <span className="relative ml-auto rounded-full px-3 py-1 text-sm font-bold" style={{ background: th.fg, color: th.bg }}>{g.dishes.length}</span>
                  </motion.div>
                  <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                      {g.dishes.map((d) => {
                        const name = pick(d.name_de, d.name);
                        const desc = pick(d.description_de, d.description);
                        return (
                          <motion.div
                            layout
                            key={d.id}
                            initial={{ opacity: 0, scale: 0.92 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-30px" }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            whileHover={{ y: -6 }}
                            style={{ ["--c" as string]: th.bg }}
                            className="group flex flex-col overflow-hidden rounded-3xl border-2 border-cream/10 bg-forest-700 transition-colors hover:[border-color:var(--c)]"
                          >
                            <div
                              role="button"
                              tabIndex={0}
                              aria-label={name}
                              onClick={() => setQuick(d)}
                              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setQuick(d))}
                              className="flex flex-1 cursor-pointer flex-col outline-none focus-visible:ring-2 focus-visible:ring-lime"
                            >
                              <motion.div layoutId={`vis-${d.id}`} className="aspect-[16/10] overflow-hidden"><DishVisual dish={d} theme={th} /></motion.div>
                              <div className="flex flex-1 flex-col p-5 pb-3">
                                <div className="flex items-start justify-between gap-3">
                                  <h4 className="font-display text-lg font-bold leading-snug">{name}</h4>
                                  <span className="shrink-0 font-display font-extrabold text-lime">{money(d.price)}</span>
                                </div>
                                {d.diet && (
                                  <span className="mt-2 inline-flex w-fit rounded-full bg-lime/15 px-2.5 py-0.5 text-[11px] font-semibold text-lime">
                                    {d.diet === "vegan" ? "🌱 " + t.vegan : "🟢 " + t.veg}
                                  </span>
                                )}
                                {desc && <p className="mt-2 line-clamp-2 text-sm text-cream/60">{desc}</p>}
                              </div>
                            </div>
                            <div className="px-5 pb-5"><AddControl dish={d} name={name} t={t} compact /></div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
                </div>
              );
            })}
            <p className="text-center text-xs text-cream/45">{t.vat}</p>
          </div>
        </section>

        {/* ------------------------------- CTA ------------------------------- */}
        <section className="relative overflow-hidden bg-lime py-24 text-forest">
          <Motif name="elephants" className="pointer-events-none absolute -bottom-6 right-6 w-48 text-forest/15 lg:w-72" />
          <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
            <Reveal>
              <h2 className="font-display text-5xl font-extrabold leading-[0.95] lg:text-7xl">{t.ctaTitle}</h2>
              <p className="mt-5 text-lg text-forest/80">{t.ctaBody}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Magnetic>
                  <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 text-lg font-semibold text-lime transition-colors hover:bg-forest-900">
                    {t.order} <ArrowRight className="h-5 w-5" />
                  </button>
                </Magnetic>
                <Magnetic>
                  <Link href="/#reservation" className="inline-flex items-center gap-2 rounded-full border-2 border-forest px-8 py-4 text-lg font-semibold transition-colors hover:bg-forest hover:text-lime">{t.reserve}</Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ---------------------------- Quick view --------------------------- */}
      <AnimatePresence>
        {quick && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setQuick(null)} className="fixed inset-0 z-[80] bg-forest-900/85 backdrop-blur-sm" />
            <div role="dialog" aria-modal="true" aria-label={pick(quick.name_de, quick.name)} className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="soft-shadow pointer-events-auto grid max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border-2 border-lime bg-forest-700 text-cream md:grid-cols-2"
              >
                <motion.div layoutId={`vis-${quick.id}`} className="group aspect-square overflow-hidden md:aspect-auto md:min-h-[380px]">
                  <DishVisual dish={quick} theme={themes[quick.category]} />
                </motion.div>
                <div className="flex flex-col p-7">
                  <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider" style={{ background: themes[quick.category]?.bg, color: themes[quick.category]?.fg }}>
                      <Symbol name={themes[quick.category]?.symbol ?? "greens"} className="h-4 w-4" /> {labelOf(quick.category)}
                    </span>
                    <button onClick={() => setQuick(null)} aria-label={t.close} className="text-cream/50 transition-colors hover:text-lime"><X className="h-6 w-6" /></button>
                  </div>
                  <h3 className="mt-4 font-display text-3xl font-extrabold leading-tight">{pick(quick.name_de, quick.name)}</h3>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="font-display text-2xl font-extrabold text-lime">{money(quick.price)}</span>
                    {quick.diet && <span className="rounded-full bg-lime/15 px-2.5 py-0.5 text-xs font-semibold text-lime">{quick.diet === "vegan" ? "🌱 " + t.vegan : "🟢 " + t.veg}</span>}
                  </div>
                  {pick(quick.description_de, quick.description) && <p className="mt-4 leading-relaxed text-cream/75">{pick(quick.description_de, quick.description)}</p>}
                  <div className="mt-auto pt-6"><AddControl dish={quick} name={pick(quick.name_de, quick.name)} t={t} /></div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* ---------------------------- Order bar ---------------------------- */}
      <AnimatePresence>
        {count > 0 && (
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
                <div className="text-xs text-cream/65">{t.items(count)}</div>
                <div className="font-display text-lg font-extrabold text-lime">{money(total)}</div>
              </div>
              <button onClick={() => setOpen(true)} className="shrink-0 rounded-full bg-lime px-4 py-1.5 text-sm font-bold text-forest transition-colors hover:bg-cream">{t.viewOrder}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FriezeDivider ornate />
      <Footer />
    </div>
  );
};

export default MenuPage;
