import type { Metadata } from "next";
import CateringMenuScreen from "@/screens/CateringMenu";
import { fetchCateringMenu } from "@/lib/catering";
import { SITE_URL } from "@/lib/site";
import { covers } from "@/data/food-photos";

export const revalidate = 300;

const url = `${SITE_URL}/catering`;
const description =
  "Kerala catering in Berlin by kokoland: build your menu from authentic South Indian dishes, see the total as you go and send us your request.";

export const metadata: Metadata = {
  title: "Kerala Catering in Berlin",
  description,
  alternates: { canonical: url },
  openGraph: { type: "website", url, title: "Kerala Catering in Berlin — kokoland", description, images: [{ url: covers.feast.src, width: 1920, height: 1080, alt: covers.feast.alt }] },
  twitter: { card: "summary_large_image", images: [covers.feast.src] },
};

export default async function Page() {
  const menu = await fetchCateringMenu();
  return <CateringMenuScreen menu={menu} />;
}
