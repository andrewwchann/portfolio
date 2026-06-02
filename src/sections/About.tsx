import AboutCarousel from "../components/AboutCarousel";
import AboutText from "../components/AboutText";
import { useReveal } from "../hooks/useReveal";
import { site } from "../data/content";

export default function About() {
  const headerRef = useReveal<HTMLElement>();
  const cardRef = useReveal<HTMLDivElement>();
  const carouselRef = useReveal<HTMLDivElement>();

  return (
    <section className="section" id="about" aria-labelledby="about-heading">
      <div className="container">
        <header className="section-header" ref={headerRef}>
          <span className="section-label mono">01</span>
          <h2 id="about-heading">About me</h2>
        </header>
        <div className="about-layout">
          <div className="about-card" ref={cardRef}>
            <AboutText blocks={site.about} />
            <div className="about-skills">
              <h3 className="skills-title">Technologies I&apos;ve worked with</h3>
              <ul className="skills-tags">
                {site.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="about-carousel-wrap" ref={carouselRef}>
            <AboutCarousel photos={site.aboutPhotos} />
          </div>
        </div>
      </div>
    </section>
  );
}
