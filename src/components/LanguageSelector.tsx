"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { languages } from "@/i18n";

const LanguageSelector = ({ dark = false }: { dark?: boolean }) => {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === i18n.resolvedLanguage) ?? languages[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t("lang.select")}
        className={`flex items-center gap-1.5 rounded-full px-3 h-10 text-sm font-medium transition-colors ${
          dark
            ? "text-forest hover:bg-forest/10"
            : "text-cream hover:bg-cream/10 hover:text-lime"
        }`}
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase">{current.code}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-44 rounded-2xl bg-forest text-cream border border-cream/10 shadow-xl overflow-hidden z-50 py-1"
          >
            {languages.map((l) => (
              <li key={l.code}>
                <button
                  onClick={() => choose(l.code)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-cream/10 transition-colors"
                >
                  <span className="text-base leading-none">{l.flag}</span>
                  <span className="flex-1 text-left">{l.label}</span>
                  {l.code === current.code && <Check className="w-4 h-4 text-lime" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;