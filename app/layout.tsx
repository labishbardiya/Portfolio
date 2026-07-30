import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

// Fontshare's Cabinet Grotesk files are kept in-repo so the portfolio does not
// depend on a third-party font request during a visitor's first render.
const cabinetGrotesk = localFont({
  src: [
    { path: "./fonts/CabinetGrotesk-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/CabinetGrotesk-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/CabinetGrotesk-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/CabinetGrotesk-Extrabold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-cabinet-grotesk",
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
      <body className={cabinetGrotesk.variable}>
        <SiteChrome />
        {children}
      </body>
    </html>
  );
}
