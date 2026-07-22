import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useReveal } from "../hooks/useReveal";
import { useIsScrolling } from "../hooks/useIsScrolling";
import { site } from "../data/content";
import type { Project } from "../data/types";
import { GitHubIcon, ExternalLinkIcon } from "../components/icons";
import { asset } from "../utils/asset";

export default function Projects() {
  const headerRef = useReveal<HTMLElement>();
  const gridRef = useRef<HTMLDivElement>(null);
  const [gridInView, setGridInView] = useState(false);

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
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  const href = `/projects/${project.slug ?? project.id}`;
  const openDetail = () => navigate(href);
  const ref = useReveal<HTMLElement>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isVideoAsset = /\.(mp4|webm|ogg)$/i.test(project.image ?? "");
  const usePhoneFrame = project.tileFrame === "phone";
  const scrolling = useIsScrolling();
  const [inView, setInView] = useState(false);

  // Track whether this tile's video is on screen. Playback itself is driven by
  // the effect below so it can also react to scroll state.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [project.image]);

  // Only play previews when they're visible AND the page isn't actively being
  // scrolled. Pausing video decode/compositing during scroll keeps desktop
  // scrolling smooth; previews resume the moment the user settles.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const saveData = Boolean(connection?.saveData);

    if (inView && !scrolling && !reduceMotion && !saveData) {
      void video.play().catch(() => {
        // Ignore autoplay blocking; the tile still works as a static preview.
      });
    } else {
      video.pause();
    }
  }, [inView, scrolling, project.image]);

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDetail();
    }
  };

  const media = project.image ? (
    isVideoAsset ? (
      <video
        ref={videoRef}
        className="project-card__image"
        src={asset(project.image)}
        loop
        muted
        playsInline
        preload="none"
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
        role="link"
        tabIndex={0}
        onClick={openDetail}
        onKeyDown={handleKeyDown}
        aria-label={`View ${project.title} project details`}
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
