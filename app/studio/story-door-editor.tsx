"use client";

import { useActionState } from "react";
import { archiveStoryDoor, createStoryDoor, saveStoryDoor } from "./actions";
import { emptyStudioActionState, type StudioStoryDoor } from "@/lib/studio";

function DoorFields({ door }: { door?: StudioStoryDoor }) {
  return <div className="studio-fields">
    <label className="studio-field-wide">Title<input name="title" defaultValue={door?.title} maxLength={100} required placeholder="A small thought" /></label>
    <label className="studio-field-wide">Story<textarea name="body" defaultValue={door?.body} maxLength={1400} rows={5} required placeholder="Write the thought someone finds when they open this door." /></label>
    <label>Horizontal placement <span>0 = left edge, 100 = right edge</span><input name="position_x" type="number" min="0" max="100" step="0.1" defaultValue={door?.position_x ?? 88} required /></label>
    <label>Vertical placement <span>0 = top edge, 100 = bottom edge</span><input name="position_y" type="number" min="0" max="100" step="0.1" defaultValue={door?.position_y ?? 72} required /></label>
    <label>Order<input name="sort_order" type="number" defaultValue={door?.sort_order ?? 0} required /></label>
    <label>Status<select name="status" defaultValue={door?.status ?? "draft"}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
  </div>;
}

export function NewStoryDoorForm() {
  const [state, action, pending] = useActionState(createStoryDoor, emptyStudioActionState);
  return <details className="studio-new-project"><summary>+ Add story door</summary><form action={action} className="studio-project-form"><DoorFields /><button type="submit" disabled={pending}>{pending ? "Creating…" : "Create door"}</button>{state.message && <p className={state.ok ? "studio-feedback success" : "studio-feedback"}>{state.message}</p>}</form></details>;
}

export function StoryDoorEditor({ door }: { door: StudioStoryDoor }) {
  const [saveState, saveAction, saving] = useActionState(saveStoryDoor, emptyStudioActionState);
  const [archiveState, archiveAction, archiving] = useActionState(archiveStoryDoor, emptyStudioActionState);
  return <article className="studio-project-card"><header><div><p>Story door / {door.status}</p><h2>{door.title}</h2></div></header><form action={saveAction} className="studio-project-form"><input type="hidden" name="id" value={door.id} /><DoorFields door={door} /><div className="studio-actions"><button type="submit" disabled={saving}>{saving ? "Saving…" : "Save door"}</button>{saveState.message && <p className={saveState.ok ? "studio-feedback success" : "studio-feedback"}>{saveState.message}</p>}</div></form>{door.status !== "archived" && <form action={archiveAction} className="studio-archive-form"><input type="hidden" name="id" value={door.id} /><button type="submit" disabled={archiving}>{archiving ? "Archiving…" : "Archive door"}</button>{archiveState.message && <p className={archiveState.ok ? "studio-feedback success" : "studio-feedback"}>{archiveState.message}</p>}</form>}</article>;
}
