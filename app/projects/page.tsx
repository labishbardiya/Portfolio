import { ProjectsGrid } from "@/components/projects-grid";
import { getPublishedProjects } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  return (
    <main className="page-shell content-page">
      <h1>My Projects</h1>
      <p className="page-intro">
        Some of my cool projects. You can see me talk about them on{" "}
        <a href="https://x.com/labishbardiya" target="_blank" rel="noreferrer">
          X
        </a>
        .
      </p>
      <ProjectsGrid projects={await getPublishedProjects()} />
    </main>
  );
}
