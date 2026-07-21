"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// GDPR consent categories. "necessary" is always on (session, cart, language,
// auth) and isn't a real toggle — it's listed so the banner can be transparent
// about it. "analytics" gates any future GA/GTM-style script; "marketing"
// gates any future ad-pixel. Nothing in the codebase loads either yet — this
// exists so those scripts have somewhere to check consent when they land.
export type ConsentCategory = "analytics" | "marketing";

export type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

const KEY = "kokoland-cookie-consent";

type Ctx = {
  consent: Consent | null;
  hasDecided: boolean;
  bannerOpen: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (prefs: Record<ConsentCategory, boolean>) => void;
  openSettings: () => void;
  closeSettings: () => void;
};

const CookieConsentContext = createContext<Ctx | null>(null);

const read = (): Consent | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Consent;
  } catch {
    return null;
  }
};

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    const existing = read();
    setConsent(existing);
    setBannerOpen(!existing);
    setHydrated(true);
  }, []);

  const persist = (next: Consent) => {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    setConsent(next);
    setBannerOpen(false);
  };

  const acceptAll = () =>
    persist({ necessary: true, analytics: true, marketing: true, decidedAt: new Date().toISOString() });

  const rejectNonEssential = () =>
    persist({ necessary: true, analytics: false, marketing: false, decidedAt: new Date().toISOString() });

  const savePreferences = (prefs: Record<ConsentCategory, boolean>) =>
    persist({ necessary: true, ...prefs, decidedAt: new Date().toISOString() });

  const openSettings = () => setBannerOpen(true);
  const closeSettings = () => setBannerOpen(false);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasDecided: hydrated && consent !== null,
        bannerOpen: hydrated && bannerOpen,
        acceptAll,
        rejectNonEssential,
        savePreferences,
        openSettings,
        closeSettings,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within CookieConsentProvider");
  return ctx;
};
