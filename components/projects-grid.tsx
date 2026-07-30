import { Code2, ExternalLink, FileText, Play, type LucideIcon } from "lucide-react";
import type { Project } from "@/data/projects";

const linkIcons: Record<string, LucideIcon> = {
  Code: Code2,
  Live: ExternalLink,
  Demo: Play,
  Document: FileText,
};

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <article className="project-card" key={project.name}>
          {project.coverUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- Studio accepts dynamic HTTPS image URLs, which cannot be preconfigured as Next image hosts.
            <img
              className="project-card-cover"
              src={project.coverUrl}
              alt={`${project.name} project preview`}
            />
          )}
          <div className="project-card-content">
            <div className="project-card-heading">
              <h2>{project.name}</h2>
              {project.links.length > 0 && (
                <div className="project-links" aria-label={`${project.name} links`}>
                  {project.links.map((link) => {
                    const Icon = linkIcons[link.label] ?? ExternalLink;
                    return (
                      <a href={link.href} key={`${link.label}-${link.href}`} target="_blank" rel="noreferrer" aria-label={`${link.label}: ${project.name}`} title={link.label}>
                        <Icon aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
            <p>{project.description}</p>
            <ul className="project-tags" aria-label={`${project.name} technologies`}>
              {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
