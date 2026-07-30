import { PortfolioDesktop } from "@/components/portfolio-desktop";
import { getPublishedHomeContent, getPublishedProjects } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, home] = await Promise.all([getPublishedProjects(), getPublishedHomeContent()]);
  return <PortfolioDesktop projects={projects} home={home} />;
}
