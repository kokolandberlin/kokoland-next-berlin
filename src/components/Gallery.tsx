"use client";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
const heroFood = "/assets/hero-food.svg";
const restaurantInterior = "/assets/restaurant-interior.svg";
const backwaters = "/assets/backwaters.svg";
const celebration = "/assets/celebration.svg";
import Reveal from "./Reveal";
import { Motif } from "./Brand";

const shots = [
  { src: heroFood, key: "label_platter", arch: true, span: "row-span-2" },
  { src: restaurantInterior, key: "label_shop", arch: false, span: "" },
  { src: backwaters, key: "label_backwaters", arch: false, span: "" },
  { src: celebration, key: "label_onam", arch: true, span: "row-span-2" },
];

const Gallery = () => {
  const { t } = useTranslation();
  return (
  <section id="gallery" className="relative bg-cream text-forest py-28 overflow-hidden">
    <Motif name="coconut" className="absolute top-12 left-8 w-24 text-lime animate-float pointer-events-none" />

    <div className="max-w-7xl mx-auto px-5">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
          <h2 className="font-display font-extrabold text-5xl lg:text-7xl leading-[0.95]">
            {t("gallery.title_the")} <span className="text-chili">{t("gallery.title_place")}</span>
          </h2>
          <span className="text-sm font-semibold uppercase tracking-[0.25em] text-chili">
            {t("gallery.kicker")}
          </span>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 auto-rows-[200px] gap-4">
        {shots.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className={`group relative overflow-hidden border-4 border-forest ${
              s.arch ? "arch-top rounded-b-3xl" : "rounded-3xl"
            } ${s.span}`}
            data-cursor="hover"
          >
            <img
              src={s.src}
              alt={t(`gallery.${s.key}`)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-forest/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span className="font-display font-bold text-cream text-xl translate-y-3 group-hover:translate-y-0 transition-transform">
                {t(`gallery.${s.key}`)}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default Gallery;