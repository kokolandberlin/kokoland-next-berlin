"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Reveal from "./Reveal";
import { Motif } from "./Brand";

const events = [
  { day: "FR", key: "e1" },
  { day: "SA", key: "e2" },
  { day: "SO", key: "e3" },
];

const Events = () => {
  const { t } = useTranslation();
  return (
  <section id="events" className="relative bg-forest text-cream py-28 overflow-hidden">
    <Motif name="palm-fronds" className="absolute top-16 right-12 w-28 text-lime/20 pointer-events-none" />

    <div className="max-w-7xl mx-auto px-5 relative z-10">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <h2 className="font-display font-extrabold text-5xl lg:text-7xl leading-[0.95]">
            {t("events.title_pre")} <span className="text-lime">{t("events.title_accent")}</span>
          </h2>
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-lime">
            {t("events.kicker")}
          </span>
        </div>
      </Reveal>

      <div className="space-y-3">
        {events.map((e, i) => (
          <motion.a
            key={e.key}
            href="#contact"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex items-center gap-6 rounded-3xl border-2 border-cream/10 p-6 hover:border-lime hover:bg-cream hover:text-forest transition-all duration-300"
            data-cursor="hover"
          >
            <div className="flex flex-col items-center justify-center w-16 shrink-0">
              <span className="font-display font-extrabold text-3xl text-lime group-hover:text-chili transition-colors">
                {e.day}
              </span>
              <span className="text-[10px] uppercase tracking-wider opacity-60 mt-1">{t(`events.${e.key}_date`)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-display font-bold text-2xl lg:text-3xl">{t(`events.${e.key}_title`)}</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full border border-current px-2.5 py-0.5 text-lime group-hover:text-chili">
                  {t(`events.${e.key}_tag`)}
                </span>
              </div>
              <p className="text-sm opacity-60 mt-1 max-w-xl">{t(`events.${e.key}_desc`)}</p>
            </div>
            <ArrowUpRight className="w-7 h-7 opacity-50 group-hover:opacity-100 group-hover:rotate-45 transition-all shrink-0" />
          </motion.a>
        ))}
      </div>
    </div>
  </section>
  );
};

export default Events;