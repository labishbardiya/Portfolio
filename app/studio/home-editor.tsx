"use client";

import { useActionState } from "react";
import {
  archiveTimelineEntry,
  createTimelineEntry,
  saveHomeSettings,
  saveTimelineEntry,
} from "./actions";
import {
  emptyStudioActionState,
  type StudioSettings,
  type StudioTimelineEntry,
} from "@/lib/studio";

function TimelineFields({ entry }: { entry?: StudioTimelineEntry }) {
  return (
    <div className="studio-fields">
      <label>Category<select name="category" defaultValue={entry?.category ?? "experience"}><option value="experience">Experience</option><option value="award">Award</option></select></label>
      <label>Period<input name="period" defaultValue={entry?.period} required maxLength={40} placeholder="2026 or Now" /></label>
      <label>Sort order<input name="sort_order" type="number" defaultValue={entry?.sort_order ?? 50} required /></label>
      <label>Status<select name="status" defaultValue={entry?.status ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
      <label className="studio-field-wide">Role / award title<input name="title" defaultValue={entry?.title} required maxLength={120} /></label>
      <label className="studio-field-wide">Organisation<input name="organisation" defaultValue={entry?.organisation} required maxLength={180} /></label>
      <label className="studio-field-wide">Description<textarea name="description" defaultValue={entry?.description} required maxLength={500} rows={3} /></label>
    </div>
  );
}

export function HomeSettingsEditor({ settings }: { settings: StudioSettings }) {
  const [state, action, pending] = useActionState(saveHomeSettings, emptyStudioActionState);
  const socialLinks = settings.social_links.map((link) => `${link.label} | ${link.href}`).join("\n");

  return (
    <section className="studio-content-card" aria-labelledby="home-settings-heading">
      <header><div><p className="studio-kicker">Homepage</p><h2 id="home-settings-heading">What visitors see first.</h2></div><p>Changes are live after save.</p></header>
      <form action={action} className="studio-project-form">
        <label className="studio-field-wide">Typewriter lines <span>one short thought per line · up to 10</span><textarea name="typewriter_lines" defaultValue={settings.typewriter_lines.join("\n")} required maxLength={1200} rows={6} /></label>
        <label className="studio-field-wide">Current focus <span>one line per item · up to 3</span><textarea name="current_focus" defaultValue={settings.current_focus.items.join("\n")} required maxLength={600} rows={3} /></label>
        <label className="studio-field-wide">Focus-card caption<input name="focus_caption" defaultValue={settings.current_focus.caption} required maxLength={120} /></label>
        <label className="studio-field-wide">Social links <span>one per line: LinkedIn, X, GitHub, YouTube, or Instagram | https://…</span><textarea name="social_links" defaultValue={socialLinks} required maxLength={1200} rows={5} /></label>
        <label className="studio-checkbox"><input name="is_published" type="checkbox" defaultChecked={settings.is_published} /> Show these settings on the public homepage</label>
        <div className="studio-actions"><button type="submit" disabled={pending}>{pending ? "Saving…" : "Save homepage"}</button>{state.message && <p className={state.ok ? "studio-feedback success" : "studio-feedback"}>{state.message}</p>}</div>
      </form>
    </section>
  );
}

export function NewTimelineEntryForm() {
  const [state, action, pending] = useActionState(createTimelineEntry, emptyStudioActionState);
  return (
    <details className="studio-new-project">
      <summary>+ Add timeline entry</summary>
      <form action={action} className="studio-project-form">
        <TimelineFields />
        <button type="submit" disabled={pending}>{pending ? "Creating…" : "Create entry"}</button>
        {state.message && <p className={state.ok ? "studio-feedback success" : "studio-feedback"}>{state.message}</p>}
      </form>
    </details>
  );
}

export function TimelineEntryEditor({ entry }: { entry: StudioTimelineEntry }) {
  const [saveState, saveAction, saving] = useActionState(saveTimelineEntry, emptyStudioActionState);
  const [archiveState, archiveAction, archiving] = useActionState(archiveTimelineEntry, emptyStudioActionState);
  return (
    <article className="studio-project-card studio-timeline-card">
      <header><div><p>{entry.category} / {entry.status}</p><h2>{entry.title}</h2></div><time dateTime={entry.updated_at}>order {entry.sort_order}</time></header>
      <form action={saveAction} className="studio-project-form"><input type="hidden" name="id" value={entry.id} /><TimelineFields entry={entry} /><div className="studio-actions"><button type="submit" disabled={saving}>{saving ? "Saving…" : "Save entry"}</button>{saveState.message && <p className={saveState.ok ? "studio-feedback success" : "studio-feedback"}>{saveState.message}</p>}</div></form>
      {entry.status !== "archived" && <form action={archiveAction} className="studio-archive-form"><input type="hidden" name="id" value={entry.id} /><button type="submit" disabled={archiving}>{archiving ? "Archiving…" : "Archive entry"}</button>{archiveState.message && <p className={archiveState.ok ? "studio-feedback success" : "studio-feedback"}>{archiveState.message}</p>}</form>}
    </article>
  );
}
