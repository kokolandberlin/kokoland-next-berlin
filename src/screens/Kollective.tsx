"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Instagram } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";
import Magnetic from "@/components/Magnetic";
import Reveal from "@/components/Reveal";
import { Motif, Symbol, SymbolName } from "@/components/Brand";
const markRed = "/assets/brand/kollective/mark-red.svg";
const markLime = "/assets/brand/kollective/mark-lime.svg";

const IG = "https://www.instagram.com/kokoland.kollective/";

const pillars: { icon: SymbolName; key: string }[] = [
  { icon: "mridangam", key: "w1" },
  { icon: "bloom", key: "w2" },
  { icon: "sadya", key: "w3" },
  { icon: "cardamom", key: "w4" },
];

const events = [
  { day: "FR", key: "ev1" },
  { day: "SA", key: "ev2" },
  { day: "SO", key: "ev3" },
];

const Kollective = () => {
  const { t } = useTranslation();

  return (
    <div className="grain relative bg-forest text-cream">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-forest-900 overflow-hidden pt-32 pb-24">
        <Motif name="waves" className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[130%] text-lime/10 pointer-events-none" />
        <Motif name="palm-tree" className="absolute right-[-3rem] top-24 w-64 text-lime/10 animate-sway origin-bottom pointer-events-none" />

        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-cream/60 hover:text-lime transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> {t("kollective.back")}
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block bg-lime/15 text-lime rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest"
              >
                {t("kollective.badge")}
              </motion.span>
              <h1 className="font-display font-extrabold leading-[0.9] tracking-tight text-[15vw] lg:text-[7vw] mt-6">
                <span className="block text-cream">{t("kollective.title_pre")}</span>
                <span className="block text-lime">{t("kollective.title_accent")}</span>
              </h1>
              <p className="mt-7 max-w-xl text-lg text-cream/75">{t("kollective.hero_sub")}</p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Magnetic>
                  <a
                    href={IG}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-lime text-forest font-semibold text-lg rounded-full px-8 py-4 hover:bg-cream transition-colors soft-shadow"
                  >
                    <Instagram className="w-5 h-5" />
                    {t("kollective.hero_follow")}
                  </a>
                </Magnetic>
                <Magnetic>
                  <Link
                    href="/#contact"
                    className="inline-flex items-center gap-2 border-2 border-cream/40 text-cream font-semibold text-lg rounded-full px-8 py-4 hover:border-lime hover:text-lime transition-colors"
                  >
                    {t("kollective.hero_host")}
                  </Link>
                </Magnetic>
              </div>
            </div>

            {/* Spinning emblem */}
            <div className="flex justify-center">
              <motion.img
                src={markRed}
                alt="kokoland Kollective"
                className="w-64 sm:w-80 lg:w-[26rem] drop-shadow-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, ease: "linear", repeat: Infinity }}
              />
            </div>
          </div>
        </div>

        {/* bottom ribbon */}
        <div className="absolute bottom-0 inset-x-0 bg-lime text-forest py-3">
          <Marquee>
            {["LIVE MUSIC", "ART", "SUPPER CLUB", "CULTURE", "WORKSHOPS", "GOOD FOOD"].map((w) => (
              <span key={w} className="font-display font-bold text-lg mx-6 flex items-center gap-6">
                {w} <span className="text-chili">●</span>
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* What we host */}
      <section className="relative bg-cream text-forest py-28 overflow-hidden">
        <Motif name="coconut" className="absolute top-12 right-10 w-24 text-lime animate-float pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-chili">
              {t("kollective.what_kicker")}
            </span>
            <h2 className="font-display font-extrabold text-5xl lg:text-7xl mt-3 leading-[0.95]">
              {t("kollective.what_title")}
            </h2>
          </Reveal>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p, i) => (
              <Reveal key={p.key} delay={i * 0.08}>
                <div className="group h-full rounded-3xl border-2 border-forest/10 p-7 hover:border-lime hover:bg-forest hover:text-cream transition-all duration-300">
                  <Symbol name={p.icon} className="w-12 h-12 text-chili group-hover:text-lime transition-colors" />
                  <h3 className="font-display font-bold text-2xl mt-5">{t(`kollective.${p.key}_t`)}</h3>
                  <p className="text-sm opacity-70 mt-2">{t(`kollective.${p.key}_d`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <section className="relative bg-forest text-cream py-28 overflow-hidden">
        <Motif name="palm-fronds" className="absolute top-16 right-12 w-28 text-lime/20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 relative z-10">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-lime">
                  {t("kollective.upcoming_kicker")}
                </span>
                <h2 className="font-display font-extrabold text-5xl lg:text-7xl leading-[0.95] mt-3">
                  {t("kollective.upcoming_title")}
                </h2>
              </div>
            </div>
          </Reveal>

          <div className="space-y-3">
            {events.map((e, i) => (
              <motion.a
                key={e.key}
                href={IG}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex items-center gap-6 rounded-3xl border-2 border-cream/10 p-6 hover:border-lime hover:bg-cream hover:text-forest transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center w-16 shrink-0">
                  <span className="font-display font-extrabold text-3xl text-lime group-hover:text-chili transition-colors">
                    {e.day}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider opacity-60 mt-1">{t(`kollective.${e.key}_date`)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display font-bold text-2xl lg:text-3xl">{t(`kollective.${e.key}_title`)}</h3>
                    <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full border border-current px-2.5 py-0.5 text-lime group-hover:text-chili">
                      {t(`kollective.${e.key}_tag`)}
                    </span>
                  </div>
                  <p className="text-sm opacity-60 mt-1 max-w-xl">{t(`kollective.${e.key}_desc`)}</p>
                </div>
                <ArrowUpRight className="w-7 h-7 opacity-50 group-hover:opacity-100 group-hover:rotate-45 transition-all shrink-0" />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Follow / join */}
      <section className="relative bg-lime text-forest py-24 overflow-hidden">
        <div className="max-w-4xl mx-auto px-5 text-center relative z-10">
          <motion.img
            src={markLime}
            alt=""
            aria-hidden
            className="w-28 mx-auto mb-8"
            animate={{ rotate: 360 }}
            transition={{ duration: 24, ease: "linear", repeat: Infinity }}
          />
          <h2 className="font-display font-extrabold text-4xl lg:text-6xl leading-[0.95]">
            {t("kollective.follow_title")}
          </h2>
          <p className="mt-5 text-lg text-forest/75 max-w-2xl mx-auto">{t("kollective.follow_body")}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <a
                href={IG}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-forest text-cream font-semibold text-lg rounded-full px-8 py-4 hover:bg-chili transition-colors soft-shadow"
              >
                <Instagram className="w-5 h-5" />
                {t("kollective.follow_cta")}
              </a>
            </Magnetic>
            <Magnetic>
              <Link
                href="/#contact"
                className="inline-flex items-center gap-2 border-2 border-forest/30 text-forest font-semibold text-lg rounded-full px-8 py-4 hover:bg-forest hover:text-cream transition-colors"
              >
                {t("kollective.host_cta")}
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Kollective;