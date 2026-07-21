"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
const restaurantInterior = "/assets/restaurant-interior.svg";
const backwaters = "/assets/backwaters.svg";
import Reveal from "./Reveal";
import { Motif, BadgeIcon, IconName } from "./Brand";
import { StampField, PackagingMark } from "./BrandDecor";
import { useTheme } from "@/context/ThemeContext";

const Counter = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1.8, bounce: 0 });

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, mv, to]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`;
    });
    return unsub;
  }, [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

const values: { icon: IconName; key: string }[] = [
  { icon: "pure", key: "value1" },
  { icon: "fresh", key: "value2" },
  { icon: "plant", key: "value3" },
];

const About = () => {
  const { t } = useTranslation();
  const { style } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 50]);

  return (
    <section id="about" ref={ref} className="relative bg-cream text-forest py-28 overflow-hidden">
      <Motif name="palm-tree" className="absolute top-8 right-12 w-28 text-lime pointer-events-none" />
      <StampField variant="about" />

      <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">
        {/* Images */}
        <div className={`relative ${style === "bazaar" ? "h-[620px]" : "h-[520px]"}`}>
          <motion.div
            style={{ y: y1 }}
            className="absolute top-0 left-0 w-3/4 overflow-hidden arch-top rounded-b-3xl border-4 border-forest group"
          >
            <img
              src={restaurantInterior}
              alt="kokoland interior"
              className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
          <motion.div
            style={{ y: y2 }}
            className="absolute top-[170px] right-0 w-2/3 overflow-hidden rounded-[2rem] border-4 border-lime group rotate-2 z-10"
          >
            <img
              src={backwaters}
              alt="Kerala backwaters"
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
          <div className="absolute top-[230px] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-chili text-cream font-display font-bold text-sm rounded-full px-5 py-3 rotate-[-6deg] z-20 soft-shadow">
            {t("about.badge")}
          </div>
          {/* Spice-pack illustration, bottom-left under the photos (bazaar only) */}
          <PackagingMark className="absolute bottom-0 left-0 w-[46%] animate-float pointer-events-none z-0" />
        </div>

        {/* Text */}
        <div>
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-chili">
              {t("about.kicker")}
            </span>
            <h2 className="font-display font-extrabold text-5xl lg:text-7xl leading-[0.95] mt-4">
              {t("about.title_where")} <span className="text-chili">{t("about.title_kerala")}</span>
              <br />
              {t("about.title_meets")}{" "}
              <span className="relative inline-block">
                {t("about.title_berlin")}
                <span className="absolute left-0 -bottom-1 w-full h-3 bg-lime -z-10" />
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-8 text-lg text-forest/70 max-w-lg">{t("about.body")}</p>
          </Reveal>

          <div className="mt-10 space-y-3">
            {values.map((v, i) => (
              <Reveal key={v.key} delay={0.1 * i}>
                <div
                  className="group flex items-center gap-4 rounded-2xl border-2 border-forest/10 p-4 hover:border-lime hover:bg-forest hover:text-cream transition-all duration-300"
                  data-cursor="hover"
                >
                  <BadgeIcon name={v.icon} className="w-12 h-12 shrink-0" />
                  <div>
                    <h3 className="font-display font-bold text-xl">{t(`about.${v.key}_t`)}</h3>
                    <p className="text-sm opacity-70 mt-0.5">{t(`about.${v.key}_d`)}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { to: 40, suffix: "+", label: t("about.stat_dishes") },
              { to: 12, suffix: "", label: t("about.stat_spices") },
              { to: 100, suffix: "%", label: t("about.stat_soul") },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl bg-forest text-cream p-5 text-center hover:bg-chili transition-colors"
              >
                <div className="font-display font-extrabold text-4xl text-lime">
                  <Counter to={s.to} suffix={s.suffix} />
                </div>
                <div className="text-xs font-medium uppercase tracking-widest mt-1 opacity-80">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;