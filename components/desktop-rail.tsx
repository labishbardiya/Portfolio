import Link from "next/link";
import { BookOpen, FileText, FolderKanban, House, Mail, UserRound } from "lucide-react";

const leftLinks = [
  { label: "Home", href: "/", icon: House },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Writing", href: "/writing", icon: BookOpen },
];

const rightLinks = [
  { label: "About", href: "/about", icon: UserRound },
  { label: "Resume", href: "/resume", icon: FileText },
  { label: "Contact", href: "/contact", icon: Mail },
];

function Rail({ links, side }: { links: typeof leftLinks; side: "left" | "right" }) {
  return (
    <nav className={`desktop-rail desktop-rail-${side}`} aria-label={`${side} quick navigation`}>
      {links.map(({ label, href, icon: Icon }) => (
        <Link key={href} href={href} className="rail-link">
          <span className="rail-icon"><Icon size={19} strokeWidth={1.8} /></span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export function DesktopRails() {
  return (
    <>
      <Rail links={leftLinks} side="left" />
      <Rail links={rightLinks} side="right" />
    </>
  );
}
