"use client";

import { ReactNode } from "react";
import "@/i18n";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { CookieConsentProvider } from "@/context/CookieConsentContext";
import CustomCursor from "@/components/CustomCursor";
import CookieBanner from "@/components/CookieBanner";
import TableBanner from "@/components/TableBanner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <CookieConsentProvider>
            <CustomCursor />
            {children}
            <TableBanner />
            <CookieBanner />
          </CookieConsentProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
