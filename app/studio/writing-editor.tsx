"use client";

import { useActionState } from "react";
import { archiveWritingPost, createWritingPost, saveWritingPost } from "./actions";
import { emptyStudioActionState, type StudioWritingPost } from "@/lib/studio";

function WritingFields({ post }: { post?: StudioWritingPost }) {
  return (
    <div className="studio-fields">
      <label className="studio-field-wide">Title<input name="title" defaultValue={post?.title} required maxLength={180} placeholder="A useful thing I learned" /></label>
      <label className="studio-field-wide">Slug<input name="slug" defaultValue={post?.slug} required maxLength={100} placeholder="a-useful-thing-i-learned" /></label>
      <label className="studio-field-wide">Subtitle <span>optional · the one-line promise</span><input name="subtitle" defaultValue={post?.subtitle} maxLength={280} /></label>
      <label className="studio-field-wide">Excerpt <span>optional · used in the writing index</span><textarea name="excerpt" defaultValue={post?.excerpt} maxLength={500} rows={3} /></label>
      <label>Status<select name="status" defaultValue={post?.status ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
      <label>Sort order<input name="sort_order" type="number" defaultValue={post?.sort_order ?? 50} required /></label>
      <label className="studio-field-wide">Original-post link <span>optional · for a LinkedIn, X, Instagram, or YouTube post</span><input name="external_url" type="url" defaultValue={post?.external_url ?? ""} maxLength={1000} placeholder="https://…" /></label>
      <label className="studio-field-wide">Markdown article <span>headings, emphasis, links, lists, quotes, code blocks, and tables are supported</span><textarea className="studio-markdown-input" name="body_markdown" defaultValue={post?.body_markdown} required maxLength={50000} rows={18} placeholder={"# Start with a point of view\n\nWrite the first paragraph here."} /></label>
    </div>
  );
}

export function NewWritingPostForm() {
  const [state, action, pending] = useActionState(createWritingPost, emptyStudioActionState);
  return (
    <details className="studio-new-project">
      <summary>+ New post</summary>
      <form action={action} className="studio-project-form"><WritingFields /><button type="submit" disabled={pending}>{pending ? "Creating…" : "Create draft"}</button>{state.message && <p className={state.ok ? "studio-feedback success" : "studio-feedback"}>{state.message}</p>}</form>
    </details>
  );
}

export function WritingPostEditor({ post }: { post: StudioWritingPost }) {
  const [saveState, saveAction, saving] = useActionState(saveWritingPost, emptyStudioActionState);
  const [archiveState, archiveAction, archiving] = useActionState(archiveWritingPost, emptyStudioActionState);
  return (
    <article className="studio-project-card studio-writing-card">
      <header><div><p>post / {post.status}</p><h2>{post.title}</h2></div><time dateTime={post.updated_at}>order {post.sort_order}</time></header>
      <form action={saveAction} className="studio-project-form"><input type="hidden" name="id" value={post.id} /><WritingFields post={post} /><div className="studio-actions"><button type="submit" disabled={saving}>{saving ? "Saving…" : "Save post"}</button>{saveState.message && <p className={saveState.ok ? "studio-feedback success" : "studio-feedback"}>{saveState.message}</p>}</div></form>
      {post.status !== "archived" && <form action={archiveAction} className="studio-archive-form"><input type="hidden" name="id" value={post.id} /><button type="submit" disabled={archiving}>{archiving ? "Archiving…" : "Archive post"}</button>{archiveState.message && <p className={archiveState.ok ? "studio-feedback success" : "studio-feedback"}>{archiveState.message}</p>}</form>}
    </article>
  );
}
