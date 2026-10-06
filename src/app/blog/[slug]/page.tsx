import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import BlogLayout from "@/components/BlogLayout";
import { getPost, describe } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };
  const url = `${SITE_URL}/blog/${post.slug}`;
  const description = describe(post);
  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      locale: post.lang === "de" ? "de_DE" : "en_US",
      images: post.cover_url ? [{ url: post.cover_url }] : undefined,
    },
    twitter: { card: post.cover_url ? "summary_large_image" : "summary", title: post.title, description },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: describe(post),
    inLanguage: post.lang,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: url,
    image: post.cover_url ? [post.cover_url] : undefined,
    author: { "@type": "Organization", name: "kokoland", url: SITE_URL },
    publisher: { "@type": "Organization", name: "kokoland", url: SITE_URL },
  };

  return (
    <BlogLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <article lang={post.lang} className="max-w-3xl mx-auto px-5">
        <Link href="/blog" className="inline-flex items-center gap-2 text-cream/60 hover:text-lime transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> All posts
        </Link>
        <time dateTime={post.published_at} className="block text-xs uppercase tracking-widest text-cream/50 mb-2">
          {new Date(post.published_at).toLocaleDateString(post.lang === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </time>
        <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-lime mb-8">{post.title}</h1>
        {post.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.cover_url} alt="" className="mb-10 aspect-[16/9] w-full rounded-xl object-cover" />
        )}
        <div className="space-y-5 text-cream/85 leading-relaxed [&_a]:text-lime [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-lime/40 [&_blockquote]:pl-4 [&_blockquote]:text-cream/70 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-cream [&_h2]:pt-4 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-cream [&_img]:rounded-xl [&_li]:ml-6 [&_ol]:list-decimal [&_ul]:list-disc">
          <ReactMarkdown
            components={{
              a: ({ href, children }) => {
                const external = !!href && /^https?:\/\//.test(href) && !href.startsWith(SITE_URL);
                return (
                  <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {children}
                  </a>
                );
              },
            }}
          >
            {post.body_md}
          </ReactMarkdown>
        </div>
      </article>
    </BlogLayout>
  );
}
