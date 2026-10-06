"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/Marquee";
import Magnetic from "@/components/Magnetic";
import CartDrawer from "@/components/CartDrawer";
import { Motif, Symbol, type SymbolName } from "@/components/Brand";
import { FriezeDivider, StampField } from "@/components/BrandDecor";
import { DISHES, FAQS, GROUPS, GROUP_ORDER, SEASONS, STEPS, type Dish, type GroupId } from "@/lib/onam-sadhya";

const MALAYALAM = '"Noto Sans Malayalam","Malayalam Sangam MN","Kartika",sans-serif';

const GROUP_SYMBOL: Record<GroupId, SymbolName> = {
  sides: "cardamom",
  veg: "greens",
  rice: "paddy",
  sweet: "star",
};

// ---------------------------------------------------------------------------
// Pookalam — the flower carpet laid out for Onam, drawn as counter-rotating
// rings of petals in the brand palette.
// ---------------------------------------------------------------------------
const RINGS = [
  { n: 36, r: 178, len: 20, w: 8, fill: "#F21B07", secs: 90 },
  { n: 28, r: 146, len: 24, w: 10, fill: "#FF7008", secs: 70 },
  { n: 22, r: 112, len: 24, w: 11, fill: "#FFCA40", secs: 60 },
  { n: 16, r: 80, len: 22, w: 12, fill: "#C0F252", secs: 50 },
  { n: 10, r: 52, len: 18, w: 11, fill: "#F9F1E4", secs: 40 },
];

const Pookalam = () => (
  <div className="relative mx-auto aspect-square w-full max-w-[520px]">
    <div className="absolute inset-[4%] rounded-full bg-forest-900/50 ring-4 ring-lime/30" />
    {RINGS.map((ring, i) => (
      <svg
        key={ring.r}
        viewBox="-200 -200 400 400"
        aria-hidden
        className="absolute inset-0 h-full w-full animate-spin-slow motion-reduce:animate-none"
        style={{ animationDuration: `${ring.secs}s`, animationDirection: i % 2 ? "reverse" : "normal" }}
      >
        {Array.from({ length: ring.n }).map((_, k) => (
          <ellipse
            key={k}
            cx={0}
            cy={-ring.r}
            rx={ring.w}
            ry={ring.len}
            fill={ring.fill}
            opacity={k % 2 ? 0.92 : 1}
            transform={`rotate(${(k * 360) / ring.n})`}
          />
        ))}
      </svg>
    ))}
    <div className="absolute inset-[38%] flex items-center justify-center rounded-full bg-lime text-forest shadow-xl">
      <Symbol name="sadya" className="h-3/4 w-3/4" />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// The banana leaf — every dish has its place. Hover, tap or focus a dish.
// ---------------------------------------------------------------------------
const LEAF_PATH =
  "M20,220 C160,60 420,30 700,70 C860,92 950,160 985,220 C950,280 860,348 700,370 C420,410 160,380 20,220 Z";

const veins = Array.from({ length: 27 }).flatMap((_, i) => {
  const x = 90 + i * 33;
  return [
    { x1: x, y1: 220, x2: x + 70, y2: -20, key: `t${i}` },
    { x1: x, y1: 220, x2: x + 70, y2: 460, key: `b${i}` },
  ];
});

const Leaf = ({ active, onPick }: { active: string; onPick: (id: string) => void }) => (
  <svg viewBox="0 0 1000 440" role="group" aria-label="A banana leaf with the eighteen sadhya dishes" className="h-auto w-full">
    <defs>
      <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7BD348" />
        <stop offset="1" stopColor="#02664C" />
      </linearGradient>
      <clipPath id="leafClip">
        <path d={LEAF_PATH} />
      </clipPath>
    </defs>
    <path d={LEAF_PATH} fill="url(#leafGrad)" stroke="#C0F252" strokeWidth="4" />
    <g clipPath="url(#leafClip)" stroke="#0A2620" strokeOpacity="0.22" strokeWidth="2" fill="none">
      {veins.map((v) => (
        <line key={v.key} x1={v.x1} y1={v.y1} x2={v.x2} y2={v.y2} />
      ))}
    </g>
    <path d="M20,220 L985,220" stroke="#C0F252" strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" />

    {DISHES.map((d) => {
      const on = d.id === active;
      return (
        <g
          key={d.id}
          role="button"
          tabIndex={0}
          aria-label={`${d.name}: ${d.desc}`}
          aria-pressed={on}
          className="cursor-pointer outline-none"
          onMouseEnter={() => onPick(d.id)}
          onFocus={() => onPick(d.id)}
          onClick={() => onPick(d.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onPick(d.id);
            }
          }}
        >
          <circle cx={d.x} cy={d.y} r={Math.max(d.r + 12, 28)} fill="transparent" />
          {on && <circle cx={d.x} cy={d.y} r={d.r + 9} fill="none" stroke="#0A2620" strokeWidth="4" strokeDasharray="6 5" />}
          <circle cx={d.x} cy={d.y} r={d.r} fill={d.fill ?? GROUPS[d.group].color} stroke="#0A2620" strokeWidth={on ? 4 : 2} />
          {d.id === "matta-rice" && <circle cx={d.x} cy={d.y} r={d.r - 14} fill="none" stroke="#C0F252" strokeWidth="3" strokeDasharray="2 7" strokeLinecap="round" />}
          <text
            x={d.x}
            y={d.y + d.r + 17}
            textAnchor="middle"
            fontSize="14"
            fontWeight={on ? 700 : 500}
            fill="#F9F1E4"
            stroke="#0A2620"
            strokeWidth="4"
            paintOrder="stroke"
          >
            {d.name}
          </text>
        </g>
      );
    })}
  </svg>
);

