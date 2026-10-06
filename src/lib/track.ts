import { supabasePublic, isSupabaseConfigured, DISHDATA_SLUG } from "@/lib/supabase";

// Two kinds of counting, both from here:
//
//  1. Our own anonymous counter (always on). It stores no cookie, no IP address and no device id:
//     the "visit id" lives only in the page's memory and disappears on reload. The numbers appear
//     in DishData, and they cover every visitor. It respects "Do Not Track".
//  2. Google Analytics 4, only after the visitor accepted analytics cookies in the banner, and
//     only once NEXT_PUBLIC_GA_ID (the "G-XXXXXXX" Measurement ID) is set.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export interface TrackItem {
  item_id?: string;
  item_name: string;
  price?: number;
  quantity?: number;
}

// ---- first-party session context, kept in memory only
let visitId = "";
let ctx: { device: string; referrer: string | null; utm: { source?: string; medium?: string; campaign?: string }; lang: string } | null = null;

function context() {
  if (ctx) return ctx;
  const w = window.innerWidth;
  const q = new URLSearchParams(window.location.search);
  let ref: string | null = null;
  try {
    const host = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : "";
    if (host && host !== window.location.hostname.replace(/^www\./, "")) ref = host;
  } catch {
    /* unreadable referrer: treat as direct */
  }
  ctx = {
    device: w < 768 ? "mobile" : w < 1024 ? "tablet" : "desktop",
    referrer: ref,
    utm: { source: q.get("utm_source") ?? undefined, medium: q.get("utm_medium") ?? undefined, campaign: q.get("utm_campaign") ?? undefined },
    lang: (navigator.language || "en").slice(0, 2),
  };
  return ctx;
}

function firstParty(event: string, p: Record<string, unknown>) {
  if (typeof window === "undefined" || !isSupabaseConfigured || !DISHDATA_SLUG) return;
  if (navigator.doNotTrack === "1") return;
  if (!visitId) visitId = Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const c = context();
  const items = (p.items as TrackItem[] | undefined) ?? [];
  void supabasePublic
    .rpc("track_site_event", {
      _slug: DISHDATA_SLUG,
      _kind: event,
      _visit: visitId,
      _path: typeof p.page_path === "string" ? p.page_path.split("?")[0] : window.location.pathname,
      _item: items[0]?.item_name,
      _order_type: typeof p.order_type === "string" ? p.order_type : undefined,
      _table: typeof p.table === "string" ? p.table : undefined,
      _partner: typeof p.partner === "string" ? p.partner : undefined,
      _lead_type: typeof p.lead_type === "string" ? p.lead_type : undefined,
      _value: typeof p.value === "number" ? p.value : undefined,
      _device: c.device,
      _referrer: c.referrer ?? undefined,
      _utm_source: c.utm.source,
      _utm_medium: c.utm.medium,
      _utm_campaign: c.utm.campaign,
      _lang: c.lang,
    })
    .then(() => undefined, () => undefined);
}

/** Record an event. Safe to call anywhere: it never throws and never blocks. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  firstParty(event, params);
  // Only defined once the visitor has accepted analytics cookies (see Analytics.tsx).
  if (GA_ID && typeof window.gtag === "function") window.gtag("event", event, params);
}
