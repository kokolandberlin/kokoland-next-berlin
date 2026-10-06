"use client";

import { ReactNode, useEffect } from "react";
import i18n from "@/i18n";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CustomCursor from "@/components/CustomCursor";
import CookieBanner from "@/components/CookieBanner";
import TableBanner from "@/components/TableBanner";
import Analytics from "@/components/Analytics";

/** After the first render, move to the visitor's saved or browser language. */
function LanguageSync() {
  useEffect(() => {
    const detected = i18n.services.languageDetector?.detect();
    const code = (Array.isArray(detected) ? detected[0] : detected)?.toString().slice(0, 2);
    if (code && code !== i18n.language && i18n.options.supportedLngs && (i18n.options.supportedLngs as string[]).includes(code)) {
      i18n.changeLanguage(code);
    }
  }, []);
  return null;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <CookieConsentProvider>
            <LanguageSync />
            <CustomCursor />
            {children}
            <TableBanner />
            <Analytics />
            <CookieBanner />
          </CookieConsentProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
