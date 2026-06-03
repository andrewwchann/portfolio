import { useEffect, useState } from "react";
import { asset } from "../utils/asset";

const NAV = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

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

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`} id="top">
      <nav className="nav container" aria-label="Main">
        <a className="logo" href="#top" aria-label="Home">
          <img
            className="logo-signature"
            src={asset("/signature.gif")}
            alt="Andrew Chan"
            width={271}
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
              Contact Me!
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
