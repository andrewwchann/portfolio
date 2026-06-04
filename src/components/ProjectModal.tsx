import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Project } from "../data/types";
import ContentBlocks from "./ContentBlocks";
import { GitHubIcon, ExternalLinkIcon } from "./icons";
import { asset } from "../utils/asset";

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

type ExpandedDiagram = {
  src: string;
  alt: string;
  caption?: string;
};

function toEmbedUrl(url: string): string | null {
  if (url.startsWith("/") || url.endsWith(".mp4") || url.endsWith(".webm")) {
    return null;
  }
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtube.com") && parsed.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }
    if (parsed.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
  } catch {
    return null;
  }
  return null;
}

function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div className="project-modal__placeholder">
      <span className="project-modal__placeholder-icon" aria-hidden>
        ◫
      </span>
      <p>{label}</p>
      <span className="project-modal__placeholder-hint mono">
        Add path in content.ts → detail
      </span>
    </div>
  );
}

function DiagramFigure({
  src,
  alt,
  caption,
  onExpand,
}: {
  src: string;
  alt: string;
  caption?: string;
  onExpand: (diagram: ExpandedDiagram) => void;
}) {
  return (
    <figure className="project-modal__figure">
      <button
        type="button"
        className="project-modal__figure-btn"
        onClick={() => onExpand({ src, alt, caption })}
        aria-label={`View ${alt} full size`}
      >
        <img src={src} alt={alt} />
        <span className="project-modal__figure-hint mono" aria-hidden>
          Full size
        </span>
      </button>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const expandedDiagramRef = useRef<ExpandedDiagram | null>(null);
  const [expandedDiagram, setExpandedDiagram] = useState<ExpandedDiagram | null>(
    null,
  );

  expandedDiagramRef.current = expandedDiagram;

  useEffect(() => {
    setExpandedDiagram(null);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    closeRef.current?.focus();
  }, [project]);

  useEffect(() => {
    if (!project) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (expandedDiagramRef.current) {
        setExpandedDiagram(null);
      } else {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const detail = project.detail;
  const overview = detail?.overview ?? [];
  const highlights = detail?.highlights ?? [];
  const videoUrl = detail?.videoUrl?.trim();
  const architectureSrc = detail?.architectureSrc?.trim();
  const flowSrc = detail?.flowSrc?.trim();
  const embedUrl = videoUrl ? toEmbedUrl(videoUrl) : null;
  const isLocalVideo =
    videoUrl?.startsWith("/") ||
    videoUrl?.endsWith(".mp4") ||
    videoUrl?.endsWith(".webm");

  return (
    <>
    <div
      className="project-modal"
      role="presentation"
      onClick={() => {
        if (!expandedDiagram) onClose();
      }}
    >
      <div
        className="project-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="project-modal__header">
          <div>
            <p className="project-modal__label mono">Project</p>
            <h2 id="project-modal-title" className="project-modal__title">
              {project.title}
            </h2>
            <ul className="project-tags project-modal__tags">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="project-modal__close"
            onClick={onClose}
            aria-label="Close project details"
          >
            ×
          </button>
        </header>

        <div className="project-modal__actions">
          <a
            className="btn btn-primary"
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon size={18} />
            View on GitHub
          </a>
          {project.demo && (
            <a
              className="btn btn-ghost"
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon size={18} />
              Live demo
            </a>
          )}
        </div>

        <div className="project-modal__body">
          <section className="project-modal__section">
            <h3 className="project-modal__section-title">Overview</h3>
            {overview.length > 0 ? (
              <ContentBlocks
                blocks={overview}
                className="project-modal__overview"
              />
            ) : (
              <p className="project-modal__overview project-modal__overview--placeholder">
                A longer project write-up will go here — background, your role,
                technical decisions, and outcomes.
              </p>
            )}
            {highlights.length > 0 && (
              <ul className="project-modal__highlights">
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>

          <section className="project-modal__section">
            <h3 className="project-modal__section-title">Demo</h3>
            {videoUrl && embedUrl ? (
              <div className="project-modal__video-wrap">
                <iframe
                  src={embedUrl}
                  title={`${project.title} demo`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : videoUrl && isLocalVideo ? (
              <div className="project-modal__video-wrap">
                <video controls playsInline preload="metadata" src={asset(videoUrl)}>
                  <track kind="captions" />
                </video>
              </div>
            ) : (
              <MediaPlaceholder label="Video demo — YouTube URL or /videos/your-demo.mp4" />
            )}
          </section>

          <div className="project-modal__diagrams">
            <section className="project-modal__section">
              <h3 className="project-modal__section-title">Architecture</h3>
              {architectureSrc ? (
                <DiagramFigure
                  src={asset(architectureSrc)}
                  alt={
                    detail?.architectureCaption ??
                    `${project.title} architecture diagram`
                  }
                  caption={detail?.architectureCaption}
                  onExpand={setExpandedDiagram}
                />
              ) : (
                <MediaPlaceholder label="Architecture diagram — .png or .svg in /public" />
              )}
            </section>

            {flowSrc ? (
              <section className="project-modal__section">
                <h3 className="project-modal__section-title">Design Decision Matrices</h3>
                <DiagramFigure
                  src={asset(flowSrc)}
                  alt={detail?.flowCaption ?? `${project.title} flow diagram`}
                  caption={detail?.flowCaption}
                  onExpand={setExpandedDiagram}
                />
              </section>
            ) : null}

            {(detail?.images ?? []).map((image) => (
              <section className="project-modal__section" key={image.src}>
                <h3 className="project-modal__section-title">{image.label}</h3>
                <DiagramFigure
                  src={asset(image.src)}
                  alt={image.caption ?? `${project.title} ${image.label}`}
                  caption={image.caption}
                  onExpand={setExpandedDiagram}
                />
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>

    {expandedDiagram
      ? createPortal(
          <div
            className="project-modal__lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={expandedDiagram.alt}
            onClick={() => setExpandedDiagram(null)}
          >
            <button
              type="button"
              className="project-modal__lightbox-close"
              onClick={() => setExpandedDiagram(null)}
              aria-label="Close expanded diagram"
            >
              ×
            </button>
            <figure
              className="project-modal__lightbox-figure"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={expandedDiagram.src} alt={expandedDiagram.alt} />
              {expandedDiagram.caption ? (
                <figcaption>{expandedDiagram.caption}</figcaption>
              ) : null}
            </figure>
          </div>,
          document.body,
        )
      : null}
    </>
  );
}
