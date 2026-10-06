"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMenuGlimpse } from "@/hooks/useMenuGlimpse";
import { useCart } from "@/context/CartContext";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";
import { Motif } from "./Brand";
import DishVisual from "./DishVisual";
import { StampField } from "./BrandDecor";
import type { MenuDish } from "@/lib/menu";

const eur = (n: number, lang: string) =>
  new Intl.NumberFormat(lang.startsWith("de") ? "de-DE" : "en-GB", { style: "currency", currency: "EUR" }).format(n);

// Home-page teaser for the rotating menu: the story, the dish of the
// week and a glimpse of what is live now, leading to the full /menu page.
const Menu = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const de = lang.startsWith("de");
  const { weekly, picks, total } = useMenuGlimpse();
  const { setOpen } = useCart();
  const name = (d: MenuDish) => (de && d.name_de ? d.name_de : d.name);

  return (
    <section id="menu" className="relative overflow-hidden bg-forest py-28 text-cream">
      <Motif name="palm-tree" className="pointer-events-none absolute -right-12 top-24 w-64 origin-bottom animate-sway text-lime/10" />
      <Motif name="waves" className="pointer-events-none absolute bottom-10 left-0 w-[60%] text-lime/10" />
      <StampField variant="menu" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-12">
        {/* Story */}
        <div className="lg:col-span-5">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-lime">{t("menu.kicker")}</span>
            <h2 className="mt-3 font-display text-5xl font-extrabold leading-[0.95] text-lime lg:text-7xl">{t("menu.title")}</h2>
            <p className="mt-6 text-lg leading-relaxed text-cream/75">{t("menu.story")}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <span className="rounded-full border-2 border-cream/15 px-4 py-1.5 text-sm font-medium text-cream/85">Malabar → Travancore</span>
              {total > 0 && <span className="rounded-full border-2 border-cream/15 px-4 py-1.5 text-sm font-medium text-cream/85">{t("menu.live", { count: total })}</span>}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-9 flex flex-wrap gap-4">
              <Magnetic>
                <Link href="/menu" className="soft-shadow inline-flex items-center gap-2 rounded-full bg-lime px-8 py-4 text-lg font-semibold text-forest transition-colors hover:bg-cream">
                  {t("menu.full")} <ArrowRight className="h-5 w-5" />
                </Link>
              </Magnetic>
              <Magnetic>
                <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full border-2 border-cream/40 px-8 py-4 text-lg font-semibold text-cream transition-colors hover:border-lime hover:text-lime">
                  {t("menu.cta")}
                </button>
              </Magnetic>
            </div>
          </Reveal>
        </div>

        {/* Glimpse */}
        <div className="space-y-5 lg:col-span-7">
          {weekly && (
            <Reveal>
              <Link
                href="/menu#week"
                data-cursor="hover"
                className="group grid overflow-hidden rounded-3xl border-2 border-lime bg-forest-700 shadow-[0_24px_70px_-30px_rgba(192,242,82,0.45)] transition-transform duration-300 hover:-translate-y-1 sm:grid-cols-5"
              >
                <div className="relative aspect-[4/3] overflow-hidden sm:col-span-2 sm:aspect-auto sm:min-h-[260px]">
                  <DishVisual dish={weekly.dish} />
                  <span className="absolute left-3 top-3 inline-flex -rotate-3 items-center gap-1 rounded-full bg-chili px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cream">
                    <Sparkles className="h-3 w-3" /> {t("menu.week")}
                  </span>
                </div>
                <div className="flex flex-col justify-center p-6 sm:col-span-3 sm:p-8">
                  {weekly.region && <span className="text-xs font-bold uppercase tracking-widest text-lime">{weekly.region}</span>}
                  <h3 className="mt-1 font-display text-3xl font-extrabold leading-tight">{name(weekly.dish)}</h3>
                  {weekly.headline && <p className="mt-2 font-display text-lg font-bold text-lime">{weekly.headline}</p>}
                  <p className="mt-3 line-clamp-3 text-sm text-cream/65">{(weekly.story ?? "").split(/\n\s*\n/)[0] || (de && weekly.dish.description_de ? weekly.dish.description_de : weekly.dish.description)}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-lime">
                    {eur(weekly.dish.price, lang)} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          <div className={`grid gap-4 ${weekly ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}>
            {picks.slice(0, weekly ? 4 : 4).map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link href="/menu#all" data-cursor="hover" className="group block overflow-hidden rounded-2xl border-2 border-cream/10 bg-forest-700 transition-colors hover:border-lime">
                  <div className="aspect-[4/3] overflow-hidden"><DishVisual dish={d} /></div>
                  <div className="p-3.5">
                    <div className="line-clamp-2 text-sm font-bold leading-snug transition-colors group-hover:text-lime">{name(d)}</div>
                    <div className="mt-1 text-sm font-semibold text-lime">{eur(d.price, lang)}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Menu;
