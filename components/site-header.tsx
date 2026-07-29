"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { desktopPages, type DesktopPage } from "@/components/desktop-rail";

const navigation: Array<[string, DesktopPage]> = [
  ["Home", "home"],
  ["Projects", "projects"],
  ["Writing", "writing"],
  ["About", "about"],
  ["Resume", "resume"],
  ["Contact", "contact"],
];

function hrefFor(page: DesktopPage) {
  return page === "home" ? "/" : `/${page}`;
}

export function SiteHeader() {
  const pathname = usePathname();

  const openInDesktop = (event: MouseEvent<HTMLAnchorElement>, page: DesktopPage) => {
    if (pathname !== "/" || !desktopPages.includes(page)) return;
    event.preventDefault();
    window.dispatchEvent(new CustomEvent("portfolio:navigate", { detail: { page } }));
  };

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <Link className="wordmark" href="/" aria-label="Labish Bardiya home" onClick={(event) => openInDesktop(event, "home")}>LB</Link>
        <div className="nav-links">
          {navigation.map(([label, page]) => (
            <Link key={page} href={hrefFor(page)} onClick={(event) => openInDesktop(event, page)}>
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
