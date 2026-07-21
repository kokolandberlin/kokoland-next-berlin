"use client";

import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useOffers } from "@/hooks/useOffers";
import Marquee from "./Marquee";

// Lime accent banner between the hero and the story. Renders nothing when
// there are no active offers, so it stays out of the way until staff add one.
const Offers = () => {
  const { t } = useTranslation();
  const { offers } = useOffers();
  if (offers.length === 0) return null;

  return (
    <section id="offers" className="relative bg-lime text-forest py-14 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <Marquee>
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="font-display font-extrabold text-5xl mx-8">
              {t("offers.marquee")}
            </span>
          ))}
        </Marquee>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5">
        <div className="flex items-center gap-3 mb-8">
          <Tag className="w-6 h-6" />
          <h2 className="font-display font-extrabold text-3xl lg:text-4xl">{t("offers.title")}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {offers.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-3xl bg-forest text-cream p-6 soft-shadow"
              data-cursor="hover"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display font-bold text-xl">{o.title}</h3>
                {o.discount_label && (
                  <span className="font-display font-extrabold text-lg text-lime whitespace-nowrap">
                    {o.discount_label}
                  </span>
                )}
              </div>
              <p className="text-sm text-cream/70 mt-2">{o.description}</p>
              {o.code && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-dashed border-lime/60 px-4 py-1.5 text-sm font-semibold tracking-widest text-lime">
                  {o.code}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offers;