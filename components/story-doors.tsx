"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

type StoryDoor = {
  id: string;
  title: string;
  body: string;
  position_x: number;
  position_y: number;
};

function publicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}

/** A door appears only when a Studio-published story exists. */
export function StoryDoors() {
  const [doors, setDoors] = useState<StoryDoor[]>([]);
  const [activeDoor, setActiveDoor] = useState<StoryDoor | null>(null);

  useEffect(() => {
    const client = publicClient();
    if (!client) return;
    void client.from("portfolio_story_doors")
      .select("id, title, body, position_x, position_y")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .then(({ data }) => setDoors((data ?? []) as StoryDoor[]));
  }, []);

  return (
    <div className="story-world" aria-label="Personal stories">
      <span className="story-mist story-mist-one" aria-hidden="true" />
      <span className="story-mist story-mist-two" aria-hidden="true" />
      <span className="story-spark story-spark-one" aria-hidden="true" />
      <span className="story-spark story-spark-two" aria-hidden="true" />
      <span className="story-spark story-spark-three" aria-hidden="true" />
      {doors.map((door) => (
        <button
          key={door.id}
          className="story-door"
          type="button"
          style={{ left: `${door.position_x}%`, top: `${door.position_y}%` }}
          aria-label={`Open story: ${door.title}`}
          onClick={() => setActiveDoor(door)}
        >
          <span className="story-door-glow" aria-hidden="true" />
          <span className="story-door-frame" aria-hidden="true"><span /></span>
          <span className="story-door-hint">Story</span>
        </button>
      ))}
      {activeDoor && (
        <div className="story-note-backdrop" role="presentation" onMouseDown={() => setActiveDoor(null)}>
          <article className="story-note" role="dialog" aria-modal="true" aria-labelledby="story-note-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="story-note-close" type="button" onClick={() => setActiveDoor(null)} aria-label="Close story"><X size={18} /></button>
            <p>Behind the door</p>
            <h2 id="story-note-title">{activeDoor.title}</h2>
            <p>{activeDoor.body}</p>
          </article>
        </div>
      )}
    </div>
  );
}
