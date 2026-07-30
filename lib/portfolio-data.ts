import { createClient } from "@supabase/supabase-js";
import { projects as localProjects, type Project, type ProjectLink } from "@/data/projects";
import { defaultHomeContent, type HomeContent, type SocialLink, type TimelineItem } from "@/data/home";

type DatabaseProject = {
  number: number;
  name: string;
  stage: string;
  description: string;
  tags: string[];
  links: unknown;
};

type DatabaseTimelineEntry = TimelineItem & {
  category: "experience" | "award";
};

type DatabaseSettings = {
  typewriter_lines: unknown;
  social_links: unknown;
  current_focus: unknown;
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

function isStringArray(value: unknown, maximumLength = 100): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string" && item.trim().length > 0 && item.length <= maximumLength);
}

function isSocialLinks(value: unknown): value is SocialLink[] {
  const labels = new Set<SocialLink["label"]>(["LinkedIn", "X", "GitHub", "YouTube", "Instagram"]);
  return Array.isArray(value) && value.every((item) => {
    if (!item || typeof item !== "object") return false;
    const link = item as Record<string, unknown>;
    return typeof link.label === "string" && labels.has(link.label as SocialLink["label"])
      && typeof link.href === "string" && /^https:\/\//.test(link.href);
  });
}

function isFocus(value: unknown): value is HomeContent["currentFocus"] {
  if (!value || typeof value !== "object") return false;
  const focus = value as Record<string, unknown>;
  return isStringArray(focus.items, 140) && typeof focus.caption === "string" && focus.caption.length <= 120;
}

function toTimelineItem(entry: DatabaseTimelineEntry): TimelineItem {
  return {
    period: entry.period,
    title: entry.title,
    organisation: entry.organisation,
    description: entry.description,
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

/** Public homepage content with a local fallback for a first-run or an offline preview. */
export async function getPublishedHomeContent(): Promise<HomeContent> {
  const supabase = getPublicClient();
  if (!supabase) return defaultHomeContent;

  const [{ data: settings, error: settingsError }, { data: timeline, error: timelineError }] = await Promise.all([
    supabase.from("portfolio_settings").select("typewriter_lines, social_links, current_focus").eq("is_published", true).eq("id", true).maybeSingle(),
    supabase.from("portfolio_timeline_entries").select("category, period, title, organisation, description").eq("status", "published").order("sort_order", { ascending: true }),
  ]);

  if (settingsError || !settings) return defaultHomeContent;

  const typedSettings = settings as DatabaseSettings;
  const entries = timelineError ? [] : (timeline as DatabaseTimelineEntry[] | null) ?? [];
  const experience = entries.filter((entry) => entry.category === "experience").map(toTimelineItem);
  const awards = entries.filter((entry) => entry.category === "award").map(toTimelineItem);

  return {
    typewriterPhrases: isStringArray(typedSettings.typewriter_lines) && typedSettings.typewriter_lines.length > 0 ? typedSettings.typewriter_lines : defaultHomeContent.typewriterPhrases,
    socialLinks: isSocialLinks(typedSettings.social_links) && typedSettings.social_links.length > 0 ? typedSettings.social_links : defaultHomeContent.socialLinks,
    currentFocus: isFocus(typedSettings.current_focus) ? typedSettings.current_focus : defaultHomeContent.currentFocus,
    experience: experience.length ? experience : defaultHomeContent.experience,
    awards: awards.length ? awards : defaultHomeContent.awards,
  };
}
