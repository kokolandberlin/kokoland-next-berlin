"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useSpring, useMotionValue, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import Reveal from "./Reveal";
import { Motif, BadgeIcon, IconName } from "./Brand";
import { StampField } from "./BrandDecor";
import FloatingPlates, { type PlateSpot } from "./FloatingPlates";
import { plates } from "@/data/food-photos";

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
  { icon: "plant", key: "value2" },
  { icon: "fresh", key: "value3" },
];

// A table of plates running the full height of the text: one big plate at the
// centre inside the rings, the rest around it, top and bottom rows mirroring each other.
const PLATE_TABLE: PlateSpot[] = [
  { photo: plates.kappaFish, left: "22%", top: "33%", vw: 22, min: 130, max: 300, drift: 14, spin: 40, tilt: 0 },
  { photo: plates.porottaBeef, left: "1%", top: "11%", vw: 17, min: 104, max: 235, drift: 20, spin: 55, tilt: -8 },
  { photo: plates.puttuKadala, left: "54%", top: "9%", vw: 16, min: 100, max: 220, drift: 22, spin: 45, tilt: 14 },
  { photo: plates.coconutPudding, left: "35%", top: "7%", vw: 10, min: 68, max: 135, drift: 26, spin: -60, tilt: 0 },
  { photo: plates.bananaFritters, left: "74%", top: "20%", vw: 10, min: 66, max: 135, drift: 30, spin: -70, tilt: 0, desktopOnly: true },
  { photo: plates.kadala, left: "41%", top: "24%", vw: 8, min: 56, max: 112, drift: 24, spin: 80, tilt: 0 },
  { photo: plates.paneerChilli, left: "-3%", top: "39%", vw: 14, min: 90, max: 195, drift: 26, spin: -65, tilt: 0 },
  { photo: plates.kokoChicken, left: "67%", top: "40%", vw: 13, min: 84, max: 178, drift: 24, spin: 60, tilt: 0 },
  { photo: plates.beefDry, left: "0%", top: "60%", vw: 16, min: 100, max: 225, drift: 20, spin: 50, tilt: -6 },
  { photo: plates.chickenRoll, left: "31%", top: "65%", vw: 14, min: 90, max: 200, drift: 24, spin: -45, tilt: 8 },
  { photo: plates.samosa, left: "60%", top: "62%", vw: 14, min: 90, max: 195, drift: 28, spin: 50, tilt: 10 },
  { photo: plates.semiya, left: "50%", top: "80%", vw: 11, min: 72, max: 150, drift: 22, spin: 65, tilt: 0, desktopOnly: true },
  { photo: plates.gheeRice, left: "18%", top: "83%", vw: 9, min: 60, max: 125, drift: 20, spin: -55, tilt: 0, desktopOnly: true },
];

const About = () => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section id="about" ref={ref} className="relative bg-cream text-forest py-28 overflow-hidden">
      <Motif name="palm-tree" className="absolute top-8 right-12 w-28 text-lime pointer-events-none" />
      <StampField variant="about" />

      <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-8 lg:gap-24 lg:items-stretch">
        {/* Cut-out plates, as tall as the text beside them */}
        <div className="relative z-20 h-[380px] sm:h-[540px] lg:h-auto lg:min-h-[760px]">
          <FloatingPlates spots={PLATE_TABLE} progress={scrollYProgress} ringSizes={[380, 560]} />
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center">
          <Reveal>
            <span className="text-sm font-semibold uppercase tracking-[0.25em] text-chili">
              {t("about.kicker")}
            </span>
            <h2 className="font-display font-extrabold text-[clamp(1.7rem,8.4vw,3rem)] sm:text-5xl lg:text-5xl xl:text-6xl leading-[1.02] mt-4">
              {t("about.title_a")} <span className="text-chili">{t("about.title_accent")}</span>
              <br />
              {t("about.title_b")}{" "}
              <span className="relative inline-block">
                {t("about.title_end")}
                <span className="absolute left-0 -bottom-1 w-full h-3 bg-lime -z-10" />
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-8 text-lg text-forest/70 max-w-lg">{t("about.body")}</p>
            <Link
              href="/kerala"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 font-semibold text-lime transition-colors hover:bg-chili hover:text-cream"
            >
              {t("about.explore")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-10 flex flex-wrap gap-3">
              {values.map((v) => (
                <li
                  key={v.key}
                  className="flex items-center gap-2.5 rounded-full border-2 border-forest/10 py-1.5 pl-1.5 pr-4 text-sm font-semibold transition-colors hover:border-lime hover:bg-forest hover:text-cream"
                >
                  <BadgeIcon name={v.icon} className="h-8 w-8 shrink-0" />
                  {t(`about.${v.key}_t`)}
                </li>
              ))}
            </ul>
          </Reveal>

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
