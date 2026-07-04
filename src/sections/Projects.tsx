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
          <span className="section-label mono">01</span>
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
  const isVideoAsset = /\.(mp4|webm|ogg)$/i.test(project.image ?? "");
  const usePhoneFrame = project.tileFrame === "phone";

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  };

  const media = project.image ? (
    isVideoAsset ? (
      <video
        className="project-card__image"
        src={asset(project.image)}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden
      />
    ) : (
      <img
        className="project-card__image"
        src={asset(project.image)}
        alt=""
        loading="lazy"
        decoding="async"
      />
    )
  ) : null;

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
        className={`project-card project-card--interactive${
          usePhoneFrame ? " project-card--phone" : ""
        }`}
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
        aria-label={`Open details for ${project.title}`}
      >
        {project.image ? (
          <div
            className={`project-card__media${
              usePhoneFrame ? " project-card__media--phone" : ""
            }`}
          >
            {usePhoneFrame ? (
              <div className="project-card__phone" aria-hidden>
                <div className="project-card__phone-screen">{media}</div>
              </div>
            ) : (
              media
            )}
          </div>
        ) : (
          <div className="project-card__media project-card__media--empty">
            <span className="project-card__glyph" aria-hidden>
              ◈
            </span>
          </div>
        )}

        <div className="project-card__scrim" aria-hidden />

        <span className="project-card__view mono" aria-hidden>
          View details
        </span>

        <div className="project-card__links">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.title} on GitHub`}
            onClick={(e) => e.stopPropagation()}
          >
            <GitHubIcon size={18} />
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} live demo`}
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLinkIcon size={18} />
            </a>
          )}
        </div>

        <div className="project-card__caption">
          <h3 className="project-card__name">{project.title}</h3>
          {project.dates && (
            <span className="project-card__dates">{project.dates}</span>
          )}
        </div>
      </article>
    </div>
  );
}
