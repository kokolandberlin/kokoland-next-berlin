"use client";

// Central registry of brand SVG assets, inlined as raw markup so single-color
// motifs inherit `currentColor` (theme per section) and can be animated.
import palmFronds from "@/assets/brand/patterns-green/palm-fronds.svg?raw";
import coconut from "@/assets/brand/patterns-green/coconut.svg?raw";
import chicken from "@/assets/brand/patterns-green/chicken.svg?raw";
import palmTree from "@/assets/brand/patterns-green/palm-tree.svg?raw";
import waves from "@/assets/brand/patterns-green/waves.svg?raw";
import seal from "@/assets/brand/patterns-green/seal.svg?raw";
import elephants from "@/assets/brand/patterns-green/elephants.svg?raw";
import arch from "@/assets/brand/patterns-green/arch.svg?raw";
import stamp from "@/assets/brand/patterns-green/stamp.svg?raw";

import plant from "@/assets/brand/icons/plant.svg?raw";
import steam from "@/assets/brand/icons/steam.svg?raw";
import fresh from "@/assets/brand/icons/fresh.svg?raw";
import mortar from "@/assets/brand/icons/mortar.svg?raw";
import pure from "@/assets/brand/icons/pure.svg?raw";
import pods from "@/assets/brand/icons/pods.svg?raw";
import drink from "@/assets/brand/icons/drink.svg?raw";
import organic from "@/assets/brand/icons/organic.svg?raw";
import cake from "@/assets/brand/icons/cake.svg?raw";

// Expanded brand-symbol set (Style 2 "Bazaar"): proteins, decor & Kerala
// musical instruments / ornaments.
import fish from "@/assets/brand/symbols/fish.svg?raw";
import chickenSym from "@/assets/brand/symbols/chicken.svg?raw";
import beef from "@/assets/brand/symbols/beef.svg?raw";
import goat from "@/assets/brand/symbols/goat.svg?raw";
import pig from "@/assets/brand/symbols/pig.svg?raw";
import cardamom from "@/assets/brand/symbols/cardamom.svg?raw";
import grain from "@/assets/brand/symbols/grain.svg?raw";
import paddy from "@/assets/brand/symbols/paddy.svg?raw";
import star from "@/assets/brand/symbols/star.svg?raw";
import sunring from "@/assets/brand/symbols/sunring.svg?raw";
import sadya from "@/assets/brand/symbols/sadya.svg?raw";
import pineapple from "@/assets/brand/symbols/pineapple.svg?raw";
import elephantDuo from "@/assets/brand/symbols/elephant-duo.svg?raw";
import sealSprout from "@/assets/brand/symbols/seal-sprout.svg?raw";
import greens from "@/assets/brand/symbols/greens.svg?raw";
// Kerala musical instruments + ornaments.
import bloom from "@/assets/brand/symbols/bloom.svg?raw";
import harp from "@/assets/brand/symbols/harp.svg?raw";
import mridangam from "@/assets/brand/symbols/mridangam.svg?raw";
import mallets from "@/assets/brand/symbols/mallets.svg?raw";
import chenda from "@/assets/brand/symbols/chenda.svg?raw";
import flourish from "@/assets/brand/symbols/flourish.svg?raw";
import kalasam from "@/assets/brand/symbols/kalasam.svg?raw";
import kombu from "@/assets/brand/symbols/kombu.svg?raw";
import shakers from "@/assets/brand/symbols/shakers.svg?raw";
import ghatam from "@/assets/brand/symbols/ghatam.svg?raw";
import veena from "@/assets/brand/symbols/veena.svg?raw";

// Combined decorative assets: ornamental frieze bands + tiling wordmark.
import friezeBand from "@/assets/brand/friezes/band.svg?raw";
import friezeOrnate from "@/assets/brand/friezes/ornate.svg?raw";
import wordmarkTile from "@/assets/brand/tiles/wordmark.svg?raw";

export type MotifName =
  | "palm-fronds"
  | "coconut"
  | "chicken"
  | "palm-tree"
  | "waves"
  | "seal"
  | "elephants"
  | "arch"
  | "stamp";

