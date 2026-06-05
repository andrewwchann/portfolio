import ContentBlocks from "../components/ContentBlocks";
import { useReveal } from "../hooks/useReveal";
import { site } from "../data/content";

export default function Experience() {
  const headerRef = useReveal<HTMLElement>();

  return (
    <section className="section section-alt" id="experience" aria-labelledby="experience-heading">
      <div className="container">
        <header className="section-header" ref={headerRef}>
          <span className="section-label mono">02</span>
          <h2 id="experience-heading">Experience</h2>
        </header>
        <ol className="timeline">
          {site.experience.map((item) => (
            <ExperienceItem key={item.id} {...item} />
          ))}
        </ol>
      </div>
    </section>
  );
}

type ExperienceItemProps = (typeof site.experience)[number];

function ExperienceItem({
  from,
  label,
  type,
  role,
  org,
  product,
  description,
  tags,
}: ExperienceItemProps) {
  const ref = useReveal<HTMLLIElement>();

  return (
    <li className="timeline-item" ref={ref}>
      <div className="timeline-meta">
        <time dateTime={from}>{label}</time>
        <span className="timeline-type">{type}</span>
      </div>
      <h3 className="timeline-role">{role}</h3>
      <p className="timeline-org">{org}</p>
      {product ? (
        <p className="timeline-product">
          <a href={product.href} target="_blank" rel="noopener noreferrer">
            {product.name}
          </a>
          {product.tagline ? (
            <span className="timeline-product-desc"> — {product.tagline}</span>
          ) : null}
        </p>
      ) : null}
      <ContentBlocks blocks={description} className="timeline-desc" />
      <ul className="timeline-tags">
        {tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </li>
  );
}
