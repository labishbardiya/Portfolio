"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { StoryDoors } from "./story-doors";

/** The public navigation never appears inside the intentionally private Studio. */
export function SiteChrome() {
  const pathname = usePathname();
  return pathname.startsWith("/studio") ? null : <><SiteHeader /><StoryDoors /></>;
}
