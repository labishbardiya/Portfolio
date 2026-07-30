import { notFound } from "next/navigation";
import { ExternalPostLink } from "@/components/external-post-link";
import { MarkdownArticle } from "@/components/markdown-article";
import { getPublishedWritingPost } from "@/lib/writing-data";

export const dynamic = "force-dynamic";

export default async function WritingPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedWritingPost(slug);
  if (!post) notFound();

  return (
    <article className="page-shell content-page article-page">
      <p className="eyebrow">Writing / {post.published_at?.slice(0, 10) ?? "Note"}</p>
      <h1>{post.title}</h1>
      {post.subtitle && <p className="article-subtitle">{post.subtitle}</p>}
      <ExternalPostLink href={post.external_url} />
      <MarkdownArticle markdown={post.body_markdown} />
    </article>
  );
}
