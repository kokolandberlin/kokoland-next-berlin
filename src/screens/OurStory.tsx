"use client";

import Link from "next/link";
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
import { chapters } from "@/data/story";

const strings = (de: boolean) =>
  de
    ? {
        kicker: "Unsere Story",
        h1a: "Von der Cloud Kitchen",
        h1b: "zu euch an den Tisch.",
        sub: "Seit 2021 kochen wir Kerala-Küche in Berlin: erst nur zum Liefern, dann auf Pop-ups, Märkten, Hochzeiten und an ein paar überraschenden Orten.",
        soon: "Fotos folgen",
        ctaTitle: "Lust auf mehr?",
        ctaBody: "Schau, was gerade auf der Karte steht, oder frag uns für dein Event an.",
        menu: "Zur Speisekarte",
        catering: "Catering anfragen",
      }
    : {
        kicker: "Our story",
        h1a: "From a cloud kitchen",
        h1b: "to your table.",
        sub: "Since 2021 we have been cooking Kerala food in Berlin: first for delivery only, then at pop-ups, markets, weddings and a few surprising places.",
        soon: "Photos coming soon",
        ctaTitle: "Hungry for more?",
        ctaBody: "See what is on the menu right now, or ask us about your event.",
        menu: "See the menu",
        catering: "Ask about catering",
      };

const OurStory = () => {
  const { i18n } = useTranslation();
  const de = (i18n.language || "en").startsWith("de");
  const t = strings(de);
  const pick = (b: { en: string; de: string }) => (de ? b.de : b.en);

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
            <h1 className="mt-6 font-display text-[clamp(2.6rem,8.5vw,7rem)] font-extrabold leading-[0.95] tracking-tight">
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
              {t.sub}
            </motion.p>
          </div>
        </section>

        <FriezeDivider />

        {/* Timeline */}
        <section className="relative overflow-hidden bg-cream py-24 text-forest">
          <div className="relative mx-auto max-w-6xl px-5">
            <div aria-hidden className="absolute bottom-0 left-[1.65rem] top-0 w-0.5 bg-forest/15 lg:left-1/2 lg:-translate-x-1/2" />
            <ol className="space-y-16 lg:space-y-24">
              {chapters.map((c, i) => {
                const flip = i % 2 === 1;
                return (
                  <li key={c.id} className="relative grid items-center gap-6 pl-14 lg:grid-cols-2 lg:gap-20 lg:pl-0">
                    <span aria-hidden className="absolute left-0 top-1 flex h-[3.3rem] w-[3.3rem] items-center justify-center rounded-full bg-forest text-center font-display text-[11px] font-extrabold uppercase leading-tight tracking-wide text-lime lg:left-1/2 lg:top-1/2 lg:h-16 lg:w-16 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:text-xs">
                      {pick(c.label)}
                    </span>

                    <Reveal className={flip ? "lg:order-2" : ""}>
                      <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{pick(c.title)}</h2>
                      <p className="mt-4 max-w-lg text-lg text-forest/70">{pick(c.text)}</p>
                      {c.items && (
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {c.items.map((it) => (
                            <li key={it} className="rounded-full border-2 border-forest/15 px-3.5 py-1.5 text-sm font-semibold">{it}</li>
                          ))}
                        </ul>
                      )}
                      {c.link && (
                        <Link href={c.link.href} className="group mt-5 inline-flex items-center gap-2 font-semibold text-chili">
                          {pick(c.link.label)} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      )}
                    </Reveal>

                    <Reveal delay={0.1} className={flip ? "lg:order-1" : ""}>
                      {c.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.photo.src} alt={c.photo.alt} loading="lazy" className="aspect-[4/3] w-full rounded-3xl border-4 border-forest object-cover" />
                      ) : (
                        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-forest/20 bg-lime/10">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={c.plate.src} alt="" aria-hidden loading="lazy" className="h-[78%] w-auto drop-shadow-[0_14px_16px_rgba(19,64,51,0.25)]" />
                          <span className="absolute bottom-3 right-4 text-xs font-semibold uppercase tracking-widest text-forest/40">{t.soon}</span>
                        </div>
                      )}
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="relative overflow-hidden bg-lime py-24 text-forest">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <Reveal>
              <h2 className="font-display text-4xl font-extrabold sm:text-6xl">{t.ctaTitle}</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-forest/75">{t.ctaBody}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Magnetic>
                  <Link href="/menu" className="soft-shadow inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 text-lg font-semibold text-lime transition-colors hover:bg-chili hover:text-cream">
                    {t.menu} <ArrowRight className="h-5 w-5" />
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link href="/catering" className="inline-flex items-center gap-2 rounded-full border-2 border-forest px-8 py-4 text-lg font-semibold transition-colors hover:bg-forest hover:text-lime">
                    {t.catering}
                  </Link>
                </Magnetic>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OurStory;
