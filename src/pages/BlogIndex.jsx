import { Link } from "react-router-dom";
import { posts } from "../posts/posts.js";

export default function BlogIndex() {
  return (
    <article className="prose">
      <h1>Blog</h1>
      <p className="lede">Notes on MarTech engineering, CDPs, and measurement.</p>

      <ul className="post-list">
        {posts.map((p) => (
          <li key={p.slug} className="post-list__item">
            <Link to={`/blog/${p.slug}`} className="post-link">
              <span className="post-link__title">{p.title}</span>
              <span className="post-link__meta">{p.date}</span>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
