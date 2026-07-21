"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Check } from "lucide-react";
import { useTheme, Style } from "@/context/ThemeContext";

const options: { id: Style; label: string; desc: string }[] = [
  { id: "tropical", label: "Tropical", desc: "Clean & airy" },
  { id: "bazaar", label: "Bazaar", desc: "Spice-market rich" },
];

const ThemeSwitcher = () => {
  const { style, setStyle } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Style"
        className="flex items-center justify-center w-10 h-10 rounded-full text-cream hover:bg-cream/10 hover:text-lime transition-colors"
      >
        <Palette className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 rounded-2xl bg-forest text-cream border border-cream/10 shadow-xl overflow-hidden z-50 py-1"
          >
            {options.map((o) => (
              <li key={o.id}>
                <button
                  onClick={() => {
                    setStyle(o.id);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-cream/10 transition-colors text-left"
                >
                  <span
                    className={`w-3 h-3 rounded-full shrink-0 ${
                      o.id === "tropical" ? "bg-lime" : "bg-chili"
                    }`}
                  />
                  <span className="flex-1">
                    <span className="block font-semibold leading-tight">{o.label}</span>
                    <span className="block text-[11px] text-cream/65">{o.desc}</span>
                  </span>
                  {o.id === style && <Check className="w-4 h-4 text-lime" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;