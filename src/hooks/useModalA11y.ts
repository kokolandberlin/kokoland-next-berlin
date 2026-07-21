"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Minimal, dependency-free modal accessibility: Escape closes, Tab/Shift+Tab
// cycles within the dialog instead of leaking into the page behind it, focus
// moves into the dialog on open and back to the trigger element on close.
// WCAG 2.1.1 (keyboard), 2.4.3 (focus order), 4.1.2 (name/role/value).
//
// `container.inert` is set synchronously on close, independent of framer-motion's
// exit-animation timing — AnimatePresence keeps the DOM node mounted for the
// duration of its exit transition (sometimes indefinitely, if the animation
// never resolves as "complete"), which would otherwise leave an invisible but
// still focusable/tabbable dialog sitting off-screen after "closing".
export function useModalA11y(open: boolean, onClose: () => void) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!open) {
      if (container) container.inert = true;
      return;
    }
    if (container) container.inert = false;

    triggerRef.current = document.activeElement as HTMLElement | null;
    const first = container?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !container) return;
      const focusables = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown, true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      if (container) container.inert = true;
      triggerRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return containerRef;
}
