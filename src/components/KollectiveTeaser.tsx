"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Magnetic from "./Magnetic";
import Marquee from "./Marquee";
import { Motif } from "./Brand";
const markRed = "/assets/brand/kollective/mark-red.svg";

const KollectiveTeaser = () => {
  const { t } = useTranslation();
  const tags = ["tag_arts", "tag_culture", "tag_music", "tag_food"];

  return (
    <section id="kollective" className="relative bg-forest-900 text-cream py-24 overflow-hidden">
      <Motif name="palm-fronds" className="absolute -left-10 top-10 w-40 text-lime/10 animate-sway origin-bottom pointer-events-none" />

      {/* animated brand ribbon */}
      <div className="absolute top-0 inset-x-0 bg-lime text-forest py-2">
        <Marquee>
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="font-display font-bold text-sm mx-5 flex items-center gap-5 uppercase tracking-wider">
              {t("kollective.badge")} <span className="text-chili">●</span>
            </span>
          ))}
        </Marquee>
      </div>

      <div className="max-w-7xl mx-auto px-5 pt-10 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Spinning emblem — the brand "stamp" in motion */}
        <div className="flex justify-center order-2 lg:order-1">
          <motion.img
            src={markRed}
            alt="kokoland Kollective"
            className="w-56 sm:w-72 drop-shadow-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 26, ease: "linear", repeat: Infinity }}
          />
        </div>

        {/* Copy + CTA */}
        <div className="order-1 lg:order-2">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-[0.25em] text-lime"
          >
            {t("kollective.teaser_kicker")}
          </motion.span>
          <h2 className="font-display font-extrabold text-5xl lg:text-6xl mt-4 leading-[0.95]">
            {t("kollective.teaser_title")}
          </h2>
          <p className="mt-5 text-lg text-cream/75 max-w-lg">{t("kollective.teaser_body")}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-lime/40 text-lime px-4 py-1.5 text-sm font-medium"
              >
                {t(`kollective.${tag}`)}
              </span>
            ))}
          </div>

          <Magnetic>
            <Link
              href="/kollective"
              className="mt-8 inline-flex items-center gap-2 bg-lime text-forest font-semibold text-lg rounded-full px-8 py-4 hover:bg-chili hover:text-cream transition-colors soft-shadow"
            >
              {t("kollective.teaser_cta")}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
};

export default KollectiveTeaser;