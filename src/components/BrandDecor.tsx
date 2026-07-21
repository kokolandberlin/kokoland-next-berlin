"use client";

import { useTheme } from "@/context/ThemeContext";
import { Symbol, Frieze, SymbolName } from "./Brand";
// Full-color packaging illustration (classes namespaced `pkgb-*` so its inlined
// <style> block can't collide with the shared `.cls-1` of the other motifs).
import packagingArt from "@/assets/brand/packaging-bottom-tight.svg?raw";

// ---------------------------------------------------------------------------
// StampField — a scattered "spice-market" pattern of Kerala instruments, leaves
// & motifs that sits in a section background (biased toward the lower edge).
// Only renders in the "bazaar" style.
// ---------------------------------------------------------------------------
type Stamp = { name: SymbolName; cls: string; anim?: "float" | "sway"; tone?: string };

const fields: Record<string, Stamp[]> = {
  hero: [
    { name: "mridangam", cls: "top-28 left-[5%] w-14", anim: "float", tone: "text-lime/25" },
    { name: "kombu", cls: "top-[44%] left-[2%] w-16", anim: "sway", tone: "text-chili/30" },
    { name: "star", cls: "bottom-36 left-[11%] w-10", anim: "float", tone: "text-lime/25" },
    { name: "bloom", cls: "top-20 right-[9%] w-12", anim: "sway", tone: "text-lime/25" },
    { name: "chenda", cls: "bottom-44 right-[6%] w-16", anim: "float", tone: "text-lime/20" },
  ],
  menu: [
    { name: "fish", cls: "top-10 left-[4%] w-16", anim: "sway", tone: "text-lime/15" },
    { name: "chicken", cls: "top-[42%] right-[3%] w-20", anim: "float", tone: "text-lime/15" },
    { name: "mridangam", cls: "bottom-14 left-[7%] w-16", anim: "sway", tone: "text-lime/15" },
    { name: "kombu", cls: "bottom-24 right-[9%] w-14", anim: "float", tone: "text-chili/22" },
    { name: "beef", cls: "top-24 right-[15%] w-14", anim: "sway", tone: "text-lime/12" },
  ],
  about: [
    { name: "pineapple", cls: "top-12 right-[6%] w-16", anim: "float", tone: "text-chili/22" },
    { name: "greens", cls: "bottom-12 left-[4%] w-16", anim: "sway", tone: "text-lime/40" },
    { name: "harp", cls: "top-1/3 left-[7%] w-12", anim: "float", tone: "text-forest/15" },
    { name: "ghatam", cls: "bottom-20 right-[10%] w-12", anim: "sway", tone: "text-chili/18" },
  ],
  catering: [
    { name: "greens", cls: "bottom-6 left-[6%] w-20", anim: "sway", tone: "text-lime/40" },
    { name: "elephant-duo", cls: "bottom-8 left-[22%] w-24", anim: "float", tone: "text-lime/30" },
    { name: "star", cls: "bottom-24 left-[40%] w-10", anim: "float", tone: "text-chili/35" },
    { name: "mridangam", cls: "bottom-10 right-[20%] w-16", anim: "sway", tone: "text-lime/30" },
    { name: "kombu", cls: "bottom-6 right-[5%] w-16", anim: "float", tone: "text-chili/30" },
    { name: "shakers", cls: "top-16 right-[8%] w-16", anim: "sway", tone: "text-lime/20" },
  ],
  footer: [
    { name: "elephant-duo", cls: "top-8 left-[6%] w-24", anim: "float", tone: "text-lime/18" },
    { name: "paddy", cls: "bottom-10 right-[8%] w-16", anim: "sway", tone: "text-lime/22" },
    { name: "mridangam", cls: "top-12 right-[20%] w-14", anim: "float", tone: "text-lime/15" },
    { name: "kombu", cls: "bottom-12 left-[16%] w-14", anim: "sway", tone: "text-lime/15" },
  ],
};

export const StampField = ({ variant }: { variant: keyof typeof fields }) => {
  const { style } = useTheme();
  if (style !== "bazaar") return null;
  const stamps = fields[variant] ?? [];
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {stamps.map((s, i) => (
        <Symbol
          key={i}
          name={s.name}
          className={`absolute ${s.cls} ${s.tone ?? "text-lime/20"} ${
            s.anim === "float" ? "animate-float" : "animate-sway origin-bottom"
          }`}
        />
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------
// PackagingMark — the full-color spice-pack illustration as a positionable
// decorative mark. The caller controls size & placement via className.
// Only renders in "bazaar".
// ---------------------------------------------------------------------------
export const PackagingMark = ({ className = "" }: { className?: string }) => {
  const { style } = useTheme();
  if (style !== "bazaar") return null;
  return (
    <div
      aria-hidden
      className={`[&_svg]:block [&_svg]:h-full [&_svg]:w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: packagingArt }}
    />
  );
};

// ---------------------------------------------------------------------------
// FriezeDivider — an ornamental brand border band between sections. Tiles the
// band motif horizontally. Only renders in "bazaar".
// ---------------------------------------------------------------------------
export const FriezeDivider = ({
  tone = "text-lime",
  bg = "bg-forest",
  ornate = false,
}: {
  tone?: string;
  bg?: string;
  ornate?: boolean;
}) => {
  const { style } = useTheme();
  if (style !== "bazaar") return null;
  const count = ornate ? 7 : 14;
  return (
    <div className={`relative w-full overflow-hidden ${bg} ${tone} ${ornate ? "py-1" : ""}`}>
      <div className="flex justify-center">
        {Array.from({ length: count }).map((_, i) => (
          <Frieze
            key={i}
            name={ornate ? "ornate" : "band"}
            className={ornate ? "h-12 w-[14.3%] shrink-0" : "h-10 w-[7.15%] shrink-0"}
          />
        ))}
      </div>
    </div>
  );
};