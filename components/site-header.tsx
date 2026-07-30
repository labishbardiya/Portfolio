"use client";

import Link from "next/link";
const navigation = [
  ["Home", "/"],
  ["Projects", "/projects"],
  ["Writing", "/writing"],
  ["About", "/about"],
  ["Resume", "/resume"],
  ["Contact", "/contact"],
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <Link className="wordmark" href="/" aria-label="Labish Bardiya home">LB</Link>
        <div className="nav-links">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
