import type { ReactNode } from "react";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <nav className="nav" aria-label="BrokenSEO navigation">
        <a className="brand" href="/">
          BROKENSEO
        </a>
        <span className="nav-links">
          <a href="https://www.fastestrank.com">FastestRank</a>
        </span>
      </nav>
      {children}
      <footer className="foot">
        <div className="foot-inner">
          <a className="foot-brand" href="/">
            BROKENSEO
          </a>
          <span className="foot-links">
            <a href="/#issues">All issues</a>
            <a href="https://www.fastestrank.com">FastestRank</a>
            <a href="/privacy/">Privacy</a>
            <button
              className="footer-button"
              type="button"
              data-cookie-settings
            >
              Cookie settings
            </button>
          </span>
        </div>
      </footer>
    </>
  );
}