export type IconName =
  | "plant"
  | "steam"
  | "fresh"
  | "mortar"
  | "pure"
  | "pods"
  | "drink"
  | "organic"
  | "cake";

export type SymbolName =
  | "fish"
  | "chicken"
  | "beef"
  | "goat"
  | "pig"
  | "cardamom"
  | "grain"
  | "paddy"
  | "star"
  | "sunring"
  | "sadya"
  | "pineapple"
  | "elephant-duo"
  | "seal-sprout"
  | "greens"
  // Kerala musical instruments + ornaments
  | "bloom"
  | "harp"
  | "mridangam"
  | "mallets"
  | "chenda"
  | "flourish"
  | "kalasam"
  | "kombu"
  | "shakers"
  | "ghatam"
  | "veena";

const motifs: Record<MotifName, string> = {
  "palm-fronds": palmFronds,
  coconut,
  chicken,
  "palm-tree": palmTree,
  waves,
  seal,
  elephants,
  arch,
  stamp,
};

const icons: Record<IconName, string> = {
  plant,
  steam,
  fresh,
  mortar,
  pure,
  pods,
  drink,
  organic,
  cake,
};

const symbols: Record<SymbolName, string> = {
  fish,
  chicken: chickenSym,
  beef,
  goat,
  pig,
  cardamom,
  grain,
  paddy,
  star,
  sunring,
  sadya,
  pineapple,
  "elephant-duo": elephantDuo,
  "seal-sprout": sealSprout,
  greens,
  bloom,
  harp,
  mridangam,
  mallets,
  chenda,
  flourish,
  kalasam,
  kombu,
  shakers,
  ghatam,
  veena,
};

// Single-color motifs — recolor via text color on the wrapper.
export const Motif = ({
  name,
  className = "",
}: {
  name: MotifName;
  className?: string;
}) => (
  <span
    aria-hidden
    className={`inline-block [&_svg]:w-full [&_svg]:h-full [&_svg]:block ${className}`}
    dangerouslySetInnerHTML={{ __html: motifs[name] }}
  />
);

// Two-tone scalloped badge icons (lime seal + forest line art) — fixed colors.
export const BadgeIcon = ({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) => (
  <span
    aria-hidden
    className={`inline-block [&_svg]:w-full [&_svg]:h-full [&_svg]:block ${className}`}
    dangerouslySetInnerHTML={{ __html: icons[name] }}
  />
);

// Expanded single-color brand symbols (proteins, spices, decor) — recolor via
// text color on the wrapper, same as Motif.
export const Symbol = ({
  name,
  className = "",
}: {
  name: SymbolName;
  className?: string;
}) => (
  <span
    aria-hidden
    className={`inline-block [&_svg]:w-full [&_svg]:h-full [&_svg]:block ${className}`}
    dangerouslySetInnerHTML={{ __html: symbols[name] }}
  />
);

export type FriezeName = "band" | "ornate" | "wordmark";

const friezes: Record<FriezeName, string> = {
  band: friezeBand,
  ornate: friezeOrnate,
  wordmark: wordmarkTile,
};

// Decorative frieze / tile (currentColor) — recolor via text color on wrapper.
export const Frieze = ({
  name,
  className = "",
}: {
  name: FriezeName;
  className?: string;
}) => (
  <span
    aria-hidden
    className={`block [&_svg]:w-full [&_svg]:h-full [&_svg]:block ${className}`}
    dangerouslySetInnerHTML={{ __html: friezes[name] }}
  />
);

// Resolve a dish to its brand protein/category symbol by name + category.
export const dishSymbol = (dish: {
  name: string;
  category?: string;
  type?: string;
}): SymbolName => {
  const n = dish.name.toLowerCase();
  if (dish.type === "drink") return "cardamom";
  if (dish.type === "dessert") return "star";
  if (dish.category === "veg") return "greens";
  if (/fish|moilee|prawn|seafood|meen/.test(n)) return "fish";
  if (/chicken|65|mappas/.test(n)) return "chicken";
  if (/beef/.test(n)) return "beef";
  if (/mutton|goat|lamb/.test(n)) return "goat";
  if (/pork|pig/.test(n)) return "pig";
  return "beef"; // generic meat fallback (e.g. Malabar Biryani)
};