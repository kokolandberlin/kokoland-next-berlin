"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, LayoutGrid, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModalA11y } from "@/hooks/useModalA11y";
import { isCutout } from "@/components/DishVisual";

export interface CategoryEntry {
  key: string;
  label: string;
  count: number;
  /** A photo of one of its dishes, shown as the thumbnail. */
  image?: string | null;
  emoji?: string | null;
}

/**
 * "Categories" overview for the menu pages: a sheet that lists every category with a photo,
 * its name and how many dishes it holds, the current one ticked. Tap one to jump to it.
 * A bottom sheet on phones, a centred card on larger screens.
 */
export function CategoryButton({ onClick, label }: { onClick: () => void; label?: string }) {
  const { i18n } = useTranslation();
  const de = (i18n.language || "en").startsWith("de");
  const text = label ?? (de ? "Kategorien" : "Categories");
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className="flex shrink-0 items-center gap-2 rounded-full border-2 border-lime bg-lime px-3.5 py-1.5 text-sm font-semibold text-forest transition-colors hover:bg-cream"
    >
      <LayoutGrid className="h-4 w-4" aria-hidden />
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
}

export default function CategorySheet({
  open,
  onClose,
  items,
  activeKey,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  items: CategoryEntry[];
  activeKey: string;
  onPick: (key: string) => void;
}) {
  const { i18n } = useTranslation();
  const de = (i18n.language || "en").startsWith("de");
  const dialogRef = useModalA11y(open, onClose);
  // Rendered on <body>: the sticky category bar has a blur filter, which would otherwise
  // trap a fixed-position sheet inside the bar instead of covering the page.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-forest/80 backdrop-blur-sm"
          />
          <div className="pointer-events-none fixed inset-0 z-[90] flex items-end justify-center sm:items-center sm:p-4">
            <motion.div
              key="panel"
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="category-sheet-title"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="pointer-events-auto flex max-h-[82vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl bg-forest text-cream soft-shadow sm:rounded-3xl"
            >
              <div className="flex items-center justify-between border-b border-cream/10 px-5 py-4">
                <h2 id="category-sheet-title" className="font-display text-xl font-extrabold text-lime">
                  {de ? "Kategorien" : "Categories"}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={de ? "Schließen" : "Close"}
                  className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-cream/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="overflow-y-auto p-2.5">
                {items.map((c) => {
                  const active = c.key === activeKey;
                  return (
                    <li key={c.key}>
                      <button
                        type="button"
                        onClick={() => {
                          onPick(c.key);
                          onClose();
                        }}
                        aria-current={active ? "true" : undefined}
                        className={`flex w-full items-center gap-3.5 rounded-2xl px-2.5 py-2 text-left transition-colors ${
                          active ? "bg-lime/15 text-lime" : "hover:bg-cream/10"
                        }`}
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#F8B5A0]/90">
                          {c.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={c.image} alt="" loading="lazy" className={`h-full w-full ${isCutout(c.image) ? "object-contain p-0.5" : "object-cover"}`} />
                          ) : (
                            <span className="text-xl" aria-hidden>{c.emoji || "🍽️"}</span>
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-semibold">{c.label}</span>
                          <span className="block text-xs text-cream/55">
                            {de ? `${c.count} ${c.count === 1 ? "Gericht" : "Gerichte"}` : `${c.count} ${c.count === 1 ? "item" : "items"}`}
                          </span>
                        </span>
                        {active && <Check className="h-5 w-5 shrink-0" aria-hidden />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
