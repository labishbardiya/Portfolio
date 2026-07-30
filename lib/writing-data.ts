import { createClient } from "@supabase/supabase-js";

export type WritingPost = {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  body_markdown: string;
  external_url: string | null;
  published_at: string | null;
};

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

/** Published writing only. Drafts and archived work are never part of public reads. */
export async function getPublishedWritingPosts(): Promise<WritingPost[]> {
  const supabase = getPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("portfolio_writing_posts")
    .select("slug, title, subtitle, excerpt, body_markdown, external_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .order("sort_order", { ascending: true });
  return error || !data ? [] : data as WritingPost[];
}

export async function getPublishedWritingPost(slug: string): Promise<WritingPost | null> {
  const supabase = getPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("portfolio_writing_posts")
    .select("slug, title, subtitle, excerpt, body_markdown, external_url, published_at")
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();
  return error || !data ? null : data as WritingPost;
}
