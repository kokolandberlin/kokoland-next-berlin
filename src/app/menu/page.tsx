import type { Metadata } from "next";
import MenuPage from "@/screens/MenuPage";
import { fetchMenu } from "@/lib/menu";
import { SITE_URL } from "@/lib/site";
import { covers } from "@/data/food-photos";

export const revalidate = 300;

const url = `${SITE_URL}/menu`;
const description =
  "The kokoland menu rotates: Kerala dishes from Malabar to Travancore, Indian street food and Indo-Chinese favorites like Gobi Manchurian and Chilli Paneer. Order online or visit us in Berlin.";

export const metadata: Metadata = {
  title: "Menu: a rotating mix of Indian street food & Kerala dishes",
  description,
  alternates: { canonical: url },
  openGraph: { type: "website", url, title: "Menu — kokoland Berlin", description, images: [{ url: covers.spread.src, width: 1920, height: 1080, alt: covers.spread.alt }] },
  twitter: { card: "summary_large_image", images: [covers.spread.src] },
};

export default async function Page() {
  const menu = await fetchMenu();
  return <MenuPage menu={menu} />;
}
