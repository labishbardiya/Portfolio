import { createClient } from "@supabase/supabase-js";
import { projects as localProjects, type Project, type ProjectLink } from "@/data/projects";

type DatabaseProject = {
  number: number;
  name: string;
  stage: string;
  description: string;
  tags: string[];
  links: unknown;
};

function getPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function isProjectLink(value: unknown): value is ProjectLink {
  if (!value || typeof value !== "object") return false;
  const link = value as Record<string, unknown>;
  return (link.label === "Code" || link.label === "Live") && typeof link.href === "string";
}

function toProject(project: DatabaseProject): Project {
  const links = Array.isArray(project.links) ? project.links.filter(isProjectLink) : [];
  return {
    number: String(project.number).padStart(2, "0"),
    name: project.name,
    stage: project.stage,
    description: project.description,
    tags: project.tags,
    links,
  };
}

/**
 * Public pages read published content from Supabase once credentials are set.
 * Local data keeps the site usable until the hosted project is connected.
 */
export async function getPublishedProjects(): Promise<Project[]> {
  const supabase = getPublicClient();
  if (!supabase) return localProjects;

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("number, name, stage, description, tags, links")
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return localProjects;
  return (data as DatabaseProject[]).map(toProject);
}
