import type { Metadata } from "next";
import OnamSadhya from "@/screens/OnamSadhya";
import { FAQS } from "@/lib/onam-sadhya";
import { SITE_URL } from "@/lib/site";
import { covers } from "@/data/food-photos";

const url = `${SITE_URL}/onam-sadhya`;
const description =
  "The Onam sadhya in Berlin by kokoland: a vegetarian Kerala harvest feast of 18 dishes on a banana leaf. Explore the leaf, the menu and how to eat it.";

export const metadata: Metadata = {
  title: "Onam Sadhya in Berlin",
  description,
  alternates: { canonical: url },
  openGraph: { type: "website", url, title: "Onam Sadhya in Berlin — kokoland", description, images: [{ url: covers.closeup.src, width: 1920, height: 1080, alt: covers.closeup.alt }] },
  twitter: { card: "summary_large_image", images: [covers.closeup.src] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <OnamSadhya />
    </>
  );
}
