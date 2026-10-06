import type { Metadata } from "next";
import Link from "next/link";
import BlogLayout from "@/components/BlogLayout";
import { listPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories, recipes and news from kokoland: Kerala food, Onam Sadhya and life in our Berlin kitchen.",
  alternates: { canonical: `${SITE_URL}/blog` },
};

const fmt = (iso: string, lang: string) =>
  new Date(iso).toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

export default async function BlogIndex() {
  const posts = await listPosts();
  return (
    <BlogLayout>
      <div className="max-w-3xl mx-auto px-5">
        <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-lime mb-3">Blog</h1>
        <p className="text-cream/70 mb-12">Stories, recipes and news from the kokoland kitchen in Berlin.</p>

        {posts.length === 0 ? (
          <p className="text-cream/60">New posts are coming soon.</p>
        ) : (
          <div className="space-y-10">
            {posts.map((p) => (
              <article key={p.slug} lang={p.lang}>
                <Link href={`/blog/${p.slug}`} className="group block">
                  {p.cover_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.cover_url} alt="" loading="lazy" className="mb-4 aspect-[16/9] w-full rounded-xl object-cover" />
                  )}
                  <time dateTime={p.published_at} className="text-xs uppercase tracking-widest text-cream/50">
                    {fmt(p.published_at, p.lang)}
                  </time>
                  <h2 className="font-display font-bold text-2xl text-cream group-hover:text-lime transition-colors mt-1">{p.title}</h2>
                  {p.excerpt && <p className="mt-2 text-cream/70">{p.excerpt}</p>}
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </BlogLayout>
  );
}
