"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { StudioActionState, StudioProjectLink } from "@/lib/studio";

const statusValues = new Set(["draft", "published", "archived"]);
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
  revalidatePath("/studio");
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
