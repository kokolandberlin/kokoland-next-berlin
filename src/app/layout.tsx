import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://kokolandberlin.com"),
  title: {
    default: "kokoland — Kerala flavors, Berlin home",
    template: "%s — kokoland",
  },
  description:
    "kokoland — a Kerala restobar in Berlin. Tropical South Indian flavors, house brews and good company. 100% pure, properly spiced.",
  openGraph: {
    title: "kokoland — Kerala flavors, Berlin home",
    description:
      "A Kerala restobar in Berlin. Tropical South Indian flavors, house brews and good company.",
    url: "https://kokolandberlin.com",
    siteName: "kokoland",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "kokoland — Kerala flavors, Berlin home",
    description:
      "A Kerala restobar in Berlin. Tropical South Indian flavors, house brews and good company.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
