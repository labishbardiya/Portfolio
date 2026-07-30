import { PortfolioDesktop } from "@/components/portfolio-desktop";
import { getPublishedProjects } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return <PortfolioDesktop projects={await getPublishedProjects()} />;
}
