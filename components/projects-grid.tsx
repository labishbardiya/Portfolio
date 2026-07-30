import { ArrowUpRight, Code2, Globe2 } from "lucide-react";
import { projects } from "@/data/projects";

const linkIcons = {
  Code: Code2,
  Live: Globe2,
};

export function ProjectsGrid() {
  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <article className="project-card" key={project.name}>
          <div className="project-card-meta">
            <span>{project.number}</span>
            <span>{project.stage}</span>
          </div>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <ul className="project-tags" aria-label={`${project.name} disciplines`}>
            {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <div className="project-links">
            {project.links.map((link) => {
              const Icon = linkIcons[link.label];
              return (
                <a href={link.href} key={link.label} target="_blank" rel="noreferrer">
                  <Icon size={14} aria-hidden="true" /> {link.label} <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}
