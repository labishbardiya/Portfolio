import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const navigation = [
  ["Home", "/"],
  ["Projects", "/projects"],
  ["Writing", "/writing"],
  ["About", "/about"],
  ["Resume", "/resume"],
  ["Contact", "/contact"],
] as const;

export const metadata: Metadata = {
  title: "Labish Bardiya",
  description: "Portfolio of Labish Bardiya — builder, researcher, and founder.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav className="site-nav" aria-label="Primary navigation">
            <Link className="wordmark" href="/" aria-label="Labish Bardiya home">
              LB
            </Link>
            <div className="nav-links">
              {navigation.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
