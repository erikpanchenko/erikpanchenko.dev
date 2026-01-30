import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home.jsx";
import BlogIndex from "./pages/BlogIndex.jsx";
import BlogPost from "./pages/BlogPost.jsx";
import CdpCleanup from "./pages/CdpCleanup.jsx";

function Nav() {
  return (
    <header className="site-header">
      <nav className="nav">
        <NavLink to="/" end className="nav__link">
          Home
        </NavLink>
        <NavLink to="/blog" className="nav__link">
          Blog
        </NavLink>
        <NavLink to="https://www.linkedin.com/in/erik-panchenko/" className="nav__link">
          LinkedIn
        </NavLink>
      </nav>
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
