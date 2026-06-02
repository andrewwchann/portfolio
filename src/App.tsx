import Header from "./components/Header";
import Footer from "./components/Footer";
import PageBackground from "./components/PageBackground";
import { CopyToastProvider } from "./components/CopyToastProvider";
import { site } from "./data/content";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

export default function App() {
  return (
    <CopyToastProvider email={site.email}>
    <>
      <PageBackground />
      <div className="page-content">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
      </div>
    </>
    </CopyToastProvider>
  );
}
