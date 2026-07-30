import type { Metadata } from "next";
import { SiteChrome } from "@/components/site-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Labish Bardiya",
  description: "Portfolio of Labish Bardiya — builder, researcher, and founder.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteChrome />
        {children}
      </body>
    </html>
  );
}
