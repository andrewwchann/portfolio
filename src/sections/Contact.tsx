import { useReveal } from "../hooks/useReveal";
import { useCopyEmail } from "../components/CopyToastProvider";
import { site } from "../data/content";

export default function Contact() {
  const headerRef = useReveal<HTMLElement>();
  const actionsRef = useReveal<HTMLDivElement>();
  const copyEmail = useCopyEmail();

  return (
    <section className="section section-contact" id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <header className="section-header section-header-center" ref={headerRef}>
          <span className="section-label mono">04</span>
          <h2 id="contact-heading">Get in touch</h2>
          <p className="contact-lead">
            Open to internships, collaborations, and interesting problems. The best way
            to reach me is email—I usually reply within a day.
          </p>
        </header>
        <div className="contact-actions" ref={actionsRef}>
          <button type="button" className="btn btn-primary btn-lg" onClick={copyEmail}>
            {site.email}
          </button>
          <a
            className="btn btn-ghost"
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
