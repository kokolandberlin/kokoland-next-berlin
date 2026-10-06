"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import Reveal from "./Reveal";
import LoopVideo from "./LoopVideo";
import { Motif, BadgeIcon, IconName } from "./Brand";
import { StampField } from "./BrandDecor";

const services: { icon: IconName; key: string }[] = [
  { icon: "cake", key: "service1" },
  { icon: "mortar", key: "service2" },
  { icon: "fresh", key: "service3" },
];

const Catering = () => {
  const { t } = useTranslation();

  return (
    <section id="catering" className="relative bg-forest text-cream py-28 overflow-hidden">
      <Motif name="palm-tree" className="absolute -left-12 bottom-0 w-60 text-lime/10 animate-sway origin-bottom pointer-events-none" />
      <Motif name="elephants" className="absolute top-16 right-10 w-28 text-lime/15 pointer-events-none" />

      <StampField variant="catering" />

      <div className="max-w-7xl mx-auto px-5 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <Reveal>
          <div className="relative mx-auto w-full max-w-[440px] overflow-hidden arch-top rounded-b-3xl border-4 border-lime soft-shadow order-2 lg:order-1">
            <LoopVideo
              src="/assets/hero-loop.mp4"
              poster="/assets/hero-loop-poster.jpg"
              label="Kerala dishes ready to be catered by kokoland"
              className="w-full h-[520px] lg:h-[620px] object-cover object-[50%_40%]"
            />
            <div className="absolute bottom-6 left-4 bg-chili text-cream font-display font-bold text-sm rounded-full px-4 py-2 rotate-[-4deg]">
              {t("catering.badge")}
            </div>
          </div>
        </Reveal>

        {/* Content */}
        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="inline-flex items-center gap-2 bg-lime/15 text-lime rounded-full px-4 py-1.5 text-sm font-semibold">
              {t("catering.kicker")}
            </span>
            <h2 className="font-display font-extrabold text-5xl lg:text-7xl mt-5 leading-[0.95]">
              {t("catering.title_pre")} <span className="text-lime">{t("catering.title_accent")}</span>
            </h2>
            <p className="mt-5 text-lg text-cream/75 max-w-lg">{t("catering.body")}</p>
          </Reveal>

          <div className="mt-8 space-y-3">
            {services.map((s, i) => (
              <Reveal key={s.key} delay={0.08 * i}>
                <div className="group flex items-center gap-4 rounded-2xl border-2 border-cream/10 p-4 hover:border-lime hover:bg-cream hover:text-forest transition-all duration-300">
                  <BadgeIcon name={s.icon} className="w-12 h-12 shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-lg">{t(`catering.${s.key}_t`)}</h3>
                    <p className="text-sm opacity-70 mt-0.5">{t(`catering.${s.key}_d`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <Link
              href="/catering"
              className="mt-8 inline-flex items-center gap-2 bg-lime text-forest font-semibold text-lg rounded-full px-8 py-4 hover:bg-chili hover:text-cream transition-colors soft-shadow"
            >
              <FileText className="w-5 h-5" />
              {t("catering.cta")}
            </Link>
          </Reveal>
        </div>
      </div>

    </section>
  );
};

export default Catering;