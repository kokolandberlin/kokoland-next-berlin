import type { MetadataRoute } from "next";
import { listPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { STORY_LIVE } from "@/data/story";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPosts();
  const pages = ["", "/menu", "/kerala", "/catering", "/onam-sadhya", ...(STORY_LIVE ? ["/our-story"] : []), "/blog", "/kollective", "/impressum", "/datenschutz", "/agb"];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p}`, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.6 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.updated_at, changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
