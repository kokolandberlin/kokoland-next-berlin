import { createClient } from "@supabase/supabase-js";
import { DISHDATA_SLUG } from "@/lib/supabase";

// Server-side reads for the public blog. A fresh anon client with no session:
// RLS (blog_posts_public_read) already limits anon to published posts, so this
// never sees drafts. Failures degrade to "no posts" rather than a broken page.

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string | null;
  body_md: string;
  cover_url: string | null;
  lang: "de" | "en";
  published_at: string;
  updated_at: string;
}

export type BlogSummary = Omit<BlogPost, "body_md">;

const SUMMARY_COLS = "slug,title,excerpt,cover_url,lang,published_at,updated_at";

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || !DISHDATA_SLUG) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function orgId(sb: NonNullable<ReturnType<typeof client>>): Promise<string | null> {
  const { data } = await sb.from("orgs").select("id").eq("slug", DISHDATA_SLUG).maybeSingle();
  return data?.id ?? null;
}

export async function listPosts(): Promise<BlogSummary[]> {
  const sb = client();
  if (!sb) return [];
  try {
    const org = await orgId(sb);
    if (!org) return [];
    const { data, error } = await sb
      .from("blog_posts")
      .select(SUMMARY_COLS)
      .eq("org_id", org)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as BlogSummary[];
  } catch (e) {
    console.error("[blog] listPosts failed", e);
    return [];
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  const sb = client();
  if (!sb) return null;
  try {
    const org = await orgId(sb);
    if (!org) return null;
    const { data, error } = await sb
      .from("blog_posts")
      .select(`${SUMMARY_COLS},body_md`)
      .eq("org_id", org)
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    return (data as BlogPost | null) ?? null;
  } catch (e) {
    console.error("[blog] getPost failed", e);
    return null;
  }
}

/** Plain-text description for posts that have no excerpt. */
export function describe(post: Pick<BlogPost, "excerpt" | "body_md">): string {
  if (post.excerpt?.trim()) return post.excerpt.trim();
  const text = post.body_md.replace(/[#>*_`~\[\]()!-]+/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}…` : text;
}
