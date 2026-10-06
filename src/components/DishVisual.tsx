"use client";

import { Symbol, dishSymbol } from "./Brand";
import type { MenuDish } from "@/lib/menu";
import type { CategoryTheme } from "@/lib/category-theme";

const PLACEHOLDER_EMOJI = new Set(["🍽️", "🍽"]);

/** Our own studio photos are transparent cut-outs: they sit on a colour panel instead of filling the frame. */
export const isCutout = (src: string | null) => !!src && src.startsWith("/assets/food/");

// A dish's photo or, when it has none, an art panel: the category's colour and
// illustrated symbol if a theme is given, otherwise the brand symbol for the dish.
const DishVisual = ({ dish, theme, className = "" }: { dish: MenuDish; theme?: CategoryTheme; className?: string }) => {
  if (dish.image_url && isCutout(dish.image_url)) {
    return (
      <div className={`flex h-full w-full items-center justify-center overflow-hidden p-[7%] ${className}`} style={{ background: theme?.bg ?? "rgba(192,242,82,0.12)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dish.image_url} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.28)] transition-transform duration-700 group-hover:rotate-[14deg] group-hover:scale-[1.06]" />
      </div>
    );
  }
  if (dish.image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={dish.image_url} alt="" loading="lazy" className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${className}`} />
    );
  }
  const hasEmoji = !!dish.emoji && !PLACEHOLDER_EMOJI.has(dish.emoji);
  const type = /beverage|drink|getr(ä|ae)nk/i.test(dish.category) ? "drink" : /dessert|sweet|payasam/i.test(`${dish.category} ${dish.name}`) ? "dessert" : undefined;

  if (theme) {
    return (
      <div className={`relative flex h-full w-full items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105 ${className}`} style={{ background: theme.bg, color: theme.fg }} aria-hidden>
        <Symbol name={theme.symbol} className="absolute -bottom-6 -right-6 h-40 w-40 opacity-20 transition-transform duration-700 group-hover:rotate-12" />
        {hasEmoji ? <span className="relative text-6xl">{dish.emoji}</span> : <Symbol name={dishSymbol({ name: dish.name, category: dish.diet ? "veg" : undefined, type })} className="relative h-20 w-20 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110" />}
      </div>
    );
  }
  return (
    <div className={`flex h-full w-full items-center justify-center bg-lime/10 transition-transform duration-500 group-hover:scale-110 ${className}`} aria-hidden>
      {hasEmoji ? <span className="text-6xl">{dish.emoji}</span> : <Symbol name={dishSymbol({ name: dish.name, category: dish.diet ? "veg" : undefined, type })} className="h-20 w-20 text-lime/70" />}
    </div>
  );
};

export default DishVisual;
