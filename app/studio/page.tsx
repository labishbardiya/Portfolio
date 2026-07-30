import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { StudioProject, StudioSettings, StudioTimelineEntry, StudioWritingPost } from "@/lib/studio";
import { HomeSettingsEditor, NewTimelineEntryForm, TimelineEntryEditor } from "./home-editor";
import { NewProjectForm, ProjectEditor } from "./project-editor";
import { NewWritingPostForm, WritingPostEditor } from "./writing-editor";

export const dynamic = "force-dynamic";

function AccessPending({ userId, email }: { userId: string; email: string }) {
  return (
    <main className="studio-shell">
      <section className="studio-access-card">
        <p className="studio-kicker">Studio / access checkpoint</p>
        <h1>You&apos;re signed in.</h1>
        <p><strong>{email}</strong> is verified, but it has not yet been approved to edit the portfolio.</p>
        <p className="studio-user-id">Secure account ID: <code>{userId}</code></p>
        <p>Send me a screenshot of this page or say “Studio login complete” and I&apos;ll add this account to the admin list. Until then, the database will refuse all edits.</p>
      </section>
    </main>
  );
}

export default async function StudioPage() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  const email = claimsData?.claims?.email;

  if (typeof userId !== "string" || typeof email !== "string") redirect("/studio/login");

  const { data: admin } = await supabase
    .from("portfolio_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!admin) return <AccessPending userId={userId} email={email} />;

  const [{ data: projects, error: projectsError }, { data: settings, error: settingsError }, { data: timeline, error: timelineError }, { data: posts, error: postsError }] = await Promise.all([
    supabase.from("portfolio_projects").select("id, name, slug, number, stage, description, tags, links, cover_url, status, featured, sort_order, updated_at").order("sort_order", { ascending: true }),
    supabase.from("portfolio_settings").select("id, typewriter_lines, social_links, current_focus, is_published, updated_at").eq("id", true).single(),
    supabase.from("portfolio_timeline_entries").select("id, category, period, title, organisation, description, status, sort_order, updated_at").order("category", { ascending: true }).order("sort_order", { ascending: true }),
    supabase.from("portfolio_writing_posts").select("id, slug, title, subtitle, excerpt, body_markdown, external_url, status, sort_order, published_at, updated_at").order("updated_at", { ascending: false }),
  ]);

  return (
    <main className="studio-shell">
      <header className="studio-header">
        <div><p className="studio-kicker">Labish Bardiya / Studio</p><h1>Portfolio control room.</h1><p>Projects are live data. Save a draft, publish when it is ready, archive instead of deleting.</p></div>
        <div className="studio-header-links"><span>{email}</span><Link href="/">View portfolio ↗</Link></div>
      </header>
      <section className="studio-summary"><p><strong>{projects?.filter((project) => project.status === "published").length ?? 0}</strong> published</p><p><strong>{projects?.filter((project) => project.status === "draft").length ?? 0}</strong> drafts</p><p><strong>{projects?.filter((project) => project.status === "archived").length ?? 0}</strong> archived</p></section>
      {settingsError || !settings ? <p className="studio-feedback">Could not load homepage settings. Refresh and try again.</p> : <HomeSettingsEditor settings={settings as StudioSettings} />}
      <section className="studio-projects" aria-labelledby="timeline-heading"><div className="studio-section-title"><div><p className="studio-kicker">Homepage proof</p><h2 id="timeline-heading">Experience & awards</h2></div><NewTimelineEntryForm /></div>{timelineError ? <p className="studio-feedback">Could not load timeline entries. Refresh and try again.</p> : <div className="studio-project-list">{(timeline as StudioTimelineEntry[] | null)?.map((entry) => <TimelineEntryEditor key={entry.id} entry={entry} />)}</div>}</section>
      <section className="studio-projects" aria-labelledby="projects-heading"><div className="studio-section-title"><div><p className="studio-kicker">Content</p><h2 id="projects-heading">Projects</h2></div><NewProjectForm /></div>{projectsError ? <p className="studio-feedback">Could not load projects. Refresh and try again.</p> : <div className="studio-project-list">{(projects as StudioProject[] | null)?.map((project) => <ProjectEditor key={project.id} project={project} />)}</div>}</section>
      <section className="studio-projects" aria-labelledby="writing-heading"><div className="studio-section-title"><div><p className="studio-kicker">Publishing</p><h2 id="writing-heading">Writing</h2></div><NewWritingPostForm /></div>{postsError ? <p className="studio-feedback">Could not load writing posts. Refresh and try again.</p> : <div className="studio-project-list">{(posts as StudioWritingPost[] | null)?.map((post) => <WritingPostEditor key={post.id} post={post} />)}</div>}</section>
    </main>
  );
}
