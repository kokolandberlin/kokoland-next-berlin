import type { Metadata } from "next";
import OurStory from "@/screens/OurStory";
import { SITE_URL } from "@/lib/site";
import { covers } from "@/data/food-photos";
import { STORY_LIVE } from "@/data/story";

const url = `${SITE_URL}/our-story`;
const description =
  "How kokoland grew from a Kerala cloud kitchen in 2021 to pop-ups, markets, collaborations and weddings across Berlin.";

export const metadata: Metadata = {
  title: "Our story",
  description,
  alternates: { canonical: url },
  // Hidden until photos and details are added (see STORY_LIVE in src/data/story.ts).
  robots: STORY_LIVE ? undefined : { index: false, follow: false },
  openGraph: { type: "website", url, title: "Our story — kokoland Berlin", description, images: [{ url: covers.feast.src, width: 1920, height: 1080, alt: covers.feast.alt }] },
  twitter: { card: "summary_large_image", images: [covers.feast.src] },
};

export default function Page() {
  return <OurStory />;
}
