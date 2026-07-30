import { PortfolioHome } from "@/components/portfolio-home";
import { getPublishedHomeContent } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return <PortfolioHome home={await getPublishedHomeContent()} />;
}
