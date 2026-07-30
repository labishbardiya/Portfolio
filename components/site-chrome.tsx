"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";

/** The public navigation never appears inside the intentionally private Studio. */
export function SiteChrome() {
  const pathname = usePathname();
  return pathname.startsWith("/studio") ? null : <SiteHeader />;
}
