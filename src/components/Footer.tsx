"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { useTranslation } from "react-i18next";
import Marquee from "./Marquee";
import { Motif } from "./Brand";
import { StampField } from "./BrandDecor";
import { useCookieConsent } from "@/context/CookieConsentContext";
const logo = "/assets/brand/kokoland-logo-wide.png";

const legalLinks = [
  { key: "impressum", href: "/impressum" },
  { key: "privacy", href: "/datenschutz" },
  { key: "terms", href: "/agb" },
];

const navLinks = [
  { key: "story", h: "/#about" },
  { key: "menu", h: "/menu" },
  { key: "kerala", h: "/kerala" },
  { key: "onam", h: "/onam-sadhya" },
  { key: "catering", h: "/#catering" },
  { key: "reserve", h: "/#reservation" },
  { key: "blog", h: "/blog" },
  { key: "contact", h: "/#contact" },
  { key: "events", h: "/#events" },
];

const Footer = () => {
  const { t } = useTranslation();
  const { openSettings } = useCookieConsent();
  return (
  <footer className="relative bg-forest text-cream overflow-hidden">
    <StampField variant="footer" />
    {/* Palm band */}
    <div className="relative h-16 text-lime/15">
      <Motif name="waves" className="absolute inset-x-0 bottom-0 w-full" />
    </div>

    {/* Big marquee */}
    <div className="border-y-2 border-lime/30 py-6">
      <Marquee>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="font-display font-extrabold text-5xl lg:text-7xl text-lime mx-8">
            kokoland berlin •
          </span>
        ))}
      </Marquee>
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-5 py-16 grid md:grid-cols-3 gap-10">
      <div>
        <img src={logo} alt="kokoland" className="h-10 object-contain mb-4" />
        <p className="text-cream/55 text-sm max-w-xs">{t("footer.tagline")}</p>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-lime mb-2">{t("footer.nav")}</span>
        {navLinks.map((x) => (
          <a key={x.key} href={x.h} className="text-cream/70 hover:text-lime hover:translate-x-2 transition-all w-fit">
            {t(`nav.${x.key}`)}
          </a>
        ))}
      </div>

      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-lime mb-2 block">{t("footer.follow")}</span>
        <div className="flex gap-3">
          {[Instagram, Facebook, Twitter].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="w-11 h-11 rounded-full bg-cream/10 flex items-center justify-center text-cream hover:bg-lime hover:text-forest transition-colors"
              data-cursor="hover"
            >
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </div>
        <p className="text-cream/60 text-xs mt-6">
          Petersburger Str. 39 · 10249 Berlin<br />
          info@kokolandberlin.com
        </p>
      </div>
    </div>

    <div className="border-t border-cream/10 py-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
      <p className="text-cream/60 text-xs uppercase tracking-widest">
        © {new Date().getFullYear()} kokoland · {t("footer.copyright")}
      </p>
      {legalLinks.map((l) => (
        <Link
          key={l.key}
          href={l.href}
          className="text-cream/60 hover:text-lime text-xs uppercase tracking-widest underline underline-offset-2 transition-colors"
        >
          {t(`footer.${l.key}`)}
        </Link>
      ))}
      <button
        onClick={openSettings}
        className="text-cream/60 hover:text-lime text-xs uppercase tracking-widest underline underline-offset-2 transition-colors"
      >
        {t("footer.cookie_settings") || "Cookie Settings"}
      </button>
    </div>
  </footer>
  );
};

export default Footer;