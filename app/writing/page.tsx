import { WritingList } from "@/components/writing-list";
import { getPublishedWritingPosts } from "@/lib/writing-data";

export const dynamic = "force-dynamic";

export default async function WritingPage() {
  return (
    <main className="page-shell content-page writing-page">
      <p className="eyebrow">Writing</p>
      <h1>Notes from the workbench.</h1>
      <p className="page-intro">Essays, ideas, and things I&apos;m still figuring out—written in Markdown, with room to point back to the original post when an idea started somewhere else.</p>
      <WritingList posts={await getPublishedWritingPosts()} />
    </main>
  );
}
