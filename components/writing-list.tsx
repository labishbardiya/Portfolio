import Link from "next/link";
import type { WritingPost } from "@/lib/writing-data";

export function WritingList({ posts, compact = false }: { posts: WritingPost[]; compact?: boolean }) {
  if (!posts.length) return <p className="writing-empty">No notes are published yet. The first one is being worked on.</p>;
  return (
    <div className={compact ? "writing-list writing-list-compact" : "writing-list"}>
      {posts.map((post) => (
        <article className="writing-card" key={post.slug}>
          <p className="writing-card-kicker">Note / {post.published_at?.slice(0, 10) ?? "coming soon"}</p>
          <h2><Link href={`/writing/${post.slug}`}>{post.title}</Link></h2>
          {post.subtitle && <p className="writing-card-subtitle">{post.subtitle}</p>}
          {post.excerpt && <p>{post.excerpt}</p>}
          <Link className="writing-card-link" href={`/writing/${post.slug}`}>Read note →</Link>
        </article>
      ))}
    </div>
  );
}