const SectionKicker = ({ children, tone = "text-lime" }: { children: React.ReactNode; tone?: string }) => (
  <span className={`text-sm font-semibold uppercase tracking-[0.25em] ${tone}`}>{children}</span>
);

const OnamSadhya = () => {
  const [activeId, setActiveId] = useState("avial");
  const active = useMemo<Dish>(() => DISHES.find((d) => d.id === activeId) ?? DISHES[0], [activeId]);
  const total = DISHES.length;
  const marquee = ["ONAM SADHYA", "ഓണസദ്യ", `${total} DISHES`, "ONE BANANA LEAF", "COOKED IN BERLIN"];

  return (
    <div className="grain relative">
      <Navbar />
      <CartDrawer />
      <main>
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="relative overflow-hidden bg-forest pb-20 pt-32 text-cream lg:pt-36">
          <Motif name="palm-tree" className="pointer-events-none absolute -left-10 top-24 w-48 origin-bottom animate-sway text-lime/15 lg:w-72" />
          <Motif name="waves" className="pointer-events-none absolute bottom-0 left-1/2 w-[120%] -translate-x-1/2 text-lime/10" />
          <StampField variant="hero" />

          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-7 inline-flex items-center gap-2.5 rounded-full bg-lime/15 p-1.5 text-lime">
                <span className="rounded-full bg-lime px-2.5 py-0.5 text-[11px] font-bold text-forest">Kerala harvest feast</span>
                <span className="pr-3 text-xs font-medium">This season is over. See you next Onam.</span>
              </motion.div>

              <h1 className="font-display text-[17vw] font-extrabold leading-[0.92] tracking-tight lg:text-[8.2vw]">
                {["Onam", "Sadhya", "in Berlin"].map((line, i) => (
                  <span key={line} className="block overflow-hidden">
                    <motion.span
                      className={`block ${i === 1 ? "text-lime" : "text-cream"}`}
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease: [0.21, 0.7, 0.25, 1] }}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                aria-hidden
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                style={{ fontFamily: MALAYALAM, WebkitTextStroke: "2px #C0F252" }}
                className="mt-4 text-5xl font-bold text-transparent lg:text-7xl"
              >
                ഓണസദ്യ
              </motion.p>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }} className="mt-6 max-w-xl text-lg text-cream/75">
                {total} dishes. One banana leaf. The whole Kerala harvest feast, cooked in our Berlin kitchen the way it is cooked at home.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }} className="mt-9 flex flex-wrap gap-4">
                <Magnetic>
                  <a href="#leaf" className="soft-shadow inline-flex items-center gap-2 rounded-full bg-lime px-8 py-4 text-lg font-semibold text-forest transition-colors hover:bg-cream">
                    Meet the leaf <ArrowRight className="h-5 w-5" />
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="#next" className="inline-flex items-center gap-2 rounded-full border-2 border-cream/40 px-8 py-4 text-lg font-semibold text-cream transition-colors hover:border-lime hover:text-lime">
                    Next Onam
                  </a>
                </Magnetic>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.4 }} className="lg:col-span-5">
              <Pookalam />
            </motion.div>
          </div>
        </section>

        {/* ----------------------------- Marquee ---------------------------- */}
        <div className="border-y-2 border-forest bg-lime py-4 text-forest">
          <Marquee>
            {marquee.concat(marquee).map((m, i) => (
              <span key={i} className="mx-6 inline-flex items-center gap-6 font-display text-2xl font-extrabold lg:text-3xl" style={m === "ഓണസദ്യ" ? { fontFamily: MALAYALAM } : undefined}>
                {m}
                <Symbol name="star" className="h-6 w-6" />
              </span>
            ))}
          </Marquee>
        </div>

        {/* ------------------------------ Story ----------------------------- */}
        <section className="relative overflow-hidden bg-cream py-24 text-forest">
          <StampField variant="about" />
          <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <SectionKicker tone="text-chili">What is a sadhya?</SectionKicker>
              <h2 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] lg:text-7xl">
                A feast with a place for <span className="text-chili">everything.</span>
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-forest/80">
                Onam is Kerala&apos;s harvest festival, and the sadhya is its heart: a vegetarian feast of many small dishes served together on a banana leaf, where every dish has its own spot and its own moment.
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-forest/80">
                At kokoland we cook it in Berlin the way it is cooked at home, with matta rice, slow coconut curries, tamarind and jaggery, and a payasam to finish.
              </p>
            </Reveal>

            <Reveal delay={0.15} className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { big: String(total), small: "dishes on one leaf", tone: "bg-forest text-lime" },
                  { big: "1", small: "banana leaf, zero cutlery", tone: "bg-lime text-forest" },
                  { big: "2022", small: "first sadhya in Berlin", tone: "bg-chili text-cream" },
                  { big: "100%", small: "vegetarian", tone: "bg-gold text-forest" },
                ].map((s, i) => (
                  <div key={s.small} className={`rounded-3xl p-6 ${s.tone} ${i % 2 ? "translate-y-6" : ""}`}>
                    <div className="font-display text-5xl font-extrabold leading-none">{s.big}</div>
                    <div className="mt-2 text-sm font-medium opacity-80">{s.small}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <FriezeDivider />

        {/* ------------------------------- Leaf ----------------------------- */}
        <section id="leaf" className="relative overflow-hidden bg-forest-700 py-24 text-cream">
          <Motif name="palm-fronds" className="pointer-events-none absolute right-10 top-10 w-28 text-lime/20" />
          <div className="relative z-10 mx-auto max-w-6xl px-5">
            <Reveal>
              <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-5xl font-extrabold leading-[0.95] lg:text-7xl">
                  The <span className="text-lime">leaf.</span>
                </h2>
                <SectionKicker>Tap a dish to meet it</SectionKicker>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="-mx-5 overflow-x-auto px-5 pb-2">
                <div className="min-w-[720px]">
                  <Leaf active={activeId} onPick={setActiveId} />
                </div>
              </div>
              <p className="mt-1 text-center text-xs text-cream/50 sm:hidden">Swipe sideways to see the whole leaf</p>
            </Reveal>

            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              aria-live="polite"
              className="mx-auto mt-6 flex max-w-2xl items-center gap-5 rounded-3xl border-2 border-lime/30 bg-forest-900/60 p-6"
            >
              <span className="h-14 w-14 shrink-0 rounded-full border-4 border-forest-900" style={{ background: active.fill ?? GROUPS[active.group].color }} />
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lime">
                  {GROUPS[active.group].label} · {DISHES.indexOf(active) + 1} of {total}
                </div>
                <div className="font-display text-3xl font-extrabold">{active.name}</div>
                <p className="mt-1 text-cream/75">{active.desc}</p>
              </div>
            </motion.div>
            <p className="mt-4 text-center text-xs text-cream/50">Households and regions lay the leaf a little differently. This is how we plate ours.</p>

            {/* The menu, as readable text */}
            <div className="mt-20 grid gap-5 md:grid-cols-2">
              {GROUP_ORDER.map((g) => {
                const dishes = DISHES.filter((d) => d.group === g);
                return (
                  <Reveal key={g}>
                    <div className="h-full rounded-3xl border-2 border-cream/10 p-7">
                      <div className="mb-5 flex items-center gap-4">
                        <span className="flex h-14 w-14 items-center justify-center rounded-full" style={{ background: GROUPS[g].color, color: "#134033" }}>
                          <Symbol name={GROUP_SYMBOL[g]} className="h-9 w-9" />
                        </span>
                        <div>
                          <h3 className="font-display text-2xl font-extrabold">{GROUPS[g].label}</h3>
                          <p className="text-sm text-cream/60">{GROUPS[g].blurb}</p>
                        </div>
                      </div>
                      <dl className="space-y-3">
                        {dishes.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setActiveId(d.id)}
                            className={`block w-full cursor-pointer rounded-xl px-3 py-2 text-left transition-colors ${d.id === activeId ? "bg-lime/15" : "hover:bg-cream/5"}`}
                          >
                            <dt className="font-display font-bold text-lime">{d.name}</dt>
                            <dd className="text-sm text-cream/75">{d.desc}</dd>
                          </button>
                        ))}
                      </dl>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ----------------------------- How to eat ------------------------- */}
        <section className="relative overflow-hidden bg-cream py-24 text-forest">
          <div className="relative z-10 mx-auto max-w-7xl px-5">
            <Reveal>
              <SectionKicker tone="text-chili">First time?</SectionKicker>
              <h2 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] lg:text-7xl">
                How to eat a <span className="text-chili">sadhya.</span>
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.08}>
                  <div className="h-full rounded-3xl bg-forest p-7 text-cream">
                    <div className="font-display text-7xl font-extrabold leading-none text-transparent" style={{ WebkitTextStroke: "2px #C0F252" }}>
                      {s.n}
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-extrabold text-lime">{s.title}</h3>
                    <p className="mt-2 text-cream/75">{s.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-6 text-sm text-forest/60">Every household orders things a little differently. This is the common route.</p>
          </div>
        </section>

        {/* ------------------------------ Seasons --------------------------- */}
        <section className="relative overflow-hidden bg-forest py-24 text-cream">
          <div className="relative z-10 mx-auto max-w-7xl px-5">
            <Reveal>
              <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
                <h2 className="font-display text-5xl font-extrabold leading-[0.95] lg:text-7xl">
                  Sadhya days <span className="text-lime">so far.</span>
                </h2>
                <SectionKicker>Crossed out means booked out</SectionKicker>
              </div>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SEASONS.map((s, i) => (
                <Reveal key={s.year} delay={i * 0.08}>
                  <div className="h-full rounded-3xl border-2 border-dashed border-lime/40 p-6">
                    <div className="font-display text-6xl font-extrabold leading-none text-lime">{s.year}</div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {s.dates.map((d) => (
                        <span key={d.label} className={`rounded-full border px-3 py-1 text-sm font-semibold ${d.soldOut ? "border-cream/20 text-cream/40 line-through" : "border-lime text-cream"}`}>
                          {d.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------- Next ---------------------------- */}
        <section id="next" className="relative overflow-hidden bg-lime py-24 text-forest">
          <Motif name="elephants" className="pointer-events-none absolute -bottom-6 right-6 w-48 text-forest/15 lg:w-72" />
          <Motif name="palm-fronds" className="pointer-events-none absolute left-6 top-6 w-24 text-forest/15" />
          <div className="relative z-10 mx-auto max-w-4xl px-5 text-center">
            <Reveal>
              <SectionKicker tone="text-forest">Next Onam</SectionKicker>
              <h2 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] lg:text-7xl">Save us a spot on the leaf.</h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-forest/80">
                Pre-orders are announced ahead of the festival and the best days go fast. Drop us a message and we will keep you in the loop.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Magnetic>
                  <Link href="/#contact" className="inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 text-lg font-semibold text-lime transition-colors hover:bg-forest-900">
                    Keep me posted <ArrowRight className="h-5 w-5" />
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href="/menu" className="inline-flex items-center gap-2 rounded-full border-2 border-forest px-8 py-4 text-lg font-semibold text-forest transition-colors hover:bg-forest hover:text-lime">
                    Hungry now? See the menu
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------- FAQ ------------------------------ */}
        <section className="bg-cream py-24 text-forest">
          <div className="mx-auto max-w-3xl px-5">
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold lg:text-5xl">
                Good to <span className="text-chili">know.</span>
              </h2>
            </Reveal>
            <div className="mt-10 divide-y-2 divide-forest/10 border-y-2 border-forest/10">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-bold">
                    {f.q}
                    <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-forest/80">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <FriezeDivider ornate />
      <Footer />
    </div>
  );
};

export default OnamSadhya;
