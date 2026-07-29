import { BookOpen, FileText, FolderKanban, House, Mail, UserRound } from "lucide-react";

export const desktopPages = ["home", "projects", "writing", "about", "resume", "contact"] as const;
export type DesktopPage = (typeof desktopPages)[number];

const leftLinks: Array<{ label: string; page: DesktopPage; icon: typeof House }> = [
  { label: "Home", page: "home", icon: House },
  { label: "Projects", page: "projects", icon: FolderKanban },
  { label: "Writing", page: "writing", icon: BookOpen },
];

const rightLinks: Array<{ label: string; page: DesktopPage; icon: typeof House }> = [
  { label: "About", page: "about", icon: UserRound },
  { label: "Resume", page: "resume", icon: FileText },
  { label: "Contact", page: "contact", icon: Mail },
];

function Rail({ links, side, onOpen }: { links: typeof leftLinks; side: "left" | "right"; onOpen: (page: DesktopPage) => void }) {
  return (
    <nav className={`desktop-rail desktop-rail-${side}`} aria-label={`${side} quick navigation`}>
      {links.map(({ label, page, icon: Icon }) => (
        <button key={page} type="button" className="rail-link" onClick={() => onOpen(page)}>
          <span className="rail-icon"><Icon size={19} strokeWidth={1.8} /></span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export function DesktopRails({ onOpen }: { onOpen: (page: DesktopPage) => void }) {
  return (
    <>
      <Rail links={leftLinks} side="left" onOpen={onOpen} />
      <Rail links={rightLinks} side="right" onOpen={onOpen} />
    </>
  );
}
