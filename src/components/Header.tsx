import { useEffect, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { asset } from "../utils/asset";

const SECTIONS = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
];

const SIGNATURE_GIF = asset("/signature.gif");

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [signaturePlayId, setSignaturePlayId] = useState(() => Date.now());
  const location = useLocation();
  const navigate = useNavigate();
  const onHome = location.pathname === "/";

  // Toggle the header shadow. rAF-throttled and only reads scrollY (no layout
  // reads), so it never forces a reflow while scrolling.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      setScrolled(window.scrollY > 20);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active-section highlight via IntersectionObserver instead of measuring
  // element offsets on every scroll event.
  useEffect(() => {
    if (!onHome) {
      setActive("");
      return;
    }

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]"),
    );
    if (sections.length === 0) return;

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set((entry.target as HTMLElement).id, entry.intersectionRatio);
        }
        let bestId = "";
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId) setActive(bestId);
      },
      {
        threshold: [0.15, 0.35, 0.55, 0.75],
        rootMargin: "-72px 0px -35% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onHome, location.pathname]);

  const closeMenu = () => setMenuOpen(false);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goToSection =
    (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      closeMenu();
      if (onHome) {
        scrollToId(id);
      } else {
        navigate(`/#${id}`);
      }
    };

  const goHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeMenu();
    setSignaturePlayId(Date.now());
    if (onHome) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <nav className="nav container" aria-label="Main">
        <a className="logo" href="/" aria-label="Home" onClick={goHome}>
          <img
            key={signaturePlayId}
            className="logo-signature"
            src={`${SIGNATURE_GIF}?v=${signaturePlayId}`}
            alt="Andrew Chan"
            width={335}
            height={109}
          />
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="nav-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
        <ul className={`nav-links${menuOpen ? " open" : ""}`} id="nav-menu">
          <li>
            <Link
              to="/about"
              className={location.pathname === "/about" ? "active" : undefined}
              onClick={closeMenu}
            >
              About
            </Link>
          </li>
          {SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`/#${id}`}
                className={onHome && active === id ? "active" : undefined}
                onClick={goToSection(id)}
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <a className="nav-cta" href="/#contact" onClick={goToSection("contact")}>
              Say Hi!
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
