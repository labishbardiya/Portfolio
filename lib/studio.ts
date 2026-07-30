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
