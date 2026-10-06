import type { Metadata } from "next";
import Home from "@/screens/Home";
import { SITE_URL } from "@/lib/site";
import { covers } from "@/data/food-photos";

// For now the Berlin page is the group's main landing page. When a group home
// page exists this content moves under /berlin and this metadata moves with it.
export const metadata: Metadata = {
  title: { absolute: "kokoland | Indian Street Food & Kerala Restaurant Berlin" },
  description:
    "Indian street food and authentic Kerala cooking in Berlin: porotta and beef, biriyani, Gobi Manchurian, Chilli Paneer, appam and more. Order online or visit kokoland.",
  alternates: { canonical: SITE_URL },
  openGraph: { type: "website", url: SITE_URL, images: [{ url: covers.feast.src, width: 1920, height: 1080, alt: covers.feast.alt }] },
  twitter: { card: "summary_large_image", images: [covers.feast.src] },
};

// Keep in sync with the opening hours and address shown on the page.
const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "kokoland",
  legalName: "Kokoland Gastro UG (haftungsbeschränkt)",
  url: SITE_URL,
  image: [`${SITE_URL}${covers.feast.src}`, `${SITE_URL}/assets/hero-photo.jpg`],
  telephone: "+49 176 24404981",
  email: "info@kokolandberlin.com",
  servesCuisine: ["Indian", "Kerala", "South Indian", "Indian street food", "Indo-Chinese"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Petersburger Str. 39",
    postalCode: "10249",
    addressLocality: "Berlin",
    addressCountry: "DE",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "12:00",
      closes: "22:00",
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd).replace(/</g, "\\u003c") }}
      />
      <Home />
    </>
  );
}
