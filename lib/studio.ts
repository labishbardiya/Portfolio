export type StudioProjectLink = {
  label: string;
  href: string;
};

export type StudioProject = {
  id: string;
  name: string;
  slug: string;
  number: number;
  stage: string;
  description: string;
  tags: string[];
  links: StudioProjectLink[];
  cover_url: string | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
  sort_order: number;
  updated_at: string;
};

export type StudioActionState = {
  ok: boolean;
  message: string;
};

export const emptyStudioActionState: StudioActionState = { ok: false, message: "" };

export type StudioSocialLink = {
  label: "LinkedIn" | "X" | "GitHub" | "YouTube" | "Instagram";
  href: string;
};

export type StudioSettings = {
  id: true;
  typewriter_lines: string[];
  social_links: StudioSocialLink[];
  current_focus: { items: string[]; caption: string };
  is_published: boolean;
  updated_at: string;
};

export type StudioTimelineEntry = {
  id: string;
  category: "experience" | "award";
  period: string;
  title: string;
  organisation: string;
  description: string;
  status: "draft" | "published" | "archived";
  sort_order: number;
  updated_at: string;
};
