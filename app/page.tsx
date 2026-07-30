import { PortfolioDesktop } from "@/components/portfolio-desktop";
import { getPublishedHomeContent, getPublishedProjects } from "@/lib/portfolio-data";
import { getPublishedWritingPosts } from "@/lib/writing-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, home, posts] = await Promise.all([getPublishedProjects(), getPublishedHomeContent(), getPublishedWritingPosts()]);
  return <PortfolioDesktop projects={projects} home={home} posts={posts} />;
}
