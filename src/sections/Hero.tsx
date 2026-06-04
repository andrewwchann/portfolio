import { GitHubIcon, LinkedInIcon, EmailIcon } from "../components/icons";
import { useCopyEmail } from "../components/CopyToastProvider";
import { site } from "../data/content";
import { asset } from "../utils/asset";

export default function Hero() {
  const copyEmail = useCopyEmail();

  return (
    <section className="hero" id="top" aria-labelledby="hero-heading">
      <div className="container hero-inner">
        <div className="hero-row">
          <div className="hero-content">
          <p className="hero-greeting">
            <span className="mono">Hey! I&apos;m</span>
          </p>
          <h1 id="hero-heading" className="hero-title">
            {site.name}
          </h1>
          <p className="hero-subtitle">{site.tagline}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#projects">
              View my work
            </a>
            <a
              className="btn btn-ghost"
              href={asset(site.resumeUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume
            </a>
          </div>
          <ul className="hero-social" aria-label="Social links">
            <li>
              <a
                href={site.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </li>
            <li>
              <button type="button" onClick={copyEmail} aria-label="Copy email">
                <EmailIcon />
              </button>
            </li>
          </ul>
          </div>

          <div className="hero-photo-wrap">
            <img
              className="hero-photo"
              src={asset(site.photoUrl)}
              alt={site.photoAlt}
              width={380}
              height={380}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
