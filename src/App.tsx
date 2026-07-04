import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CopyToastProvider } from "./components/CopyToastProvider";
import { site } from "./data/content";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

function Home() {
  return (
    <main id="main">
      <Hero />
      <Projects />
      <Experience />
      <Contact />
    </main>
  );
}

function AboutPage() {
  return (
    <main id="main" className="subpage subpage--reveal">
      <About />
    </main>
  );
}

/** Scrolls to a hash target on navigation, or to the top when there is none. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        requestAnimationFrame(() =>
          el.scrollIntoView({ behavior: "smooth", block: "start" }),
        );
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash, key]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <CopyToastProvider email={site.email}>
        <div className="page-content">
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Header />
          <ScrollManager />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
          <Footer />
        </div>
      </CopyToastProvider>
    </BrowserRouter>
  );
}
