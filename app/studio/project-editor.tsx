"use client";

import { useActionState } from "react";
import { archiveProject, createProject, saveProject } from "./actions";
import { emptyStudioActionState, type StudioProject } from "@/lib/studio";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Keep the server and every browser byte-for-byte aligned during hydration.
function formatUpdatedAt(value: string) {
  const [year, month, day] = new Date(value).toISOString().slice(0, 10).split("-");
  return `${day} ${MONTHS[Number(month) - 1]} ${year}`;
}

function ProjectFields({ project }: { project?: StudioProject }) {
  const links = project?.links.map((link) => `${link.label} | ${link.href}`).join("\n") ?? "";

  return (
    <div className="studio-fields">
      <label>Name<input name="name" defaultValue={project?.name} required maxLength={100} /></label>
      <label>Slug<input name="slug" defaultValue={project?.slug} required maxLength={100} placeholder="my-project" /></label>
      <label>Number<input name="number" type="number" min="1" max="99" defaultValue={project?.number ?? 1} required /></label>
      <label>Stage<input name="stage" defaultValue={project?.stage} required maxLength={40} placeholder="Building" /></label>
      <label>Sort order<input name="sort_order" type="number" defaultValue={project?.sort_order ?? 50} required /></label>
      <label>Status
        <select name="status" defaultValue={project?.status ?? "draft"}>
          <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
        </select>
      </label>
      <label className="studio-field-wide">Description<textarea name="description" defaultValue={project?.description} required maxLength={500} rows={3} /></label>
      <label className="studio-field-wide">Tags <span>comma separated</span><input name="tags" defaultValue={project?.tags.join(", ")} maxLength={300} placeholder="Healthtech, ML, Wearables" /></label>
      <label className="studio-field-wide">Links <span>one per line: Code, Live, Demo, or Document | URL</span><textarea name="links" defaultValue={links} maxLength={4000} rows={3} placeholder={"Code | https://github.com/…\nDemo | https://youtube.com/…"} /></label>
      <label className="studio-field-wide">Cover image URL <span>optional</span><input name="cover_url" type="url" defaultValue={project?.cover_url ?? ""} maxLength={1000} /></label>
      <label className="studio-checkbox"><input name="featured" type="checkbox" defaultChecked={project?.featured ?? false} /> Featured project</label>
    </div>
  );
}

export function NewProjectForm() {
  const [state, action, pending] = useActionState(createProject, emptyStudioActionState);
  return (
    <details className="studio-new-project">
      <summary>+ Add project</summary>
      <form action={action} className="studio-project-form">
        <ProjectFields />
        <button type="submit" disabled={pending}>{pending ? "Creating…" : "Create project"}</button>
        {state.message && <p className={state.ok ? "studio-feedback success" : "studio-feedback"}>{state.message}</p>}
      </form>
    </details>
  );
}

export function ProjectEditor({ project }: { project: StudioProject }) {
  const [saveState, saveAction, saving] = useActionState(saveProject, emptyStudioActionState);
  const [archiveState, archiveAction, archiving] = useActionState(archiveProject, emptyStudioActionState);

  return (
    <article className="studio-project-card">
      <header><div><p>{String(project.number).padStart(2, "0")} / {project.status}</p><h2>{project.name}</h2></div><time dateTime={project.updated_at}>updated {formatUpdatedAt(project.updated_at)}</time></header>
      <form action={saveAction} className="studio-project-form">
        <input type="hidden" name="id" value={project.id} />
        <ProjectFields project={project} />
        <div className="studio-actions"><button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>{saveState.message && <p className={saveState.ok ? "studio-feedback success" : "studio-feedback"}>{saveState.message}</p>}</div>
      </form>
      {project.status !== "archived" && <form action={archiveAction} className="studio-archive-form"><input type="hidden" name="id" value={project.id} /><button type="submit" disabled={archiving}>{archiving ? "Archiving…" : "Archive project"}</button>{archiveState.message && <p className={archiveState.ok ? "studio-feedback success" : "studio-feedback"}>{archiveState.message}</p>}</form>}
    </article>
  );
}
