import { useEffect, useState, type MouseEvent } from "react";
import { asset } from "../utils/asset";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
];

const SIGNATURE_GIF = asset("/signature.gif");

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [signaturePlayId, setSignaturePlayId] = useState(() => Date.now());

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
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const scrollToTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMenu();
    setSignaturePlayId(Date.now());
  };

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`}>
      <nav className="nav container" aria-label="Main">
        <a className="logo" href="#top" aria-label="Home" onClick={scrollToTop}>
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
          {NAV.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className={active === href.slice(1) ? "active" : undefined}
                onClick={closeMenu}
              >
                {label}
              </a>
            </li>
          ))}
          <li>
            <a className="nav-cta" href="#contact" onClick={closeMenu}>
              Say Hi!
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
