// Visitor tracking through Google Analytics 4, used only after the visitor accepted analytics
// cookies in the banner. Nothing is sent otherwise, and nothing at all happens until
// NEXT_PUBLIC_GA_ID (the "G-XXXXXXX" Measurement ID) is set.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

/** Send an event. Safe to call anywhere: it does nothing when analytics is off or not consented. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !GA_ID || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}

export interface TrackItem {
  item_id?: string;
  item_name: string;
  price?: number;
  quantity?: number;
}
