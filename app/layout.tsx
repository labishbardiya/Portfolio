import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

// Lato is self-hosted by Next at build time, so the portfolio does not make a
// runtime request to Google when a visitor opens it.
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Labish Bardiya",
  description: "Portfolio of Labish Bardiya — builder, researcher, and founder.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={lato.variable}>
        <SiteChrome />
        {children}
      </body>
    </html>
  );
}
