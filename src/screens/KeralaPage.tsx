"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import { Motif } from "@/components/Brand";
import { FriezeDivider, StampField } from "@/components/BrandDecor";
import KeralaAtlas from "@/screens/KeralaAtlas";
import type { MenuDish } from "@/lib/menu";

const strings = (de: boolean) =>
  de
    ? {
        kicker: "Unser Kerala",
        h1a: "Die Küchen",
        h1b: "Keralas.",
        sub: "Kerala ist ein schmaler Küstenstreifen mit vielen Küchen, vielen Glaubensrichtungen und tausend Arten, Reis zu kochen. Das ist die Landkarte hinter unserer Speisekarte.",
        ctaTitle: "Hunger bekommen?",
        ctaBody: "Schau, was gerade auf der Karte steht.",
        menu: "Zur Speisekarte",
        reserve: "Tisch reservieren",
      }
    : {
        kicker: "Our Kerala",
        h1a: "The kitchens",
        h1b: "of Kerala.",
        sub: "Kerala is one narrow coast with many kitchens, many faiths and a thousand ways to cook rice. Here is the map behind our menu.",
        ctaTitle: "Hungry yet?",
        ctaBody: "See what is on the menu right now.",
        menu: "See the menu",
        reserve: "Reserve a table",
      };

const KeralaPage = ({ dishes }: { dishes: MenuDish[] }) => {
  const { i18n } = useTranslation();
  const de = (i18n.language || "en").startsWith("de");
  const t = strings(de);
  const router = useRouter();

  return (
    <div className="grain relative">
      <Navbar />
      <CartDrawer />
      <main>
        <section className="relative overflow-hidden bg-forest pb-20 pt-36 text-cream lg:pt-44">
          <Motif name="palm-tree" className="pointer-events-none absolute -left-10 top-24 w-48 origin-bottom animate-sway text-lime/15 lg:w-72" />
          <Motif name="waves" className="pointer-events-none absolute bottom-0 left-1/2 w-[120%] -translate-x-1/2 text-lime/10" />
          <StampField variant="menu" />
          <div className="relative z-10 mx-auto max-w-7xl px-5">
            <motion.span initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex rounded-full bg-lime/15 px-4 py-1.5 text-sm font-semibold text-lime">
              {t.kicker}
            </motion.span>
            <h1 className="mt-6 font-display text-[clamp(3rem,10.5vw,8.5rem)] font-extrabold leading-[0.92] tracking-tight">
              {[t.h1a, t.h1b].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span className={`block ${i === 1 ? "text-lime" : ""}`} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.3 + i * 0.15, ease: [0.21, 0.7, 0.25, 1] }}>
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-7 max-w-2xl text-lg text-cream/75">
              {t.sub}
            </motion.p>
          </div>
        </section>

        <FriezeDivider />

        <section className="relative overflow-hidden bg-cream py-24 text-forest">
          <StampField variant="about" />
          <KeralaAtlas de={de} dishes={dishes} showHeading={false} onPick={(q) => router.push(`/menu?q=${encodeURIComponent(q)}`)} />
        </section>

        <section className="relative overflow-hidden bg-lime py-24 text-forest">
          <Motif name="elephants" className="pointer-events-none absolute -bottom-6 right-6 w-48 text-forest/15 lg:w-72" />
          <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
            <Reveal>
              <h2 className="font-display text-5xl font-extrabold leading-[0.95] lg:text-7xl">{t.ctaTitle}</h2>
              <p className="mt-5 text-lg text-forest/80">{t.ctaBody}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Magnetic>
                  <Link href="/menu" className="inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 text-lg font-semibold text-lime transition-colors hover:bg-forest-900">
                    {t.menu} <ArrowRight className="h-5 w-5" />
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href="/#reservation" className="inline-flex items-center gap-2 rounded-full border-2 border-forest px-8 py-4 text-lg font-semibold transition-colors hover:bg-forest hover:text-lime">{t.reserve}</Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <FriezeDivider ornate />
      <Footer />
    </div>
  );
};

export default KeralaPage;
