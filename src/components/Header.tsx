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

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const scrollY = window.scrollY + 120;
      let current = "";
      document.querySelectorAll("section[id]").forEach((section) => {
        const el = section as HTMLElement;
        if (scrollY >= el.offsetTop && scrollY < el.offsetTop + el.offsetHeight) {
          current = el.id;
        }
      });
      setActive(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

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
