import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

// A variable Google font with the same compact, contemporary grotesk character
// as Cabinet Grotesk. Next serves it from this site at build time.
const manrope = Manrope({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-manrope",
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
      <body className={manrope.variable}>
        <SiteChrome />
        {children}
      </body>
    </html>
  );
}
