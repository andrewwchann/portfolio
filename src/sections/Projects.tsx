import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useReveal } from "../hooks/useReveal";
import { site } from "../data/content";
import type { Project } from "../data/types";
import ProjectModal from "../components/ProjectModal";
import { GitHubIcon, ExternalLinkIcon } from "../components/icons";
import { asset } from "../utils/asset";

export default function Projects() {
  const headerRef = useReveal<HTMLElement>();
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridInView, setGridInView] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setGridInView(entry.isIntersecting),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
        <div
          ref={gridRef}
          className={`projects-grid${gridInView ? " projects-grid--float" : ""}`}
        >
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
    <div
      className={
        project.hoverArt
          ? "project-card-wrap project-card-wrap--peek"
          : "project-card-wrap"
      }
    >
      {project.hoverArt ? (
        <img
          className="project-card__peek"
          src={asset(project.hoverArt)}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
        />
      ) : null}
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
    </div>
  );
}
