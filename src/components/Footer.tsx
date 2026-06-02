export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="footer-copy">
          <span className="mono">© {year}</span> AC. Built with React &amp; Vite.
        </p>
        {/* <a className="footer-top" href="#top" aria-label="Back to top">
          ↑ Top
        </a> */}
      </div>
    </footer>
  );
}
