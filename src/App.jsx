import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import BlogIndex from "./pages/BlogIndex.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import CdpCleanup from "./pages/CdpCleanup.jsx";

function Nav() {
  const { pathname } = useLocation();
  const showLogo = pathname !== "/";

  return (
    <header className="site-header">
      <div className="site-header__inner">
        {showLogo ? (
          <NavLink to="/" className="site-logo" aria-label="Go to homepage">
            <img
              src="/images/erik.png"
              alt="Erik Panchenko"
              className="site-logo__image"
            />
            <span className="site-logo__text">Erik Panchenko</span>
          </NavLink>
        ) : null}
        <nav className="nav">
          <NavLink to="/" end className="nav__link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav__link">
            About
          </NavLink>
          <NavLink to="/blog" className="nav__link">
            Blog
          </NavLink>
          <NavLink to="https://www.linkedin.com/in/erik-panchenko/" className="nav__link">
            LinkedIn
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div className="page">
      <Nav />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/cdp-cleanup" element={<CdpCleanup />} />
        </Routes>
      </main>
      <footer className="site-footer">
        
      </footer>
    </div>
  );
}
