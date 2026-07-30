"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { stories, type Story } from "@/data/stories";

type Offset = { x: number; y: number };
type DragState = {
  id: string;
  pointerId: number;
  startX: number;
  startY: number;
  origin: Offset;
  baseLeft: number;
  baseTop: number;
  width: number;
  height: number;
};

const emptyOffset: Offset = { x: 0, y: 0 };

/** Floating entry points for small personal essays, separate from the portfolio's work. */
export function StoryClouds() {
  const [offsets, setOffsets] = useState<Record<string, Offset>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const movedRef = useRef(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openStory = stories.find((story) => story.id === openId) ?? null;

  useEffect(() => {
    if (!openStory) return;

    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openStory]);

  function startDrag(event: React.PointerEvent<HTMLButtonElement>, story: Story) {
    if (event.button !== 0) return;

    const current = event.currentTarget;
    const currentOffset = offsets[story.id] ?? emptyOffset;
    const rect = current.getBoundingClientRect();
    dragRef.current = {
      id: story.id,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: currentOffset,
      baseLeft: rect.left - currentOffset.x,
      baseTop: rect.top - currentOffset.y,
      width: rect.width,
      height: rect.height,
    };
    movedRef.current = false;
    setActiveId(story.id);
    current.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.hypot(deltaX, deltaY) > 7) movedRef.current = true;

    const nextX = Math.min(
      Math.max(drag.origin.x + deltaX, -drag.baseLeft + 10),
      window.innerWidth - drag.baseLeft - drag.width - 10,
    );
    const nextY = Math.min(
      Math.max(drag.origin.y + deltaY, -drag.baseTop + 10),
      window.innerHeight - drag.baseTop - drag.height - 10,
    );
    setOffsets((current) => ({ ...current, [drag.id]: { x: nextX, y: nextY } }));
  }

  function endDrag(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
    setActiveId(null);
  }

  function openFromCloud(event: React.MouseEvent<HTMLButtonElement>, story: Story) {
    if (movedRef.current) {
      event.preventDefault();
      movedRef.current = false;
      return;
    }
    setOpenId(story.id);
  }

  function moveToStory(direction: number) {
    if (!openStory) return;
    const currentIndex = stories.findIndex((story) => story.id === openStory.id);
    const nextIndex = (currentIndex + direction + stories.length) % stories.length;
    setOpenId(stories[nextIndex].id);
  }

  return (
    <div className="story-clouds" aria-label="Personal stories">
      {stories.map((story) => {
        const offset = offsets[story.id] ?? emptyOffset;
        return (
          <button
            key={story.id}
            className={`story-cloud story-cloud-${story.shape}`}
            data-active={activeId === story.id}
            style={{
              left: story.position.left,
              top: story.position.top,
              transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${story.rotation}deg)`,
              zIndex: activeId === story.id ? 18 : 10,
            }}
            type="button"
            aria-label={`Open story: ${story.title}. Drag to reposition it.`}
            onPointerDown={(event) => startDrag(event, story)}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClick={(event) => openFromCloud(event, story)}
          >
            <span className="story-cloud-art" aria-hidden="true">
              <Image src={story.image} alt="" width={900} height={900} sizes="96px" />
            </span>
            <span className="story-cloud-label">Story!</span>
            <span className="story-cloud-topic">{story.topic}</span>
          </button>
        );
      })}

      {openStory && (
        <div className="story-dialog-backdrop" role="presentation" onMouseDown={() => setOpenId(null)}>
          <section
            className="story-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="story-dialog-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button ref={closeButtonRef} className="story-dialog-close" type="button" onClick={() => setOpenId(null)} aria-label="Close story">
              <X size={19} aria-hidden="true" />
            </button>
            <div className="story-dialog-image">
              <Image src={openStory.image} alt="" width={900} height={900} sizes="(max-width: 720px) 84vw, 390px" priority />
            </div>
            <div className="story-dialog-copy">
              <p>{openStory.topic}</p>
              <h2 id="story-dialog-title">{openStory.title}</h2>
              <p>{openStory.thought}</p>
              <button className="story-dialog-next" type="button" onClick={() => moveToStory(1)}>Another story <span aria-hidden="true">→</span></button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
