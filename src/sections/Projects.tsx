import { useState, type KeyboardEvent } from "react";
import { useReveal } from "../hooks/useReveal";
import { site } from "../data/content";
import type { Project } from "../data/types";
import ProjectModal from "../components/ProjectModal";
import { GitHubIcon, ExternalLinkIcon } from "../components/icons";

export default function Projects() {
  const headerRef = useReveal<HTMLElement>();
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <section className="section" id="projects" aria-labelledby="projects-heading">
      <div className="container">
        <header className="section-header" ref={headerRef}>
          <span className="section-label mono">03</span>
          <h2 id="projects-heading">Projects</h2>
          <p className="projects-lead">
            Click a project to explore more details, demos, and architecture/flow diagrams.
          </p>
        </header>
        <div className="projects-grid">
          {site.projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => setSelected(project)}
            />
          ))}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  const ref = useReveal<HTMLElement>();

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  return (
    <article
      className="project-card project-card--interactive"
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      aria-label={`Open details for ${project.title}`}
    >
      <div className="project-card__content">
        <div className="project-card-top">
          <span className="project-icon mono" aria-hidden>
            ◈
          </span>
          <div className="project-links">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              onClick={(e) => e.stopPropagation()}
            >
              <GitHubIcon size={20} />
            </a>
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live demo`}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLinkIcon />
              </a>
            )}
          </div>
        </div>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
        <ul className="project-tags">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
      <div className="project-card__hover" aria-hidden>
        <span className="project-card__hover-text mono">View more details</span>
      </div>
    </article>
  );
}
