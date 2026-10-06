"use client";

import { useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ShoppingBag, Menu as MenuIcon, X, User } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Magnetic from "./Magnetic";
import LanguageSelector from "./LanguageSelector";
import ThemeSwitcher from "./ThemeSwitcher";
import { STORY_LIVE } from "@/data/story";
const logo = "/assets/brand/kokoland-logo-wide.png";
const logoMark = "/assets/brand/kokoland-mark.png";

const SHOW_BLOG = false;

const links = [
  { key: "story", href: "/#about" },
  ...(STORY_LIVE ? [{ key: "ourStory", href: "/our-story" }] : []),
  { key: "menu", href: "/menu" },
  { key: "reserve", href: "/#reservation" },
  { key: "catering", href: "/#catering" },
  { key: "events", href: "/#events" },
  // The blog is built but parked: set to true to show it in the menu again.
  ...(SHOW_BLOG ? [{ key: "blog", href: "/blog" }] : []),
  { key: "contact", href: "/#contact" },
];

const Navbar = () => {
  const { t } = useTranslation();
  const { count, setOpen } = useCart();
  const { session, isAdmin } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 60));

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div
            className={`flex items-center justify-between rounded-full px-4 sm:px-6 transition-all duration-300 ${
              scrolled
                ? "bg-forest/95 backdrop-blur-md py-2.5 soft-shadow"
                : "bg-transparent py-2"
            }`}
          >
            <Link href="/#top" className="flex items-center gap-2">
              {/* Phones: elephant mark only, so the header icons keep their room. */}
              <img
                src={logoMark}
                alt="kokoland"
                className={`sm:hidden object-contain transition-all duration-300 ${scrolled ? "h-8" : "h-10"}`}
              />
              <img
                src={logo}
                alt="kokoland"
                className={`hidden sm:block object-contain transition-all duration-300 ${
                  scrolled ? "h-8" : "h-9 xl:h-11"
                } ${scrolled ? "" : "drop-shadow"}`}
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="relative text-sm font-medium text-cream hover:text-lime transition-colors after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-lime after:transition-all hover:after:w-full"
                >
                  {t(`nav.${l.key}`)}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <LanguageSelector />
              <Link
                href={session ? "/account" : "/auth"}
                title={session ? (isAdmin ? t("nav.admin") : t("nav.account")) : t("nav.login")}
                className="flex items-center justify-center w-10 h-10 rounded-full text-cream hover:bg-cream/10 hover:text-lime transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
              <Magnetic>
                <button
                  onClick={() => setOpen(true)}
                  className="relative flex items-center gap-2 bg-lime text-forest font-semibold text-sm rounded-full px-4 py-2.5 hover:bg-chili hover:text-cream transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:inline">{t("nav.cart")}</span>
                  <AnimatePresence>
                    {count > 0 && (
                      <motion.span
                        key={count}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-chili text-cream text-[10px] flex items-center justify-center font-bold"
                      >
                        {count}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </Magnetic>

              <button
                className="lg:hidden p-1 text-cream"
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 bg-forest flex flex-col items-center justify-center gap-8 lg:hidden"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="font-display font-extrabold text-4xl text-cream hover:text-lime transition-colors"
              >
                {t(`nav.${l.key}`)}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;