import type { Metadata } from "next";
import KeralaPage from "@/screens/KeralaPage";
import { fetchMenu } from "@/lib/menu";
import { SITE_URL } from "@/lib/site";
import { covers } from "@/data/food-photos";

export const revalidate = 300;

const url = `${SITE_URL}/kerala`;
const description =
  "Explore the regional kitchens and cultures of Kerala, from Malabar and Palakkad to Thrissur, Kochi and Travancore, and the dishes behind kokoland's menu in Berlin.";

export const metadata: Metadata = {
  title: "Kerala Cuisine: Malabar, Palakkad, Thrissur & Travancore",
  description,
  alternates: { canonical: url },
  openGraph: { type: "website", url, title: "The Kitchens of Kerala — kokoland Berlin", description, images: [{ url: covers.porottaCloseup.src, width: 1920, height: 1080, alt: covers.porottaCloseup.alt }] },
  twitter: { card: "summary_large_image", images: [covers.porottaCloseup.src] },
};

export default async function Page() {
  const menu = await fetchMenu();
  return <KeralaPage dishes={menu.dishes} />;
}
