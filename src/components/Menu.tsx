"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Flame, Plus, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatEur } from "@/data/menu";
import { useMenu } from "@/hooks/useMenu";
import { useCart } from "@/context/CartContext";
import Reveal from "./Reveal";
import { Motif, Symbol, dishSymbol } from "./Brand";
import { StampField } from "./BrandDecor";
import { useTheme } from "@/context/ThemeContext";

const filters = [
  { id: "all", key: "filter_all" },
  { id: "veg", key: "filter_veg" },
  { id: "non-veg", key: "filter_nonveg" },
  { id: "drink", key: "filter_drinks" },
  { id: "dessert", key: "filter_sweets" },
];

const Menu = () => {
  const { t } = useTranslation();
  const { style } = useTheme();
  const [filter, setFilter] = useState("all");
  const { addItem, setOpen } = useCart();
  const { dishes } = useMenu();
  const [added, setAdded] = useState<string | null>(null);

  const filtered = dishes.filter((d) => {
    if (filter === "all") return true;
    if (filter === "veg") return d.category === "veg" && d.type !== "drink" && d.type !== "dessert";
    if (filter === "non-veg") return d.category === "non-veg";
    return d.type === filter;
  });

  const handleAdd = (dish: { id?: string; name: string; price: number }) => {
    addItem(dish.id ?? dish.name, dish.name, dish.price);
    setAdded(dish.name);
    window.setTimeout(() => setAdded((cur) => (cur === dish.name ? null : cur)), 900);
  };

  return (
    <section id="menu" className="relative bg-forest text-cream py-28 overflow-hidden">
      <Motif name="palm-tree" className="absolute -right-12 top-24 w-64 text-lime/10 animate-sway origin-bottom pointer-events-none" />
      <Motif name="waves" className="absolute left-0 bottom-10 w-[60%] text-lime/10 pointer-events-none" />

      <StampField variant="menu" />

      <div className="max-w-7xl mx-auto px-5 relative z-10">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.25em] text-lime">
                {t("menu.kicker")}
              </span>
              <h2 className="font-display font-extrabold text-5xl lg:text-7xl mt-3 leading-[0.95] text-lime">
                {t("menu.title")}
              </h2>
            </div>
            <p className="text-cream/70 max-w-sm">{t("menu.sub")}</p>
          </div>
        </Reveal>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`relative px-6 py-2.5 rounded-full font-medium text-sm transition-colors ${
                filter === f.id ? "text-forest" : "text-cream/70 hover:text-cream bg-cream/5"
              }`}
            >
              {filter === f.id && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 bg-lime rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{t(`menu.${f.key}`)}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((dish) => (
              <motion.div
                layout
                key={dish.name}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-3xl bg-forest-700 border-2 border-cream/10 p-6 hover:border-lime transition-colors"
                data-cursor="hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {style === "bazaar" && (
                      <Symbol
                        name={dishSymbol(dish)}
                        className="w-9 h-9 shrink-0 text-lime mt-0.5"
                      />
                    )}
                    <h3 className="font-display font-bold text-xl group-hover:text-lime transition-colors">
                      {dish.name}
                    </h3>
                  </div>
                  <span className="font-display font-bold text-lg text-lime whitespace-nowrap">
                    {formatEur(dish.price)}
                  </span>
                </div>

                <p className="text-sm text-cream/55 mt-2 mb-4">{dish.desc}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {dish.vegan && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-lime border border-lime/50 rounded-full px-2.5 py-1">
                        <Leaf className="w-3 h-3" /> {t("menu.vegan")}
                      </span>
                    )}
                    {!!dish.hot && (
                      <span className="inline-flex items-center text-chili">
                        {Array.from({ length: dish.hot }).map((_, i) => (
                          <Flame key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </span>
                    )}
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAdd(dish)}
                    className={`flex items-center gap-1.5 text-xs font-semibold rounded-full px-4 py-2 transition-colors ${
                      added === dish.name
                        ? "bg-lime text-forest"
                        : "bg-cream/10 text-cream hover:bg-lime hover:text-forest"
                    }`}
                  >
                    {added === dish.name ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> {t("menu.added")}
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" /> {t("menu.add")}
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <Reveal delay={0.1} className="text-center mt-14">
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 bg-chili text-cream font-semibold text-lg rounded-full px-10 py-4 hover:bg-lime hover:text-forest transition-colors soft-shadow"
          >
            {t("menu.cta")} →
          </button>
        </Reveal>
      </div>
    </section>
  );
};

export default Menu;