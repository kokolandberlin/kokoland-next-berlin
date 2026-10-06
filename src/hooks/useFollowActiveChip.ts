"use client";

import { useEffect, type RefObject } from "react";

/**
 * Keeps the highlighted chip of a horizontally scrolling category bar in view: when `activeKey`
 * changes, the bar scrolls (sideways only, never the page) so the chip sits in the middle.
 * Mark the active chip with data-active="true".
 */
export function useFollowActiveChip(bar: RefObject<HTMLElement | null>, activeKey: string) {
  useEffect(() => {
    const el = bar.current;
    const chip = el?.querySelector<HTMLElement>('[data-active="true"]');
    if (!el || !chip) return;
    const target = chip.offsetLeft - (el.clientWidth - chip.clientWidth) / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [bar, activeKey]);
}
