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

const leadingNavigation = navigation.slice(0, 3);
const trailingNavigation = navigation.slice(3);

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <div className="nav-links nav-links-leading">
          {leadingNavigation.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
        <Link className="wordmark" href="/" aria-label="Labish Bardiya home">LB</Link>
        <div className="nav-links nav-links-trailing">
          {trailingNavigation.map(([label, href]) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
