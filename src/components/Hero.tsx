"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
const heroFood = "/assets/hero-photo.jpg";
import Magnetic from "./Magnetic";
import Marquee from "./Marquee";
import { Motif } from "./Brand";
import { StampField } from "./BrandDecor";

const Hero = () => {
  const { t } = useTranslation();
  const headline = [t("hero.line1"), t("hero.line2"), t("hero.line3")].filter(Boolean);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative min-h-[100svh] overflow-hidden bg-forest text-cream pt-28 pb-28 lg:pb-16"
    >
      {/* Decorative motifs */}
      <Motif
        name="palm-tree"
        className="absolute -left-10 top-24 w-48 lg:w-72 text-lime/15 origin-bottom animate-sway pointer-events-none"
      />
      <Motif
        name="palm-tree"
        className="absolute right-[-3rem] bottom-28 w-56 lg:w-80 text-lime/10 origin-bottom animate-sway pointer-events-none scale-x-[-1]"
      />
      <Motif
        name="waves"
        className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[120%] text-lime/10 pointer-events-none"
      />

      {/* Style 2 "Bazaar": scattered spice/protein stamps */}
      <StampField variant="hero" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 grid lg:grid-cols-12 gap-9 lg:gap-10 items-center lg:min-h-[78vh]">
        {/* Headline */}
        <motion.div style={{ y: textY }} className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2.5 mb-7 bg-lime/15 text-lime rounded-full p-1.5"
          >
            <span className="bg-lime text-forest text-[11px] font-bold rounded-full px-2.5 py-0.5">
              {t("hero.badge")}
            </span>
            {/* Tagline hidden for now — restore this span to bring back
                "Restobar · Kreuzberg meets Kochi" (t("hero.tagline")). */}
          </motion.div>

          <h1 className="font-display font-extrabold leading-[0.95] tracking-tight text-[clamp(2.2rem,9.5vw,3.5rem)] sm:text-[clamp(3rem,8vw,4.5rem)] lg:text-[clamp(3rem,6.4vw,5.5rem)]">
            {headline.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className={`block ${i === 1 ? "text-lime" : "text-cream"}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease: [0.21, 0.7, 0.25, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
            className="mt-5 lg:mt-7 max-w-xl text-base sm:text-lg text-cream/75"
          >
            {t("hero.sub")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-7 lg:mt-9 flex flex-wrap gap-3 lg:gap-4"
          >
            <Magnetic>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 bg-lime text-forest font-semibold text-base sm:text-lg rounded-full px-6 sm:px-8 py-3.5 sm:py-4 hover:bg-cream transition-colors soft-shadow"
              >
                {t("hero.order")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href="#about"
                className="inline-flex items-center gap-2 border-2 border-cream/40 text-cream font-semibold text-base sm:text-lg rounded-full px-6 sm:px-8 py-3.5 sm:py-4 hover:border-lime hover:text-lime transition-colors"
              >
                {t("hero.story")}
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        {/* Image — arched tropical frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="lg:col-span-5 relative mx-auto w-[82%] max-w-sm sm:max-w-md lg:max-w-none lg:w-full"
        >
          <motion.div
            style={{ y: imgY }}
            className="relative overflow-hidden arch-top rounded-b-[2.5rem] border-4 border-lime soft-shadow"
          >
            <motion.img
              src={heroFood}
              alt="Kerala feast at kokoland"
              className="w-full h-[340px] sm:h-[460px] lg:h-[660px] object-cover object-[50%_88%] sm:object-[50%_70%] lg:object-[50%_34%]"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.6 }}
            />
          </motion.div>

          {/* Rotating stamp */}
          <div className="absolute -top-7 -left-6 w-24 h-24 lg:-top-8 lg:-left-8 lg:w-36 lg:h-36">
            <div className="relative w-full h-full animate-spin-slow">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <path id="heroCircle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
                </defs>
                <text className="fill-lime text-[8.5px] font-semibold uppercase tracking-[0.2em]">
                  <textPath href="#heroCircle" textLength="228" lengthAdjust="spacing">{t("hero.stamp")}</textPath>
                </text>
              </svg>
            </div>
            <Motif
              name="coconut"
              className="absolute inset-0 m-auto w-14 h-14 lg:w-16 lg:h-16 text-lime"
            />
          </div>

          {/* Floating elephant */}
          <Motif
            name="elephants"
            className="absolute -bottom-5 -right-3 w-24 sm:w-32 lg:w-40 text-chili animate-float"
          />
        </motion.div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 inset-x-0 bg-lime text-forest py-3">
        <Marquee>
          {["FISH MOILEE", "MALABAR BIRYANI", "APPAM & STEW", "BEEF FRY", "CHICKEN 65", "GOBI MANCHURIAN", "PAYASAM"].map(
            (dish) => (
              <span key={dish} className="font-display font-bold text-lg mx-6 flex items-center gap-6">
                {dish} <span className="text-chili">●</span>
              </span>
            )
          )}
        </Marquee>
      </div>
    </section>
  );
};

export default Hero;