"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Two switchable visual styles:
//  - "tropical": the clean, airy on-brand look (default).
//  - "bazaar":   asset-rich Kerala spice-market look — protein/spice stamps,
//                ornamental frieze dividers, wordmark tiles, floating packets.
export type Style = "tropical" | "bazaar";

const KEY = "kokoland-style";

type ThemeCtx = { style: Style; setStyle: (s: Style) => void; toggle: () => void };

const Ctx = createContext<ThemeCtx>({ style: "tropical", setStyle: () => {}, toggle: () => {} });

const read = (): Style => {
  if (typeof window === "undefined") return "tropical";
  const v = window.localStorage.getItem(KEY);
  return v === "bazaar" ? "bazaar" : "tropical";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [style, setStyleState] = useState<Style>(read);

  useEffect(() => {
    document.documentElement.dataset.style = style;
    window.localStorage.setItem(KEY, style);
  }, [style]);

  const setStyle = (s: Style) => setStyleState(s);
  const toggle = () => setStyleState((s) => (s === "tropical" ? "bazaar" : "tropical"));

  return <Ctx.Provider value={{ style, setStyle, toggle }}>{children}</Ctx.Provider>;
};

export const useTheme = () => useContext(Ctx);