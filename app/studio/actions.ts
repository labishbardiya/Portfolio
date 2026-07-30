"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { StudioActionState, StudioProjectLink, StudioSocialLink } from "@/lib/studio";

const statusValues = new Set(["draft", "published", "archived"]);
const timelineCategories = new Set(["experience", "award"]);
const socialLabels = new Set<StudioSocialLink["label"]>(["LinkedIn", "X", "GitHub", "YouTube", "Instagram"]);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function text(formData: FormData, key: string, maximum: number, minimum = 0) {
  const value = String(formData.get(key) ?? "").trim();
  if (value.length < minimum || value.length > maximum) {
    throw new Error(`${key.replaceAll("_", " ")} needs ${minimum}–${maximum} characters.`);
  }
  return value;
}

function integer(formData: FormData, key: string, minimum: number, maximum: number) {
  const value = Number(formData.get(key));
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${key.replaceAll("_", " ")} must be a whole number from ${minimum} to ${maximum}.`);
  }
  return value;
}

function parseLinks(value: string): StudioProjectLink[] {
  if (!value.trim()) return [];

  return value.split("\n").map((line) => {
    const [rawLabel, rawHref, ...extra] = line.split("|").map((part) => part.trim());
    if (!rawLabel || !rawHref || extra.length || rawLabel.length > 40) {
      throw new Error("Links use one line per item: Label | https://example.com");
    }

    try {
      const url = new URL(rawHref);
      if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
    } catch {
      throw new Error("Every project link needs a valid http or https URL.");
    }

    return { label: rawLabel, href: rawHref };
  });
}

function parseLines(value: string, key: string, minimum: number, maximum: number, lineMaximum: number) {
  const lines = value.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length < minimum || lines.length > maximum || lines.some((line) => line.length > lineMaximum)) {
    throw new Error(`${key} needs ${minimum}–${maximum} short lines.`);
  }
  return lines;
}

function parseSocialLinks(value: string): StudioSocialLink[] {
  const lines = parseLines(value, "social links", 1, 5, 120);
  const links = lines.map((line) => {
    const [rawLabel, rawHref, ...extra] = line.split("|").map((part) => part.trim());
    if (!rawLabel || !rawHref || extra.length || !socialLabels.has(rawLabel as StudioSocialLink["label"])) {
      throw new Error("Social links use LinkedIn, X, GitHub, YouTube, or Instagram: Label | https://…");
    }
    try {
      const url = new URL(rawHref);
      if (url.protocol !== "https:") throw new Error();
    } catch {
      throw new Error("Every social link needs a valid https URL.");
    }
    return { label: rawLabel as StudioSocialLink["label"], href: rawHref };
  });
  if (new Set(links.map((link) => link.label)).size !== links.length) throw new Error("Use each social network once.");
  return links;
}

function readProject(formData: FormData) {
  const slug = text(formData, "slug", 100, 1).toLowerCase();
  if (!slugPattern.test(slug)) {
    throw new Error("slug uses lowercase letters, numbers, and single hyphens only.");
  }

  const status = text(formData, "status", 12, 1);
  if (!statusValues.has(status)) throw new Error("Choose draft, published, or archived.");

  const tags = text(formData, "tags", 300)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  if (tags.some((tag) => tag.length > 40) || tags.length > 12) {
    throw new Error("Use at most 12 short tags.");
  }

  const coverUrl = text(formData, "cover_url", 1000);
  if (coverUrl) {
    try {
      const url = new URL(coverUrl);
      if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
    } catch {
      throw new Error("Cover URL needs to be a valid http or https URL.");
    }
  }

  return {
    name: text(formData, "name", 100, 1),
    slug,
    number: integer(formData, "number", 1, 99),
    stage: text(formData, "stage", 40, 1),
    description: text(formData, "description", 500, 1),
    tags,
    links: parseLinks(text(formData, "links", 4000)),
    cover_url: coverUrl || null,
    status,
    featured: formData.get("featured") === "on",
    sort_order: integer(formData, "sort_order", -10000, 10000),
    published_at: status === "published" ? new Date().toISOString() : null,
  };
}

async function requireStudioAdmin() {
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (claimsError || typeof userId !== "string") throw new Error("Please sign in again.");

  const { data: admin, error: adminError } = await supabase
    .from("portfolio_admins")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (adminError || !admin) throw new Error("This account is not approved for Studio.");
  return supabase;
}

function refreshPortfolio() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/writing");
  revalidatePath("/studio");
}

function readTimelineEntry(formData: FormData) {
  const category = text(formData, "category", 12, 1);
  if (!timelineCategories.has(category)) throw new Error("Choose experience or award.");
  const status = text(formData, "status", 12, 1);
  if (!statusValues.has(status)) throw new Error("Choose draft, published, or archived.");
  return {
    category,
    period: text(formData, "period", 40, 1),
    title: text(formData, "title", 120, 1),
    organisation: text(formData, "organisation", 180, 1),
    description: text(formData, "description", 500, 1),
    status,
    sort_order: integer(formData, "sort_order", -10000, 10000),
  };
}

export async function createProject(_: StudioActionState, formData: FormData): Promise<StudioActionState> {
  try {
    const supabase = await requireStudioAdmin();
    const project = readProject(formData);
    const { error } = await supabase.from("portfolio_projects").insert(project);
    if (error) throw new Error(error.message);
    refreshPortfolio();
    return { ok: true, message: "Project created." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not create the project." };
  }
}

export async function saveProject(_: StudioActionState, formData: FormData): Promise<StudioActionState> {
  try {
    const id = text(formData, "id", 36, 36);
    const supabase = await requireStudioAdmin();
    const project = readProject(formData);
    const { error } = await supabase.from("portfolio_projects").update(project).eq("id", id);
    if (error) throw new Error(error.message);
    refreshPortfolio();
    return { ok: true, message: "Saved." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not save the project." };
  }
}

export async function archiveProject(_: StudioActionState, formData: FormData): Promise<StudioActionState> {
  try {
    const id = text(formData, "id", 36, 36);
    const supabase = await requireStudioAdmin();
    const { error } = await supabase
      .from("portfolio_projects")
      .update({ status: "archived", featured: false, published_at: null })
      .eq("id", id);
    if (error) throw new Error(error.message);
    refreshPortfolio();
    return { ok: true, message: "Archived. You can restore it by editing its status later." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not archive the project." };
  }
}

export async function saveHomeSettings(_: StudioActionState, formData: FormData): Promise<StudioActionState> {
  try {
    const supabase = await requireStudioAdmin();
    const typewriter_lines = parseLines(text(formData, "typewriter_lines", 1200), "typewriter lines", 1, 10, 120);
    const focusItems = parseLines(text(formData, "current_focus", 600), "current focus", 1, 3, 140);
    const current_focus = { items: focusItems, caption: text(formData, "focus_caption", 120, 1) };
    const social_links = parseSocialLinks(text(formData, "social_links", 1200));
    const { error } = await supabase.from("portfolio_settings").update({
      typewriter_lines,
      current_focus,
      social_links,
      is_published: formData.get("is_published") === "on",
    }).eq("id", true);
    if (error) throw new Error(error.message);
    refreshPortfolio();
    return { ok: true, message: "Homepage settings saved." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not save homepage settings." };
  }
}

export async function createTimelineEntry(_: StudioActionState, formData: FormData): Promise<StudioActionState> {
  try {
    const supabase = await requireStudioAdmin();
    const { error } = await supabase.from("portfolio_timeline_entries").insert(readTimelineEntry(formData));
    if (error) throw new Error(error.message);
    refreshPortfolio();
    return { ok: true, message: "Timeline entry created." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not create the timeline entry." };
  }
}

export async function saveTimelineEntry(_: StudioActionState, formData: FormData): Promise<StudioActionState> {
  try {
    const id = text(formData, "id", 36, 36);
    const supabase = await requireStudioAdmin();
    const { error } = await supabase.from("portfolio_timeline_entries").update(readTimelineEntry(formData)).eq("id", id);
    if (error) throw new Error(error.message);
    refreshPortfolio();
    return { ok: true, message: "Timeline entry saved." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not save the timeline entry." };
  }
}

export async function archiveTimelineEntry(_: StudioActionState, formData: FormData): Promise<StudioActionState> {
  try {
    const id = text(formData, "id", 36, 36);
    const supabase = await requireStudioAdmin();
    const { error } = await supabase.from("portfolio_timeline_entries").update({ status: "archived" }).eq("id", id);
    if (error) throw new Error(error.message);
    refreshPortfolio();
    return { ok: true, message: "Timeline entry archived." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not archive the timeline entry." };
  }
}

function readWritingPost(formData: FormData) {
  const slug = text(formData, "slug", 100, 1).toLowerCase();
  if (!slugPattern.test(slug)) throw new Error("slug uses lowercase letters, numbers, and single hyphens only.");
  const status = text(formData, "status", 12, 1);
  if (!statusValues.has(status)) throw new Error("Choose draft, published, or archived.");
  const externalUrl = text(formData, "external_url", 1000);
  if (externalUrl) {
    try {
      if (new URL(externalUrl).protocol !== "https:") throw new Error();
    } catch {
      throw new Error("Original-post link needs a valid https URL.");
    }
  }
  return {
    slug,
    title: text(formData, "title", 180, 1),
    subtitle: text(formData, "subtitle", 280),
    excerpt: text(formData, "excerpt", 500),
    body_markdown: text(formData, "body_markdown", 50000, 1),
    external_url: externalUrl || null,
    status,
    sort_order: integer(formData, "sort_order", -10000, 10000),
  };
}

export async function createWritingPost(_: StudioActionState, formData: FormData): Promise<StudioActionState> {
  try {
    const supabase = await requireStudioAdmin();
    const post = readWritingPost(formData);
    const { error } = await supabase.from("portfolio_writing_posts").insert({
      ...post,
      published_at: post.status === "published" ? new Date().toISOString() : null,
    });
    if (error) throw new Error(error.message);
    refreshPortfolio();
    return { ok: true, message: "Writing post created." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not create the writing post." };
  }
}

export async function saveWritingPost(_: StudioActionState, formData: FormData): Promise<StudioActionState> {
  try {
    const id = text(formData, "id", 36, 36);
    const supabase = await requireStudioAdmin();
    const post = readWritingPost(formData);
    const { data: existing, error: existingError } = await supabase.from("portfolio_writing_posts").select("published_at").eq("id", id).single();
    if (existingError || !existing) throw new Error("Writing post no longer exists.");
    const { error } = await supabase.from("portfolio_writing_posts").update({
      ...post,
      published_at: post.status === "published" ? existing.published_at ?? new Date().toISOString() : null,
    }).eq("id", id);
    if (error) throw new Error(error.message);
    refreshPortfolio();
    return { ok: true, message: "Writing post saved." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not save the writing post." };
  }
}

export async function archiveWritingPost(_: StudioActionState, formData: FormData): Promise<StudioActionState> {
  try {
    const id = text(formData, "id", 36, 36);
    const supabase = await requireStudioAdmin();
    const { error } = await supabase.from("portfolio_writing_posts").update({ status: "archived", published_at: null }).eq("id", id);
    if (error) throw new Error(error.message);
    refreshPortfolio();
    return { ok: true, message: "Writing post archived." };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Could not archive the writing post." };
  }
}
